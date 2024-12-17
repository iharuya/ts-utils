import { assertEquals, assertThrows } from "jsr:@std/assert";
import { err, match, ok, type Result } from "./mod.ts";

Deno.test("Result - Ok", () => {
  const result = ok(2) as Result<number, unknown>;
  assertEquals(result.val, 2);
  assertEquals(result.isOk(), true);
  assertEquals(result.isOkAnd((val) => val > 1), true);
  assertEquals(result.isOkAnd((val) => val < 1), false);
  assertEquals(result.isErr(), false);
  assertEquals(result.isErrAnd(() => true), false);
  assertEquals(result.map((val) => val * 2).val, 4);
  assertEquals(result.mapOr((val) => val * 2, 0), 4);
  assertEquals(result.mapOrElse((val) => val * 2, (_) => 0), 4);
  assertEquals(result.mapErr((e) => e).val, 2);
  assertEquals(result.inspect((val) => assertEquals(val, 2)).val, 2);
  assertEquals(result.inspectErr(() => {}).val, 2);
  assertEquals(result.expect("error"), 2);
  assertEquals(result.unwrap(), 2);
  assertThrows(() => result.expectErr("error"), Error, "error: 2");
  assertThrows(
    () => result.unwrapErr(),
    Error,
    "called `Result.unwrapErr()` on an `Ok` value: 2",
  );
});

Deno.test("Result - Err", () => {
  const result = err("error") as Result<number, string>;
  assertEquals(result.val, "error");
  assertEquals(result.isOk(), false);
  assertEquals(result.isOkAnd(() => true), false);
  assertEquals(result.isErr(), true);
  assertEquals(result.isErrAnd((e) => e === "error"), true);
  assertEquals(result.isErrAnd((e) => e !== "error"), false);
  assertEquals(result.map((val) => val).val, "error");
  assertEquals(result.mapOr((_) => 0, 4), 4);
  assertEquals(result.mapOrElse((_) => 0, (e) => e.length), 5);
  assertEquals(result.mapErr((e) => e.toUpperCase()).val, "ERROR");
  assertEquals(result.inspect(() => {}).val, "error");
  assertEquals(
    result.inspectErr((e) => assertEquals(e, "error")).val,
    "error",
  );
  assertThrows(() => result.expect("oh no"), Error, "oh no: error");
  assertThrows(() => result.unwrap(), Error, "error");
  assertEquals(result.expectErr("error"), "error");
  assertEquals(result.unwrapErr(), "error");
});

Deno.test("Result - match", () => {
  const okResult = ok(2) as Result<number, string>;
  const errResult = err("error") as Result<number, string>;
  assertEquals(match(okResult, (val) => val * 2, (_) => 0), 4);
  assertEquals(match(errResult, (_) => 0, (e) => e.length), 5);
});

Deno.test("Result - Ok with different types", () => {
  const result = ok(10) as Result<number, string>;
  assertEquals(result.val, 10);
  assertEquals(result.isOk(), true);

  const result2 = ok("hello") as Result<string, Error>;
  assertEquals(result2.val, "hello");
  assertEquals(result2.isOk(), true);
});

Deno.test("Result - Err with different types", () => {
  const result = err("error message") as Result<number, string>;
  assertEquals(result.val, "error message");
  assertEquals(result.isErr(), true);

  const error = new Error("test error");
  const result2: Result<string, Error> = err(error);
  assertEquals(result2.val, error);
  assertEquals(result2.isErr(), true);
});

Deno.test("Result - mapOrElse with different types", () => {
  const okResult = ok(10) as Result<number, string>;
  const errResult = err("error") as Result<number, string>;

  const mappedOk = okResult.mapOrElse(
    (val) => val.toString(),
    (err) => err.length.toString(),
  );
  assertEquals(mappedOk, "10");

  const mappedErr = errResult.mapOrElse(
    (val) => val.toString(),
    (err) => err.length.toString(),
  );
  assertEquals(mappedErr, "5");
});

Deno.test("Result - unwrapFailed throws custom error", () => {
  assertThrows(
    () => {
      const result = err("custom error");
      result.expect("unwrap failed");
    },
    Error,
    "unwrap failed: custom error",
  );
});

Deno.test("Result - handles complex nested results", () => {
  const innerOk = ok(5) as Result<number, string>;
  const outerOk = ok(innerOk) as Result<Result<number, string>, string>;

  assertEquals(outerOk.isOk(), true);
  assertEquals(outerOk.unwrap().isOk(), true);
  assertEquals(outerOk.unwrap().unwrap(), 5);

  const innerErr = err("inner error") as Result<number, string>;
  const outerErr = ok(innerErr) as Result<Result<number, string>, string>;

  assertEquals(outerErr.isOk(), true);
  assertEquals(outerErr.unwrap().isErr(), true);
  assertEquals(outerErr.unwrap().unwrapErr(), "inner error");
});

Deno.test("Result - handles edge cases with undefined and null", () => {
  const okUndefined = ok(undefined);
  const okNull = ok(null);
  const errUndefined = err(undefined);
  const errNull = err(null);

  assertEquals(okUndefined.isOk(), true);
  assertEquals(okUndefined.unwrap(), undefined);

  assertEquals(okNull.isOk(), true);
  assertEquals(okNull.unwrap(), null);

  assertEquals(errUndefined.isErr(), true);
  assertEquals(errUndefined.unwrapErr(), undefined);

  assertEquals(errNull.isErr(), true);
  assertEquals(errNull.unwrapErr(), null);
});
