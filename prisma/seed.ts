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

  const configKeys = [
    { key: "day_30_pct", value: "30" },
    { key: "day_60_pct", value: "30" },
    { key: "day_90_pct", value: "40" },
    { key: "milestone_day_30", value: "30" },
    { key: "milestone_day_60", value: "60" },
    { key: "milestone_day_90", value: "90" },
    { key: "max_referrals_per_day", value: "5" },
  ];

  for (const c of configKeys) {
    await prisma.platformConfig.upsert({
      where: { key: c.key },
      create: c,
      update: { value: c.value },
    });
  }

  await prisma.user.upsert({
    where: { email: "admin@trusthire.com" },
    update: {},
    create: {
      email: "admin@trusthire.com",
      passwordHash: hash,
      role: "ADMIN",
      status: "ACTIVE",
      profile: { create: { firstName: "Eleanor", lastName: "Vance" } },
    },
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

  const mentor = await prisma.user.upsert({
    where: { email: "mentor@trusthire.com" },
    update: {},
    create: {
      email: "mentor@trusthire.com",
      phone: "+919876543212",
      passwordHash: hash,
      role: "MENTOR",
      status: "ACTIVE",
      profile: { create: { firstName: "Raj", lastName: "Sharma" } },
      mentorProfile: {
        create: {
          company: "TechMentor India",
          title: "Staff Engineer",
          expertise: ["React", "TypeScript", "Leadership", "System Design"],
          yearsExp: 12,
          maxMentees: 5,
        },
      },
    },
  });

  const mentee = await prisma.user.upsert({
    where: { email: "mentee@trusthire.com" },
    update: {},
    create: {
      email: "mentee@trusthire.com",
      phone: "+919876543213",
      passwordHash: hash,
      role: "MENTEE",
      status: "ACTIVE",
      profile: { create: { firstName: "Priya", lastName: "Patel" } },
      menteeProfile: {
        create: {
          currentRole: "Junior Developer",
          goals: "Transition to senior frontend role within 12 months",
          desiredSkills: ["React", "TypeScript", "System Design"],
        },
      },
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

  const existingMentorship = await prisma.mentorship.findFirst({
    where: { mentorId: mentor.id, menteeId: mentee.id },
  });
  if (!existingMentorship) {
    await prisma.mentorship.create({
      data: { mentorId: mentor.id, menteeId: mentee.id, status: "ACTIVE" },
    });
  }

  console.log("Seed complete.");
  console.log("Admin: admin@trusthire.com / Password123!");
  console.log("Employer: careers@acme.com / Password123!");
  console.log("Referrer: jane.doe@staffing.com / Password123!");
  console.log("Mentor: mentor@trusthire.com / Password123!");
  console.log("Mentee: mentee@trusthire.com / Password123!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
