import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

const schema = z.object({
  status: z.enum(["ACTIVE", "REJECTED", "COMPLETED"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const mentorship = await prisma.mentorship.findFirst({
    where: { id: params.id, mentorId: session.user.id },
    include: { mentee: { include: { profile: true } } },
  });
  if (!mentorship) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (parsed.data.status === "ACTIVE") {
    const activeCount = await prisma.mentorship.count({
      where: { mentorId: session.user.id, status: "ACTIVE" },
    });
    const profile = await prisma.mentorProfile.findUnique({ where: { userId: session.user.id } });
    if (profile && activeCount >= profile.maxMentees) {
      return NextResponse.json({ error: "Maximum mentee capacity reached" }, { status: 400 });
    }
  }

  const updated = await prisma.mentorship.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  const menteeName = mentorship.mentee.profile
    ? `${mentorship.mentee.profile.firstName} ${mentorship.mentee.profile.lastName}`
    : mentorship.mentee.email;

  await createNotification(
    mentorship.menteeId,
    parsed.data.status === "ACTIVE"
      ? `Your mentorship request was accepted by your mentor`
      : `Your mentorship request was ${parsed.data.status.toLowerCase()}`,
    "MENTORSHIP"
  );

  return NextResponse.json(updated);
}
