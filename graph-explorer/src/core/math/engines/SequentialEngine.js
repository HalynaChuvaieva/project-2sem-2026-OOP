import { IMathEngine } from './IMathEngine.js';
import { MathAdapter } from '../MathAdapter.js';

/**
 * @class SequentialEngine
 * @implements IMathEngine
 * @description Послідовна (однопоточна) реалізація обчислення точок.
 */
export class SequentialEngine extends IMathEngine {
    async calculatePoints(formula, startX, endX, step) {
        if (step <= 0) throw new Error("Крок має бути більшим за 0");
        
        const points = [];
        
    for (let x = startX; x <= endX; x += step) {
      const y = MathAdapter.evaluate(formula, x);
      if (!isNaN(y) && isFinite(y)) {
        points.push({ x, y });
      }
    }
    return points; 
  }
}