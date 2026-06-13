import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowRight, Briefcase, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type JobCardData = {
  id: string;
  title: string;
  rewardAmount: number;
  isActive: boolean;
  referralCount: number;
  href: string;
};

export function JobCard({ job }: { job: JobCardData }) {
  return (
    <Link href={job.href} className="group block">
      <article
        className={cn(
          "relative overflow-hidden rounded-xl border border-primary/8 bg-white p-5 shadow-card",
          "transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-card-hover"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent/80 to-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10 transition-all group-hover:bg-accent/20 group-hover:ring-accent/30">
            <Briefcase className="h-5 w-5 text-accent" />
          </div>
          <Badge variant={job.isActive ? "accent" : "default"}>{job.isActive ? "Active" : "Closed"}</Badge>
        </div>

        <h3 className="mt-4 font-semibold text-primary transition-colors group-hover:text-primary/90">
          {job.title}
        </h3>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-accent">
            {formatCurrency(job.rewardAmount)} bounty
          </span>
          <span className="flex items-center gap-1 text-muted">
            <Users className="h-3.5 w-3.5" />
            {job.referralCount} referrals
          </span>
        </div>

        <div className="mt-4 flex items-center justify-end text-xs font-medium text-muted opacity-0 transition-all group-hover:opacity-100">
          View overview
          <ArrowRight className="ml-1 h-3.5 w-3.5 text-accent" />
        </div>
      </article>
    </Link>
  );
}
