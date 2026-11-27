import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page, Route } from "@playwright/test";

type Session = { id: string; nome: string; papel: string };

const PASSWORD = "e2e-password";
const seedUsers: Record<string, Session> = {
  "patricia@distrilux.test": {
    id: "3f1c2a4e-8b7d-4c6a-9e2f-1a2b3c4d5e6f",
    nome: "Patrícia",
    papel: "VENDEDOR",
  },
  "fernanda@distrilux.test": {
    id: "7a2b4c6d-1e3f-4a5b-8c7d-9e0f1a2b3c4d",
    nome: "Fernanda Cavalcanti",
    papel: "GERENTE",
  },
  "sergio@distrilux.test": {
    id: "b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e",
    nome: "Sérgio Barros",
    papel: "FINANCEIRO",
  },
  "lucas@distrilux.test": {
    id: "c4d5e6f7-a8b9-4c0d-9e1f-2a3b4c5d6e7f",
    nome: "Lucas Moura",
    papel: "ADMINISTRADOR",
  },
};

// Simulates the BACK-01 authentication API inside the browser. The preview
// server and the API are different origins, so every answer carries the CORS
// headers the real back end sends for credentialed requests.
async function simulateAuthApi(page: Page) {
  let session: Session | null = null;

  await page.route("**/auth/**", async (route: Route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
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

    if (path.endsWith("/auth/login")) {
      const body = request.postDataJSON() as { email: string; senha: string };
      const user = seedUsers[body.email];

      if (!user || body.senha !== PASSWORD) {
        await route.fulfill({
          status: 401,
          headers,
          json: { message: "Invalid email or password." },
        });
        return;
      }

      session = user;
      await route.fulfill({ status: 200, headers, json: user });
      return;
    }

    if (path.endsWith("/auth/logout")) {
      session = null;
      await route.fulfill({ status: 204, headers });
      return;
    }

    if (session) {
      await route.fulfill({ status: 200, headers, json: session });
    } else {
      await route.fulfill({
        status: 401,
        headers,
        json: { message: "Authentication required." },
      });
    }
  });
}

async function signIn(page: Page, email: string, password = PASSWORD) {
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
}

async function expectNoAccessibilityViolations(page: Page) {
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(accessibility.violations).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await simulateAuthApi(page);
});

const roles = [
  {
    email: "patricia@distrilux.test",
    path: "/clientes",
    page: "Clientes",
    menu: ["Clientes", "Meus pedidos"],
  },
  {
    email: "fernanda@distrilux.test",
    path: "/painel",
    page: "Painel do comercial",
    menu: ["Painel do comercial"],
  },
  {
    email: "sergio@distrilux.test",
    path: "/fila",
    page: "Fila do financeiro",
    menu: ["Fila do financeiro"],
  },
  {
    email: "lucas@distrilux.test",
    path: "/usuarios",
    page: "Usuários",
    menu: ["Usuários"],
  },
];

for (const role of roles) {
  test(`${role.email} signs in to the initial page and sees only the role menu`, async ({
    page,
  }) => {
    await page.goto("/entrar");
    await signIn(page, role.email);

    await expect(page).toHaveURL(role.path);
    await expect(
      page.getByRole("heading", { level: 1, name: role.page }),
    ).toBeVisible();

    const menu = page.getByRole("navigation");
    await expect(menu.getByRole("link")).toHaveText(role.menu);
    await expect(menu.getByRole("button", { name: "Sair" })).toBeVisible();

    await expectNoAccessibilityViolations(page);
  });
}

test("a wrong password shows the credential error without naming the wrong field", async ({
  page,
}) => {
  await page.goto("/entrar");
  await expectNoAccessibilityViolations(page);

  await signIn(page, "patricia@distrilux.test", "wrong-password");

  // FRONT-02: the approved brand guide writes the message with a final period.
  await expect(page.getByRole("alert")).toHaveText(
    "E-mail ou senha incorretos.",
  );
  await expect(page.getByLabel("E-mail")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.getByLabel("Senha")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page).toHaveURL("/entrar");
  await expectNoAccessibilityViolations(page);
});

test("a page outside the role shows the access-denied message instead of the page", async ({
  page,
}) => {
  await page.goto("/usuarios");
  await expect(page).toHaveURL("/entrar");

  await signIn(page, "patricia@distrilux.test");

  await expect(page).toHaveURL("/usuarios");
  await expect(
    page.getByText("Você não tem acesso a esta página"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 1, name: "Usuários" }),
  ).toHaveCount(0);
});

test("after signing out, the browser back button shows no data", async ({
  page,
}) => {
  await page.goto("/entrar");
  await signIn(page, "patricia@distrilux.test");
  await expect(
    page.getByRole("heading", { level: 1, name: "Clientes" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Meus pedidos" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Meus pedidos" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL("/entrar");

  await page.goBack();

  await expect(
    page.getByRole("heading", { name: "Entrar no portal" }),
  ).toBeVisible();
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { level: 1, name: "Clientes" }),
  ).toHaveCount(0);
});

test("the root address leads to the sign-in screen, then to the role's initial page", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL("/entrar");

  await signIn(page, "fernanda@distrilux.test");

  await expect(page).toHaveURL("/painel");
  await page.goto("/");
  await expect(page).toHaveURL("/painel");
  await expect(
    page.getByRole("heading", { level: 1, name: "Painel do comercial" }),
  ).toBeVisible();
});
