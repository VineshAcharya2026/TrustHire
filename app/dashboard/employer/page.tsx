import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/charts/StatCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { Briefcase, FileText, TrendingUp, UserCheck } from "lucide-react";

export default async function EmployerDashboardPage() {
  const session = await getSession();
  if (!session || session.user.role !== "EMPLOYER") redirect("/login");

  const employer = await prisma.employer.findUnique({
    where: { userId: session.user.id },
  });
  if (!employer) redirect("/login");

  const referrals = await prisma.referral.findMany({
    where: { job: { employerId: employer.id } },
  });

  const activeJobs = await prisma.job.count({
    where: { employerId: employer.id, isActive: true },
  });

  const total = referrals.length;
  const hired = referrals.filter((r) => r.status === "HIRED").length;
  const interviewed = referrals.filter((r) =>
    ["INTERVIEW_SCHEDULED", "INTERVIEW_DONE", "OFFER_MADE", "HIRED"].includes(r.status)
  ).length;

  const byJob = await prisma.job.findMany({
    where: { employerId: employer.id },
    include: { _count: { select: { referrals: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">{employer.companyName}</h1>
        <p className="text-muted">Employer overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active jobs" value={activeJobs} icon={Briefcase} />
        <StatCard label="Total referrals" value={total} icon={FileText} />
        <StatCard label="Interview rate" value={`${total ? Math.round((interviewed / total) * 100) : 0}%`} icon={TrendingUp} />
        <StatCard label="Hires" value={hired} icon={UserCheck} />
      </div>

      <BarChartCard
        title="Referrals by job"
        data={byJob.map((j) => ({ name: j.title.slice(0, 20), count: j._count.referrals }))}
      />
    </div>
  );
}
