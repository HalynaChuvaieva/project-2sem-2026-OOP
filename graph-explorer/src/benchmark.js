import { SequentialEngine } from './core/math/engines/SequentialEngine.js';
import { ParallelEngine } from './core/math/engines/ParallelEngine.js';

export async function runConfigurableBenchmark(config, logCallback) {
  const log = (msg) => { console.log(msg); if (logCallback) logCallback(msg); };

  const { taskType, formula, formula2, startX, endX, step, threads } = config;
  const pointsCount = Math.round((endX - startX) / step);

  log(`\n=== 🚀 БЕНЧМАРК: ${taskType.toUpperCase()} ===`);
  log(`F1: ${formula} ${taskType === 'intersections' ? ' | F2: ' + formula2 : ''}`);
  log(`Діапазон: [${startX}, ${endX}], Крок: ${step}`);
  log(`Очікується ітерацій: ~${pointsCount}`);

  try {
    log(`\n▶️ Однопоточний запуск...`);
    const seqEngine = new SequentialEngine();
    const startSeq = performance.now();
    const resSeq = await seqEngine.runTask(taskType, formula, startX, endX, step, formula2);
    const timeSeq = performance.now() - startSeq;
    log(`✅ Sequential: ${timeSeq.toFixed(2)} мс`);

    log(`\n▶️ Мультипоточний (${threads} потоків)...`);
    const parEngine = new ParallelEngine(threads);
    const startPar = performance.now();
    const resPar = await parEngine.runTask(taskType, formula, startX, endX, step, formula2);
    const timePar = performance.now() - startPar;
    log(`✅ Parallel: ${timePar.toFixed(2)} мс`);

    const speedup = (timeSeq / timePar).toFixed(2);
    log(`\n📊 ПРИСКОРЕННЯ: ${speedup}x`);

    log(`\n--- РЕЗУЛЬТАТ ОБЧИСЛЕНЬ ---`);
    if (taskType === 'area') {
      log(`Площа: ~${resPar.toFixed(4)}`);
    } 
    else if (taskType === 'roots') {
      log(`Знайдено коренів: ${resPar.length}`);
      if (resPar.length > 0) {
        const allRoots = resPar.map(r => r.toFixed(4)).join(';  ');
        log(`Корені: x ∈ { ${allRoots} }`);
      }
    } 
    else if (taskType === 'intersections') {
      log(`Точок перетину: ${resPar.length}`);
      if (resPar.length > 0) {
        const allPoints = resPar.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(';  ');
        log(`Точки: { ${allPoints} }`);
      }
    } 
    else if (taskType === 'extrema') {
      log(`Локальних MIN: ${resPar.min.length} | MAX: ${resPar.max.length}`);
      if (resPar.min.length > 0 || resPar.max.length > 0) {
        const minStr = resPar.min.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join('; ');
        const maxStr = resPar.max.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join('; ');
        log(`Мінімуми: ${minStr || 'немає'}`);
        log(`Максимуми: ${maxStr || 'немає'}`);
      }
    } 
    else if (taskType === 'minmax') {
      log(`Глобальний MIN: ${resPar.min.toFixed(4)}`);
      log(`Глобальний MAX: ${resPar.max.toFixed(4)}`);
    }

  } catch (err) {
    log(`❌ Помилка: ${err.message}`);
  }
}