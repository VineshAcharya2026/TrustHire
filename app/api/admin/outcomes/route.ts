import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const outcomes = await prisma.mentorshipOutcome.findMany({
    where: { verified: false },
    include: {
      mentorship: {
        include: {
          mentor: { include: { profile: true, mentorProfile: true } },
          mentee: { include: { profile: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(outcomes);
}
