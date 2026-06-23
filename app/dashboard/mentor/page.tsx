import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/charts/StatCard";
import { Button } from "@/components/ui/button";
import { Users, Clock } from "lucide-react";

export default async function MentorDashboardPage() {
  const session = await getSession();
  if (!session || session.user.role !== "MENTOR") redirect("/login");

  const [activeMentees, pendingRequests, recent] = await Promise.all([
    prisma.mentorship.count({ where: { mentorId: session.user.id, status: "ACTIVE" } }),
    prisma.mentorship.count({ where: { mentorId: session.user.id, status: "PENDING" } }),
    prisma.mentorship.findMany({
      where: { mentorId: session.user.id },
      include: { mentee: { include: { profile: true } } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Welcome, {session.user.name}</h1>
        <p className="mt-1 text-sm text-muted">Guide mentees and explore opportunities together.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Active mentees" value={activeMentees} icon={Users} />
        <StatCard label="Pending requests" value={pendingRequests} icon={Clock} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="accent" asChild>
          <Link href="/dashboard/mentor/mentees">Manage mentees</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/mentor/profile">Edit profile</Link>
        </Button>
      </div>

      {recent.length > 0 && (
        <div className="rounded-xl border border-primary/8 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-semibold text-primary">Recent mentorship activity</h2>
          <ul className="space-y-2">
            {recent.map((m) => (
              <li key={m.id} className="flex items-center justify-between text-sm">
                <span>
                  {m.mentee.profile
                    ? `${m.mentee.profile.firstName} ${m.mentee.profile.lastName}`
                    : m.mentee.email}
                </span>
                <span className="rounded-md bg-primary/5 px-2 py-0.5 text-xs font-medium">{m.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
