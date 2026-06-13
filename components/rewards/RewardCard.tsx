import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { RewardStatusBadge } from "@/components/referrals/StatusBadge";
import type { RewardStatus } from "@prisma/client";
import { ArrowRight, Gift } from "lucide-react";

export type RewardCardData = {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: RewardStatus;
  totalAmount: number;
  releasedAmount: number;
  href: string;
};

export function RewardCard({ reward }: { reward: RewardCardData }) {
  const progress = reward.totalAmount > 0 ? Math.round((reward.releasedAmount / reward.totalAmount) * 100) : 0;

  return (
    <Link href={reward.href} className="group block">
      <article
        className={cn(
          "relative overflow-hidden rounded-xl border border-primary/8 bg-white p-5 shadow-card",
          "transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-card-hover"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-success via-accent to-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success/10">
            <Gift className="h-5 w-5 text-success" />
          </div>
          <RewardStatusBadge status={reward.status} />
        </div>

        <h3 className="mt-4 font-semibold text-primary">{reward.candidateName}</h3>
        <p className="mt-1 text-sm text-muted">{reward.jobTitle}</p>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-accent">{formatCurrency(reward.totalAmount)}</span>
          <span className="text-success">{formatCurrency(reward.releasedAmount)} released</span>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider text-muted">
            <span>Payout progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-primary/5">
            <div className="h-full rounded-full bg-success transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end text-xs font-medium text-muted opacity-0 transition-all group-hover:opacity-100">
          View details
          <ArrowRight className="ml-1 h-3.5 w-3.5 text-accent" />
        </div>
      </article>
    </Link>
  );
}
