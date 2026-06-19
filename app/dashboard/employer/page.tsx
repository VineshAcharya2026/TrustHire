import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/charts/StatCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { RecentLeadsPanel } from "@/components/referrals/RecentLeadsPanel";
import { Briefcase, FileText, TrendingUp, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function EmployerDashboardPage() {
  const session = await getSession();
  if (!session || session.user.role !== "EMPLOYER") redirect("/login");

  const employer = await prisma.employer.findUnique({
    where: { userId: session.user.id },
  });
  if (!employer) redirect("/login");

  const referrals = await prisma.referral.findMany({
    where: { job: { employerId: employer.id } },
    include: { job: true },
    orderBy: { submittedAt: "desc" },
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">{employer.companyName}</h1>
          <p className="mt-1 text-sm text-muted">Hiring pipeline and candidate leads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/employer/referrals">View referrals</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/employer/logins">View logins</Link>
          </Button>
          <Button variant="accent" asChild>
            <Link href="/dashboard/employer/jobs/new">Post job</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active jobs" value={activeJobs} icon={Briefcase} />
        <StatCard label="Total leads" value={total} icon={FileText} />
        <StatCard label="Interview rate" value={`${total ? Math.round((interviewed / total) * 100) : 0}%`} icon={TrendingUp} />
        <StatCard label="Hires" value={hired} icon={UserCheck} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentLeadsPanel
          title="Latest candidate leads"
          viewAllHref="/dashboard/employer/referrals"
          leads={referrals.slice(0, 5).map((r) => ({
            id: r.id,
            candidateName: r.candidateName,
            status: r.status,
            submittedAt: r.submittedAt,
            subtitle: r.job.title,
            href: `/dashboard/employer/referrals/${r.id}`,
          }))}
        />
        <BarChartCard
          title="Leads by job"
          data={byJob.map((j) => ({ name: j.title.slice(0, 18), count: j._count.referrals }))}
        />
      </div>
    </div>
  );
}
