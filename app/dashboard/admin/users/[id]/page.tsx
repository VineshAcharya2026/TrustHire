"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { OverviewHeader } from "@/components/layout/OverviewHeader";
import { InfoPanel, InfoRow } from "@/components/referrals/LeadOverview";
import { LeadCard, LeadCardGrid } from "@/components/referrals/LeadCard";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/api-utils";
import { formatDate } from "@/lib/utils";
import type { ReferralStatus, RewardStatus } from "@prisma/client";
import { Building2, Calendar, Mail, Phone, Shield } from "lucide-react";

type User = {
  id: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
  profile?: { firstName: string; lastName: string };
  employer?: {
    companyName: string;
    website?: string;
    verified: boolean;
    jobs: { id: string; title: string; isActive: boolean; _count: { referrals: number } }[];
  };
  referrals: {
    id: string;
    candidateName: string;
    candidateEmail: string;
    status: ReferralStatus;
    submittedAt: string;
    job: { title: string };
    reward?: { status: RewardStatus; totalAmount: number };
  }[];
  _count: { referrals: number; auditLogs: number };
};

export default function AdminUserOverviewPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    fetchJson<User>(`/api/admin/users/${id}`).then(({ data, error: err }) => {
      if (err) setError(err);
      else if (data) setUser(data);
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  async function approve() {
    await fetch(`/api/admin/users/${id}/approve`, { method: "PATCH" });
    load();
  }

  async function suspend() {
    const reason = prompt("Suspension reason:");
    if (!reason) return;
    await fetch(`/api/admin/users/${id}/suspend`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    load();
  }

  const name = useMemo(() => {
    if (!user) return "";
    return user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email;
  }, [user]);

  if (error) return <Alert variant="error">{error}</Alert>;

  if (!user) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 rounded-xl bg-primary/5" />
      </div>
    );
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
          <>
            {user.status === "PENDING" && (
              <Button variant="accent" size="sm" onClick={approve}>Approve</Button>
            )}
            {user.status === "ACTIVE" && (
              <Button variant="outline" size="sm" onClick={suspend}>Suspend</Button>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {user.employer && (
            <InfoPanel title="Company">
              <InfoRow label="Company" value={user.employer.companyName} icon={<Building2 className="h-3.5 w-3.5" />} />
              <InfoRow label="Website" value={user.employer.website || "—"} />
              <InfoRow label="Verified" value={user.employer.verified ? "Yes" : "No"} icon={<Shield className="h-3.5 w-3.5" />} />
              {user.employer.jobs.length > 0 && (
                <div className="mt-4 border-t border-primary/5 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Jobs ({user.employer.jobs.length})</p>
                  <div className="space-y-2">
                    {user.employer.jobs.map((j) => (
                      <div key={j.id} className="flex items-center justify-between rounded-md bg-surface px-3 py-2 text-sm">
                        <span>{j.title}</span>
                        <span className="text-muted">{j._count.referrals} referrals</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </InfoPanel>
          )}

          {user.referrals.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-primary">Recent referrals</h2>
              <LeadCardGrid>
                {user.referrals.map((r) => (
                  <LeadCard
                    key={r.id}
                    lead={{
                      id: r.id,
                      candidateName: r.candidateName,
                      candidateEmail: r.candidateEmail,
                      status: r.status,
                      submittedAt: r.submittedAt,
                      jobTitle: r.job.title,
                      href: `/dashboard/admin/referrals/${r.id}`,
                    }}
                  />
                ))}
              </LeadCardGrid>
            </div>
          )}
        </div>

        <InfoPanel title="Account details">
          <InfoRow label="Email" value={user.email} icon={<Mail className="h-3.5 w-3.5" />} />
          <InfoRow label="Phone" value={user.phone || "—"} icon={<Phone className="h-3.5 w-3.5" />} />
          <InfoRow label="Joined" value={formatDate(user.createdAt)} icon={<Calendar className="h-3.5 w-3.5" />} />
          <InfoRow label="Referrals" value={user._count.referrals} />
          <InfoRow label="Audit events" value={user._count.auditLogs} />
        </InfoPanel>
      </div>
    </div>
  );
}
