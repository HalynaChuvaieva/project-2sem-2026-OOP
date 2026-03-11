import * as math from 'mathjs';

export class MathAdapter {
  static evaluate(formula, xValue) {
    try {
      return math.evaluate(formula, { x: xValue });
    } catch (e) {
      return NaN;
    }
  }

  static validate(formula) {
    try {
      const code = math.compile(formula);
      code.evaluate({ x: 1 });
      return { valid: true };
    } catch (e) {
      return { valid: false, message: e.message };
    }
  }
}