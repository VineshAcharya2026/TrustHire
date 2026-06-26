"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { OverviewHeader } from "@/components/layout/OverviewHeader";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/api-utils";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, Shield, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MemberReflectionPanel } from "@/components/reflection/MemberReflectionPanel";

type User = {
  id: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
  profile?: { firstName: string; lastName: string };
  mentorProfile?: {
    company: string;
    title: string;
    expertise: string[];
    maxMentees: number;
    creditsBalance?: number;
    thoughtLeadershipScore?: number;
    isEliteFounder100?: boolean;
  };
  menteeProfile?: { currentRole: string; goals: string; desiredSkills: string[] };
  memberReflection?: {
    id: string;
    introduction?: string | null;
    proudestAchievement?: string | null;
    guidingValues?: string | null;
    standFor?: string | null;
    admiredPerson?: string | null;
    meaningPurpose?: string | null;
    dreamMission?: string | null;
    societalAspiration?: string | null;
    othersDescribeYou?: string | null;
    valuedQualities?: string[];
    energizingPeople?: string | null;
    differentBeliefsApproach?: string | null;
    confidentialityImportance?: number | null;
    supportWays?: string[];
    contributions?: string | null;
    leadershipLoneliness?: string | null;
    supportNeeded?: string | null;
    sharingTopics?: string | null;
    rememberedFor?: string | null;
    additionalNotes?: string | null;
    gentleCommitment?: string | null;
    completedAt?: string | null;
  };
  mentorSessions: { id: string; status: string; mentee: { profile?: { firstName: string; lastName: string } } }[];
  menteeSessions: { id: string; status: string; mentor: { profile?: { firstName: string; lastName: string } } }[];
  _count: { loginEvents: number; auditLogs: number };
};

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [creditAmount, setCreditAmount] = useState("10");
  const [creditReason, setCreditReason] = useState("Admin bonus");
  const [eliteFounder, setEliteFounder] = useState(false);

  const load = () => {
    fetchJson<User>(`/api/admin/users/${id}`).then(({ data, error: err }) => {
      if (err) setError(err);
      else if (data) {
        setUser(data);
        setEliteFounder(data.mentorProfile?.isEliteFounder100 ?? false);
      }
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  async function adjustMentorCredits() {
    await fetch(`/api/admin/mentors/${id}/credits`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(creditAmount),
        reason: creditReason,
        isEliteFounder100: eliteFounder,
      }),
    });
    load();
  }

  async function suspend() {
    await fetch(`/api/admin/users/${id}/suspend`, { method: "PATCH" });
    load();
  }

  async function remove() {
    if (!confirm("Soft-delete this user?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    window.location.href = "/dashboard/admin/users";
  }

  const name = useMemo(() => {
    if (!user) return "";
    return user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email;
  }, [user]);

  if (error) return <Alert variant="error">{error}</Alert>;

  if (!user) {
    return <div className="h-32 animate-pulse rounded-xl bg-primary/5" />;
  }

  return (
    <div className="space-y-6">
      <OverviewHeader
        title={name}
        subtitle={user.email}
        backHref="/dashboard/admin/users"
        backLabel="Back to users"
        icon={<span className="text-xl font-bold">{name.slice(0, 2).toUpperCase()}</span>}
        badge={
          <>
            <Badge variant="accent">{user.role}</Badge>
            <Badge>{user.status}</Badge>
          </>
        }
        actions={
          user.role !== "SUPER_ADMIN" ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={suspend}>
                Suspend
              </Button>
              <Button variant="outline" size="sm" onClick={remove}>
                Delete
              </Button>
            </div>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-primary/8 bg-white p-5 shadow-card space-y-3">
          <h2 className="font-semibold text-primary">Account</h2>
          <p className="flex items-center gap-2 text-sm text-muted"><Mail className="h-4 w-4" />{user.email}</p>
          {user.phone && <p className="flex items-center gap-2 text-sm text-muted"><Phone className="h-4 w-4" />{user.phone}</p>}
          <p className="flex items-center gap-2 text-sm text-muted"><Calendar className="h-4 w-4" />Joined {formatDate(user.createdAt)}</p>
          <p className="flex items-center gap-2 text-sm text-muted"><Shield className="h-4 w-4" />{user._count.loginEvents} logins</p>
        </div>

        {user.mentorProfile && (
          <div className="rounded-xl border border-primary/8 bg-white p-5 shadow-card space-y-3">
            <h2 className="font-semibold text-primary">Mentor profile</h2>
            <p className="text-sm">{user.mentorProfile.title} at {user.mentorProfile.company}</p>
            <p className="text-sm text-muted">Expertise: {user.mentorProfile.expertise.join(", ") || "—"}</p>
            <p className="text-sm text-muted">Max mentees: {user.mentorProfile.maxMentees}</p>
            <p className="text-sm text-muted">Credits: {user.mentorProfile.creditsBalance ?? 0}</p>
            <p className="text-sm text-muted">Thought leadership: {user.mentorProfile.thoughtLeadershipScore ?? 0}/100</p>
            {user.mentorProfile.isEliteFounder100 && <Badge variant="accent">Elite Founder 100</Badge>}
            <div className="space-y-2 border-t border-primary/8 pt-3">
              <Label>Adjust credits</Label>
              <div className="flex gap-2">
                <Input type="number" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} className="w-24" />
                <Input value={creditReason} onChange={(e) => setCreditReason(e.target.value)} placeholder="Reason" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={eliteFounder} onChange={(e) => setEliteFounder(e.target.checked)} className="accent-accent" />
                Elite Founder 100
              </label>
              <Button size="sm" variant="accent" onClick={adjustMentorCredits}>
                Save mentor settings
              </Button>
            </div>
          </div>
        )}

        {user.menteeProfile && (
          <div className="rounded-xl border border-primary/8 bg-white p-5 shadow-card space-y-2">
            <h2 className="font-semibold text-primary">Mentee profile</h2>
            <p className="text-sm">Current role: {user.menteeProfile.currentRole ?? "—"}</p>
            <p className="text-sm text-muted">{user.menteeProfile.goals ?? "No goals set"}</p>
            <p className="text-sm text-muted">Skills: {user.menteeProfile.desiredSkills.join(", ") || "—"}</p>
          </div>
        )}
      </div>

      <MemberReflectionPanel reflection={user.memberReflection} />

      {(user.mentorSessions.length > 0 || user.menteeSessions.length > 0) && (
        <div className="rounded-xl border border-primary/8 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-semibold text-primary">Mentorships</h2>
          <ul className="space-y-2 text-sm">
            {user.mentorSessions.map((m) => (
              <li key={m.id} className="flex justify-between">
                <span>Mentee: {m.mentee.profile?.firstName} {m.mentee.profile?.lastName}</span>
                <Badge>{m.status}</Badge>
              </li>
            ))}
            {user.menteeSessions.map((m) => (
              <li key={m.id} className="flex justify-between">
                <span>Mentor: {m.mentor.profile?.firstName} {m.mentor.profile?.lastName}</span>
                <Badge>{m.status}</Badge>
              </li>
            ))}
          </ul>
          <Link href="/dashboard/admin/mentorships" className="mt-3 inline-block text-sm text-accent hover:underline">
            View all mentorships
          </Link>
        </div>
      )}
    </div>
  );
}
