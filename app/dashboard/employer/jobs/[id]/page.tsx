"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import type { ReferralStatus } from "@prisma/client";

const STAGES: ReferralStatus[] = [
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_DONE",
  "OFFER_MADE",
  "HIRED",
  "REJECTED",
];

type Job = {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  referrals: {
    id: string;
    candidateName: string;
    candidateEmail: string;
    status: ReferralStatus;
  }[];
};

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);

  const load = () => fetch(`/api/employer/jobs/${id}`).then((r) => r.json()).then(setJob);
  useEffect(() => { load(); }, [id]);

  async function updateStatus(referralId: string, status: ReferralStatus) {
    await fetch(`/api/employer/referrals/${referralId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (!job) return <p className="text-muted">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">{job.title}</h1>
        <p className="text-muted">{job.description}</p>
      </div>

      <h2 className="text-lg font-semibold">Referrals ({job.referrals.length})</h2>
      <div className="space-y-3">
        {job.referrals.map((r) => (
          <Card key={r.id} className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base">{r.candidateName}</CardTitle>
                <p className="text-sm text-muted">{r.candidateEmail}</p>
              </div>
              <ReferralStatusBadge status={r.status} />
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pb-4">
              {STAGES.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={r.status === s ? "accent" : "outline"}
                  onClick={() => updateStatus(r.id, s)}
                  className="text-xs"
                >
                  {s.replace(/_/g, " ")}
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
