// Unit tests for the V4 perf harness: stats, budget verdicts, run floor.
// Run: node --test tests/perf/harness.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { stat, checkBudgets, runHarness, DEFAULT_BUDGETS } from "./harness.mjs";

const s = (v) => ({ median: v, p95: v, values: [v, v, v] });

function fixture({ desktopCls = 0, phoneImgKb = 0, phoneFontKb = 0 } = {}) {
  const page = (cls, imgKb, fontKb) => ({
    lcpMs: s(100),
    cls: s(cls),
    worstFrameMs: s(10),
    bytesKb: { image: imgKb, font: fontKb, script: 0, media: 0, document: 0, stylesheet: 0, other: 0 },
  });
  return {
    meta: { commit: "abc1234", date: "2026-10-30", browser: "chromium", browserVersion: "x", cpuRate: 4, runs: 3 },
    pages: { "http://x/": { desktop: page(desktopCls, 0, 0), phone: page(0, phoneImgKb, phoneFontKb) } },
  };
}

test("stat gives median and nearest-rank p95, keeping values in input order", () => {
  assert.deepEqual(stat([5, 1, 3]), { median: 3, p95: 5, values: [5, 1, 3] });
});

test("checkBudgets fails desktop CLS above 0.02 and names the value", () => {
  const r = checkBudgets(fixture({ desktopCls: 0.03 }), DEFAULT_BUDGETS);
  assert.equal(r.pass, false);
  assert.ok(r.failures.some((f) => f.includes("cls") && f.includes("0.03")), r.failures.join("\n"));
});

test("checkBudgets fails phone images plus fonts above 400 KB and names the total", () => {
  const r = checkBudgets(fixture({ phoneImgKb: 300, phoneFontKb: 124 }), DEFAULT_BUDGETS);
  assert.equal(r.pass, false);
  assert.ok(r.failures.some((f) => f.includes("phone") && f.includes("424")), r.failures.join("\n"));
});

test("runHarness refuses fewer than 3 runs", async () => {
  await assert.rejects(
    runHarness({ urls: ["http://x/"], runs: 2, profiles: ["desktop"], cpuRate: 4, browser: "chromium" }),
    /at least 3 runs/,
  );
});
