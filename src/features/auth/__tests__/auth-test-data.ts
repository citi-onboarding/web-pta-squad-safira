import { createApiClient } from "@/shared/lib/api/create-client";

import type { Role, Session } from "../types/session";

export const API_URL = "http://api.test";

// Create the client inside each test: it captures `fetch` when created, and
// MSW only replaces `fetch` once the test server is listening.
export function createTestClient() {
  return createApiClient({ baseUrl: API_URL });
}

export const sessionsByRole: Record<Role, Session> = {
  VENDEDOR: {
    id: "3f1c2a4e-8b7d-4c6a-9e2f-1a2b3c4d5e6f",
    nome: "Patrícia",
    papel: "VENDEDOR",
  },
  GERENTE: {
    id: "7a2b4c6d-1e3f-4a5b-8c7d-9e0f1a2b3c4d",
    nome: "Fernanda Cavalcanti",
    papel: "GERENTE",
  },
  FINANCEIRO: {
    id: "b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e",
    nome: "Sérgio Barros",
    papel: "FINANCEIRO",
  },
  ADMINISTRADOR: {
    id: "c4d5e6f7-a8b9-4c0d-9e1f-2a3b4c5d6e7f",
    nome: "Lucas Moura",
    papel: "ADMINISTRADOR",
  },
};
