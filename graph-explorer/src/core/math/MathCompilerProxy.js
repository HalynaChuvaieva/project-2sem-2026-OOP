import { MathAdapter } from './MathAdapter';

export class MathCompilerProxy {
  constructor() {
    this.cache = {};
  }
  calculatePoint(formula, x) {
    const key = `${formula}_${x}`;
    if (!this.cache[key]) {
      this.cache[key] = MathAdapter.evaluate(formula, x);
    }
    return this.cache[key];
  }
}