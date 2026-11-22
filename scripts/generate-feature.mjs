import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const KEBAB_CASE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

function pascalCase(value) {
  return value
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function camelCase(value) {
  const pascal = pascalCase(value);
  return pascal[0].toLowerCase() + pascal.slice(1);
}

async function pathExists(target) {
  try {
    await stat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export async function generateFeature({ name, root = process.cwd() }) {
  if (!KEBAB_CASE.test(name ?? "")) {
    throw new Error("Feature names must use kebab-case.");
  }

  const featureName = pascalCase(name);
  const schemaName = `${camelCase(name)}Schema`;
  const featureRoot = path.join(root, "src/features", name);

  if (await pathExists(featureRoot)) {
    throw new Error(`Feature '${name}' already exists.`);
  }

  const files = {
    [`types/${name}.ts`]: `import { z } from "zod";\n\nexport const ${schemaName} = z.object({\n  id: z.string(),\n  name: z.string(),\n});\n\nexport type ${featureName} = z.infer<typeof ${schemaName}>;\n`,
    [`api/get-${name}.ts`]: `import type { ApiClient } from "@/shared/lib/api/create-client";\n\nimport { ${schemaName} } from "../types/${name}";\n\nexport function get${featureName}(client: ApiClient) {\n  return client.request("${name}", { schema: ${schemaName} });\n}\n`,
    [`queries/${name}-query.ts`]: `import { queryOptions } from "@tanstack/react-query";\n\nimport type { ApiClient } from "@/shared/lib/api/create-client";\n\nimport { get${featureName} } from "../api/get-${name}";\n\nexport function ${camelCase(name)}QueryOptions(client: ApiClient) {\n  return queryOptions({\n    queryKey: ["${name}"],\n    queryFn: () => get${featureName}(client),\n  });\n}\n`,
    [`components/${name}-card.tsx`]: `import type { ${featureName} } from "../types/${name}";\n\ntype ${featureName}CardProps = {\n  value: ${featureName};\n};\n\nexport function ${featureName}Card({ value }: ${featureName}CardProps) {\n  return (\n    <article>\n      <h2>{value.name}</h2>\n    </article>\n  );\n}\n`,
    [`__tests__/${name}-card.test.tsx`]: `import { render, screen } from "@testing-library/react";\nimport { expect, it } from "vitest";\n\nimport { ${featureName}Card } from "../components/${name}-card";\n\nit("renders ${name}", () => {\n  render(<${featureName}Card value={{ id: "1", name: "${featureName}" }} />);\n  expect(\n    screen.getByRole("heading", { name: "${featureName}" }),\n  ).toBeInTheDocument();\n});\n`,
    [`__tests__/get-${name}.test.ts`]: `import { expect, it, vi } from "vitest";\n\nimport type { ApiClient } from "@/shared/lib/api/create-client";\n\nimport { get${featureName} } from "../api/get-${name}";\n\nit("requests ${name} through the injected API client", async () => {\n  const request = vi.fn().mockResolvedValue({ id: "1", name: "${featureName}" });\n  const client = { request } as unknown as ApiClient;\n\n  await expect(get${featureName}(client)).resolves.toMatchObject({ id: "1" });\n  expect(request).toHaveBeenCalledWith("${name}", expect.any(Object));\n});\n`,
    [`__tests__/${name}-query.test.ts`]: `import { expect, it, vi } from "vitest";\n\nimport type { ApiClient } from "@/shared/lib/api/create-client";\n\nimport { ${camelCase(name)}QueryOptions } from "../queries/${name}-query";\n\nit("creates query options for ${name}", async () => {\n  const request = vi.fn().mockResolvedValue({ id: "1", name: "${featureName}" });\n  const options = ${camelCase(name)}QueryOptions({ request } as unknown as ApiClient);\n\n  expect(options.queryKey).toEqual(["${name}"]);\n  await expect(options.queryFn?.({} as never)).resolves.toMatchObject({ id: "1" });\n});\n`,
  };

  await Promise.all(
    Object.keys(files).map((relativePath) =>
      mkdir(path.dirname(path.join(featureRoot, relativePath)), {
        recursive: true,
      }),
    ),
  );
  await Promise.all(
    Object.entries(files).map(([relativePath, content]) =>
      writeFile(path.join(featureRoot, relativePath), content, "utf8"),
    ),
  );

  return { featureRoot, files: Object.keys(files) };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  generateFeature({ name: process.argv[2] })
    .then(({ featureRoot }) => console.log(`Created ${featureRoot}`))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
