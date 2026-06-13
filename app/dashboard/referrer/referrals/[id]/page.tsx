"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LeadOverviewHeader, InfoPanel, InfoRow } from "@/components/referrals/LeadOverview";
import { ReferralTimeline } from "@/components/referrals/ReferralTimeline";
import { RewardStatusBadge } from "@/components/referrals/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ReferralStatus, RewardStatus } from "@prisma/client";
import { Building2, Calendar, DollarSign, Mail, Wallet } from "lucide-react";

type Referral = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  status: ReferralStatus;
  submittedAt: string;
  job: { title: string; rewardAmount: number; employer: { companyName: string } };
  reward?: {
    status: RewardStatus;
    totalAmount: number;
    releasedAmount: number;
    milestones: { dayMark: number; percentage: number; confirmed: boolean }[];
    payouts: { amount: number; status: string; approvedAt?: string }[];
  };
};

export default function ReferrerReferralOverviewPage() {
  const { id } = useParams();
  const [referral, setReferral] = useState<Referral | null>(null);

  useEffect(() => {
    fetch(`/api/referrer/referrals/${id}`)
      .then((r) => r.json())
      .then(setReferral);
  }, [id]);

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

  return (
    <div className="space-y-6">
      <LeadOverviewHeader
        candidateName={referral.candidateName}
        status={referral.status}
        subtitle={`${referral.job.title} at ${referral.job.employer.companyName}`}
        backHref="/dashboard/referrer/referrals"
        backLabel="Back to my leads"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ReferralTimeline currentStatus={referral.status} />

          {referral.reward ? (
            <InfoPanel title="Reward tracker">
              <div className="mb-4 flex items-center justify-between">
                <RewardStatusBadge status={referral.reward.status} />
                <span className="text-xl font-bold text-accent">
                  {formatCurrency(referral.reward.totalAmount)}
                </span>
              </div>
              <InfoRow
                label="Released"
                value={formatCurrency(referral.reward.releasedAmount)}
                icon={<Wallet className="h-3.5 w-3.5" />}
              />
              <InfoRow
                label="Remaining"
                value={formatCurrency(referral.reward.totalAmount - referral.reward.releasedAmount)}
                icon={<DollarSign className="h-3.5 w-3.5" />}
              />
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Milestones</p>
                {referral.reward.milestones.map((m) => (
                  <div
                    key={m.dayMark}
                    className="flex items-center justify-between rounded-md border border-primary/8 px-3 py-2 text-sm transition-colors hover:bg-surface"
                  >
                    <span>Day {m.dayMark} ({m.percentage}%)</span>
                    <span className={m.confirmed ? "font-medium text-success" : "text-muted"}>
                      {m.confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
              {referral.reward.payouts.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">Payout history</p>
                  {referral.reward.payouts.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm text-muted">
                      <span>{p.status}</span>
                      <span className="font-medium text-primary">{formatCurrency(p.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </InfoPanel>
          ) : (
            <InfoPanel title="Potential reward">
              <p className="text-sm text-muted">
                If this candidate is hired, you&apos;ll earn{" "}
                <strong className="text-accent">{formatCurrency(referral.job.rewardAmount)}</strong> in milestone payouts.
              </p>
            </InfoPanel>
          )}
        </div>

        <div className="space-y-6">
          <InfoPanel title="Candidate">
            <InfoRow label="Email" value={referral.candidateEmail} icon={<Mail className="h-3.5 w-3.5" />} />
            <InfoRow label="Company" value={referral.job.employer.companyName} icon={<Building2 className="h-3.5 w-3.5" />} />
            <InfoRow label="Role" value={referral.job.title} />
            <InfoRow label="Bounty" value={formatCurrency(referral.job.rewardAmount)} icon={<DollarSign className="h-3.5 w-3.5" />} />
            <InfoRow label="Submitted" value={formatDate(referral.submittedAt)} icon={<Calendar className="h-3.5 w-3.5" />} />
          </InfoPanel>
        </div>
      </div>
    </div>
  );
}
