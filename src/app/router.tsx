import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import { HomePage } from "./routes/home-page";
import { NotFoundPage } from "./routes/not-found-page";
import { RouteErrorPage } from "./routes/route-error-page";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
