class Graph {
  constructor(id, formula) { this.id = id; this.formula = formula; }
}
class CartesianGraph extends Graph { type = 'cartesian'; }
class PolarGraph extends Graph { type = 'polar'; }

export class GraphFactory {
  static createGraph(type, id, formula) {
    if (type === 'polar') return new PolarGraph(id, formula);
    return new CartesianGraph(id, formula);
  }
}