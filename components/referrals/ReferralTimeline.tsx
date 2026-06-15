import { cn } from "@/lib/utils";
import { REFERRAL_PIPELINE, STATUS_LABELS, getStatusIndex } from "@/lib/referral-utils";
import type { ReferralStatus } from "@prisma/client";
import { Check } from "lucide-react";

export function ReferralTimeline({ currentStatus }: { currentStatus: ReferralStatus }) {
  const isRejected = currentStatus === "REJECTED";
  const currentIdx = getStatusIndex(currentStatus);
  const steps = REFERRAL_PIPELINE.filter((s) => s !== "REJECTED");

  return (
    <div className="rounded-lg border border-primary/8 bg-white p-6 shadow-card">
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted">
        Hiring pipeline
      </h3>
      {isRejected ? (
        <div className="rounded-md border border-error/20 bg-red-50 px-4 py-3 text-sm text-error">
          This candidate was rejected and is no longer in the active pipeline.
        </div>
      ) : (
        <ol className="relative space-y-0">
          {steps.map((step, idx) => {
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            const isLast = idx === steps.length - 1;

            return (
              <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
                {!isLast && (
                  <span
                    className={cn(
                      "absolute left-[15px] top-8 h-full w-0.5",
                      done ? "bg-accent" : "bg-primary/10"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300",
                    done && "border-accent bg-accent text-white",
                    active && "border-accent bg-accent text-white shadow-card ring-4 ring-accent/20",
                    !done && !active && "border-primary/15 bg-white text-muted"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <div className="pt-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      active ? "text-primary" : done ? "text-primary/80" : "text-muted"
                    )}
                  >
                    {STATUS_LABELS[step]}
                  </p>
                  {active && (
                    <p className="mt-0.5 text-xs text-accent">Current stage</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
