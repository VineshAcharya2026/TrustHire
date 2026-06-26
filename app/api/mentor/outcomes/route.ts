import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  mentorshipId: z.string(),
  outcomeType: z.enum([
    "PLACED",
    "PROMOTED",
    "STARTED_VENTURE",
    "CHANGED_INDUSTRY",
    "CHANGED_JOB",
  ]),
  city: z.string().optional(),
  industry: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export async function GET() {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const outcomes = await prisma.mentorshipOutcome.findMany({
    where: { mentorId: session.user.id },
    include: {
      mentorship: {
        include: { mentee: { include: { profile: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const mentorships = await prisma.mentorship.findMany({
    where: { mentorId: session.user.id, status: { in: ["ACTIVE", "COMPLETED"] } },
    include: { mentee: { include: { profile: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ outcomes, mentorships });
}

export async function POST(request: Request) {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const mentorship = await prisma.mentorship.findFirst({
    where: { id: parsed.data.mentorshipId, mentorId: session.user.id },
  });
  if (!mentorship) {
    return NextResponse.json({ error: "Mentorship not found" }, { status: 404 });
  }

  const outcome = await prisma.mentorshipOutcome.create({
    data: {
      mentorshipId: parsed.data.mentorshipId,
      mentorId: session.user.id,
      outcomeType: parsed.data.outcomeType,
      city: parsed.data.city,
      industry: parsed.data.industry,
      notes: parsed.data.notes,
    },
  });

  return NextResponse.json(outcome, { status: 201 });
}
