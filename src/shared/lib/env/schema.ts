import { z } from "zod";

export const envSchema = z.object({
  VITE_APP_NAME: z.string().trim().min(1).default("Vite Boilerplate"),
  VITE_APP_URL: z.url().default("http://localhost:5173"),
  VITE_API_URL: z.url().default("http://localhost:3001"),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv<TSchema extends z.ZodType>(
  schema: TSchema,
  values: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(values);

  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${z.prettifyError(result.error)}`,
    );
  }

  return result.data;
}

export function parseEnvironment(values: unknown): Env {
  return parseEnv(envSchema, values);
}
