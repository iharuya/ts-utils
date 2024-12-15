import { assertEquals } from "jsr:@std/assert";
import { type PriceArgs, TaxCalculator } from "./mod.ts";

Deno.test("TaxCalculator - constructor initializes with correct tax rate", () => {
  const taxRate = 0.1;
  const calculator = new TaxCalculator(taxRate);
  assertEquals(calculator["taxRate"], taxRate);
});

Deno.test("TaxCalculator - tax calculates correct tax for tax-excluded price", () => {
  const calculator = new TaxCalculator(0.1);
  const args: PriceArgs = { price: 1000, taxIncluded: false };
  assertEquals(calculator.tax(args), 100);
});

Deno.test("TaxCalculator - tax calculates correct tax for tax-included price", () => {
  const calculator = new TaxCalculator(0.1);
  const args: PriceArgs = { price: 1100, taxIncluded: true };
  assertEquals(calculator.tax(args), 100);
});

Deno.test("TaxCalculator - includeTax returns same price if already tax-included", () => {
  const calculator = new TaxCalculator(0.1);
  const args: PriceArgs = { price: 1100, taxIncluded: true };
  assertEquals(calculator.includeTax(args), 1100);
});

Deno.test("TaxCalculator - includeTax calculates correct price for tax-excluded price", () => {
  const calculator = new TaxCalculator(0.1);
  const args: PriceArgs = { price: 1000, taxIncluded: false };
  assertEquals(calculator.includeTax(args), 1100);
});

Deno.test("TaxCalculator - excludeTax returns same price if already tax-excluded", () => {
  const calculator = new TaxCalculator(0.1);
  const args: PriceArgs = { price: 1000, taxIncluded: false };
  assertEquals(calculator.excludeTax(args), 1000);
});

Deno.test("TaxCalculator - excludeTax calculates correct price for tax-included price", () => {
  const calculator = new TaxCalculator(0.1);
  const args: PriceArgs = { price: 1100, taxIncluded: true };
  assertEquals(calculator.excludeTax(args), 1000);
});

Deno.test("TaxCalculator - extractTax returns 0 for tax-excluded price", () => {
  const calculator = new TaxCalculator(0.1);
  const args: PriceArgs = { price: 1000, taxIncluded: false };
  assertEquals(calculator.extractTax(args), 0);
});

Deno.test("TaxCalculator - extractTax calculates correct tax for tax-included price", () => {
  const calculator = new TaxCalculator(0.1);
  const args: PriceArgs = { price: 1100, taxIncluded: true };
  assertEquals(calculator.extractTax(args), 100);
});

Deno.test("TaxCalculator - handles different tax rates", () => {
  const calculator = new TaxCalculator(0.08);
  assertEquals(calculator.tax({ price: 1000, taxIncluded: false }), 80);
  assertEquals(
    calculator.includeTax({ price: 1000, taxIncluded: false }),
    1080,
  );
  assertEquals(calculator.excludeTax({ price: 1080, taxIncluded: true }), 1000);
  assertEquals(calculator.extractTax({ price: 1080, taxIncluded: true }), 80);
});

Deno.test("TaxCalculator - handles zero tax rate", () => {
  const calculator = new TaxCalculator(0);
  assertEquals(calculator.tax({ price: 1000, taxIncluded: false }), 0);
  assertEquals(
    calculator.includeTax({ price: 1000, taxIncluded: false }),
    1000,
  );
  assertEquals(calculator.excludeTax({ price: 1000, taxIncluded: true }), 1000);
  assertEquals(calculator.extractTax({ price: 1000, taxIncluded: true }), 0);
});

Deno.test("TaxCalculator - handles rounding", () => {
  // 四捨五入
  const calculator = new TaxCalculator(0.1);
  assertEquals(calculator.excludeTax({ price: 1006, taxIncluded: true }), 915); // 914.5454...
  assertEquals(calculator.excludeTax({ price: 1007, taxIncluded: true }), 915); // 915.4545...
});

Deno.test("TaxCalculator - handles very large price", () => {
  const calculator = new TaxCalculator(0.1);
  assertEquals(
    calculator.tax({ price: 999999999999999, taxIncluded: false }),
    100000000000000,
  );
});

Deno.test.ignore("TaxCalculator - handles floaty prices", () => {}); // TODO: Add this test when things got serious
