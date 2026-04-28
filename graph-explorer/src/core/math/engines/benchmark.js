import { SequentialEngine } from './core/math/engines/SequentialEngine.js';
import { ParallelEngine } from './core/math/engines/ParallelEngine.js';

export async function runBenchmark() {
  const formula = 'sin(x) * cos(x) + x^2 - log(abs(x)+1)';
  const startX = -10000;
  const endX = 10000;
  const step = 0.01; 

  console.log(`Запуск бенчмарку для 2 000 000 точок...`);
  
  const seqEngine = new SequentialEngine();
  const startSeq = performance.now();
  const seqPoints = await seqEngine.calculatePoints(formula, startX, endX, step);
  const endSeq = performance.now();
  const seqTime = endSeq - startSeq;
  console.log(`Однопоточний час: ${seqTime.toFixed(2)} мс`);

    
    
  const parEngine = new ParallelEngine(4);
  const startPar = performance.now();
  const parPoints = await parEngine.calculatePoints(formula, startX, endX, step);
  const endPar = performance.now();
  const parTime = endPar - startPar;
  console.log(`⏱️ Мультипоточний час (4 потоки): ${parTime.toFixed(2)} мс`);

  console.log(`Пришвидшення: у ${(seqTime / parTime).toFixed(2)} разів!`);
  console.assert(seqPoints.length === parPoints.length, "Кількість точок не збігається!");
}