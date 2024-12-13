import {
  assertAlmostEquals,
  assertEquals,
  assertRejects,
} from "jsr:@std/assert";
import { sleep } from "jsr:@iharuya/time";
import { Scheduler } from "./mod.ts";

Deno.test("Scheduler limits concurrent requests", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 10, minTime: 0 });
  const tasks = [];
  for (let i = 0; i < 25; i++) {
    tasks.push(scheduler.schedule(() => sleep(100)));
  }
  const start = performance.now();
  await Promise.all(tasks);
  const end = performance.now();
  const elapsed = end - start;
  assertAlmostEquals(elapsed, 300, 20);
  // FIXME: もっと直接的にテストする方法を考えるべき
  // 実装側に手を加えて「タスク実行開始」イベントを発火させないといけない
});

Deno.test("Scheduler limits concurrent requests even if tasks take arbitrary time", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 2, minTime: 0 });
  const tasks = [];
  tasks.push(scheduler.schedule(() => sleep(100)));
  tasks.push(scheduler.schedule(() => sleep(50)));
  tasks.push(scheduler.schedule(() => sleep(100)));
  tasks.push(scheduler.schedule(() => sleep(50)));
  tasks.push(scheduler.schedule(() => sleep(50)));
  //# timeline ("|" = 50ms)
  //1 ||
  //2 |
  //3  ||
  //4   |
  //5    |
  const start = performance.now();
  await Promise.all(tasks);
  const end = performance.now();
  const elapsed = end - start;
  assertAlmostEquals(elapsed, 200, 20);
});

Deno.test("Scheduler limits concurrent requests even if tasks take arbitrary time #2", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 3, minTime: 0 });
  const tasks = [];
  tasks.push(scheduler.schedule(() => sleep(100)));
  tasks.push(scheduler.schedule(() => sleep(50)));
  tasks.push(scheduler.schedule(() => sleep(200)));
  tasks.push(scheduler.schedule(() => sleep(50)));
  tasks.push(scheduler.schedule(() => sleep(250)));
  tasks.push(scheduler.schedule(() => sleep(50)));
  tasks.push(scheduler.schedule(() => sleep(150)));
  //# timeline ("|" = 50ms)
  //1 ||
  //2 |
  //3 ||||
  //4  |
  //5   |||||
  //6   |
  //7    |||
  const start = performance.now();
  await Promise.all(tasks);
  const end = performance.now();
  const elapsed = end - start;
  assertAlmostEquals(elapsed, 350, 20);
});

Deno.test("Scheduler respects minTime", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 1, minTime: 200 });
  const tasks = [];
  for (let i = 0; i < 3; i++) {
    tasks.push(scheduler.schedule(() => sleep(100)));
  }
  const start = performance.now();
  await Promise.all(tasks);
  const end = performance.now();
  const elapsed = end - start;
  assertAlmostEquals(elapsed, 700, 20);
});

Deno.test("Scheduler respects minTime even if tasks take arbitrary time", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 1, minTime: 200 });
  const tasks = [];
  tasks.push(scheduler.schedule(() => sleep(50)));
  tasks.push(scheduler.schedule(() => sleep(150)));
  tasks.push(scheduler.schedule(() => sleep(100)));
  const start = performance.now();
  await Promise.all(tasks);
  const end = performance.now();
  const elapsed = end - start;
  assertAlmostEquals(elapsed, 700, 20);
});

Deno.test("Scheduler limits concurrent requests and respects minTime", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 3, minTime: 200 });
  const tasks = [];
  for (let i = 0; i < 5; i++) {
    tasks.push(scheduler.schedule(() => sleep(100)));
  }
  const start = performance.now();
  await Promise.all(tasks);
  const end = performance.now();
  const elapsed = end - start;
  assertAlmostEquals(elapsed, 400, 20);
})

Deno.test("Scheduler limits concurrent requests and respects minTime even if tasks take arbitrary time", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 3, minTime: 100 });
  const tasks = [];
  tasks.push(scheduler.schedule(() => sleep(100)));
  tasks.push(scheduler.schedule(() => sleep(50)));
  tasks.push(scheduler.schedule(() => sleep(200)));
  tasks.push(scheduler.schedule(() => sleep(50)));
  tasks.push(scheduler.schedule(() => sleep(250)));
  tasks.push(scheduler.schedule(() => sleep(50)));
  tasks.push(scheduler.schedule(() => sleep(150)));
  //# timeline ("|" = 50ms)
  //1 ||**
  //2 |**
  //3 ||||**
  //4    |**
  //5     |||||
  //6       |**
  //7       |||
  const start = performance.now();
  await Promise.all(tasks);
  const end = performance.now();
  const elapsed = end - start;
  assertAlmostEquals(elapsed, 450, 20);
})

Deno.test("Scheduler task result goes back to the caller", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 1, minTime: 0 });
  const result = await scheduler.schedule(() => Promise.resolve("success"));
  assertEquals(result, "success");
});

Deno.test("Scheduler task throws error thrown in the callback", async () => {
  const scheduler = new Scheduler({ maxConcurrent: 1, minTime: 0 });
  const task = scheduler.schedule(() => Promise.reject(new Error("failure")));
  await assertRejects(() => task);
});
