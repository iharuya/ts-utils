import { Range } from "jsr:@iharuya/number@0.0.2";

/**
 * Pauses the execution for the specified number of milliseconds.
 * @param ms - The number of milliseconds to sleep.
 * @returns A Promise that resolves after the specified number of milliseconds.
 *
 * @example
 * ```ts
 * console.log("ついた？")
 * await sleep(1000) // sleep for 1 second
 * console.log("ごめん寝てた")
 * ```
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Pauses execution for a random duration within the specified range.
 *
 * @param {Range} range - An object that provides a method to get a random value within the range in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the random sleep duration.
 *
 * @example
 * ```ts
 * for (item in downloadList) {
 *   await download(item);
 *   await randomSleep(new Range(1000, 5000));
 * }
 * ```
 */
export function randomSleep(range: Range): Promise<void> {
  const sleepDuration = range.getRandomValue();
  return new Promise((resolve) => setTimeout(resolve, sleepDuration));
}

// ======== generator ======== //

/**
 * Asynchronously iterates over the given iterable, yielding each item with a constant delay between iterations.
 *
 * @template T - The type of elements in the iterable.
 * @param {Iterable<T>} iterable - The iterable to iterate over.
 * @param {number} delay - The constant delay (in milliseconds) between iterations.
 * @returns {AsyncGenerator<T>} An async generator that yields each item from the iterable with a random delay.
 *
 * @example
 * ```ts
 * for await (const url of delayed(donwloadUrls, 1000)) {
 *   await download(url);
 * }
 * ```
 */
export function delayed<T>(
  iterable: Iterable<T>,
  delay: number,
): AsyncGenerator<T>;

/**
 * Asynchronously iterates over the given iterable, yielding each item with a random delay between iterations.
 *
 * @template T - The type of elements in the iterable.
 * @param {Iterable<T>} iterable - The iterable to iterate over.
 * @param {number} minDelay - The minimum delay (in milliseconds) between iterations.
 * @param {number} maxDelay - The maximum delay (in milliseconds) between iterations.
 * @returns {AsyncGenerator<T>} An async generator that yields each item from the iterable with a random delay.
 *
 * @example
 * ```ts
 * for await (const url of delayed(donwloadUrls, 1000, 5000)) {
 *   await download(url);
 * }
 * ```
 */
export function delayed<T>(
  iterable: Iterable<T>,
  minDelay: number,
  maxDelay: number,
): AsyncGenerator<T>;

export async function* delayed<T>(
  iterable: Iterable<T>,
  ...delay: number[]
): AsyncGenerator<T> {
  const isRandom = delay.length === 2;
  const wait = isRandom
    ? () => randomSleep(new Range(delay[0], delay[1]))
    : () => sleep(delay[0]);
  for (const item of iterable) {
    yield item;
    if (item !== iterable[Symbol.iterator]().next().value) {
      await wait();
    }
  }
}
