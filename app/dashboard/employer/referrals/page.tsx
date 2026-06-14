"use client";

import { useCallback, useEffect, useState } from "react";
import { LeadCard, LeadCardGrid, LeadCardSkeleton } from "@/components/referrals/LeadCard";
import { PageHeader, EmptyState } from "@/components/layout/PageHeader";
import {
  AdvancedFilterBar,
  emptyFilters,
  filtersToParams,
  type AdvancedFilterValues,
} from "@/components/layout/AdvancedFilterBar";
import type { ReferralStatus } from "@prisma/client";

type Referral = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  status: ReferralStatus;
  submittedAt: string;
  job: { title: string; rewardAmount: number };
  referrer?: { profile?: { firstName: string; lastName: string } };
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

export default function EmployerReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdvancedFilterValues>(emptyFilters);

  const load = useCallback(() => {
    setLoading(true);
    const params = filtersToParams(filters);
    fetch(`/api/employer/referrals?${params.toString()}`)
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
        title="Candidate leads"
        description={`${referrals.length} referrals across your job postings`}
      />

      <AdvancedFilterBar
        values={filters}
        onChange={setFilters}
        onApply={load}
        onClear={() => {
          setFilters(emptyFilters);
          setLoading(true);
          fetch("/api/employer/referrals")
            .then((r) => r.json())
            .then((data) => setReferrals(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
        }}
        searchPlaceholder="Search candidates, jobs, skills..."
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
        <EmptyState
          title="No leads found"
          description="Referrals will appear here when referrers submit candidates for your jobs."
        />
      ) : (
        <LeadCardGrid>
          {referrals.map((r) => (
            <LeadCard
              key={r.id}
              showReferrer
              showReward
              lead={{
                id: r.id,
                candidateName: r.candidateName,
                candidateEmail: r.candidateEmail,
                status: r.status,
                submittedAt: r.submittedAt,
                jobTitle: r.job.title,
                rewardAmount: r.job.rewardAmount,
                referrerName: r.referrer?.profile
                  ? `${r.referrer.profile.firstName} ${r.referrer.profile.lastName}`
                  : undefined,
                href: `/dashboard/employer/referrals/${r.id}`,
              }}
            />
          ))}
        </LeadCardGrid>
      )}
    </div>
  );
}
