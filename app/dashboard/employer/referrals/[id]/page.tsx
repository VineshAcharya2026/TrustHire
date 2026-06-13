"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LeadOverviewHeader, InfoPanel, InfoRow } from "@/components/referrals/LeadOverview";
import { ReferralTimeline } from "@/components/referrals/ReferralTimeline";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ReferralStatus } from "@prisma/client";
import { Calendar, DollarSign, Mail, Phone, User } from "lucide-react";

type Referral = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  resumeUrl?: string;
  status: ReferralStatus;
  submittedAt: string;
  job: { title: string; rewardAmount: number };
  referrer: { profile?: { firstName: string; lastName: string } };
  milestones: { id: string; dayMark: number; percentage: number; confirmed: boolean }[];
};

const NEXT: Partial<Record<ReferralStatus, ReferralStatus>> = {
  SUBMITTED: "SHORTLISTED",
  SHORTLISTED: "INTERVIEW_SCHEDULED",
  INTERVIEW_SCHEDULED: "INTERVIEW_DONE",
  INTERVIEW_DONE: "OFFER_MADE",
  OFFER_MADE: "HIRED",
};

export default function EmployerReferralOverviewPage() {
  const { id } = useParams();
  const [referral, setReferral] = useState<Referral | null>(null);

  const load = () => {
    fetch(`/api/employer/referrals/${id}`)
      .then((r) => r.json())
      .then(setReferral);
  };

  useEffect(() => { load(); }, [id]);

  async function advance() {
    if (!referral) return;
    const next = NEXT[referral.status];
    if (!next) return;
    await fetch(`/api/employer/referrals/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    load();
  }

  async function confirmMilestone(milestoneId: string) {
    await fetch(`/api/employer/milestones/${milestoneId}/confirm`, { method: "POST" });
    load();
  }

  if (!referral?.id) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 rounded-lg bg-primary/5" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-64 rounded-lg bg-primary/5 lg:col-span-2" />
          <div className="h-64 rounded-lg bg-primary/5" />
        </div>
      </div>
    );
  }

  const nextStage = NEXT[referral.status];
  const referrerName = referral.referrer?.profile
    ? `${referral.referrer.profile.firstName} ${referral.referrer.profile.lastName}`
    : "Referrer";

  return (
    <div className="space-y-6">
      <LeadOverviewHeader
        candidateName={referral.candidateName}
        status={referral.status}
        subtitle={`${referral.job.title} · Bounty ${formatCurrency(referral.job.rewardAmount)}`}
        backHref="/dashboard/employer/referrals"
        backLabel="Back to leads"
        actions={
          nextStage ? (
            <Button variant="accent" onClick={advance} className="hover-lift">
              Advance to {nextStage.replace(/_/g, " ")}
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ReferralTimeline currentStatus={referral.status} />

          {referral.milestones?.length > 0 && (
            <InfoPanel title="Retention milestones">
              {referral.milestones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between border-b border-primary/5 py-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-primary">Day {m.dayMark}</p>
                    <p className="text-xs text-muted">{m.percentage}% of bounty</p>
                  </div>
                  {m.confirmed ? (
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-success">
                      Confirmed
                    </span>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => confirmMilestone(m.id)}>
                      Confirm
                    </Button>
                  )}
                </div>
              ))}
            </InfoPanel>
          )}
        </div>

        <div className="space-y-6">
          <InfoPanel title="Candidate contact">
            <InfoRow label="Email" value={referral.candidateEmail} icon={<Mail className="h-3.5 w-3.5" />} />
            <InfoRow label="Phone" value={referral.candidatePhone} icon={<Phone className="h-3.5 w-3.5" />} />
            {referral.resumeUrl && (
              <InfoRow
                label="Resume"
                value={
                  <a href={referral.resumeUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                    View
                  </a>
                }
              />
            )}
          </InfoPanel>

          <InfoPanel title="Lead summary">
            <InfoRow label="Referrer" value={referrerName} icon={<User className="h-3.5 w-3.5" />} />
            <InfoRow label="Position" value={referral.job.title} />
            <InfoRow label="Bounty" value={formatCurrency(referral.job.rewardAmount)} icon={<DollarSign className="h-3.5 w-3.5" />} />
            <InfoRow label="Submitted" value={formatDate(referral.submittedAt)} icon={<Calendar className="h-3.5 w-3.5" />} />
          </InfoPanel>
        </div>
      </div>
    </div>
  );
}
