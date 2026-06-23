import { prisma } from "@/lib/prisma";

export function parseSkillInput(input: string | string[] | undefined): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((s) => s.trim()).filter(Boolean);
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function getFilterOptions() {
  const mentors = await prisma.mentorProfile.findMany({
    select: { company: true, expertise: true },
    where: { user: { status: "ACTIVE", role: "MENTOR" } },
  });

  const companies = Array.from(
    new Set(mentors.map((m) => m.company).filter((c): c is string => !!c))
  ).sort();

  const skills = Array.from(new Set(mentors.flatMap((m) => m.expertise))).sort();

  return { companies, skills };
}
