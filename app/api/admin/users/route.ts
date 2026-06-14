import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const status = searchParams.get("status");

  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role: role as "ADMIN" | "EMPLOYER" | "REFERRER" | "MENTOR" | "MENTEE" } : {}),
      ...(status ? { status: status as "PENDING" | "ACTIVE" | "SUSPENDED" | "FROZEN" | "DELETED" } : {}),
    },
    include: { profile: true, employer: true, mentorProfile: true, menteeProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}
