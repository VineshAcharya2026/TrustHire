import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreMentorMatch } from "@/lib/mentor-matching";

export async function GET() {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const self = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      skills: true,
      user: { include: { profile: true, memberReflection: true } },
    },
  });
  if (!self) {
    return NextResponse.json({ matches: [] });
  }

  const others = await prisma.mentorProfile.findMany({
    where: { userId: { not: session.user.id }, user: { status: "ACTIVE" } },
    include: {
      skills: true,
      user: { include: { profile: true, memberReflection: true } },
    },
    take: 50,
  });

  const selfInput = {
    id: self.id,
    userId: self.userId,
    company: self.company,
    title: self.title,
    expertise: self.expertise,
    city: self.city,
    industry: self.industry,
    seniorityLevel: self.seniorityLevel,
    interests: self.interests,
    skills: self.skills,
    profile: self.user.profile,
    reflection: self.user.memberReflection
      ? {
          valuedQualities: self.user.memberReflection.valuedQualities,
          sharingTopics: self.user.memberReflection.sharingTopics,
        }
      : null,
  };

  const matches = others
    .map((other) => {
      const { score, reasons } = scoreMentorMatch(selfInput, {
        id: other.id,
        userId: other.userId,
        company: other.company,
        title: other.title,
        expertise: other.expertise,
        city: other.city,
        industry: other.industry,
        seniorityLevel: other.seniorityLevel,
        interests: other.interests,
        skills: other.skills,
        profile: other.user.profile,
        reflection: other.user.memberReflection
          ? {
              valuedQualities: other.user.memberReflection.valuedQualities,
              sharingTopics: other.user.memberReflection.sharingTopics,
            }
          : null,
      });
      return {
        score,
        reasons,
        mentor: {
          id: other.id,
          userId: other.userId,
          company: other.company,
          title: other.title,
          expertise: other.expertise,
          city: other.city,
          industry: other.industry,
          seniorityLevel: other.seniorityLevel,
          linkedInUrl: other.linkedInUrl,
          isEliteFounder100: other.isEliteFounder100,
          profile: other.user.profile,
        },
      };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return NextResponse.json({ matches });
}
