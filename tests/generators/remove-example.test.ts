import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { removeExample } from "../../scripts/remove-example.mjs";

const pageWithMarkers = `// BEGIN EXAMPLE FEATURE IMPORT
import { Example } from "example";
// END EXAMPLE FEATURE IMPORT

export default function Page() {
  return <main>{/* BEGIN EXAMPLE FEATURE */}<Example />{/* END EXAMPLE FEATURE */}</main>;
}
`;

async function exampleRoot(page = pageWithMarkers) {
  const root = await mkdtemp(path.join(os.tmpdir(), "vite-example-removal-"));
  await mkdir(path.join(root, "src/features/example"), { recursive: true });
  await mkdir(path.join(root, "src/app/routes"), { recursive: true });
  await writeFile(
    path.join(root, "src/features/example/example.ts"),
    "",
    "utf8",
  );
  await writeFile(
    path.join(root, "src/app/routes/home-page.tsx"),
    page,
    "utf8",
  );
  return root;
}

describe("removeExample", () => {
  it("removes only the marked example code", async () => {
    const root = await exampleRoot();

    await removeExample({ root });

    await expect(
      stat(path.join(root, "src/features/example")),
    ).rejects.toThrow();
    await expect(
      readFile(path.join(root, "src/app/routes/home-page.tsx"), "utf8"),
    ).resolves.not.toContain("EXAMPLE FEATURE");
  });

  it("does not delete the feature when markers are missing", async () => {
    const root = await exampleRoot(
      "export default function Page() { return null; }",
    );

    await expect(removeExample({ root })).rejects.toThrow(
      "markers are missing",
    );
    await expect(
      stat(path.join(root, "src/features/example")),
    ).resolves.toBeDefined();
  });
});
