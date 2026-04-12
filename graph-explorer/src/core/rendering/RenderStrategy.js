import { BaseRenderer } from '../rendering/BaseRendererTemplate';

export class CanvasStrategy extends BaseRenderer {
  drawCurves(ctx, data) {
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    data.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  }
}