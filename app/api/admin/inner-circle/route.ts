import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const applications = await prisma.innerCircleApplication.findMany({
    where: { submittedAt: { not: null } },
    include: {
      mentor: {
        include: {
          user: { include: { profile: true } },
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(applications);
}
