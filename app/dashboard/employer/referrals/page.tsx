"use client";

import { useEffect, useMemo, useState } from "react";
import { LeadCard, LeadCardGrid, LeadCardSkeleton } from "@/components/referrals/LeadCard";
import { PageHeader, FilterBar, EmptyState } from "@/components/layout/PageHeader";
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

const FILTERS = [
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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    const q = filter ? `?status=${filter}` : "";
    fetch(`/api/employer/referrals${q}`)
      .then((r) => r.json())
      .then(setReferrals)
      .finally(() => setLoading(false));
  }, [filter]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return referrals;
    return referrals.filter(
      (r) =>
        r.candidateName.toLowerCase().includes(q) ||
        r.candidateEmail.toLowerCase().includes(q) ||
        r.job.title.toLowerCase().includes(q)
    );
  }, [referrals, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate leads"
        description={`${referrals.length} referrals across your job postings`}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        filterOptions={FILTERS}
        placeholder="Search candidates or jobs..."
      />

      {loading ? (
        <LeadCardGrid>
          {[1, 2, 3].map((i) => (
            <LeadCardSkeleton key={i} />
          ))}
        </LeadCardGrid>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No leads yet"
          description="Referrals will appear here when referrers submit candidates for your jobs."
        />
      ) : (
        <LeadCardGrid>
          {filtered.map((r) => (
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
