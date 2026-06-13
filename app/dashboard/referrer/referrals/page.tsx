"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LeadCard, LeadCardGrid, LeadCardSkeleton } from "@/components/referrals/LeadCard";
import { PageHeader, FilterBar, EmptyState } from "@/components/layout/PageHeader";
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

const FILTERS = [
  { value: "", label: "All statuses" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

export default function ReferrerReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/referrer/referrals")
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
        r.job.title.toLowerCase().includes(q) ||
        r.job.employer.companyName.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [referrals, search, filter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My leads"
        description={`${referrals.length} candidates you've referred`}
        actions={
          <Button variant="accent" asChild className="hover-lift">
            <Link href="/dashboard/referrer/referrals/new">
              <Plus className="h-4 w-4" /> Submit referral
            </Link>
          </Button>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        filterOptions={FILTERS}
        placeholder="Search by candidate, job, or company..."
      />

      {loading ? (
        <LeadCardGrid>
          {[1, 2, 3].map((i) => (
            <LeadCardSkeleton key={i} />
          ))}
        </LeadCardGrid>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No referrals yet"
          description="Submit your first candidate to start earning bounties."
          action={
            <Button variant="accent" asChild>
              <Link href="/dashboard/referrer/referrals/new">Submit referral</Link>
            </Button>
          }
        />
      ) : (
        <LeadCardGrid>
          {filtered.map((r) => (
            <LeadCard
              key={r.id}
              showReward
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
            />
          ))}
        </LeadCardGrid>
      )}
    </div>
  );
}
