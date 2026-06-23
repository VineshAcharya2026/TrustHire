import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

const requestSchema = z.object({
  mentorId: z.string().min(1),
  message: z.string().optional(),
});

export async function GET() {
  const { error, session } = await requireRole("MENTEE");
  if (error || !session) return error;

  const mentorships = await prisma.mentorship.findMany({
    where: { menteeId: session.user.id },
    include: {
      mentor: { include: { profile: true, mentorProfile: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(mentorships);
}

export async function POST(request: Request) {
  const { error, session } = await requireRole("MENTEE");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const mentor = await prisma.user.findFirst({
    where: { id: parsed.data.mentorId, role: "MENTOR", status: "ACTIVE" },
  });
  if (!mentor) {
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
  }

  const existing = await prisma.mentorship.findUnique({
    where: { mentorId_menteeId: { mentorId: parsed.data.mentorId, menteeId: session.user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "Request already exists" }, { status: 409 });
  }

  const mentorship = await prisma.mentorship.create({
    data: {
      mentorId: parsed.data.mentorId,
      menteeId: session.user.id,
      message: parsed.data.message,
      status: "PENDING",
    },
  });

  await createNotification(parsed.data.mentorId, "New mentorship request from a mentee", "MENTORSHIP");

  return NextResponse.json(mentorship, { status: 201 });
}
