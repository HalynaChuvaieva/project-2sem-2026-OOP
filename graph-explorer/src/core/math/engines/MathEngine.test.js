import { describe, it, expect } from 'vitest';
import { SequentialEngine } from './SequentialEngine';

describe('MathEngine: Обчислення точок (Edge Cases)', () => {
  const engine = new SequentialEngine();

  it('Правильні дані: має коректно рахувати лінійну функцію', async () => {
    const points = await engine.calculatePoints('x + 5', 0, 2, 1);
    expect(points).toEqual([
      { x: 0, y: 5 },
      { x: 1, y: 6 },
      { x: 2, y: 7 }
    ]);
  });

  it('Неправильні дані: має ігнорувати некоректні формули (повертати порожній масив)', async () => {
    const points = await engine.calculatePoints('not_a_math_function(x)', 0, 10, 1);
    expect(points.length).toBe(0);
  });

  it('Екстремальні дані: нульовий крок має викликати помилку або бути обробленим', async () => {
    await expect(engine.calculatePoints('x', 0, 10, 0)).rejects.toThrow();
  });
});