import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseSkillInput } from "@/lib/skills";
import { createNotification } from "@/lib/notifications";

const schema = z.object({
  company: z.string().optional(),
  title: z.string().optional(),
  expertise: z.string().optional(),
  yearsExp: z.number().optional(),
  maxMentees: z.number().optional(),
});

export async function GET() {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const profile = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const profile = await prisma.mentorProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      company: data.company,
      title: data.title,
      expertise: parseSkillInput(data.expertise),
      yearsExp: data.yearsExp,
      maxMentees: data.maxMentees ?? 5,
    },
    update: {
      company: data.company,
      title: data.title,
      expertise: data.expertise ? parseSkillInput(data.expertise) : undefined,
      yearsExp: data.yearsExp,
      maxMentees: data.maxMentees,
    },
  });

  return NextResponse.json(profile);
}
