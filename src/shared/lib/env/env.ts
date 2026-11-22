import { parseEnvironment } from "./schema";

export const env = parseEnvironment({
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
  VITE_API_URL: import.meta.env.VITE_API_URL,
});
