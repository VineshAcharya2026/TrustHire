import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { syncJobSkills } from "../lib/skills";

const prisma = new PrismaClient();

const SKILL_NAMES = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Rust",
  "PostgreSQL",
  "Leadership",
  "System Design",
];

async function main() {
  const hash = await bcrypt.hash("Password123!", 12);

  for (const name of SKILL_NAMES) {
    await prisma.skill.upsert({ where: { name }, create: { name }, update: {} });
  }

  await prisma.platformConfig.upsert({
    where: { key: "max_referrals_per_day" },
    create: { key: "max_referrals_per_day", value: "5" },
    update: { value: "5" },
  });

  const employer = await prisma.user.upsert({
    where: { email: "careers@acme.com" },
    update: {},
    create: {
      email: "careers@acme.com",
      phone: "+919876543210",
      passwordHash: hash,
      role: "EMPLOYER",
      status: "ACTIVE",
      profile: { create: { firstName: "Marcus", lastName: "Vance" } },
      employer: {
        create: { companyName: "Acme Corp", website: "https://acme.com", verified: true },
      },
    },
    include: { employer: true },
  });

  const referrer = await prisma.user.upsert({
    where: { email: "jane.doe@staffing.com" },
    update: {},
    create: {
      email: "jane.doe@staffing.com",
      phone: "+919876543211",
      passwordHash: hash,
      role: "REFERRER",
      status: "ACTIVE",
      profile: { create: { firstName: "Jane", lastName: "Doe" } },
    },
  });

  if (employer.employer) {
    const existingJob = await prisma.job.findFirst({
      where: { employerId: employer.employer.id, title: "Senior Frontend Engineer" },
    });

    if (!existingJob) {
      const job = await prisma.job.create({
        data: {
          employerId: employer.employer.id,
          title: "Senior Frontend Engineer",
          description: "Build modern React applications with TypeScript and Next.js.",
          requirements: "5+ years React, TypeScript, team leadership",
          rewardAmount: 50000,
        },
      });
      await syncJobSkills(job.id, ["React", "TypeScript", "Next.js", "Leadership"]);

      const job2 = await prisma.job.create({
        data: {
          employerId: employer.employer.id,
          title: "Rust Core Developer",
          description: "Scale backend services with Rust and PostgreSQL.",
          requirements: "3+ years Rust, async systems",
          rewardAmount: 80000,
        },
      });
      await syncJobSkills(job2.id, ["Rust", "PostgreSQL", "System Design"]);

      await prisma.referral.create({
        data: {
          jobId: job.id,
          referrerId: referrer.id,
          candidateName: "Alice Carter",
          candidateEmail: "alice.carter@developer.com",
          candidatePhone: "+919876543214",
          status: "SUBMITTED",
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log("Employer: careers@acme.com / Password123!");
  console.log("Referrer: jane.doe@staffing.com / Password123!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
