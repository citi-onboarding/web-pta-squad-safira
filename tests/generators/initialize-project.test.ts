import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { initializeProject } from "../../scripts/initialize-project.mjs";

const boilerplatePackageName = "vite-boilerplate";
const boilerplateAppName = "Vite Boilerplate";

async function writeJson(target: string, value: unknown) {
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function createBoilerplateFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "vite-initializer-"));
  const directories = [
    "public",
    "src/app/routes",
    "src/features/example",
    "src/shared/lib/env",
  ];

  await Promise.all(
    directories.map((directory) =>
      mkdir(path.join(root, directory), { recursive: true }),
    ),
  );
  await writeJson(path.join(root, "package.json"), {
    name: boilerplatePackageName,
    scripts: {},
  });
  await writeFile(
    path.join(root, ".env.example"),
    `VITE_APP_NAME=${boilerplateAppName}\nVITE_APP_URL=http://localhost:5173\n`,
    "utf8",
  );
  await writeFile(
    path.join(root, "README.md"),
    `# ${boilerplateAppName}\n\nThe default is configured by the initializer.\n`,
    "utf8",
  );
  await writeFile(
    path.join(root, "src/shared/lib/env/schema.ts"),
    `export const defaultName = "${boilerplateAppName}";\n`,
    "utf8",
  );
  await writeFile(
    path.join(root, "src/shared/lib/env/env.test.ts"),
    `const expectedName = "${boilerplateAppName}";\n`,
    "utf8",
  );
  await writeFile(
    path.join(root, "src/app/routes/home-page.tsx"),
    `// BEGIN EXAMPLE FEATURE IMPORT
import { Example } from "example";
// END EXAMPLE FEATURE IMPORT

export default function Page() {
  return <main>{/* BEGIN EXAMPLE FEATURE */}<Example />{/* END EXAMPLE FEATURE */}</main>;
}
`,
    "utf8",
  );
  await writeFile(
    path.join(root, "src/features/example/example.ts"),
    "export const example = true;\n",
    "utf8",
  );
  await writeFile(
    path.join(root, "public/health.json"),
    '{"status":"ok","scope":"static-assets"}\n',
    "utf8",
  );

  return root;
}

describe("initializeProject", () => {
  it("customizes the project and removes boilerplate-only files", async () => {
    const root = await createBoilerplateFixture();

    await expect(
      initializeProject({ appName: "Café Admin", root }),
    ).resolves.toEqual({ appName: "Café Admin", packageName: "cafe-admin" });

    await expect(
      readFile(path.join(root, "package.json"), "utf8"),
    ).resolves.toContain('"name": "cafe-admin"');
    await expect(
      readFile(path.join(root, ".env.local"), "utf8"),
    ).resolves.toContain("VITE_APP_NAME=Café Admin");
    await expect(
      readFile(path.join(root, "README.md"), "utf8"),
    ).resolves.not.toContain(boilerplateAppName);
    await expect(
      readFile(path.join(root, ".boilerplate-initialized"), "utf8"),
    ).resolves.toContain("Package: cafe-admin");
    await expect(
      stat(path.join(root, "src/features/example")),
    ).rejects.toThrow();
    await expect(
      stat(path.join(root, "public/health.json")),
    ).resolves.toBeDefined();
  });

  it("refuses a second initialization", async () => {
    const root = await createBoilerplateFixture();
    await initializeProject({ appName: "First Project", root });

    await expect(
      initializeProject({ appName: "Second Project", root }),
    ).rejects.toThrow("already been initialized");
  });

  it("does not modify files when a local environment already exists", async () => {
    const root = await createBoilerplateFixture();
    await writeFile(path.join(root, ".env.local"), "SECRET=value\n", "utf8");

    await expect(
      initializeProject({ appName: "Safe Project", root }),
    ).rejects.toThrow(".env.local already exists");
    await expect(
      readFile(path.join(root, "package.json"), "utf8"),
    ).resolves.toContain(boilerplatePackageName);
    await expect(
      stat(path.join(root, "src/features/example")),
    ).resolves.toBeDefined();
  });

  it("rejects unsafe application and package names", async () => {
    const root = await createBoilerplateFixture();

    await expect(
      initializeProject({ appName: 'Unsafe "Name"', root }),
    ).rejects.toThrow("safe display characters");
    await expect(
      initializeProject({
        appName: "Safe Name",
        packageName: "Unsafe_Name",
        root,
      }),
    ).rejects.toThrow("lowercase kebab-case");
  });
});
