"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LeadCard, LeadCardGrid, LeadCardSkeleton } from "@/components/referrals/LeadCard";
import { PageHeader, FilterBar, EmptyState } from "@/components/layout/PageHeader";
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

const FILTERS = [
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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/referrals")
      .then((r) => r.json())
      .then(setReferrals)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return referrals.filter((r) => {
      const matchFilter = !filter || r.status === filter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.candidateName.toLowerCase().includes(q) ||
        r.candidateEmail.toLowerCase().includes(q) ||
        r.job.title.toLowerCase().includes(q) ||
        r.job.employer.companyName.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [referrals, search, filter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="All leads"
        description={`${referrals.length} referrals across the platform`}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        filterOptions={FILTERS}
        placeholder="Search by name, email, job, or company..."
      />

      {loading ? (
        <LeadCardGrid>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LeadCardSkeleton key={i} />
          ))}
        </LeadCardGrid>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No leads found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <LeadCardGrid>
          {filtered.map((r) => (
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
