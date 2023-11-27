import * as z from "zod";

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(24, "Password is too long"),
});

export type AuthSchemaTypes = z.infer<typeof AuthSchema>;

export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  limit: z.number().optional(),
});

export type ProductQuerySchemaTypes = z.infer<typeof ProductQuerySchema>;
