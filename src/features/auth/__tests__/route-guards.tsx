import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { ProtectedRoute } from "../components/protected-route";
import { RoleRoute } from "../components/role-route";
import { renderWithAuth } from "./render-with-auth";
import { SignInProbe } from "./sign-in-probe";

// Renders the real guards around simple test pages, so the tests exercise
// the guards without depending on the application's destination screens.
export function renderGuardedRoute(initialPath: string) {
  const router = createMemoryRouter(
    [
      { path: "/entrar", element: <SignInProbe /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <RoleRoute />,
            children: [
              { path: "/clientes", element: <h1>Clients content</h1> },
              { path: "/usuarios", element: <h1>Users content</h1> },
            ],
          },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  return renderWithAuth(<RouterProvider router={router} />);
}
