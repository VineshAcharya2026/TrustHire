"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import type { ReferralStatus } from "@prisma/client";

type Referral = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  resumeUrl?: string;
  status: ReferralStatus;
  job: { title: string };
  milestones: { id: string; dayMark: number; confirmed: boolean }[];
};

const NEXT: Partial<Record<ReferralStatus, ReferralStatus>> = {
  SUBMITTED: "SHORTLISTED",
  SHORTLISTED: "INTERVIEW_SCHEDULED",
  INTERVIEW_SCHEDULED: "INTERVIEW_DONE",
  INTERVIEW_DONE: "OFFER_MADE",
  OFFER_MADE: "HIRED",
};

export default function EmployerReferralDetailPage() {
  const { id } = useParams();
  const [referral, setReferral] = useState<Referral | null>(null);

  const load = () => {
    fetch("/api/employer/referrals")
      .then((r) => r.json())
      .then((refs: Referral[]) => setReferral(refs.find((r) => r.id === id) || null));
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

  if (!referral) return <p className="text-muted">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">{referral.candidateName}</h1>
        <ReferralStatusBadge status={referral.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Candidate info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Email: {referral.candidateEmail}</p>
          <p>Phone: {referral.candidatePhone}</p>
          <p>Job: {referral.job.title}</p>
          {referral.resumeUrl && (
            <a href={referral.resumeUrl} className="text-accent underline" target="_blank" rel="noreferrer">
              View resume
            </a>
          )}
        </CardContent>
      </Card>

      {NEXT[referral.status] && (
        <Button variant="accent" onClick={advance} className="hover-lift">
          Advance to {NEXT[referral.status]?.replace(/_/g, " ")}
        </Button>
      )}

      {referral.milestones?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Retention milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {referral.milestones.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-md border border-primary/8 p-3">
                <span>Day {m.dayMark}</span>
                {m.confirmed ? (
                  <span className="text-sm text-success">Confirmed</span>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => confirmMilestone(m.id)}>
                    Confirm retention
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
