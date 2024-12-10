/**
 * A collection of utility functions for arrays
 * @module
 *
 * @example
 * ```ts
 * import { replaceItemAtIndex } from "jsr:@iharuya/array"
 * const arr = [1, 2, 3, 4, 5]
 * const newArr = replaceItemAtIndex(arr, 2, 10)
 * console.log(newArr) // Output: [1, 2, 10, 4, 5]
 * ```
 */

/**
 * Replaces an item at a specific index in an array.
 *
 * @template T - The type of the array elements.
 * @param {T[]} arr - The array to modify.
 * @param {number} index - The index of the item to replace.
 * @param {T} newValue - The new value to replace the item with.
 * @returns {T[]} - A new array with the item replaced.
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5];
 * const newArr = replaceItemAtIndex(arr, 2, 10);
 * console.log(newArr); // Output: [1, 2, 10, 4, 5]
 * ```
 */
export const replaceItemAtIndex = <T>(
  arr: T[],
  index: number,
  newValue: T,
): T[] => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};

/**
 * Removes an item at a specific index in an array.
 *
 * @template T - The type of the array elements.
 * @param {T[]} arr - The array to modify.
 * @param {number} index - The index of the item to remove.
 * @returns {T[]} - A new array with the item removed.
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5];
 * const newArr = removeItemAtIndex(arr, 2);
 * console.log(newArr); // Output: [1, 2, 4, 5]
 * ```
 */
export const removeItemAtIndex = <T>(arr: T[], index: number): T[] => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

/**
 * Generates an array of numbers within a specified range.
 *
 * @param {number} start - The starting number of the range.
 * @param {number} end - The ending number of the range.
 * @returns {number[]} - An array of numbers within the specified range.
 *
 * @example
 * ```ts
 * range(1, 5); // [1, 2, 3, 4, 5]
 * range(10, 15); // [10, 11, 12, 13, 14, 15]
 * ```
 */
export const range = (s: number, e: number): number[] => {
  const length = e - s + 1;
  const array = new Array(length);

  for (let i = 0; i < length; ++i) {
    array[i] = s + i;
  }

  return array;
};

type Primitive = string | number | boolean;

/**
 * Checks if two arrays are equal.
 *
 * @param a - The first array.
 * @param b - The second array.
 * @returns `true` if the arrays are equal, `false` otherwise.
 *
 * @example
 * ```ts
 * const arr1 = [1, 2, 3];
 * const arr2 = [1, 2, 3];
 * console.log(isSame(arr1, arr2)); // Output: true
 * ```
 */
export const isSame = (a: Primitive[], b: Primitive[]): boolean =>
  a.length === b.length && a.every((val, index) => val === b[index]);
