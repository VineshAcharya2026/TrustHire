import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import type { ReferralStatus } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LeadOverviewHeader({
  candidateName,
  status,
  subtitle,
  backHref,
  backLabel = "Back to leads",
  actions,
}: {
  candidateName: string;
  status: ReferralStatus;
  subtitle?: string;
  backHref: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  const initials = candidateName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="overflow-hidden rounded-lg border border-primary/8 bg-white shadow-card">
      <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary/30" />
      <div className="p-6">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted hover:text-primary">
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-xl font-bold text-accent shadow-card">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-primary">{candidateName}</h1>
                <ReferralStatusBadge status={status} />
              </div>
              {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

export function InfoPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-primary/8 bg-white p-5 shadow-card", className)}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">{title}</h3>
      {children}
    </div>
  );
}

export function InfoRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-primary/5 py-3 last:border-0 last:pb-0 first:pt-0">
      <span className="flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </span>
      <span className="text-right text-sm font-medium text-primary">{value}</span>
    </div>
  );
}
