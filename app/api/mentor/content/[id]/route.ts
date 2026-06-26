import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const item = await prisma.mentorContent.findFirst({
    where: { id: params.id, mentor: { userId: session.user.id } },
  });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (item.storageKey && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await del(item.storageKey);
    } catch {
      // blob may already be deleted
    }
  }

  await prisma.mentorContent.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
