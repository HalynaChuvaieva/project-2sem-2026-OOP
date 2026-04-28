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
    if (!formula || formula.trim() === "") {
      return {
        valid: false,
        message: "Будь ласка, введіть формулу (рядок не може бути порожнім)"
      };
    }
      try {
        const code = math.compile(formula);
        code.evaluate({ x: 1 });
        return { valid: true };
      } catch (e) {
        return { valid: false, message: e.message };
      }
    }
  }
