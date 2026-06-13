"use client";

import { useEffect, useState } from "react";
import { PayoutCard } from "@/components/payouts/PayoutCard";
import { EntityCardGrid } from "@/components/layout/OverviewHeader";
import { EmptyState, PageHeader } from "@/components/layout/PageHeader";
import { LeadCardSkeleton } from "@/components/referrals/LeadCard";
import { Alert } from "@/components/ui/alert";
import { fetchJson } from "@/lib/api-utils";

type Payout = {
  id: string;
  amount: number;
  status: string;
  reward: {
    referral: {
      candidateName: string;
      job: { title: string };
      referrer: { profile?: { firstName: string; lastName: string }; email: string };
    };
  };
};

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<Payout[]>("/api/admin/payouts/pending").then(({ data, error: err }) => {
      setLoading(false);
      if (err) setError(err);
      else setPayouts(data ?? []);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payout Queue"
        description="Review and approve milestone payouts to referrers."
      />

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <EntityCardGrid>
          {[1, 2].map((i) => <LeadCardSkeleton key={i} />)}
        </EntityCardGrid>
      ) : payouts.length === 0 ? (
        <EmptyState title="No pending payouts" description="All caught up — no payouts waiting for approval." />
      ) : (
        <EntityCardGrid>
          {payouts.map((p) => (
            <PayoutCard
              key={p.id}
              payout={{
                id: p.id,
                amount: p.amount,
                status: p.status,
                candidateName: p.reward.referral.candidateName,
                jobTitle: p.reward.referral.job.title,
                referrerName: p.reward.referral.referrer.profile
                  ? `${p.reward.referral.referrer.profile.firstName} ${p.reward.referral.referrer.profile.lastName}`
                  : p.reward.referral.referrer.email,
                href: `/dashboard/admin/payouts/${p.id}`,
              }}
            />
          ))}
        </EntityCardGrid>
      )}
    </div>
  );
}
