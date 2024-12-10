import {
  assertEquals,
  assertGreaterOrEqual,
  assertLess,
  assertRejects,
} from "jsr:@std/assert";
import { sleep } from "jsr:@iharuya/time";
import { Scheduler } from "./mod.ts";

const mockResponse = new Response("Mock response body", { status: 200 });
const mockFetch = async (_: RequestInfo, __?: RequestInit) => {
  await sleep(100);
  return mockResponse.clone();
};
const mockErrorFetch = async (_: RequestInfo, __?: RequestInit) => {
  await sleep(100);
  throw new Error("Mock fetch error");
};

Deno.test("Scheduler limits concurrent requests", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 10, minTime: 0 });
  const promises = [];
  for (let i = 0; i < 25; i++) {
    promises.push(
      scheduler.schedule(() => mockFetch("https://example.com")).then((res) =>
        res.text()
      ),
    );
  }

  const start = performance.now();
  await Promise.all(promises);
  const end = performance.now();
  const elapsed = end - start;
  assertGreaterOrEqual(elapsed, 300, "Elapsed time should be at least 300ms");
  assertLess(elapsed, 400, "Elapsed time should be at most 400ms");
  // FIXME: もっと直接的にテストする方法を考えるべき
  // 実装側に手を加えて「タスク実行開始」イベントを発火させないといけない
});

Deno.test("Scheduler respects minTime", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 1, minTime: 100 });
  const start = performance.now();
  await scheduler.schedule(() => mockFetch("https://example.com")).then((res) =>
    res.text()
  );
  await scheduler.schedule(() => mockFetch("https://example.com")).then((res) =>
    res.text()
  );
  const end = performance.now();
  const elapsed = end - start;

  assertGreaterOrEqual(elapsed, 200, "Elapsed time should be at least 200ms");
  assertLess(elapsed, 300, "Elapsed time should be at most 300ms");
});

Deno.test("Scheduler response back to the caller", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 1, minTime: 0 });
  const response = await scheduler.schedule(() =>
    mockFetch("https://example.com")
  ).then((res) => res.text());
  assertEquals(response, "Mock response body");
});

Deno.test("Scheduler throws error thrown in the callback", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 1, minTime: 0 });
  const task = scheduler.schedule(() => mockErrorFetch("https://example.com"));
  await assertRejects(() => task);
});
