"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RewardStatusBadge } from "@/components/referrals/StatusBadge";
import type { RewardStatus } from "@prisma/client";

type Reward = {
  id: string;
  status: RewardStatus;
  totalAmount: number;
  referral: { candidateName: string; job: { title: string } };
};

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Reward[]>([]);

  useEffect(() => {
    fetch("/api/admin/referrals")
      .then((r) => r.json())
      .then((refs: { reward?: Reward }[]) =>
        setDisputes(refs.filter((r) => r.reward?.status === "DISPUTED").map((r) => r.reward!))
      );
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Disputes</h1>
      {disputes.length === 0 ? (
        <p className="text-muted">No active disputes.</p>
      ) : (
        disputes.map((d) => (
          <Card key={d.id} className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                {d.referral.candidateName} — {d.referral.job.title}
              </CardTitle>
              <RewardStatusBadge status={d.status} />
            </CardHeader>
            <CardContent className="text-sm text-muted">
              Total reward: ${d.totalAmount}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
