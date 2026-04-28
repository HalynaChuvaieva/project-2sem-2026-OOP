/**
 * @interface IMathEngine
 * @description Базовий інтерфейс для рушіїв обчислення математичних функцій.
 */
export class IMathEngine {
  /**
   * Обчислює масив точок для заданої формули.
   * @param {string} formula - Математична формула.
   * @param {number} startX - Початкова точка на осі X.
   * @param {number} endX - Кінцева точка на осі X.
   * @param {number} step - Крок обчислення.
   * @returns {Promise<Array<{x: number, y: number}>>} Масив обчислених точок.
   */
  async calculatePoints(formula, startX, endX, step) {
    throw new Error("Метод calculatePoints має бути реалізований");
  }
}