import { getFormattedTimestamp } from "./mod.ts";
import { assertEquals, assertMatch } from "jsr:@std/assert";
import { FakeTime } from "jsr:@std/testing/time";

Deno.test("Formatted timestamp #1", () => {
  using _ = new FakeTime(Date.parse("2020-01-04T15:01:03"));
  const timestamp = getFormattedTimestamp();
  assertEquals(timestamp.length, 15);
  assertMatch(timestamp, /^[0-9]{8}-[0-9]{6}$/);
  assertEquals(timestamp, "20200104-150103");
});

Deno.test("Formatted timestamp #2", () => {
  using _ = new FakeTime(Date.parse("2400-02-29T23:00:00"));
  const timestamp = getFormattedTimestamp();
  assertEquals(timestamp, "24000229-230000");
});
