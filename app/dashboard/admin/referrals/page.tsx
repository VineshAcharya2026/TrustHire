"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import type { ReferralStatus } from "@prisma/client";

type Referral = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  status: ReferralStatus;
  job: { title: string; employer: { companyName: string } };
};

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  useEffect(() => {
    fetch("/api/admin/referrals").then((r) => r.json()).then(setReferrals);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">All Referrals</h1>
      <div className="space-y-3">
        {referrals.map((r) => (
          <Card key={r.id} className="transition-all duration-200 hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base">{r.candidateName}</CardTitle>
                <p className="text-sm text-muted">
                  {r.job.title} · {r.job.employer.companyName}
                </p>
              </div>
              <ReferralStatusBadge status={r.status} />
            </CardHeader>
            <CardContent className="pb-4 text-sm text-muted">{r.candidateEmail}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
