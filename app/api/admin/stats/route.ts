import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const [
    totalUsers,
    totalMentors,
    totalMentees,
    activeMentorships,
    pendingMentorships,
    totalLogins,
  ] = await Promise.all([
    prisma.user.count({ where: { status: { not: "DELETED" } } }),
    prisma.user.count({ where: { role: "MENTOR", status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "MENTEE", status: "ACTIVE" } }),
    prisma.mentorship.count({ where: { status: "ACTIVE" } }),
    prisma.mentorship.count({ where: { status: "PENDING" } }),
    prisma.loginEvent.count(),
  ]);

  return NextResponse.json({
    totalUsers,
    totalMentors,
    totalMentees,
    activeMentorships,
    pendingMentorships,
    totalLogins,
  });
}
