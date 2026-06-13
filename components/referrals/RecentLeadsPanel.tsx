import Link from "next/link";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { ReferralStatus } from "@prisma/client";
import { ArrowRight } from "lucide-react";

export function RecentLeadsPanel({
  title,
  leads,
  viewAllHref,
}: {
  title: string;
  leads: {
    id: string;
    candidateName: string;
    status: ReferralStatus;
    submittedAt: Date | string;
    subtitle: string;
    href: string;
  }[];
  viewAllHref: string;
}) {
  return (
    <div className="rounded-lg border border-primary/8 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-primary/8 px-5 py-4">
        <h2 className="font-semibold text-primary">{title}</h2>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="divide-y divide-primary/5">
        {leads.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">No leads yet</p>
        ) : (
          leads.map((lead) => (
            <Link
              key={lead.id}
              href={lead.href}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-all duration-200 hover:bg-surface"
            >
              <div className="min-w-0">
                <p className="font-medium text-primary">{lead.candidateName}</p>
                <p className="truncate text-sm text-muted">{lead.subtitle}</p>
                <p className="mt-0.5 text-xs text-muted">{formatDate(lead.submittedAt)}</p>
              </div>
              <ReferralStatusBadge status={lead.status} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
