export class GraphComponent {
  setVisibility(isVisible) {}
}

export class SingleGraph extends GraphComponent {
  constructor(name) { super(); this.name = name; this.visible = true; }
  setVisibility(isVisible) { this.visible = isVisible; }
}

export class GraphGroup extends GraphComponent {
  constructor() { super(); this.children = []; }
  add(child) { this.children.push(child); }
  setVisibility(isVisible) {
    this.children.forEach(c => c.setVisibility(isVisible)); 
  }
}