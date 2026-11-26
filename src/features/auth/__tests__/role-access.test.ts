import { describe, expect, it } from "vitest";

import { canOpen, initialPathFor, menuByRole } from "../types/role-access";

describe("role access table", () => {
  it.each([
    [
      "VENDEDOR",
      [
        { path: "/clientes", label: "Clientes" },
        { path: "/pedidos", label: "Meus pedidos" },
      ],
    ],
    ["GERENTE", [{ path: "/painel", label: "Painel do comercial" }]],
    ["FINANCEIRO", [{ path: "/fila", label: "Fila do financeiro" }]],
    ["ADMINISTRADOR", [{ path: "/usuarios", label: "Usuários" }]],
  ] as const)("lists only the menu entries of %s", (role, entries) => {
    expect(menuByRole[role]).toEqual(entries);
  });

  it.each([
    ["VENDEDOR", "/clientes"],
    ["GERENTE", "/painel"],
    ["FINANCEIRO", "/fila"],
    ["ADMINISTRADOR", "/usuarios"],
  ] as const)("sends %s to %s as the initial page", (role, path) => {
    expect(initialPathFor(role)).toBe(path);
  });

  it.each([
    ["VENDEDOR", "/clientes", true],
    ["VENDEDOR", "/pedidos", true],
    ["VENDEDOR", "/usuarios", false],
    ["GERENTE", "/painel", true],
    ["GERENTE", "/fila", false],
    ["FINANCEIRO", "/fila", true],
    ["FINANCEIRO", "/clientes", false],
    ["ADMINISTRADOR", "/usuarios", true],
    ["ADMINISTRADOR", "/painel", false],
  ] as const)("answers whether %s may open %s: %s", (role, path, allowed) => {
    expect(canOpen(role, path)).toBe(allowed);
  });
});
