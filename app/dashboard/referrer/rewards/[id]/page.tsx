"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { OverviewHeader } from "@/components/layout/OverviewHeader";
import { InfoPanel, InfoRow } from "@/components/referrals/LeadOverview";
import { ReferralTimeline } from "@/components/referrals/ReferralTimeline";
import { RewardStatusBadge } from "@/components/referrals/StatusBadge";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/api-utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ReferralStatus, RewardStatus } from "@prisma/client";
import { Building2, Calendar, CheckCircle2, Gift } from "lucide-react";

type Reward = {
  id: string;
  status: RewardStatus;
  totalAmount: number;
  releasedAmount: number;
  createdAt: string;
  referral: {
    id: string;
    candidateName: string;
    status: ReferralStatus;
    submittedAt: string;
    job: { title: string; rewardAmount: number; employer: { companyName: string } };
    milestones: { dayMark: number; percentage: number; confirmed: boolean; confirmedAt?: string }[];
  };
  payouts: { id: string; amount: number; status: string; approvedAt?: string }[];
};

export default function RewardOverviewPage() {
  const { id } = useParams();
  const [reward, setReward] = useState<Reward | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<Reward>(`/api/referrer/rewards/${id}`).then(({ data, error: err }) => {
      if (err) setError(err);
      else if (data) setReward(data);
    });
  }, [id]);

  if (error) return <Alert variant="error">{error}</Alert>;

  if (!reward) {
    return <div className="h-32 animate-pulse rounded-xl bg-primary/5" />;
  }

  const progress = reward.totalAmount > 0
    ? Math.round((reward.releasedAmount / reward.totalAmount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title={formatCurrency(reward.totalAmount)}
        subtitle={`Reward for ${reward.referral.candidateName} · ${reward.referral.job.title}`}
        backHref="/dashboard/referrer/rewards"
        backLabel="Back to rewards"
        icon={<Gift className="h-7 w-7" />}
        badge={<RewardStatusBadge status={reward.status} />}
        accent="from-success via-accent to-primary/30"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/referrer/referrals/${reward.referral.id}`}>View referral</Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <InfoPanel title="Payout progress">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-success">{formatCurrency(reward.releasedAmount)}</p>
                <p className="text-sm text-muted">of {formatCurrency(reward.totalAmount)} released</p>
              </div>
              <span className="text-2xl font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-primary/5">
              <div className="h-full rounded-full bg-success transition-all" style={{ width: `${progress}%` }} />
            </div>
          </InfoPanel>

          {reward.payouts.length > 0 && (
            <InfoPanel title="Payout history">
              {reward.payouts.map((p) => (
                <InfoRow
                  key={p.id}
                  label={p.status}
                  value={
                    <>
                      {formatCurrency(p.amount)}
                      {p.approvedAt && (
                        <span className="ml-2 text-xs text-muted">{formatDate(p.approvedAt)}</span>
                      )}
                    </>
                  }
                  icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                />
              ))}
            </InfoPanel>
          )}

          <InfoPanel title="Retention milestones">
            {reward.referral.milestones.map((m) => (
              <InfoRow
                key={m.dayMark}
                label={`Day ${m.dayMark} (${m.percentage}%)`}
                value={m.confirmed ? `Confirmed ${m.confirmedAt ? formatDate(m.confirmedAt) : ""}` : "Pending"}
                icon={<Calendar className="h-3.5 w-3.5" />}
              />
            ))}
          </InfoPanel>
        </div>

        <div className="space-y-4">
          <InfoPanel title="Referral details">
            <InfoRow label="Candidate" value={reward.referral.candidateName} />
            <InfoRow label="Job" value={reward.referral.job.title} />
            <InfoRow label="Company" value={reward.referral.job.employer.companyName} icon={<Building2 className="h-3.5 w-3.5" />} />
            <InfoRow label="Hired" value={formatDate(reward.createdAt)} icon={<Calendar className="h-3.5 w-3.5" />} />
          </InfoPanel>

          <ReferralTimeline currentStatus={reward.referral.status} />
        </div>
      </div>
    </div>
  );
}
