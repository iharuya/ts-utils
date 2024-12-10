/**
 * A collection of utility functions regarding to CLI
 * @module
 *
 * @example
 * ```ts
 * if (!yesOrNo("Do you want to continue?")) {
 *    Deno.exit(0);
 * }
 * ```
 */

export * from "./yesno/index.ts";
