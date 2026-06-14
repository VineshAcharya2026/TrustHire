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
  job: { title: string; employer: { companyName: string }; rewardAmount?: number };
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

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdvancedFilterValues>(emptyFilters);

  const load = useCallback(() => {
    setLoading(true);
    const params = filtersToParams(filters);
    fetch(`/api/admin/referrals?${params.toString()}`)
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
        title="All leads"
        description={`${referrals.length} referrals across the platform`}
      />

      <AdvancedFilterBar
        values={filters}
        onChange={setFilters}
        onApply={load}
        onClear={() => {
          setFilters(emptyFilters);
          setLoading(true);
          fetch("/api/admin/referrals")
            .then((r) => r.json())
            .then((data) => setReferrals(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
        }}
        searchPlaceholder="Search by name, email, job, company, skills..."
        showStatus
        statusOptions={STATUS_OPTIONS}
      />

      {loading ? (
        <LeadCardGrid>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LeadCardSkeleton key={i} />
          ))}
        </LeadCardGrid>
      ) : referrals.length === 0 ? (
        <EmptyState
          title="No leads found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <LeadCardGrid>
          {referrals.map((r) => (
            <LeadCard
              key={r.id}
              showReferrer
              lead={{
                id: r.id,
                candidateName: r.candidateName,
                candidateEmail: r.candidateEmail,
                status: r.status,
                submittedAt: r.submittedAt,
                jobTitle: r.job.title,
                companyName: r.job.employer.companyName,
                rewardAmount: r.job.rewardAmount,
                referrerName: r.referrer?.profile
                  ? `${r.referrer.profile.firstName} ${r.referrer.profile.lastName}`
                  : undefined,
                href: `/dashboard/admin/referrals/${r.id}`,
              }}
            />
          ))}
        </LeadCardGrid>
      )}
    </div>
  );
}
