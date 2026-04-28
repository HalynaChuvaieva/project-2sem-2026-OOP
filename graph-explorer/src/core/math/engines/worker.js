import * as math from 'mathjs';

self.onmessage = function(e) {
  const { formula, startX, endX, step, chunkId } = e.data;
  
  try {
    const compiled = math.compile(formula);
    const points = [];
    
    for (let x = startX; x <= endX; x += step) {
      const y = compiled.evaluate({ x });
      if (!isNaN(y) && isFinite(y)) {
        points.push({ x, y });
      }
    }
    
    self.postMessage({ chunkId, points });
  } catch (error) {
    self.postMessage({ chunkId, error: error.message });
  }
};