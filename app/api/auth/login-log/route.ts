import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userAgent = request.headers.get("user-agent") ?? undefined;

  await prisma.loginEvent.create({
    data: {
      userId: session.user.id,
      email: session.user.email ?? "",
      role: session.user.role,
      ipAddress: getClientIp(request),
      userAgent,
    },
  });

  return NextResponse.json({ ok: true });
}
