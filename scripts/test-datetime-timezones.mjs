import { spawnSync } from "node:child_process";
import path from "node:path";

const vitest = path.join(process.cwd(), "node_modules/vitest/vitest.mjs");
const testFile = "src/shared/lib/datetime.test.ts";

for (const timezone of ["UTC", "America/Maceio"]) {
  const result = spawnSync(process.execPath, [vitest, "run", testFile], {
    env: { ...process.env, TZ: timezone },
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
