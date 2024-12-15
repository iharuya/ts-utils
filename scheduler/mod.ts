/**
 * A module providing a task scheduler that limits concurrency and enforces minimum time between tasks.
 * @module
 *
 * @example
 * ```typescript
 * import { Scheduler } from "jsr:@iharuya/scheduler";
 *
 * const scheduler = new Scheduler({ maxConcurrency: 2, extTime: 1000 });
 * const tasks = [];
 * for (let i = 0; i < 10; i++) {
 *   tasks.push(scheduler.schedule(() => fetch(`https://example.com/api/${i}`)));
 * }
 * const results = await Promise.all(tasks);
 * ```
 */

type QueueItem<T> = {
  task: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};

/**
 * A class that schedules asynchronous tasks with concurrency limits and minimum time between executions.
 */
export class Scheduler {
  #maxConcurrency: number;
  #extTime: number;
  // deno-lint-ignore no-explicit-any
  #queue: QueueItem<any>[] = [];
  #running = 0;
  #lastRequestTime = 0;

  /**
   * Creates a new Scheduler instance.
   * @param options - Configuration options for the scheduler.
   * @param options.maxConcurrency - The maximum number of tasks that can run concurrently.
   * @param options.extTime - The extensional time (in milliseconds) to sleep after one of consecutive tasks finished.
   */
  constructor(options: { maxConcurrency: number; extTime: number }) {
    this.#maxConcurrency = options.maxConcurrency;
    this.#extTime = options.extTime;
    this.#lastRequestTime = 0;
  }

  async #run() {
    while (this.#queue.length > 0 && this.#running < this.#maxConcurrency) {
      this.#running++;
      const item = this.#queue.shift()!;
      const elapsed = Date.now() - this.#lastRequestTime;
      const waitTime = this.#extTime - elapsed;
      if (waitTime > 0) {
        await new Promise((r) => setTimeout(r, waitTime));
      }
      const promise = item.task();
      promise.then(
        (res) => item.resolve(res),
        (err) => item.reject(err),
      ).finally(() => {
        this.#lastRequestTime = Date.now();
        this.#running--;
        if (this.#queue.length > 0) {
          queueMicrotask(() => this.#run());
        }
      });
    }
  }

  /**
   * Schedules a task to be executed.
   * @param task - An asynchronous function to be scheduled.
   * @returns A promise that resolves with the result of the task or rejects if the task throws an error.
   */
  schedule<Res>(task: () => Promise<Res>): Promise<Res> {
    return new Promise<Res>((resolve, reject) => {
      this.#queue.push({ task, resolve, reject });
      queueMicrotask(() => this.#run());
    });
  }
}
