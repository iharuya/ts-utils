/**
 * A collection of utility functions regarding to time
 * @module
 *
 * @example
 * ```ts
 * import { sleep } from "jsr:@iharuya/time"
 * await sleep(1000) // sleep for 1 second
 */

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
	new Promise((resolve) => setTimeout(resolve, ms))
