import type { Role } from "./session";

export type MenuEntry = {
  path: string;
  label: string;
};

// The first entry of each role is its initial page.
export const menuByRole: Record<Role, readonly MenuEntry[]> = {
  VENDEDOR: [
    { path: "/clientes", label: "Clientes" },
    { path: "/pedidos", label: "Meus pedidos" },
  ],
  GERENTE: [{ path: "/painel", label: "Painel do comercial" }],
  FINANCEIRO: [{ path: "/fila", label: "Fila do financeiro" }],
  // Provisional: the squad manager has not confirmed the administrator's initial page.
  ADMINISTRADOR: [{ path: "/usuarios", label: "Usuários" }],
};

export function initialPathFor(role: Role): string {
  return menuByRole[role][0].path;
}

export function canOpen(role: Role, path: string): boolean {
  return menuByRole[role].some((entry) => entry.path === path);
}
