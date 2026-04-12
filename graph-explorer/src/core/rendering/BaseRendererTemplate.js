export class BaseRenderer {
  render(context, data) {
    this.clearScreen(context);
    this.drawGrid(context);
    this.drawCurves(context, data); 
  }
  
  clearScreen(ctx) { ctx.clearRect(0, 0, 800, 600); }
  drawGrid(ctx) { }
  drawCurves(ctx, data) { throw new Error("Метод має бути перевизначений"); }
}