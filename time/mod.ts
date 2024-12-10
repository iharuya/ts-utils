/**
 * A collection of utility functions regarding to time
 * @module
 *
 * @example
 * ```ts
 * import { sleep } from "jsr:@iharuya/time"
 * await sleep(1000) // sleep for 1 second
 */

export * from "./sleep.ts";

/**
 * Returns the current timestamp in a formatted string.
 * The format of the timestamp is "YYYYMMDD-HHMMSS".
 *
 * @returns The formatted timestamp.
 *
 * @example
 * ```typescript
 * const timestamp = getFormattedTimestamp();
 * console.log(timestamp); // Output: "20220101-190102"
 * ```
 */
export const getFormattedTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};
