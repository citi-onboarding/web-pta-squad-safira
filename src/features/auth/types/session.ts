import { z } from "zod";

export const roleSchema = z.enum([
  "VENDEDOR",
  "GERENTE",
  "FINANCEIRO",
  "ADMINISTRADOR",
]);

export const sessionSchema = z.object({
  id: z.uuid(),
  nome: z.string(),
  papel: roleSchema,
});

export const credentialsSchema = z.object({
  email: z.email(),
  senha: z.string().min(1),
});

export type Role = z.infer<typeof roleSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type Credentials = z.infer<typeof credentialsSchema>;
