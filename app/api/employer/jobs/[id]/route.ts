import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateJobSchema } from "@/lib/validators/job";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/utils";

async function getOwnJob(jobId: string, userId: string) {
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return null;
  return prisma.job.findFirst({
    where: { id: jobId, employerId: employer.id },
    include: {
      referrals: {
        include: { referrer: { include: { profile: true } }, reward: true },
        orderBy: { submittedAt: "desc" },
      },
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("EMPLOYER");
  if (error || !session) return error;

  const job = await getOwnJob(params.id, session.user.id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(job);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("EMPLOYER");
  if (error || !session) return error;

  const job = await getOwnJob(params.id, session.user.id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const parsed = updateJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.job.update({
    where: { id: params.id },
    data: parsed.data,
  });

  await logAudit({
    userId: session.user.id,
    action: "JOB_UPDATED",
    entity: "Job",
    entityId: params.id,
    ipAddress: getClientIp(request),
  });

  return NextResponse.json(updated);
}
