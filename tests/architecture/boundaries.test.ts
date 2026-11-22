import path from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

import { architectureMessages } from "../../architecture.config.mjs";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const fixtureRoot = path.join(repositoryRoot, "tests/architecture/fixtures");
const configPath = path.join(repositoryRoot, "eslint.architecture.config.mjs");

async function lintFixture(relativePath: string) {
  const eslint = new ESLint({
    cwd: fixtureRoot,
    overrideConfigFile: configPath,
  });
  const [result] = await eslint.lintFiles(relativePath);

  return result.messages;
}

describe("architecture boundaries", () => {
  it("allows a feature to import shared and itself", async () => {
    await expect(
      lintFixture("src/features/auth/valid.mjs"),
    ).resolves.toHaveLength(0);
  });

  it("rejects cross-feature imports with an actionable message", async () => {
    const messages = await lintFixture("src/features/auth/cross-feature.mjs");

    expect(messages).toHaveLength(1);
    expect(messages[0].message).toBe(
      architectureMessages.crossFeature.replace(
        "{{to.element.captured.feature}}",
        "billing",
      ),
    );
  });

  it("rejects feature imports from the app layer", async () => {
    const messages = await lintFixture("src/features/auth/app-import.mjs");

    expect(messages).toHaveLength(1);
    expect(messages[0].message).toBe(architectureMessages.featureToApp);
  });

  it("rejects shared imports from upper layers", async () => {
    const messages = await lintFixture("src/shared/lib/feature-import.mjs");

    expect(messages).toHaveLength(1);
    expect(messages[0].message).toBe(architectureMessages.sharedToUpperLayer);
  });
});
