"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type Payout = {
  id: string;
  amount: number;
  status: string;
  reward: {
    referral: {
      candidateName: string;
      job: { title: string };
      referrer: { profile?: { firstName: string; lastName: string } };
    };
  };
};

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);

  const load = () => fetch("/api/admin/payouts/pending").then((r) => r.json()).then(setPayouts);
  useEffect(() => { load(); }, []);

  async function approve(id: string) {
    await fetch(`/api/admin/payouts/${id}/approve`, { method: "PATCH" });
    load();
  }

  async function hold(id: string) {
    await fetch(`/api/admin/payouts/${id}/hold`, { method: "PATCH" });
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Payout Queue</h1>
      {payouts.length === 0 ? (
        <p className="text-muted">No pending payouts.</p>
      ) : (
        payouts.map((p) => (
          <Card key={p.id} className="hover-lift">
            <CardHeader>
              <CardTitle className="text-base">
                {p.reward.referral.candidateName} — {p.reward.referral.job.title}
              </CardTitle>
              <p className="text-sm text-muted">
                Referrer: {p.reward.referral.referrer.profile?.firstName}{" "}
                {p.reward.referral.referrer.profile?.lastName}
              </p>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-xl font-bold text-accent">{formatCurrency(p.amount)}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="accent" onClick={() => approve(p.id)}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => hold(p.id)}>Hold</Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
