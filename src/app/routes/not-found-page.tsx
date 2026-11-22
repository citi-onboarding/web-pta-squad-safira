import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-20">
      <p className="text-sm font-semibold text-blue-600">404</p>
      <h1 className="mt-3 text-4xl font-semibold text-zinc-950 dark:text-zinc-50">
        Page not found
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        The requested route does not exist.
      </p>
      <Link className="mt-8 font-medium text-blue-600" to="/">
        Return home
      </Link>
    </main>
  );
}
