import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  requirements: z.string().optional(),
  skills: z.string().optional(),
  rewardAmount: z.number().positive(),
});

export const updateJobSchema = createJobSchema.partial().extend({
  isActive: z.boolean().optional(),
});
