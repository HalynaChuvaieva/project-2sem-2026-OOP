import React, { useEffect, useRef, useState } from 'react';
import { MathCompilerProxy } from '../core/math/MathCompilerProxy';
import { CanvasStrategy } from '../core/rendering/RenderStrategy';

const mathProxy = new MathCompilerProxy();
const renderer = new CanvasStrategy();

export default function GraphCanvas({ graphs, theme }) {
  const canvasRef = useRef(null);
  const [hoverData, setHoverData] = useState(null);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || graphs.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const step = 40;
    const mathX = (mouseX - centerX) / step;
    
    const activePoints = graphs.map(g => {
      const mathY = mathProxy.calculatePoint(g.formula, mathX);
      return {
        color: g.color,
        y: mathY.toFixed(2),
        canvasX: mouseX,
        canvasY: centerY - (mathY * step)
      };
    }).filter(p => !isNaN(p.y) && p.canvasY >= 0 && p.canvasY <= canvas.height);

    setHoverData(activePoints.length > 0 ? activePoints : null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const step = 40;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Малювання сітки та осей
    ctx.strokeStyle = theme === 'light' ? '#e2e8f0' : '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = centerX; x <= canvas.width; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
    for (let x = centerX; x >= 0; x -= step) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
    for (let y = centerY; y <= canvas.height; y += step) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
    for (let y = centerY; y >= 0; y -= step) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
    ctx.stroke();

    ctx.strokeStyle = theme === 'light' ? '#94a3b8' : '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(canvas.width, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    // Малювання графіків
    graphs.forEach(g => {
      const points = [];
      for (let x = -(centerX / step); x <= (centerX / step); x += 0.05) {
        const y = mathProxy.calculatePoint(g.formula, x);
        if (isNaN(y)) continue;
        points.push({ x: centerX + x * step, y: centerY - y * step });
      }
      ctx.strokeStyle = g.color;
      ctx.lineWidth = 2;
      renderer.drawCurves(ctx, points);
    });
  }, [graphs, theme]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: theme === 'light' ? '#fff' : '#0f172a' }}>
      <canvas 
        ref={canvasRef} width={700} height={500} 
        onMouseMove={handleMouseMove} onMouseLeave={() => setHoverData(null)}
        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }} 
      />
      {hoverData && (
        <>
          <div style={{ position: 'absolute', left: hoverData[0].canvasX, top: 0, bottom: 0, width: '1px', background: '#3b82f6', opacity: 0.3 }} />
          {hoverData.map((p, i) => (
            <div key={i} style={{
              position: 'absolute', left: p.canvasX + 10, top: p.canvasY - 20,
              background: p.color, color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold'
            }}>
              {p.y}
            </div>
          ))}
        </>
      )}
    </div>
  );
}