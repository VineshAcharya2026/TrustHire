import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("Password123!", 12);

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

  const admin = await prisma.user.upsert({
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
      phone: "+15550123211",
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
      phone: "+15551112222",
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
          rewardAmount: 6000,
        },
      });

      await prisma.job.create({
        data: {
          employerId: employer.employer.id,
          title: "Rust Core Developer",
          description: "Scale backend services with Rust and PostgreSQL.",
          requirements: "3+ years Rust, async systems",
          rewardAmount: 8000,
        },
      });

      await prisma.referral.create({
        data: {
          jobId: job.id,
          referrerId: referrer.id,
          candidateName: "Alice Carter",
          candidateEmail: "alice.carter@developer.com",
          candidatePhone: "+15557771234",
          status: "SUBMITTED",
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log("Admin: admin@trusthire.com / Password123!");
  console.log("Employer: careers@acme.com / Password123!");
  console.log("Referrer: jane.doe@staffing.com / Password123!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
