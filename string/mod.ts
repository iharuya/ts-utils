/**
 * A collection of utility functions for string
 * @module
 *
 * @example
 * ```ts
 * import { normalizeString } from "jsr:@iharuya/string"
 * const input = "Café"
 * const normalized = normalizeString(input)
 * console.log(normalized) // Output: "Cafe"
 * ```
 */

/**
 * Normalizes a string using the NFKC normalization form.
 *
 * @param str - The string to be normalized.
 * @returns The normalized string.
 *
 * @example
 * const input = "Café"
 * const normalized = normalizeString(input)
 * console.log(normalized) // Output: "Cafe"
 */
export const normalizeString = (str: string): string => {
  return str.normalize("NFKC");
};

/**
 * Generates a random string of the specified length.
 *
 * @param len The length of the random string to generate.
 * @returns A random string of the specified length.
 *
 * @example
 * const randomString = getRandomString(10);
 * console.log(randomString); // Output: "3aBcD4eFgH"
 */
export const getRandomString = (len: number): string => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let str = "";
  for (let i = 0; i <= len; i++) {
    const n = Math.floor(Math.random() * chars.length);
    str += chars[n];
  }
  return str;
};

/**
 * Converts a number to a Japanese yen formatted string.
 *
 * @param price - The number to be converted.
 * @returns The formatted string representing the price in Japanese yen.
 *
 * @example
 * ```typescript
 * const price = 1000;
 * const formattedPrice = jpyString(price);
 * console.log(formattedPrice); // "¥1,000"
 * ```
 */
export const jpyString = (price: number): string =>
  price.toLocaleString("ja-JP", {
    style: "currency",
    currency: "JPY",
  });
