import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username must be at least 1 character long")
    .max(20, "Username must be max 20 characters long"),

  email: z.email("Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password must be at least 1 character long"),
});
