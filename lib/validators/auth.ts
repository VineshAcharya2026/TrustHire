import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["MENTOR", "MENTEE"]),
  companyName: z.string().optional(),
  title: z.string().optional(),
  expertise: z.string().optional(),
  currentRole: z.string().optional(),
  goals: z.string().optional(),
  desiredSkills: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
