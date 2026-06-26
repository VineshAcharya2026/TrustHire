import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseSkillInput } from "@/lib/skills";

const skillSchema = z.object({
  skill: z.string().min(1),
  masteryLevel: z.number().int().min(1).max(5),
});

const schema = z.object({
  company: z.string().optional(),
  title: z.string().optional(),
  expertise: z.string().optional(),
  yearsExp: z.number().optional(),
  maxMentees: z.number().optional(),
  linkedInUrl: z.string().url().optional().or(z.literal("")),
  city: z.string().optional(),
  industry: z.string().optional(),
  seniorityLevel: z.enum(["MID", "SENIOR", "EXECUTIVE", "FOUNDER"]).optional().nullable(),
  interests: z.string().optional(),
  offersFreeMentorship: z.boolean().optional(),
  skills: z.array(skillSchema).optional(),
});

export async function GET() {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const profile = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      skills: { orderBy: { masteryLevel: "desc" } },
      content: { orderBy: { publishedAt: "desc" } },
      _count: { select: { content: true, ratingsReceived: true } },
    },
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

  const profile = await prisma.$transaction(async (tx) => {
    const updated = await tx.mentorProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        company: data.company,
        title: data.title,
        expertise: parseSkillInput(data.expertise),
        yearsExp: data.yearsExp,
        maxMentees: data.maxMentees ?? 5,
        linkedInUrl: data.linkedInUrl || null,
        city: data.city,
        industry: data.industry,
        seniorityLevel: data.seniorityLevel ?? undefined,
        interests: data.interests ? parseSkillInput(data.interests) : [],
        offersFreeMentorship: data.offersFreeMentorship ?? false,
      },
      update: {
        company: data.company,
        title: data.title,
        expertise: data.expertise ? parseSkillInput(data.expertise) : undefined,
        yearsExp: data.yearsExp,
        maxMentees: data.maxMentees,
        linkedInUrl: data.linkedInUrl !== undefined ? data.linkedInUrl || null : undefined,
        city: data.city,
        industry: data.industry,
        seniorityLevel: data.seniorityLevel ?? undefined,
        interests: data.interests ? parseSkillInput(data.interests) : undefined,
        offersFreeMentorship: data.offersFreeMentorship,
      },
    });

    if (data.skills) {
      await tx.mentorSkill.deleteMany({ where: { mentorId: updated.id } });
      if (data.skills.length > 0) {
        await tx.mentorSkill.createMany({
          data: data.skills.map((s) => ({
            mentorId: updated.id,
            skill: s.skill,
            masteryLevel: s.masteryLevel,
          })),
        });
      }
    }

    return tx.mentorProfile.findUnique({
      where: { id: updated.id },
      include: {
        skills: { orderBy: { masteryLevel: "desc" } },
        _count: { select: { content: true } },
      },
    });
  });

  return NextResponse.json(profile);
}
