import * as math from 'mathjs';

export class SequentialEngine {
  async runTask(taskType, formula, startX, endX, step, formula2 = null) {
    const compiled1 = math.compile(formula);
    const compiled2 = formula2 ? math.compile(formula2) : null;
    let result = null;

    if (taskType === 'points') {
      result = [];
      for (let x = startX; x <= endX; x += step) {
        const y = compiled1.evaluate({ x });
        if (isFinite(y)) result.push({ x, y });
      }
    } 
    else if (taskType === 'area') {
      let sum = 0;
      for (let x = startX; x < endX; x += step) {
        sum += Math.abs((compiled1.evaluate({ x }) + compiled1.evaluate({ x: x + step })) / 2) * step;
      }
      result = sum;
    } 
    else if (taskType === 'roots') {
      result = [];
      for (let x = startX; x < endX; x += step) {
        if (compiled1.evaluate({ x }) * compiled1.evaluate({ x: x + step }) <= 0) result.push(x + step / 2);
      }
    }
    else if (taskType === 'extrema') {
      result = { min: [], max: [] };
      for (let x = startX + step; x < endX - step; x += step) {
        const yP = compiled1.evaluate({ x: x - step }), yC = compiled1.evaluate({ x }), yN = compiled1.evaluate({ x: x + step });
        if (yC > yP && yC > yN) result.max.push({x, y: yC});
        if (yC < yP && yC < yN) result.min.push({x, y: yC});
      }
    }
    else if (taskType === 'intersections') {
      result = [];
      for (let x = startX; x < endX; x += step) {
        const d1 = compiled1.evaluate({ x }) - compiled2.evaluate({ x });
        const d2 = compiled1.evaluate({ x: x + step }) - compiled2.evaluate({ x: x + step });
        if (d1 * d2 <= 0) result.push({ x: x + step/2, y: compiled1.evaluate({ x: x + step/2 }) });
      }
    }
    else if (taskType === 'minmax') {
      let min = Infinity, max = -Infinity;
      for (let x = startX; x <= endX; x += step) {
        const y = compiled1.evaluate({ x });
        if (isFinite(y)) {
          if (y < min) min = y;
          if (y > max) max = y;
        }
      }
      result = { min, max };
    }

    return result;
  }

  async calculatePoints(formula, startX, endX, step) {
    return this.runTask('points', formula, startX, endX, step);
  }
}