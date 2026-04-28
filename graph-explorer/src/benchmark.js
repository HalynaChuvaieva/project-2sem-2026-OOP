import { SequentialEngine } from './core/math/engines/SequentialEngine.js';
import { ParallelEngine } from './core/math/engines/ParallelEngine.js';

export async function runFullBenchmark(logCallback) {
  const log = (message) => {
    console.log(message);
    if (logCallback) logCallback(message);
  };

  const formula = 'sin(x) * cos(x^2) + x';
  const steps = [0.01, 0.005]; 
  const threadCounts = [2, 4]; 

  log("===  ПОЧАТОК БЕНЧМАРКУ ===");

  for (const step of steps) {
    const pointsCount = Math.round(2000 / step);
    log(`Розмір: ~${pointsCount} точок`);
    
    const seqEngine = new SequentialEngine();
    const startSeq = performance.now();
    await seqEngine.calculatePoints(formula, -1000, 1000, step);
    const timeSeq = performance.now() - startSeq;
    log(`⏱️ Seq (1 потік): ${timeSeq.toFixed(2)} мс`);

    for (const threads of threadCounts) {
      const parEngine = new ParallelEngine(threads);
      const startPar = performance.now();
      await parEngine.calculatePoints(formula, -1000, 1000, step);
      const timePar = performance.now() - startPar;
      
      const speedup = (timeSeq / timePar).toFixed(2);
      log(`⏱️ Par (${threads} потоки): ${timePar.toFixed(2)} мс (Приск.: ${speedup}x)`);
    }
    log("-------------------------");
  }
  log("=== ✅ ЗАВЕРШЕНО ===");
}