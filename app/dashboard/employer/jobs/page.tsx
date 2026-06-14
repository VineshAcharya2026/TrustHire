"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { JobCard } from "@/components/jobs/JobCard";
import { EntityCardGrid } from "@/components/layout/OverviewHeader";
import { EmptyState, PageHeader } from "@/components/layout/PageHeader";
import {
  AdvancedFilterBar,
  emptyFilters,
  filtersToParams,
  type AdvancedFilterValues,
} from "@/components/layout/AdvancedFilterBar";
import { LeadCardSkeleton } from "@/components/referrals/LeadCard";
import { Plus } from "lucide-react";

type Job = {
  id: string;
  title: string;
  rewardAmount: number;
  isActive: boolean;
  _count: { referrals: number };
};

const JOB_STATUS_OPTIONS = [
  { value: "", label: "All jobs" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
];

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<AdvancedFilterValues>(emptyFilters);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    const params = filtersToParams(filters);
    params.set("activeOnly", "false");
    if (filters.status) params.set("jobStatus", filters.status);
    fetch(`/api/employer/jobs?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setJobs([]);
        } else {
          setJobs(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => setError("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, []);

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

      <AdvancedFilterBar
        values={filters}
        onChange={setFilters}
        onApply={load}
        onClear={() => {
          setFilters(emptyFilters);
          setLoading(true);
          fetch("/api/employer/jobs?activeOnly=false")
            .then((r) => r.json())
            .then((data) => setJobs(Array.isArray(data) ? data : []))
            .catch(() => setError("Failed to load jobs"))
            .finally(() => setLoading(false));
        }}
        searchPlaceholder="Search jobs, skills..."
        showStatus
        statusOptions={JOB_STATUS_OPTIONS}
      />

      {loading ? (
        <EntityCardGrid>
          {[1, 2, 3].map((i) => (
            <LeadCardSkeleton key={i} />
          ))}
        </EntityCardGrid>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="Post a role or adjust your filters."
          action={
            <Button variant="accent" asChild>
              <Link href="/dashboard/employer/jobs/new">
                <Plus className="h-4 w-4" />
                Post a job
              </Link>
            </Button>
          }
        />
      ) : (
        <EntityCardGrid>
          {jobs.map((job) => (
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
