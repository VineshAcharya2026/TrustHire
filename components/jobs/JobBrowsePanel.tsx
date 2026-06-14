"use client";

import { useCallback, useEffect, useState } from "react";
import { EntityCardGrid } from "@/components/layout/OverviewHeader";
import { EmptyState, PageHeader } from "@/components/layout/PageHeader";
import {
  AdvancedFilterBar,
  emptyFilters,
  filtersToParams,
  type AdvancedFilterValues,
} from "@/components/layout/AdvancedFilterBar";
import { JobCard } from "@/components/jobs/JobCard";
import { LeadCardSkeleton } from "@/components/referrals/LeadCard";
import { Alert } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/utils";

type Job = {
  id: string;
  title: string;
  rewardAmount: number;
  isActive: boolean;
  employer: { companyName: string };
  skills?: { skill: { name: string } }[];
  _count?: { referrals: number };
};

export function JobBrowsePanel({
  title,
  description,
  jobLinkPrefix,
}: {
  title: string;
  description: string;
  jobLinkPrefix?: string;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<AdvancedFilterValues>(emptyFilters);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    const params = filtersToParams(filters);
    fetch(`/api/jobs/browse?${params.toString()}`)
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
      <PageHeader title={title} description={description} />

      {error && <Alert variant="error">{error}</Alert>}

      <AdvancedFilterBar
        values={filters}
        onChange={setFilters}
        onApply={load}
        onClear={() => {
          setFilters(emptyFilters);
          setLoading(true);
          fetch("/api/jobs/browse")
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
        }}
        searchPlaceholder="Search by role, company, skills..."
        showStatus={false}
      />

      {loading ? (
        <EntityCardGrid>
          {[1, 2, 3].map((i) => (
            <LeadCardSkeleton key={i} />
          ))}
        </EntityCardGrid>
      ) : jobs.length === 0 ? (
        <EmptyState title="No jobs found" description="Try adjusting your filters or check back later." />
      ) : (
        <EntityCardGrid>
          {jobs.map((job) => (
            <div key={job.id} className="space-y-2">
              <JobCard
                job={{
                  id: job.id,
                  title: job.title,
                  rewardAmount: job.rewardAmount,
                  isActive: job.isActive,
                  referralCount: job._count?.referrals ?? 0,
                  href: jobLinkPrefix ? `${jobLinkPrefix}/${job.id}` : "#",
                }}
              />
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 px-1">
                  {job.skills.slice(0, 4).map((s) => (
                    <span
                      key={s.skill.name}
                      className="rounded-md bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-muted"
                    >
                      {s.skill.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="px-1 text-xs text-muted">{job.employer.companyName} · {formatCurrency(job.rewardAmount)}</p>
            </div>
          ))}
        </EntityCardGrid>
      )}
    </div>
  );
}
