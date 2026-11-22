import { Link } from "react-router-dom";

// BEGIN EXAMPLE FEATURE IMPORT
import { ApiEndpoint } from "@/features/example/components/api-endpoint";
import { ExampleCard } from "@/features/example/components/example-card";
// END EXAMPLE FEATURE IMPORT

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-20 sm:px-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase dark:text-blue-400">
          React and Vite scalable core
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl dark:text-zinc-50">
          Start with enforced architecture, not accidental conventions.
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          This boilerplate includes typed environment variables, an extensible
          API client, routing, server-state management, architectural
          boundaries, tests, CI, and production-ready static delivery.
        </p>
      </div>

      {/* BEGIN EXAMPLE FEATURE */}
      <div className="mt-12 max-w-xl">
        <ExampleCard
          example={{
            id: "example-1",
            name: "Feature-based architecture",
            description:
              "Compose independent features from the app layer and keep shared code dependency-free.",
          }}
        />
        <ApiEndpoint />
      </div>
      {/* END EXAMPLE FEATURE */}

      <div className="mt-10 flex flex-wrap gap-4 text-sm font-medium">
        <a
          className="rounded-full bg-zinc-950 px-5 py-3 text-white transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-300"
          href="https://vite.dev/guide/"
        >
          Vite documentation
        </a>
        <a
          className="rounded-full border border-zinc-300 px-5 py-3 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          href="/health.json"
        >
          Static health check
        </a>
        <Link
          className="rounded-full border border-zinc-300 px-5 py-3 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          to="/missing-route"
        >
          Routing example
        </Link>
      </div>
    </main>
  );
}
