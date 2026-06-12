import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireAuth();
  if (error || !session) return error;

  const notification = await prisma.notification.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!notification) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.notification.update({
    where: { id: params.id },
    data: { read: true },
  });

  return NextResponse.json(updated);
}
