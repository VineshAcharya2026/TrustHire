import { prisma } from "@/lib/prisma";

export async function upsertSkills(names: string[]) {
  const normalized = Array.from(new Set(names.map((n) => n.trim()).filter(Boolean)));
  const skills = await Promise.all(
    normalized.map((name) =>
      prisma.skill.upsert({
        where: { name },
        create: { name },
        update: {},
      })
    )
  );
  return skills;
}

export async function syncJobSkills(jobId: string, skillNames: string[]) {
  await prisma.jobSkill.deleteMany({ where: { jobId } });
  if (!skillNames.length) return;
  const skills = await upsertSkills(skillNames);
  await prisma.jobSkill.createMany({
    data: skills.map((s) => ({ jobId, skillId: s.id })),
    skipDuplicates: true,
  });
}

export function parseSkillInput(input: string | string[] | undefined): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((s) => s.trim()).filter(Boolean);
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function getFilterOptions() {
  const [companies, skills, roles] = await Promise.all([
    prisma.employer.findMany({ select: { companyName: true }, orderBy: { companyName: "asc" } }),
    prisma.skill.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
    prisma.job.findMany({ select: { title: true }, where: { isActive: true }, distinct: ["title"], orderBy: { title: "asc" } }),
  ]);

  return {
    companies: Array.from(new Set(companies.map((c) => c.companyName))),
    skills: skills.map((s) => s.name),
    roles: Array.from(new Set(roles.map((r) => r.title))),
  };
}
