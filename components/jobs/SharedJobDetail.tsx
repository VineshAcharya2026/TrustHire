"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { OverviewHeader } from "@/components/layout/OverviewHeader";
import { InfoPanel, InfoRow } from "@/components/referrals/LeadOverview";
import { formatCurrency } from "@/lib/utils";
import { Briefcase, Building2, IndianRupee } from "lucide-react";

type Job = {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  rewardAmount: number;
  employer: { companyName: string };
  skills: { skill: { name: string } }[];
};

export function SharedJobDetail({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    fetch(`/api/jobs/${id}`).then((r) => r.json()).then(setJob);
  }, [id]);

  if (!job?.id) return <div className="h-32 animate-pulse rounded-xl bg-primary/5" />;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title={job.title}
        subtitle={job.employer.companyName}
        backHref={backHref}
        backLabel={backLabel}
        icon={<Briefcase className="h-7 w-7" />}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <InfoPanel title="Description" className="lg:col-span-2">
          <p className="text-sm leading-relaxed">{job.description}</p>
          {job.requirements && (
            <p className="mt-4 border-t border-primary/5 pt-4 text-sm text-muted">{job.requirements}</p>
          )}
        </InfoPanel>
        <InfoPanel title="Details">
          <InfoRow label="Company" value={job.employer.companyName} icon={<Building2 className="h-3.5 w-3.5" />} />
          <InfoRow label="Bounty" value={formatCurrency(job.rewardAmount)} icon={<IndianRupee className="h-3.5 w-3.5" />} />
          {job.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {job.skills.map((s) => (
                <span key={s.skill.name} className="rounded-md bg-primary/5 px-2 py-0.5 text-xs">
                  {s.skill.name}
                </span>
              ))}
            </div>
          )}
        </InfoPanel>
      </div>
    </div>
  );
}
