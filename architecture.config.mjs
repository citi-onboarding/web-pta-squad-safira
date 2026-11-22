import boundaries from "eslint-plugin-boundaries";

export const architectureMessages = {
  crossFeature:
    "A feature must not import another feature. Move code shared with '{{to.element.captured.feature}}' to src/shared/.",
  featureToApp:
    "Features must not import src/app. Dependencies flow from app to features, never the opposite way.",
  sharedToUpperLayer:
    "src/shared is the lowest layer and must not depend on features or application routes.",
};

export function createArchitectureConfig({
  rootPath = process.cwd(),
  sourceRoot = "src",
  files = ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
} = {}) {
  return {
    files,
    plugins: { boundaries },
    settings: {
      "boundaries/root-path": rootPath,
      "boundaries/legacy-templates": false,
      "boundaries/elements": [
        { type: "app", pattern: `${sourceRoot}/app` },
        {
          type: "feature",
          pattern: `${sourceRoot}/features/*`,
          capture: ["feature"],
        },
        { type: "shared", pattern: `${sourceRoot}/shared` },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            {
              from: { element: { type: "feature" } },
              disallow: {
                to: {
                  element: {
                    type: "feature",
                    captured: {
                      feature: "!{{from.element.captured.feature}}",
                    },
                  },
                },
              },
              message: architectureMessages.crossFeature,
            },
            {
              from: { element: { type: "feature" } },
              disallow: { to: { element: { type: "app" } } },
              message: architectureMessages.featureToApp,
            },
            {
              from: { element: { type: "shared" } },
              disallow: {
                to: { element: { types: { anyOf: ["feature", "app"] } } },
              },
              message: architectureMessages.sharedToUpperLayer,
            },
          ],
        },
      ],
    },
  };
}
