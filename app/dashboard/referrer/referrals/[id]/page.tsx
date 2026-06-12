"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReferralStatusBadge, RewardStatusBadge } from "@/components/referrals/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { ReferralStatus, RewardStatus } from "@prisma/client";

type Referral = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  status: ReferralStatus;
  submittedAt: string;
  job: { title: string; employer: { companyName: string }; rewardAmount: number };
  reward?: {
    status: RewardStatus;
    totalAmount: number;
    releasedAmount: number;
    milestones: { dayMark: number; percentage: number; confirmed: boolean }[];
    payouts: { amount: number; status: string; approvedAt?: string }[];
  };
};

export default function ReferralDetailPage() {
  const { id } = useParams();
  const [referral, setReferral] = useState<Referral | null>(null);

  useEffect(() => {
    fetch("/api/referrer/referrals")
      .then((r) => r.json())
      .then((refs: Referral[]) => setReferral(refs.find((r) => r.id === id) || null));
  }, [id]);

  if (!referral) return <p className="text-muted">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">{referral.candidateName}</h1>
        <ReferralStatusBadge status={referral.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{referral.job.title} at {referral.job.employer.companyName}</p>
          <p className="text-muted">Submitted {formatDate(referral.submittedAt)}</p>
          <p className="text-muted">{referral.candidateEmail}</p>
        </CardContent>
      </Card>

      {referral.reward && (
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Reward</CardTitle>
            <RewardStatusBadge status={referral.reward.status} />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-6 text-sm">
              <span>Total: <strong>${referral.reward.totalAmount}</strong></span>
              <span>Released: <strong>${referral.reward.releasedAmount}</strong></span>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-muted">Milestones</p>
              {referral.reward.milestones.map((m) => (
                <div key={m.dayMark} className="flex justify-between rounded-md border border-primary/8 px-3 py-2 text-sm">
                  <span>Day {m.dayMark} ({m.percentage}%)</span>
                  <span className={m.confirmed ? "text-success" : "text-muted"}>
                    {m.confirmed ? "Confirmed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
