import { readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const IMPORT_BLOCK =
  /\/\/ BEGIN EXAMPLE FEATURE IMPORT[\s\S]*?\/\/ END EXAMPLE FEATURE IMPORT\n*/;
const COMPONENT_BLOCK =
  /\s*\{\/\* BEGIN EXAMPLE FEATURE \*\/\}[\s\S]*?\{\/\* END EXAMPLE FEATURE \*\/\}\n*/;

async function assertDirectory(target) {
  try {
    if (!(await stat(target)).isDirectory()) throw new Error();
  } catch {
    throw new Error("The removable example feature was not found.");
  }
}

export async function prepareExampleRemoval({ root = process.cwd() } = {}) {
  const featureRoot = path.join(root, "src/features/example");
  const pagePath = path.join(root, "src/app/routes/home-page.tsx");

  await assertDirectory(featureRoot);
  const page = await readFile(pagePath, "utf8");

  if (!IMPORT_BLOCK.test(page) || !COMPONENT_BLOCK.test(page)) {
    throw new Error(
      "The example markers are missing. No files were changed; remove the feature manually.",
    );
  }

  const updatedPage = page
    .replace(IMPORT_BLOCK, "")
    .replace(COMPONENT_BLOCK, "\n");

  return { featureRoot, pagePath, updatedPage };
}

export async function applyExampleRemoval({
  featureRoot,
  pagePath,
  updatedPage,
}) {
  await rm(featureRoot, { recursive: true });
  await writeFile(pagePath, updatedPage, "utf8");
}

export async function removeExample(options = {}) {
  const plan = await prepareExampleRemoval(options);

  await applyExampleRemoval(plan);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  removeExample()
    .then(() => console.log("Removed the example feature."))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
