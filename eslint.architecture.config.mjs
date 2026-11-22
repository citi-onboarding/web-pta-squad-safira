import path from "node:path";
import { fileURLToPath } from "node:url";

import { createArchitectureConfig } from "./architecture.config.mjs";

const fixtureRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "tests/architecture/fixtures",
);

const architectureTestConfig = [
  createArchitectureConfig({
    rootPath: fixtureRoot,
    files: ["src/**/*.mjs"],
  }),
];

export default architectureTestConfig;
