class Graph {
  constructor(config) { 
    this.formula = config.formula; 
    this.color = config.color;
    if (config.id) this.id = config.id;
  }
}

class StandardGraph extends Graph { type = 'function'; }

class PolarGraph extends Graph { type = 'polar'; }

export class GraphFactory {
  static createGraph(type, config) {
    if (type === 'standard') {
      return new StandardGraph(config);
    }
    if (type === 'polar') {
      return new PolarGraph(config);
    }
    
    throw new Error(`Unknown graph type: ${type}`);
  }
}