import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the home page without automatically detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /start with enforced architecture/i,
    }),
  ).toBeVisible();

  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(accessibility.violations).toEqual([]);
});

test("serves the not-found route through the SPA fallback", async ({
  page,
}) => {
  await page.goto("/missing-route");

  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});

test("reports static asset health", async ({ request }) => {
  const response = await request.get("/health.json");

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toEqual({
    status: "ok",
    scope: "static-assets",
  });
});
