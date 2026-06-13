import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowRight, Banknote, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type PayoutCardData = {
  id: string;
  amount: number;
  status: string;
  candidateName: string;
  jobTitle: string;
  referrerName: string;
  href: string;
};

export function PayoutCard({ payout }: { payout: PayoutCardData }) {
  return (
    <Link href={payout.href} className="group block">
      <article
        className={cn(
          "relative overflow-hidden rounded-xl border border-primary/8 bg-white p-5 shadow-card",
          "transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-card-hover"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-primary/80 to-accent/20 opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/15">
            <Banknote className="h-5 w-5 text-primary" />
          </div>
          <Badge>{payout.status}</Badge>
        </div>

        <h3 className="mt-4 font-semibold text-primary">{payout.candidateName}</h3>
        <p className="mt-1 text-sm text-muted">{payout.jobTitle}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-accent">{formatCurrency(payout.amount)}</span>
          <span className="flex items-center gap-1 text-xs text-muted">
            <User className="h-3 w-3" />
            {payout.referrerName}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-end text-xs font-medium text-muted opacity-0 transition-all group-hover:opacity-100">
          Review payout
          <ArrowRight className="ml-1 h-3.5 w-3.5 text-accent" />
        </div>
      </article>
    </Link>
  );
}
