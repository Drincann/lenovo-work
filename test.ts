import { createCalculator } from ".";

// test
const _cases: [Date, number][] = new Array(60)
  .fill(undefined)
  .map((_, i) => [new Date(2020, 8, 29, 12, 49), i + 1]);
const calculate = createCalculator();

console.log(
  _cases.map(([start, hours]) => `From ${start.toLocaleString()} to ${calculate(start, hours).toLocaleString()} with ${hours} hours`)
);
