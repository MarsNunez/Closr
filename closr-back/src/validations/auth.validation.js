import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, "Username must be at least 1 character").max(20),

  email: z.email("Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1),
});
