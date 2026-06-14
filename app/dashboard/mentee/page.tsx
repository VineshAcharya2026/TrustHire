import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/charts/StatCard";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, Briefcase } from "lucide-react";

export default async function MenteeDashboardPage() {
  const session = await getSession();
  if (!session || session.user.role !== "MENTEE") redirect("/login");

  const [activeMentors, pendingRequests, profile] = await Promise.all([
    prisma.mentorship.count({ where: { menteeId: session.user.id, status: "ACTIVE" } }),
    prisma.mentorship.count({ where: { menteeId: session.user.id, status: "PENDING" } }),
    prisma.menteeProfile.findUnique({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Welcome, {session.user.name}</h1>
        <p className="mt-1 text-sm text-muted">Find mentors and discover roles that match your goals.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Active mentors" value={activeMentors} icon={GraduationCap} />
        <StatCard label="Pending requests" value={pendingRequests} icon={Clock} />
      </div>

      {profile?.goals && (
        <div className="rounded-xl border border-primary/8 bg-white p-5 shadow-card">
          <h2 className="font-semibold text-primary">Your goals</h2>
          <p className="mt-2 text-sm text-muted">{profile.goals}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="accent" asChild>
          <Link href="/dashboard/mentee/mentors">Find mentors</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/mentee/jobs">
            <Briefcase className="h-4 w-4" />
            Browse jobs
          </Link>
        </Button>
      </div>
    </div>
  );
}
