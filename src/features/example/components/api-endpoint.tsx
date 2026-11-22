import { env } from "@/shared/lib/env/env";

export function ApiEndpoint() {
  return (
    <p className="mt-4 text-sm text-zinc-500">
      Browser API: <code>{env.VITE_API_URL}</code>
    </p>
  );
}
