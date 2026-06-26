import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardCreditsAndRecalculate, CREDIT_AMOUNTS } from "@/lib/credits";
import { recalculateThoughtLeadershipScore } from "@/lib/mentor-scores";

const createSchema = z.object({
  type: z.enum(["POST", "PODCAST", "VIDEO", "IMAGE"]),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  fileUrl: z.string().url(),
  storageKey: z.string().optional(),
  mimeType: z.string().optional(),
  fileSize: z.number().optional(),
});

export async function GET() {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const content = await prisma.mentorContent.findMany({
    where: { mentor: { userId: session.user.id } },
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json(content);
}

export async function POST(request: Request) {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return NextResponse.json({ error: "Mentor profile required" }, { status: 400 });
  }

  const item = await prisma.mentorContent.create({
    data: {
      mentorId: profile.id,
      ...parsed.data,
    },
  });

  await awardCreditsAndRecalculate(
    session.user.id,
    CREDIT_AMOUNTS.CONTENT_PUBLISHED,
    "CONTENT_PUBLISHED",
    `Published ${parsed.data.type.toLowerCase()}: ${parsed.data.title}`
  );
  await recalculateThoughtLeadershipScore(session.user.id);

  return NextResponse.json(item, { status: 201 });
}
