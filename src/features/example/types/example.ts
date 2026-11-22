import { z } from "zod";

// Mirrors `exampleItemSchema` in pta-api (GET /api/v1/example-items).
export const exampleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const exampleListSchema = z.array(exampleSchema);

export type Example = z.infer<typeof exampleSchema>;
