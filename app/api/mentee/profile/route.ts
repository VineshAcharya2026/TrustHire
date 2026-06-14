import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseSkillInput } from "@/lib/skills";

const profileSchema = z.object({
  currentRole: z.string().optional(),
  goals: z.string().optional(),
  desiredSkills: z.string().optional(),
});

export async function GET() {
  const { error, session } = await requireRole("MENTEE");
  if (error || !session) return error;

  const profile = await prisma.menteeProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  const { error, session } = await requireRole("MENTEE");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await prisma.menteeProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      currentRole: parsed.data.currentRole,
      goals: parsed.data.goals,
      desiredSkills: parseSkillInput(parsed.data.desiredSkills),
    },
    update: {
      currentRole: parsed.data.currentRole,
      goals: parsed.data.goals,
      desiredSkills: parsed.data.desiredSkills ? parseSkillInput(parsed.data.desiredSkills) : undefined,
    },
  });

  return NextResponse.json(profile);
}
