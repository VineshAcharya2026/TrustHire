"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RewardStatusBadge } from "@/components/referrals/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import type { RewardStatus } from "@prisma/client";

type Reward = {
  id: string;
  status: RewardStatus;
  totalAmount: number;
  releasedAmount: number;
  referral: { candidateName: string; job: { title: string } };
  payouts: { amount: number; status: string; approvedAt?: string }[];
};

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    fetch("/api/referrer/rewards").then((r) => r.json()).then(setRewards);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Rewards</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {rewards.map((r) => (
          <Card key={r.id} className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{r.referral.candidateName}</CardTitle>
                <p className="text-sm text-muted">{r.referral.job.title}</p>
              </div>
              <RewardStatusBadge status={r.status} />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total bounty</span>
                <span className="font-bold text-accent">{formatCurrency(r.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Released</span>
                <span className="font-semibold text-success">{formatCurrency(r.releasedAmount)}</span>
              </div>
              {r.payouts.length > 0 && (
                <div className="border-t border-primary/8 pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-muted">Payout history</p>
                  {r.payouts.map((p, i) => (
                    <div key={i} className="flex justify-between text-xs text-muted">
                      <span>{p.status}</span>
                      <span>{formatCurrency(p.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {rewards.length === 0 && <p className="text-muted">No rewards yet. Refer candidates and earn when they get hired!</p>}
    </div>
  );
}
