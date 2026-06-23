import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const q = searchParams.get("q")?.trim();

  const logins = await prisma.loginEvent.findMany({
    where: {
      ...(role === "MENTOR" || role === "MENTEE" || role === "SUPER_ADMIN" ? { role: role as "MENTOR" | "MENTEE" | "SUPER_ADMIN" } : {}),
      ...(q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { user: { profile: { firstName: { contains: q, mode: "insensitive" } } } },
              { user: { profile: { lastName: { contains: q, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    include: {
      user: { include: { profile: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(logins);
}
