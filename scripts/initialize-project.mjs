import { copyFile, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { pathToFileURL } from "node:url";

import {
  applyExampleRemoval,
  prepareExampleRemoval,
} from "./remove-example.mjs";

const BOILERPLATE_PACKAGE_NAME = "vite-boilerplate";
const BOILERPLATE_APP_NAME = "Vite Boilerplate";
const INITIALIZATION_MARKER = ".boilerplate-initialized";

function packageNameFromAppName(appName) {
  return appName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateAppName(appName) {
  const normalizedName = appName?.trim();

  if (
    !normalizedName ||
    normalizedName.length < 2 ||
    normalizedName.length > 80 ||
    !/^[\p{L}\p{N}][\p{L}\p{N} .&'()_-]*$/u.test(normalizedName)
  ) {
    throw new Error(
      "The application name must contain 2-80 safe display characters.",
    );
  }

  return normalizedName;
}

function validatePackageName(packageName) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(packageName ?? "")) {
    throw new Error("The package name must use lowercase kebab-case.");
  }

  return packageName;
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

function replaceExpected(source, expected, replacement, fileName) {
  if (!source.includes(expected)) {
    throw new Error(
      `${fileName} no longer contains the expected boilerplate value '${expected}'. No files were changed.`,
    );
  }

  return source.replaceAll(expected, replacement);
}

async function readJson(target) {
  return JSON.parse(await readFile(target, "utf8"));
}

async function prepareInitialization({ root, appName, packageName }) {
  const markerPath = path.join(root, INITIALIZATION_MARKER);
  const envLocalPath = path.join(root, ".env.local");

  if (await pathExists(markerPath)) {
    throw new Error("This project has already been initialized.");
  }

  if (await pathExists(envLocalPath)) {
    throw new Error(
      ".env.local already exists. Move or remove it before initializing the project.",
    );
  }

  const textReplacements = [
    [".env.example", BOILERPLATE_APP_NAME, appName],
    ["README.md", BOILERPLATE_APP_NAME, appName],
    ["src/shared/lib/env/schema.ts", BOILERPLATE_APP_NAME, appName],
    ["src/shared/lib/env/env.test.ts", BOILERPLATE_APP_NAME, appName],
  ];
  const textFiles = await Promise.all(
    textReplacements.map(async ([relativePath, expected, replacement]) => {
      const target = path.join(root, relativePath);
      const source = await readFile(target, "utf8");

      return {
        target,
        content: replaceExpected(source, expected, replacement, relativePath),
      };
    }),
  );
  const packagePath = path.join(root, "package.json");
  const packageJson = await readJson(packagePath);

  if (packageJson.name !== BOILERPLATE_PACKAGE_NAME) {
    throw new Error(
      "The package metadata no longer matches the boilerplate. No files were changed.",
    );
  }

  packageJson.name = packageName;

  return {
    markerPath,
    envExamplePath: path.join(root, ".env.example"),
    envLocalPath,
    textFiles,
    jsonFiles: [{ target: packagePath, content: packageJson }],
    exampleRemoval: await prepareExampleRemoval({ root }),
  };
}

/**
 * @param {{ appName: string; packageName?: string; root?: string }} options
 */
export async function initializeProject({
  appName: rawAppName,
  packageName: rawPackageName,
  root = process.cwd(),
}) {
  const appName = validateAppName(rawAppName);
  const packageName = validatePackageName(
    rawPackageName ?? packageNameFromAppName(appName),
  );
  const plan = await prepareInitialization({ root, appName, packageName });

  await Promise.all(
    plan.textFiles.map(({ target, content }) =>
      writeFile(target, content, "utf8"),
    ),
  );
  await Promise.all(
    plan.jsonFiles.map(({ target, content }) =>
      writeFile(target, `${JSON.stringify(content, null, 2)}\n`, "utf8"),
    ),
  );
  await copyFile(plan.envExamplePath, plan.envLocalPath);
  await applyExampleRemoval(plan.exampleRemoval);
  await writeFile(
    plan.markerPath,
    `Initialized from the Vite boilerplate.\nApplication: ${appName}\nPackage: ${packageName}\n`,
    "utf8",
  );

  return { appName, packageName };
}

function parseArguments(argumentsList) {
  const options = {};

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];

    if (argument === "--name") {
      options.appName = argumentsList[index + 1];
      index += 1;
    } else if (argument === "--package-name") {
      options.packageName = argumentsList[index + 1];
      index += 1;
    } else {
      throw new Error(`Unknown argument '${argument}'.`);
    }
  }

  return options;
}

async function interactiveOptions(options) {
  if (options.appName) return options;

  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const appName = await terminal.question("Application name: ");
    const suggestedPackageName = packageNameFromAppName(appName);
    const packageName = await terminal.question(
      `Package name (${suggestedPackageName}): `,
    );

    return {
      appName,
      packageName: packageName.trim() || suggestedPackageName,
    };
  } finally {
    terminal.close();
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  Promise.resolve(parseArguments(process.argv.slice(2)))
    .then(interactiveOptions)
    .then(initializeProject)
    .then(({ appName, packageName }) => {
      console.log(`Initialized '${appName}' with package '${packageName}'.`);
      console.log("Run pnpm install, then pnpm verify.");
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
