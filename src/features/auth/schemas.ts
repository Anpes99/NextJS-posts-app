import { z } from "zod";

const email = z.string().trim().pipe(z.email("Enter a valid email"));

export const signUpSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(50),
  email,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});
