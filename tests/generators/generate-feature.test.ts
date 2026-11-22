import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { generateFeature } from "../../scripts/generate-feature.mjs";

async function temporaryRoot() {
  return mkdtemp(path.join(os.tmpdir(), "vite-feature-generator-"));
}

describe("generateFeature", () => {
  it("creates a complete feature scaffold", async () => {
    const root = await temporaryRoot();
    const result = await generateFeature({ name: "team-members", root });

    expect(result.files).toHaveLength(7);
    await expect(
      readFile(
        path.join(result.featureRoot, "api/get-team-members.ts"),
        "utf8",
      ),
    ).resolves.toContain("getTeamMembers");
    await expect(
      readFile(path.join(result.featureRoot, "types/team-members.ts"), "utf8"),
    ).resolves.toContain("teamMembersSchema");
    await expect(
      readFile(
        path.join(result.featureRoot, "queries/team-members-query.ts"),
        "utf8",
      ),
    ).resolves.toContain("teamMembersQueryOptions");
  });

  it("rejects invalid names and existing features", async () => {
    const root = await temporaryRoot();

    await expect(
      generateFeature({ name: "TeamMembers", root }),
    ).rejects.toThrow("kebab-case");
    await generateFeature({ name: "users", root });
    await expect(generateFeature({ name: "users", root })).rejects.toThrow(
      "already exists",
    );
  });
});
