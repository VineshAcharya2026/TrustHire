"use client";

import { useEffect, useState } from "react";
import { RewardCard } from "@/components/rewards/RewardCard";
import { EntityCardGrid } from "@/components/layout/OverviewHeader";
import { EmptyState, PageHeader } from "@/components/layout/PageHeader";
import { LeadCardSkeleton } from "@/components/referrals/LeadCard";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/api-utils";
import type { RewardStatus } from "@prisma/client";
import Link from "next/link";
import { UserPlus } from "lucide-react";

type Reward = {
  id: string;
  status: RewardStatus;
  totalAmount: number;
  releasedAmount: number;
  referral: { candidateName: string; job: { title: string } };
};

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<Reward[]>("/api/referrer/rewards").then(({ data, error: err }) => {
      setLoading(false);
      if (err) setError(err);
      else setRewards(data ?? []);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rewards"
        description="Track bounties earned from successful referrals."
        actions={
          <Button variant="accent" asChild>
            <Link href="/dashboard/referrer/referrals/new">
              <UserPlus className="h-4 w-4" />
              Submit referral
            </Link>
          </Button>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <EntityCardGrid>
          {[1, 2].map((i) => <LeadCardSkeleton key={i} />)}
        </EntityCardGrid>
      ) : rewards.length === 0 ? (
        <EmptyState
          title="No rewards yet"
          description="Refer candidates and earn when they get hired!"
          action={
            <Button variant="accent" asChild>
              <Link href="/dashboard/referrer/referrals/new">Submit your first referral</Link>
            </Button>
          }
        />
      ) : (
        <EntityCardGrid>
          {rewards.map((r) => (
            <RewardCard
              key={r.id}
              reward={{
                id: r.id,
                candidateName: r.referral.candidateName,
                jobTitle: r.referral.job.title,
                status: r.status,
                totalAmount: r.totalAmount,
                releasedAmount: r.releasedAmount,
                href: `/dashboard/referrer/rewards/${r.id}`,
              }}
            />
          ))}
        </EntityCardGrid>
      )}
    </div>
  );
}
