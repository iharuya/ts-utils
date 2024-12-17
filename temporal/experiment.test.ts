import { assertAlmostEquals, assertEquals } from "jsr:@std/assert";
// import { FakeTime } from "jsr:@std/testing/time"; Temporal APIには適用されない

Deno.test("Temporal API experiment", () => {
  console.log({
    instant: Temporal.Now.instant(), // タイムスタンプにはこれを使えば良さそう
    timeZone: Temporal.Now.timeZoneId(),
    zonedDateTime: Temporal.Now.zonedDateTimeISO(),
    plain: {
      datetime: Temporal.Now.plainDateTimeISO(),
      date: Temporal.Now.plainDateISO(),
      time: Temporal.Now.plainTimeISO(),
    },
  });
  assertEquals(Temporal.Now.instant().epochMilliseconds, Date.now());
  assertEquals(
    Temporal.Duration.compare(
      Temporal.Duration.from({ seconds: 1 }),
      Temporal.Duration.from({ seconds: 2 }),
    ),
    -1,
  );

  const today = Temporal.Now.plainDateISO();
  const yesterday = today.subtract({ days: 1 });
  const dayBeforeYesterday = yesterday.subtract({ days: 1 });
  assertEquals(today.since(dayBeforeYesterday).days, 2);
  assertEquals(today.since(dayBeforeYesterday).hours, 0);
  assertEquals(
    today.since(dayBeforeYesterday).round({ largestUnit: "hour" }).hours,
    48,
  );

  const nowFromToday = today.toPlainDateTime();
  assertEquals(nowFromToday.hour, 0);

  // cup noodle
  const timeToBoil = Temporal.Duration.from({ minutes: 2 });
  const timeToWait = Temporal.Duration.from({ minutes: 3 });
  const timeToEat = Temporal.Duration.from({ minutes: 5 });
  const mealTime = timeToBoil.add(timeToWait).add(timeToEat);
  assertEquals(mealTime.total({ unit: "minute" }), 10);
  assertEquals(mealTime.total({ unit: "second" }), 600);
  assertAlmostEquals(mealTime.total({ unit: "hour" }), 10 / 60);
  assertEquals(mealTime.toLocaleString("ja-JP"), "10 分");

  const jpDateTime = Temporal.ZonedDateTime.from(
    "2024-12-06T14:53:54.225644032+09:00[Asia/Tokyo]",
  );
  assertEquals(
    jpDateTime.toLocaleString("ja-JP", {
      dateStyle: "full",
      timeStyle: "full",
    }),
    "2024/12/6金曜日 14時53分54秒 日本標準時",
  );
});
