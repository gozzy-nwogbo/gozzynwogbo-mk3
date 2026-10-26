// Records the pre-V3.5 baseline. Run against `pnpm preview --port 4329`.
import { writeFileSync } from "node:fs";
import { measure } from "./measure.mjs";

const out = await measure();
writeFileSync(new URL("./baseline-2026-10-26.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(JSON.stringify(out));
