import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import { AuthRoot } from "@/features/auth/components/auth-root";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { RoleHomeRedirect } from "@/features/auth/components/role-home-redirect";
import { RoleRoute } from "@/features/auth/components/role-route";

import { AppShell } from "./layout/app-shell";
import { ClientsPage } from "./routes/clients-page";
import { FinanceQueuePage } from "./routes/finance-queue-page";
import { LoginPage } from "./routes/login-page";
import { MyOrdersPage } from "./routes/my-orders-page";
import { NotFoundPage } from "./routes/not-found-page";
import { RouteErrorPage } from "./routes/route-error-page";
import { SalesDashboardPage } from "./routes/sales-dashboard-page";
import { UsersPage } from "./routes/users-page";

export const routes: RouteObject[] = [
  {
    element: <AuthRoot />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: "/entrar", element: <LoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <RoleHomeRedirect /> },
          {
            element: <AppShell />,
            children: [
              {
                element: <RoleRoute />,
                children: [
                  { path: "/clientes", element: <ClientsPage /> },
                  { path: "/pedidos", element: <MyOrdersPage /> },
                  { path: "/painel", element: <SalesDashboardPage /> },
                  { path: "/fila", element: <FinanceQueuePage /> },
                  { path: "/usuarios", element: <UsersPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
