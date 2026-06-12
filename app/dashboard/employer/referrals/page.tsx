"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import type { ReferralStatus } from "@prisma/client";

type Referral = {
  id: string;
  candidateName: string;
  status: ReferralStatus;
  job: { title: string };
};

export default function EmployerReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const q = filter ? `?status=${filter}` : "";
    fetch(`/api/employer/referrals${q}`).then((r) => r.json()).then(setReferrals);
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">All Referrals</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-sm border border-primary/15 px-3 py-2 text-sm shadow-subtle"
        >
          <option value="">All statuses</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="HIRED">Hired</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="space-y-3">
        {referrals.map((r) => (
          <Link key={r.id} href={`/dashboard/employer/referrals/${r.id}`}>
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="text-base">{r.candidateName}</CardTitle>
                  <p className="text-sm text-muted">{r.job.title}</p>
                </div>
                <ReferralStatusBadge status={r.status} />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
