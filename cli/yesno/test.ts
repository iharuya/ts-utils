import { yesOrNo } from "./index.ts";
import { assertEquals, assertThrows } from "jsr:@std/assert";

Deno.test("yesOrNo - returns true for 'y'", () => {
  const mockPrompt = () => "y";
  const result = yesOrNo("Question?", false, mockPrompt);
  assertEquals(result, true);
});

Deno.test("yesOrNo - returns true for 'yes'", () => {
  const mockPrompt = () => "yes";
  const result = yesOrNo("Question?", false, mockPrompt);
  assertEquals(result, true);
});

Deno.test("yesOrNo - returns false for 'n'", () => {
  const mockPrompt = () => "n";
  const result = yesOrNo("Question?", false, mockPrompt);
  assertEquals(result, false);
});

Deno.test("yesOrNo - returns false for 'no'", () => {
  const mockPrompt = () => "no";
  const result = yesOrNo("Question?", false, mockPrompt);
  assertEquals(result, false);
});

Deno.test("yesOrNo - returns default value for empty input", () => {
  const mockPrompt = () => "";
  const result = yesOrNo("Question?", true, mockPrompt);
  assertEquals(result, true);

  const result2 = yesOrNo("Question?", false, mockPrompt);
  assertEquals(result2, false);
});

Deno.test("yesOrNo - throws error if prompt function returns null", () => {
  const mockPrompt = () => null;
  const procedure = () => yesOrNo("Question?", true, mockPrompt);
  assertThrows(procedure, Error, "Could not access to the I/O");
  const procedure2 = () => yesOrNo("Question?", false, mockPrompt);
  assertThrows(procedure2, Error, "Could not access to the I/O");
});
