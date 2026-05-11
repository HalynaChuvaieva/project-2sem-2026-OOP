export class ParallelEngine {
  constructor(threadCount = navigator.hardwareConcurrency || 4) {
    this.threadCount = threadCount;
  }

  async runTask(taskType, formula, startX, endX, step, formula2 = null) {
    return new Promise((resolve, reject) => {
      const range = endX - startX;
      const rangePerThread = range / this.threadCount;
      let completedWorkers = 0;
      
      let arrayResult = [];
      let numberResult = 0;
      let objResult = { min: [], max: [] };
      let minMaxResult = { min: Infinity, max: -Infinity };

      for (let i = 0; i < this.threadCount; i++) {
        const workerStartX = startX + (i * rangePerThread);
        const workerEndX = (i === this.threadCount - 1) ? endX : workerStartX + rangePerThread;

        const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

        worker.onmessage = (e) => {
          if (e.data.error) reject(e.data.error);
          
          if (taskType === 'area') {
            numberResult += e.data.result;
          } else if (taskType === 'extrema') {
            objResult.min.push(...e.data.result.min);
            objResult.max.push(...e.data.result.max);
          } else if (taskType === 'minmax') {
            if (e.data.result.min < minMaxResult.min) minMaxResult.min = e.data.result.min;
            if (e.data.result.max > minMaxResult.max) minMaxResult.max = e.data.result.max;
          } else {
            arrayResult = arrayResult.concat(e.data.result);
          }

          completedWorkers++;
          worker.terminate();

          if (completedWorkers === this.threadCount) {
            if (taskType === 'area') resolve(numberResult);
            else if (taskType === 'extrema') resolve(objResult);
            else if (taskType === 'minmax') resolve(minMaxResult);
            else resolve(arrayResult.sort((a, b) => (a.x || a) - (b.x || b))); // Сортуємо результати по X
          }
        };

        worker.postMessage({ taskType, formula, formula2, startX: workerStartX, endX: workerEndX, step, chunkId: i });
      }
    });
  }

  async calculatePoints(formula, startX, endX, step) {
    return this.runTask('points', formula, startX, endX, step);
  }
}