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
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, "0")
	const day = String(now.getDate()).padStart(2, "0")
	const hours = String(now.getHours()).padStart(2, "0")
	const minutes = String(now.getMinutes()).padStart(2, "0")
	const seconds = String(now.getSeconds()).padStart(2, "0")
	return `${year}${month}${day}-${hours}${minutes}${seconds}`
}
