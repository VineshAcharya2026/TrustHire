"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LeadCard, LeadCardGrid, LeadCardSkeleton } from "@/components/referrals/LeadCard";
import { PageHeader, EmptyState } from "@/components/layout/PageHeader";
import {
  AdvancedFilterBar,
  emptyFilters,
  filtersToParams,
  type AdvancedFilterValues,
} from "@/components/layout/AdvancedFilterBar";
import { Button } from "@/components/ui/button";
import type { ReferralStatus } from "@prisma/client";
import { Plus } from "lucide-react";

type Referral = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  status: ReferralStatus;
  submittedAt: string;
  job: { title: string; rewardAmount: number; employer: { companyName: string } };
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview scheduled" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

export default function ReferrerReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdvancedFilterValues>(emptyFilters);

  const load = useCallback(() => {
    setLoading(true);
    const params = filtersToParams(filters);
    fetch(`/api/referrer/referrals?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setReferrals(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My leads"
        description={`${referrals.length} candidates you've referred`}
        actions={
          <Button variant="accent" asChild>
            <Link href="/dashboard/referrer/referrals/new">
              <Plus className="h-4 w-4" /> Submit referral
            </Link>
          </Button>
        }
      />

      <AdvancedFilterBar
        values={filters}
        onChange={setFilters}
        onApply={load}
        onClear={() => {
          setFilters(emptyFilters);
          setTimeout(() => {
            fetch("/api/referrer/referrals")
              .then((r) => r.json())
              .then((data) => setReferrals(Array.isArray(data) ? data : []));
          }, 0);
        }}
        searchPlaceholder="Search candidate, job, company, skills..."
        showStatus
        statusOptions={STATUS_OPTIONS}
      />

      {loading ? (
        <LeadCardGrid>
          {[1, 2, 3].map((i) => (
            <LeadCardSkeleton key={i} />
          ))}
        </LeadCardGrid>
      ) : referrals.length === 0 ? (
        <EmptyState title="No leads found" description="Adjust filters or submit your first referral." />
      ) : (
        <LeadCardGrid>
          {referrals.map((r) => (
            <LeadCard
              key={r.id}
              lead={{
                id: r.id,
                candidateName: r.candidateName,
                candidateEmail: r.candidateEmail,
                status: r.status,
                submittedAt: r.submittedAt,
                jobTitle: r.job.title,
                companyName: r.job.employer.companyName,
                rewardAmount: r.job.rewardAmount,
                href: `/dashboard/referrer/referrals/${r.id}`,
              }}
              showReward
            />
          ))}
        </LeadCardGrid>
      )}
    </div>
  );
}
