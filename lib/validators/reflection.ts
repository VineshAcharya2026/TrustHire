import { z } from "zod";
import { GENTLE_COMMITMENT_OPTIONS, SUPPORT_WAYS, VALUED_QUALITIES } from "@/lib/reflection-constants";

const textField = z.string().max(10000).optional();

const valuedQualityEnum = z.enum(VALUED_QUALITIES as unknown as [string, ...string[]]);
const supportWayEnum = z.enum(SUPPORT_WAYS as unknown as [string, ...string[]]);
const gentleCommitmentEnum = z.enum(
  GENTLE_COMMITMENT_OPTIONS.map((o) => o.value) as [string, ...string[]]
);

export const reflectionDraftSchema = z.object({
  introduction: textField,
  proudestAchievement: textField,
  guidingValues: textField,
  standFor: textField,
  admiredPerson: textField,
  meaningPurpose: textField,
  dreamMission: textField,
  societalAspiration: textField,
  othersDescribeYou: textField,
  valuedQualities: z.array(valuedQualityEnum).max(5, "Select up to five qualities").optional(),
  energizingPeople: textField,
  differentBeliefsApproach: textField,
  confidentialityImportance: z.number().int().min(1).max(10).optional().nullable(),
  supportWays: z.array(supportWayEnum).optional(),
  contributions: textField,
  leadershipLoneliness: z.enum(["FREQUENTLY", "OCCASIONALLY", "RARELY", "NEVER"]).optional().nullable(),
  supportNeeded: textField,
  sharingTopics: textField,
  rememberedFor: textField,
  additionalNotes: textField,
  gentleCommitment: gentleCommitmentEnum.optional().nullable(),
  submit: z.boolean().optional(),
});

export type ReflectionDraftInput = z.infer<typeof reflectionDraftSchema>;

export function validateReflectionSubmit(data: ReflectionDraftInput) {
  if (!data.gentleCommitment) {
    return { ok: false as const, error: "Please select a gentle commitment option to submit." };
  }
  return { ok: true as const };
}
