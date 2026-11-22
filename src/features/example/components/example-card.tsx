import type { Example } from "../types/example";

type ExampleCardProps = {
  example: Pick<Example, "id" | "name" | "description">;
};

export function ExampleCard({ example }: ExampleCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
        Removable example feature
      </p>
      <h2 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        {example.name}
      </h2>
      {example.description ? (
        <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-400">
          {example.description}
        </p>
      ) : null}
      <code className="mt-4 block text-sm text-zinc-500">ID: {example.id}</code>
    </article>
  );
}
