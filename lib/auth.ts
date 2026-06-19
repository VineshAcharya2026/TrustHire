import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { authOptions } from "@/lib/auth-options";

export { authOptions };

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  }
  return { error: null, session };
}

export async function requireRole(roles: Role | Role[]) {
  const { error, session } = await requireAuth();
  if (error || !session) return { error, session: null };

  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(session.user.role)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    };
  }
  if (session.user.status !== "ACTIVE") {
    return {
      error: NextResponse.json({ error: "Account is not active" }, { status: 403 }),
      session: null,
    };
  }
  return { error: null, session };
}

export function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "EMPLOYER":
      return "/dashboard/employer";
    case "REFERRER":
      return "/dashboard/referrer";
    default:
      return "/";
  }
}
