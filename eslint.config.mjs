import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import checkFile from "eslint-plugin-check-file";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

import { createArchitectureConfig } from "./architecture.config.mjs";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  createArchitectureConfig(),
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: [
      "scripts/**/*.{js,mjs,cjs,ts,mts,cts}",
      "tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "e2e/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "*.config.{js,mjs,cjs,ts,mts,cts}",
      "architecture.config.mjs",
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: [
      "src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "scripts/**/*.{js,mjs,cjs,ts,mts,cts}",
      "tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "e2e/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    plugins: { "check-file": checkFile },
    rules: {
      "check-file/no-index": "error",
      "check-file/filename-naming-convention": [
        "error",
        {
          "src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}": "KEBAB_CASE",
          "scripts/**/*.{js,mjs,cjs,ts,mts,cts}": "KEBAB_CASE",
          "tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}": "KEBAB_CASE",
          "e2e/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}": "KEBAB_CASE",
        },
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/{app,features,shared}/**/!(__tests__)/": "KEBAB_CASE",
          "scripts/**/": "KEBAB_CASE",
          "tests/**/!(__tests__)/": "KEBAB_CASE",
          "e2e/**/": "KEBAB_CASE",
        },
      ],
    },
  },
  globalIgnores([
    "dist/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "tests/architecture/fixtures/**",
  ]),
]);
