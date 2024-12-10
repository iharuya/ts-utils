/**
 * A collection of utility functions for objects
 * @module
 *
 * @example
 * ```ts
 * import { renameKeys } from "jsr:@iharuya/object"
 * const keysMap = { firstName: 'name', age: 'years' }
 * const obj = { firstName: 'John', age: 25 }
 * const renamedObj = renameKeys(keysMap, obj)
 * console.log(renamedObj) // Output: { name: 'John', years: 25 }
 * ```
 */

/**
 * Renames the keys of an object based on a provided keys map.
 * @param keysMap - An object that maps old keys to new keys.
 * @param obj - The object whose keys need to be renamed.
 * @returns A new object with the renamed keys.
 * @example
 * const keysMap = { firstName: 'name', age: 'years' };
 * const obj = { firstName: 'John', age: 25 };
 * const renamedObj = renameKeys(keysMap, obj);
 * // renamedObj: { name: 'John', years: 25 }
 */
export const renameKeys = (
  keysMap: { [key: string]: string },
  obj: { [key: string]: unknown },
): { [key: string]: unknown } =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
    }),
    {},
  );

/**
 * Checks if two objects are the same by comparing their stringified representations.
 * @param obj1 - The first object to compare.
 * @param obj2 - The second object to compare.
 * @returns `true` if the objects are the same, `false` otherwise.
 * @example
 * const obj1 = { name: 'John', age: 30 };
 * const obj2 = { name: 'John', age: 30 };
 * const obj3 = { name: 'Jane', age: 25 };
 *
 * console.log(areSameObjects(obj1, obj2)); // Output: true
 * console.log(areSameObjects(obj1, obj3)); // Output: false
 */
export const areSameObjects = (obj1: unknown, obj2: unknown): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};
