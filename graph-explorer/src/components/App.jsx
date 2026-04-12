import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Activity, Undo2, Plus, Moon, Sun, LineChart, Trash2, MousePointer2 } from 'lucide-react';
import { MathAdapter } from '../core/math/MathAdapter';
import { CanvasStrategy } from '../core/rendering/RenderStrategy';
import { MathCompilerProxy } from '../core/math/MathCompilerProxy';
import { settingsInstance } from '../core/config/SingletonSettings';
import { GraphConfigBuilder } from '../core/entities/GraphBuilder';
import { CommandInvoker, AddGraphCommand } from '../core/workspace/CommandHistory';

const mathProxy = new MathCompilerProxy();
const invoker = new CommandInvoker();
const renderer = new CanvasStrategy();

const lightPalette = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#0891b2'];
const darkPalette = ['#60a5fa', '#f87171', '#4ade80', '#fbbf24', '#c084fc', '#22d3ee'];

export default function App() {
  const [graphs, setGraphs] = useState([]);
  const [input, setInput] = useState('sin(x) * x');
  const [theme, setTheme] = useState(settingsInstance.theme || 'light');
  const [hoverData, setHoverData] = useState(null);
  const canvasRef = useRef(null);

  const toggleTheme = () => {
    settingsInstance.toggleTheme();
    setTheme(settingsInstance.theme);
  };

  const handleAddGraph = () => {
    const validation = MathAdapter.validate(input);
    if (!validation.valid) {
      toast.error(`Помилка: ${validation.message}`);
      return;
    }

    const palette = theme === 'light' ? lightPalette : darkPalette;
    const graphColor = palette[graphs.length % palette.length];

    const newGraph = new GraphConfigBuilder(input)
      .setColor(graphColor)
      .setThickness(2)
      .build();
    
    const graphWithId = { ...newGraph, id: Date.now() };

    const newList = [...graphs, graphWithId];
    
    const command = new AddGraphCommand(graphs, graphWithId);
    invoker.executeCommand(command);
    
    setGraphs(newList);
    setInput('');
    toast.success('Графік додано!');
  };

  const handleDeleteGraph = (id) => {
    setGraphs(prev => prev.filter(g => g.id !== id));
    toast.success('Видалено');
  };

  const handleUndo = () => {
    if (invoker.history.length === 0) return toast.error('Нічого повертати');
    invoker.undoLast();
    const lastCommand = invoker.history[invoker.history.length - 1];
    setGraphs(lastCommand ? lastCommand.graphList : []);
    toast('Дію скасовано');
  };

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
    <div style={{ 
      minHeight: '100vh', backgroundColor: theme === 'light' ? '#f8fafc' : '#0a0f1d',
      color: theme === 'light' ? '#1e293b' : '#f1f5f9', transition: 'all 0.3s ease', padding: '40px'
    }}>
      <Toaster position="top-right" />
      
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '10px', borderRadius: '12px' }}>
              <LineChart color="white" size={24} />
            </div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>GraphExplorer PRO</h1>
          </div>
          
          <button onClick={toggleTheme} style={{ 
            background: theme === 'light' ? '#fff' : '#1e293b', 
            border: '1px solid #cbd5e1', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {theme === 'light' ? <Moon size={20} color="#1e293b" /> : <Sun size={20} color="#fbbf24" />}
          </button>
        </header>

        <main style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
          <section style={{ 
            background: theme === 'light' ? '#ffffff' : 'rgba(30,41,59,0.5)', 
            padding: '20px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: theme==='light'?'#fff':'#0f172a' }}>
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
            
            <div style={{ marginTop: '20px', display: 'flex', height: '54px', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: theme==='light'?'#fff':'#1e293b', paddingLeft: '16px' }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>f(x) =</span>
                <input 
                  value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGraph()}
                  style={{ flex: 1, padding: '10px', border: 'none', background: 'transparent', color: 'inherit', outline: 'none', fontSize: '16px' }}
                />
              </div>
              <button onClick={handleAddGraph} style={{ 
                background: '#3b82f6', color: '#fff', padding: '0 25px', border: 'none', 
                cursor: 'pointer', fontWeight: 700, fontSize: '15px'
              }}>
                Побудувати
              </button>
            </div>
          </section>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: theme==='light'?'#fff':'#1e293b', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#3b82f6" /> Функції
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '100px' }}>
                {graphs.map((g) => (
                  <div key={g.id} style={{ 
                    padding: '12px', background: theme==='light'?'#f8fafc':'#0f172a', 
                    borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderLeft: `4px solid ${g.color}` 
                  }}>
                    <code style={{ fontWeight: 700, color: g.color }}>{g.formula}</code>
                    <button 
                      onClick={() => handleDeleteGraph(g.id)} 
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleUndo} style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', background: 'transparent', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Undo2 size={16} /> Повернути
              </button>
            </div>

            <div style={{ padding: '20px', borderRadius: '24px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '8px' }}>
                <MousePointer2 size={16} /> <span style={{ fontWeight: 700, fontSize: '14px' }}>Інтерактивність</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                Наведіть на графік, щоб побачити координати. 
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}