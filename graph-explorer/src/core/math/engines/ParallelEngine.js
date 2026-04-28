import { IMathEngine } from './IMathEngine.js';

/**
 * @class ParallelEngine
 * @implements IMathEngine
 * @description Мультипоточна реалізація з використанням Web Workers.
 */
export class ParallelEngine extends IMathEngine {
  /**
   * @param {number} threadCount Кількість потоків.
   */
  constructor(threadCount = navigator.hardwareConcurrency || 4) {
    super();
    this.threadCount = threadCount;
  }

  async calculatePoints(formula, startX, endX, step) {
    return new Promise((resolve, reject) => {
      const range = endX - startX;
      const rangePerThread = range / this.threadCount;
      
      let completedWorkers = 0;
      let allPoints = [];

      for (let i = 0; i < this.threadCount; i++) {
        const workerStartX = startX + (i * rangePerThread);
        const workerEndX = (i === this.threadCount - 1) ? endX : workerStartX + rangePerThread;

        const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

        worker.onmessage = (e) => {
          if (e.data.error) reject(e.data.error);
          
          allPoints = allPoints.concat(e.data.points);
          completedWorkers++;
          worker.terminate(); 

          if (completedWorkers === this.threadCount) {
            allPoints.sort((a, b) => a.x - b.x);
            resolve(allPoints);
          }
        };

        worker.postMessage({ formula, startX: workerStartX, endX: workerEndX, step, chunkId: i });
      }
    });
  }
}