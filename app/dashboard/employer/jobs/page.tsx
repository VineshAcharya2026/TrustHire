"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { JobCard } from "@/components/jobs/JobCard";
import { EntityCardGrid } from "@/components/layout/OverviewHeader";
import { EmptyState, FilterBar, PageHeader } from "@/components/layout/PageHeader";
import { LeadCardSkeleton } from "@/components/referrals/LeadCard";
import { fetchJson } from "@/lib/api-utils";
import { Plus } from "lucide-react";

type Job = {
  id: string;
  title: string;
  rewardAmount: number;
  isActive: boolean;
  _count: { referrals: number };
};

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchJson<Job[]>("/api/employer/jobs").then(({ data, error: err }) => {
      setLoading(false);
      if (err) {
        setError(err);
        return;
      }
      setJobs(data ?? []);
    });
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && j.isActive) ||
        (filter === "closed" && !j.isActive);
      return matchesSearch && matchesFilter;
    });
  }, [jobs, search, filter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Postings"
        description="Manage open roles and referral bounties."
        actions={
          <Button variant="accent" asChild>
            <Link href="/dashboard/employer/jobs/new">
              <Plus className="h-4 w-4" />
              New job
            </Link>
          </Button>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        placeholder="Search jobs..."
        filterOptions={[
          { value: "all", label: "All jobs" },
          { value: "active", label: "Active" },
          { value: "closed", label: "Closed" },
        ]}
      />

      {loading ? (
        <EntityCardGrid>
          {[1, 2, 3].map((i) => (
            <LeadCardSkeleton key={i} />
          ))}
        </EntityCardGrid>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={jobs.length === 0 ? "No jobs yet" : "No matching jobs"}
          description={
            jobs.length === 0
              ? "Post your first role to start receiving referrals from trusted partners."
              : "Try adjusting your search or filters."
          }
          action={
            jobs.length === 0 ? (
              <Button variant="accent" asChild>
                <Link href="/dashboard/employer/jobs/new">
                  <Plus className="h-4 w-4" />
                  Post a job
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <EntityCardGrid>
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={{
                id: job.id,
                title: job.title,
                rewardAmount: job.rewardAmount,
                isActive: job.isActive,
                referralCount: job._count.referrals,
                href: `/dashboard/employer/jobs/${job.id}`,
              }}
            />
          ))}
        </EntityCardGrid>
      )}
    </div>
  );
}
