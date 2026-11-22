import { useEffect } from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

import { reportError } from "@/shared/lib/report-error";

export function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "An unexpected routing error occurred.";

  useEffect(() => {
    void reportError(error, { boundary: "router" });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-20">
      <h1 className="text-4xl font-semibold text-zinc-950 dark:text-zinc-50">
        Something went wrong
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">{message}</p>
      <Link className="mt-8 font-medium text-blue-600" to="/">
        Return home
      </Link>
    </main>
  );
}
