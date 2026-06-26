import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  whyJoin: z.string().max(10000).optional(),
  whatYouBring: z.string().max(10000).optional(),
  nationBuildingCommit: z.string().max(10000).optional(),
  thoughtLeadershipRefs: z.string().max(10000).optional(),
  gentleCommitment: z.boolean().optional(),
  submit: z.boolean().optional(),
});

export async function GET() {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const profile = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!profile) return NextResponse.json({});

  const application = await prisma.innerCircleApplication.findUnique({
    where: { mentorId: profile.id },
  });

  return NextResponse.json(application ?? {});
}

export async function PATCH(request: Request) {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { submit, ...fields } = parsed.data;

  if (submit && !fields.gentleCommitment) {
    return NextResponse.json(
      { error: "Gentle commitment is required to submit." },
      { status: 400 }
    );
  }

  const profile = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return NextResponse.json({ error: "Mentor profile required" }, { status: 400 });
  }

  const application = await prisma.innerCircleApplication.upsert({
    where: { mentorId: profile.id },
    create: {
      mentorId: profile.id,
      ...fields,
      gentleCommitment: fields.gentleCommitment ?? false,
      submittedAt: submit ? new Date() : null,
      status: submit ? "PENDING" : "PENDING",
    },
    update: {
      ...fields,
      ...(submit ? { submittedAt: new Date(), status: "PENDING" } : {}),
    },
  });

  return NextResponse.json(application);
}
