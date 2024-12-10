/**
 * Prompts the user for a yes/no answer with a default value.
 * @param message The message to display to the user.
 * @param defaultValue The default value if the user enters nothing. Defaults to false.
 * @returns True if the user answers yes, false otherwise.
 * @example
 * ```typescript
 * if (!yesOrNo("Do you want to continue?")) {
 *    Deno.exit(0);
 * }
 * ```
 */
export function yesOrNo(
  message: string,
  defaultValue = false,
  promptFunc = prompt,
): boolean {
  const suffix = defaultValue ? " [Y/n] " : " [y/N] ";
  const promptMessage = message + suffix;

  while (true) {
    const result = promptFunc(promptMessage);
    if (result === null) {
      throw new Error("Could not access to the I/O");
    }
    const answer = result.trim().toLowerCase();
    if (answer === "y" || answer === "yes") {
      return true;
    } else if (answer === "n" || answer === "no") {
      return false;
    } else if (answer === "") {
      return defaultValue;
    } else {
      console.warn("Please answer with yes or no.");
    }
  }
}
