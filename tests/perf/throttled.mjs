// Throttled first-visit LCP/CLS, base (main build) vs branch, same conditions.
// Usage: node tests/perf/throttled.mjs <baseUrl> <branchUrl>
import { measure } from "./measure.mjs";

const THROTTLE = { kbps: 4000, latency: 100 };
const [base, branch] = [await measure(process.argv[2], 3, THROTTLE), await measure(process.argv[3], 3, THROTTLE)];
let ok = true;
for (const vp of ["desktop", "mobile"]) {
  const dl = branch.lcpMs[vp] - base.lcpMs[vp];
  const lcpBad = dl > 50 && dl > base.lcpMs[vp] * 0.05;
  const clsBad = branch.cls[vp] - base.cls[vp] > 0.01;
  console.log(`${vp}: LCP ${base.lcpMs[vp]} -> ${branch.lcpMs[vp]}ms ${lcpBad ? "FAIL" : "ok"}; CLS ${base.cls[vp]} -> ${branch.cls[vp]} ${clsBad ? "FAIL" : "ok"}`);
  ok &&= !lcpBad && !clsBad;
}
process.exit(ok ? 0 : 1);
