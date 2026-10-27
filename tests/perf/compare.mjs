// Fails if hero LCP or CLS regressed against the pre-V3.5 baseline.
// Ruling (ledger, Task 1): LCP fails only when it is >5% AND >50ms worse; CLS when >0.01 worse.
import { readFileSync } from "node:fs";
import { measure } from "./measure.mjs";

const base = JSON.parse(readFileSync(new URL("./baseline-2026-10-26.json", import.meta.url)));
const now = await measure();
let ok = true;
for (const vp of ["desktop", "mobile"]) {
  const dl = now.lcpMs[vp] - base.lcpMs[vp];
  const lcpBad = dl > 50 && dl > base.lcpMs[vp] * 0.05;
  const clsBad = now.cls[vp] - base.cls[vp] > 0.01;
  console.log(`${vp}: LCP ${base.lcpMs[vp]} -> ${now.lcpMs[vp]}ms ${lcpBad ? "FAIL" : "ok"}; CLS ${base.cls[vp]} -> ${now.cls[vp]} ${clsBad ? "FAIL" : "ok"}`);
  ok &&= !lcpBad && !clsBad;
}
process.exit(ok ? 0 : 1);
