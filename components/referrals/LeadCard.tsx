import Link from "next/link";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { getInitials, getStatusProgress } from "@/lib/referral-utils";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import type { ReferralStatus } from "@prisma/client";
import { ArrowRight, Building2, Calendar, DollarSign, Mail, User } from "lucide-react";

export type LeadCardData = {
  id: string;
  candidateName: string;
  candidateEmail?: string;
  status: ReferralStatus;
  submittedAt?: string;
  jobTitle: string;
  companyName?: string;
  rewardAmount?: number;
  referrerName?: string;
  href: string;
};

export function LeadCard({
  lead,
  showReward = false,
  showReferrer = false,
}: {
  lead: LeadCardData;
  showReward?: boolean;
  showReferrer?: boolean;
}) {
  const progress = getStatusProgress(lead.status);
  const initials = getInitials(lead.candidateName);

  return (
    <Link href={lead.href} className="group block">
      <article
        className={cn(
          "relative overflow-hidden rounded-lg border border-primary/8 bg-white p-5 shadow-card",
          "transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-card-hover"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent/80 to-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-sm font-bold text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-accent/20 group-hover:ring-accent/30">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-primary transition-colors group-hover:text-primary/90">
                  {lead.candidateName}
                </h3>
                {lead.candidateEmail && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                    <Mail className="h-3 w-3" />
                    {lead.candidateEmail}
                  </p>
                )}
              </div>
              <ReferralStatusBadge status={lead.status} />
            </div>

            <div className="mt-3 space-y-1.5">
              <p className="flex items-center gap-1.5 text-sm text-primary/80">
                <Building2 className="h-3.5 w-3.5 text-accent" />
                <span className="truncate">{lead.jobTitle}</span>
                {lead.companyName && (
                  <span className="text-muted">· {lead.companyName}</span>
                )}
              </p>
              {showReferrer && lead.referrerName && (
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <User className="h-3 w-3" />
                  Referred by {lead.referrerName}
                </p>
              )}
              {lead.submittedAt && (
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <Calendar className="h-3 w-3" />
                  {formatDate(lead.submittedAt)}
                </p>
              )}
            </div>

            {showReward && lead.rewardAmount != null && (
              <p className="mt-3 inline-flex items-center gap-1 rounded-md bg-accent/15 px-2 py-1 text-xs font-semibold text-primary">
                <DollarSign className="h-3 w-3 text-accent" />
                Bounty {formatCurrency(lead.rewardAmount)}
              </p>
            )}

            <div className="mt-4">
              <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider text-muted">
                <span>Pipeline progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-primary/5">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    lead.status === "REJECTED" ? "bg-error/60" : "bg-accent"
                  )}
                  style={{ width: `${lead.status === "REJECTED" ? 100 : progress}%` }}
                />
              </div>
            </div>
          </div>

          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100" />
        </div>
      </article>
    </Link>
  );
}

export function LeadCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
  );
}

export function LeadCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-primary/8 bg-white p-5 shadow-card">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary/5" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-2/3 rounded bg-primary/5" />
          <div className="h-3 w-1/2 rounded bg-primary/5" />
          <div className="h-1.5 w-full rounded-full bg-primary/5" />
        </div>
      </div>
    </div>
  );
}
