/**
 * A collection of utility functions for numbers
 * @module
 */

/**
 * Represents a range of numbers.
 * @example
 * const range = new Range(1, 10);
 * console.log(range.getRandomValue()); // Output: a random number between 1 and 10
 */
export class Range {
  /**
   * The minimum value of the range.
   */
  min: number;
  /**
   * The maximum value of the range.
   */
  max: number;

  /**
   * Creates a new Range object.
   * @param min - The minimum value of the range.
   * @param max - The maximum value of the range.
   * @throws Will throw an error if min is greater than max.
   * @example
   * const range = new Range(1, 10);
   */
  constructor(min: number, max: number) {
    if (min > max) {
      throw new Error("min must be less than or equal to max");
    }
    this.min = min;
    this.max = max;
  }

  /**
   * Returns a random integer within the range (inclusive).
   * @returns A random integer between min and max.
   * @example
   * const range = new Range(1, 10);
   * const randomValue = range.getRandomValue();
   */
  getRandomValue(): number {
    return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
  }
}
