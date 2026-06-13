"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EntityCardGrid } from "@/components/layout/OverviewHeader";
import { EmptyState, PageHeader } from "@/components/layout/PageHeader";
import { RewardStatusBadge } from "@/components/referrals/StatusBadge";
import { Alert } from "@/components/ui/alert";
import { fetchJson } from "@/lib/api-utils";
import { formatCurrency } from "@/lib/utils";
import type { ReferralStatus, RewardStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

type Referral = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  status: ReferralStatus;
  submittedAt: string;
  job: { title: string; employer: { companyName: string } };
  reward?: { status: RewardStatus; totalAmount: number };
};

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<Referral[]>("/api/admin/referrals").then(({ data, error: err }) => {
      setLoading(false);
      if (err) setError(err);
      else setDisputes((data ?? []).filter((r) => r.reward?.status === "DISPUTED"));
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Disputes"
        description="Review contested rewards requiring admin attention."
      />

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-primary/5" />
      ) : disputes.length === 0 ? (
        <EmptyState title="No active disputes" description="All rewards are in good standing." />
      ) : (
        <EntityCardGrid>
          {disputes.map((d) => (
            <Link key={d.id} href={`/dashboard/admin/referrals/${d.id}`} className="group block">
              <article
                className={cn(
                  "relative overflow-hidden rounded-xl border border-warning/20 bg-white p-5 shadow-card",
                  "transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  </div>
                  {d.reward && <RewardStatusBadge status={d.reward.status} />}
                </div>
                <h3 className="mt-3 font-semibold text-primary">{d.candidateName}</h3>
                <p className="text-sm text-muted">{d.job.title} · {d.job.employer.companyName}</p>
                {d.reward && (
                  <p className="mt-2 text-sm font-semibold text-warning">
                    {formatCurrency(d.reward.totalAmount)} at stake
                  </p>
                )}
              </article>
            </Link>
          ))}
        </EntityCardGrid>
      )}
    </div>
  );
}
