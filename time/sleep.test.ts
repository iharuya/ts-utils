import { delayed } from "./sleep.ts";
import {
  assertEquals,
  assertGreaterOrEqual,
  assertLess,
} from "jsr:@std/assert";

Deno.test("delayed with constant delay", async () => {
  const iterable = [1, 2, 3];
  const delay = 100;
  const result = [];
  const start = performance.now();
  for await (const item of delayed(iterable, delay)) {
    result.push(item);
  }
  const end = performance.now();
  const elapsed = end - start;
  assertEquals(result, [1, 2, 3]);
  assertGreaterOrEqual(elapsed, 200);
  assertLess(elapsed, 250);
});

Deno.test("delayed with empty iterable and constant delay", async () => {
  const iterable: number[] = [];
  const delay = 100;
  const result = [];
  const start = performance.now();
  for await (const item of delayed(iterable, delay)) {
    result.push(item);
  }
  const end = performance.now();
  const elapsed = end - start;
  assertEquals(result, []);
  assertLess(elapsed, 10);
});

Deno.test("delayed with range delay", async () => {
  const iterable = [1, 2, 3];
  const minDelay = 100;
  const maxDelay = 200;
  const result = [];
  const start = performance.now();
  for await (const item of delayed(iterable, minDelay, maxDelay)) {
    result.push(item);
  }
  const end = performance.now();
  const elapsed = end - start;

  assertEquals(result, [1, 2, 3]);
  const minExpected = 2 * minDelay;
  const maxExpected = 2 * maxDelay;
  assertGreaterOrEqual(elapsed, minExpected);
  assertLess(elapsed, maxExpected + 10); // Adding a small buffer for variations
});

Deno.test("delayed with empty iterable and range delay", async () => {
  const iterable: number[] = [];
  const minDelay = 100;
  const maxDelay = 200;
  const result = [];
  const start = performance.now();
  for await (const item of delayed(iterable, minDelay, maxDelay)) {
    result.push(item);
  }
  const end = performance.now();
  const elapsed = end - start;
  assertEquals(result, []);
  assertLess(elapsed, 10);
});
