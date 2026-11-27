import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page, Route } from "@playwright/test";

// FRONT-02: the design system in a real browser, in both themes and at
// desktop and phone widths. The authentication API is simulated in the page,
// as in sign-in.spec.ts.

const SESSION = {
  id: "3f1c2a4e-8b7d-4c6a-9e2f-1a2b3c4d5e6f",
  nome: "Patrícia Lins",
  papel: "VENDEDOR",
};

async function simulateAuthApi(page: Page, signedIn: boolean) {
  await page.route("**/auth/**", async (route: Route) => {
    const request = route.request();
    const headers = {
      "Access-Control-Allow-Origin": request.headers()["origin"] ?? "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
    };

    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers });
      return;
    }

    if (signedIn && request.url().endsWith("/auth/me")) {
      await route.fulfill({ status: 200, headers, json: SESSION });
      return;
    }

    await route.fulfill({
      status: 401,
      headers,
      json: { message: "Authentication required." },
    });
  });
}

async function expectNoAccessibilityViolations(page: Page) {
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(accessibility.violations).toEqual([]);
}

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
}

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
] as const;

const THEMES = ["light", "dark"] as const;

for (const viewport of VIEWPORTS) {
  for (const theme of THEMES) {
    test.describe(`${viewport.name}, ${theme} theme`, () => {
      test.use({
        viewport: { width: viewport.width, height: viewport.height },
        colorScheme: theme,
      });

      test("the sign-in screen and its error state are accessible and fit the width", async ({
        page,
      }) => {
        await simulateAuthApi(page, false);
        await page.goto("/entrar");

        await expect(
          page.getByRole("heading", { level: 1, name: "Entrar no portal" }),
        ).toBeVisible();
        await expectNoHorizontalScroll(page);
        await expectNoAccessibilityViolations(page);

        await page.getByLabel("E-mail").fill("patricia@distrilux.test");
        await page.getByLabel("Senha").fill("wrong-password");
        await page.getByRole("button", { name: "Entrar" }).click();

        await expect(page.getByRole("alert")).toHaveText(
          "E-mail ou senha incorretos.",
        );
        await expectNoHorizontalScroll(page);
        await expectNoAccessibilityViolations(page);
      });

      test("a signed-in screen is accessible and fits the width", async ({
        page,
      }) => {
        await simulateAuthApi(page, true);
        await page.goto("/clientes");

        await expect(
          page.getByRole("heading", { level: 1, name: "Clientes" }),
        ).toBeVisible();
        await expect(page.getByRole("banner")).toContainText("Patrícia Lins");
        await expectNoHorizontalScroll(page);
        await expectNoAccessibilityViolations(page);
      });
    });
  }
}

test.describe("theme", () => {
  test.use({ colorScheme: "dark" });

  test("the first visit follows the system preference", async ({ page }) => {
    await simulateAuthApi(page, false);
    await page.goto("/entrar");

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(
      page.getByRole("button", { name: "Ativar tema claro" }),
    ).toBeVisible();
  });

  test("the person's choice survives a reload, even against the system", async ({
    page,
  }) => {
    await simulateAuthApi(page, false);
    await page.goto("/entrar");

    await page.getByRole("button", { name: "Ativar tema claro" }).click();
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);

    await page.reload();

    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    await expect(
      page.getByRole("button", { name: "Ativar tema escuro" }),
    ).toBeVisible();
  });
});
