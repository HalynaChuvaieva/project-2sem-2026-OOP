import * as math from 'mathjs';

self.onmessage = function(e) {
  const { taskType, formula, formula2, startX, endX, step, chunkId } = e.data;
  
  try {
    const compiled1 = math.compile(formula);
    const compiled2 = formula2 ? math.compile(formula2) : null;
    let result = null;

    if (taskType === 'points') {
      result = [];
      for (let x = startX; x <= endX; x += step) {
        const y = compiled1.evaluate({ x });
        if (!isNaN(y) && isFinite(y)) result.push({ x, y });
      }
    } 
    else if (taskType === 'area') {
      let sum = 0;
      for (let x = startX; x < endX; x += step) {
        const y1 = compiled1.evaluate({ x });
        const y2 = compiled1.evaluate({ x: x + step });
        if (isFinite(y1) && isFinite(y2)) {
          sum += Math.abs((y1 + y2) / 2) * step;
        }
      }
      result = sum;
    } 
    else if (taskType === 'roots') {
      result = [];
      for (let x = startX; x < endX; x += step) {
        const y1 = compiled1.evaluate({ x });
        const y2 = compiled1.evaluate({ x: x + step });
        if (y1 * y2 <= 0 && isFinite(y1)) result.push(x + step / 2);
      }
    }
    else if (taskType === 'extrema') {
      result = { min: [], max: [] };
      for (let x = startX + step; x < endX - step; x += step) {
        const yPrev = compiled1.evaluate({ x: x - step });
        const yCurr = compiled1.evaluate({ x });
        const yNext = compiled1.evaluate({ x: x + step });
        if (yCurr > yPrev && yCurr > yNext) result.max.push({x, y: yCurr});
        if (yCurr < yPrev && yCurr < yNext) result.min.push({x, y: yCurr});
      }
    }
    else if (taskType === 'intersections') {
      result = [];
      for (let x = startX; x < endX; x += step) {
        const diff1 = compiled1.evaluate({ x }) - compiled2.evaluate({ x });
        const diff2 = compiled1.evaluate({ x: x + step }) - compiled2.evaluate({ x: x + step });
        if (diff1 * diff2 <= 0 && isFinite(diff1)) {
          result.push({ x: x + step / 2, y: compiled1.evaluate({ x: x + step / 2 }) });
        }
      }
    }
    else if (taskType === 'minmax') {
      let min = Infinity;
      let max = -Infinity;
      for (let x = startX; x <= endX; x += step) {
        const y = compiled1.evaluate({ x });
        if (isFinite(y)) {
          if (y < min) min = y;
          if (y > max) max = y;
        }
      }
      result = { min, max };
    }

    self.postMessage({ chunkId, result });
  } catch (error) {
    self.postMessage({ chunkId, error: error.message });
  }
};