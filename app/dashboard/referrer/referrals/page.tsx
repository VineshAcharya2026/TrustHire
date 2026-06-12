"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import { Button } from "@/components/ui/button";
import type { ReferralStatus } from "@prisma/client";
import { Plus } from "lucide-react";

type Referral = {
  id: string;
  candidateName: string;
  status: ReferralStatus;
  submittedAt: string;
  job: { title: string; employer: { companyName: string } };
};

export default function ReferrerReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    fetch("/api/referrer/referrals").then((r) => r.json()).then(setReferrals);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">My Referrals</h1>
        <Button variant="accent" asChild className="hover-lift">
          <Link href="/dashboard/referrer/referrals/new">
            <Plus className="h-4 w-4" /> Submit referral
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {referrals.map((r) => (
          <Link key={r.id} href={`/dashboard/referrer/referrals/${r.id}`}>
            <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="text-base">{r.candidateName}</CardTitle>
                  <p className="text-sm text-muted">
                    {r.job.title} · {r.job.employer.companyName}
                  </p>
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
