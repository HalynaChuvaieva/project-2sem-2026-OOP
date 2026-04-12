export class GraphConfigBuilder {
  constructor(formula) {
    this.config = { formula, color: 'black', thickness: 1, visible: true };
  }
  setColor(color) { this.config.color = color; return this; }
  setThickness(t) { this.config.thickness = t; return this; }
  build() { return this.config; }
}