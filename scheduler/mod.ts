/**
 * A module providing a task scheduler that limits concurrency and enforces minimum time between tasks.
 * @module
 *
 * @example
 * ```typescript
 * import { Scheduler } from "jsr:@iharuya/scheduler";
 *
 * const scheduler = new Scheduler({ maxConcurrent: 2, minTime: 1000 });
 *
 * const task1 = async () => {
 *   console.log("Task 1 started");
 *   await new Promise(resolve => setTimeout(resolve, 2000));
 *   console.log("Task 1 finished");
 *   return 1;
 * };
 *
 * const task2 = async () => {
 *   console.log("Task 2 started");
 *   await new Promise(resolve => setTimeout(resolve, 3000));
 *   console.log("Task 2 finished");
 *   return 2;
 * };
 *
 * const task3 = async () => {
 *   console.log("Task 3 started");
 *   await new Promise(resolve => setTimeout(resolve, 1000));
 *   console.log("Task 3 finished");
 *   return 3;
 * };
 *
 * const result1 = scheduler.schedule(task1);
 * const result2 = scheduler.schedule(task2);
 * const result3 = scheduler.schedule(task3);
 *
 * Promise.all([result1, result2, result3]).then(results => {
 *   console.log("All tasks finished:", results);
 * });
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
  #maxConcurrent: number;
  #minTime: number;
  // deno-lint-ignore no-explicit-any
  #queue: QueueItem<any>[] = [];
  #running: number = 0;
  #lastRequestTime: number = 0;

  /**
   * Creates a new Scheduler instance.
   * @param options - Configuration options for the scheduler.
   * @param options.maxConcurrent - The maximum number of tasks that can run concurrently.
   * @param options.minTime - The minimum time (in milliseconds) between the start of two consecutive tasks.
   * @example
   * const scheduler = new Scheduler({ maxConcurrent: 2, minTime: 1000 });
   */
  constructor(options: { maxConcurrent: number; minTime: number }) {
    this.#maxConcurrent = options.maxConcurrent;
    this.#minTime = options.minTime;
  }

  async #run() {
    while (this.#queue.length > 0 && this.#running < this.#maxConcurrent) {
      const waitTime = this.#minTime - (Date.now() - this.#lastRequestTime);
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      const item = this.#queue.shift()!;
      this.#running++;
      this.#lastRequestTime = Date.now();

      try {
        const result = await item.task();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      } finally {
        this.#running--;
        if (this.#queue.length > 0) {
          queueMicrotask(() => this.#run());
        }
      }
    }
  }

  /**
   * Schedules a task to be executed.
   * @param task - An asynchronous function to be scheduled.
   * @returns A promise that resolves with the result of the task or rejects if the task throws an error.
   * @template Res - The type of the task's result.
   * @example
   * const result = scheduler.schedule(async () => {
   *   // Perform some asynchronous operation
   *   return "result";
   * });
   */
  schedule<Res>(task: () => Promise<Res>): Promise<Res> {
    return new Promise<Res>((resolve, reject) => {
      this.#queue.push({ task, resolve, reject });
      this.#run();
    });
  }
}
