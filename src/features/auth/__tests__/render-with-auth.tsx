import { QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";

import { createQueryClient } from "@/shared/lib/query/create-query-client";

import { AuthApiClientProvider } from "../components/auth-api-client-provider";
import { createTestClient } from "./auth-test-data";

function createWrapper() {
  const queryClient = createQueryClient();
  const client = createTestClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthApiClientProvider client={client}>
          {children}
        </AuthApiClientProvider>
      </QueryClientProvider>
    );
  }

  return { queryClient, Wrapper };
}

export function renderWithAuth(ui: ReactNode) {
  const { queryClient, Wrapper } = createWrapper();

  return { queryClient, ...render(ui, { wrapper: Wrapper }) };
}

export function renderHookWithAuth<TResult>(hook: () => TResult) {
  const { queryClient, Wrapper } = createWrapper();

  return { queryClient, ...renderHook(hook, { wrapper: Wrapper }) };
}
