import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app/app";
import { env } from "@/shared/lib/env/env";
import "@/shared/styles/globals.css";

const root = document.querySelector<HTMLDivElement>("#root");

if (!root) {
  throw new Error("The application root element was not found.");
}

document.title = env.VITE_APP_NAME;

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
