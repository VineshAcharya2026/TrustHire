import { z } from "zod";
import { ReferralStatus } from "@prisma/client";

export const submitReferralSchema = z.object({
  jobId: z.string().min(1),
  candidateName: z.string().min(2),
  candidateEmail: z.string().email(),
  candidatePhone: z.string().min(7),
  resumeUrl: z.string().url().optional().or(z.literal("")),
});

export const updateReferralStatusSchema = z.object({
  status: z.nativeEnum(ReferralStatus),
  note: z.string().optional(),
});
