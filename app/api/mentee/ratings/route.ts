import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  awardCreditsAndRecalculate,
  CREDIT_AMOUNTS,
  ratingCreditAmount,
} from "@/lib/credits";
import { recalculateThoughtLeadershipScore } from "@/lib/mentor-scores";

const schema = z.object({
  mentorshipId: z.string(),
  rating: z.number().int().min(1).max(5),
  review: z.string().max(2000).optional(),
});

export async function GET() {
  const { error, session } = await requireRole("MENTEE");
  if (error || !session) return error;

  const pending = await prisma.mentorship.findMany({
    where: {
      menteeId: session.user.id,
      status: "COMPLETED",
      rating: null,
    },
    include: {
      mentor: { include: { profile: true, mentorProfile: true } },
    },
  });

  return NextResponse.json(pending);
}

export async function POST(request: Request) {
  const { error, session } = await requireRole("MENTEE");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const mentorship = await prisma.mentorship.findFirst({
    where: {
      id: parsed.data.mentorshipId,
      menteeId: session.user.id,
      status: "COMPLETED",
    },
    include: { mentor: { include: { mentorProfile: true } } },
  });
  if (!mentorship) {
    return NextResponse.json({ error: "Completed mentorship not found" }, { status: 404 });
  }

  const existing = await prisma.mentorshipRating.findUnique({
    where: { mentorshipId: parsed.data.mentorshipId },
  });
  if (existing) {
    return NextResponse.json({ error: "Already rated" }, { status: 400 });
  }

  const mentorProfile = mentorship.mentor.mentorProfile;
  if (!mentorProfile) {
    return NextResponse.json({ error: "Mentor profile not found" }, { status: 400 });
  }

  const rating = await prisma.mentorshipRating.create({
    data: {
      mentorshipId: parsed.data.mentorshipId,
      mentorId: mentorProfile.id,
      menteeId: session.user.id,
      rating: parsed.data.rating,
      review: parsed.data.review,
    },
  });

  const creditAmount = ratingCreditAmount(parsed.data.rating);
  if (creditAmount > 0) {
    await awardCreditsAndRecalculate(
      mentorship.mentorId,
      creditAmount,
      "RATING_BONUS",
      `${parsed.data.rating}-star rating received`,
      parsed.data.mentorshipId
    );
  } else {
    await recalculateThoughtLeadershipScore(mentorship.mentorId);
  }

  return NextResponse.json(rating, { status: 201 });
}
