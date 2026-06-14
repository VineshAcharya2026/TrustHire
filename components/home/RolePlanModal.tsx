"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RolePlan } from "@/components/home/rolePlans";

export function RolePlanModal({
  plan,
  open,
  onOpenChange,
}: {
  plan: RolePlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!plan) return null;

  const Icon = plan.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6">
        <div className="relative">
          <div
            className={`absolute inset-x-0 -top-8 h-1.5 rounded-t-xl bg-gradient-to-r ${plan.accentClass}`}
            aria-hidden
          />

          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-landing-orangeLight ring-1 ring-landing-orange/25">
                <Icon className="h-5 w-5 text-landing-orange" />
              </div>
              <Badge className="bg-landing-orangeLight text-landing-orange">{plan.title}</Badge>
            </div>
            <DialogTitle className="text-2xl leading-snug text-landing-navy">
              {plan.headline}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              {plan.summary}
            </DialogDescription>
          </DialogHeader>

          <section className="mt-6 space-y-5">
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-landing-navy">
                What you get
              </h4>
              <ul className="space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm text-muted">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-landing-orange" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-landing-navy">
                How it works
              </h4>
              <ol className="space-y-3">
                {plan.steps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm text-muted">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-landing-orange text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {plan.pricingNote && (
              <p className="rounded-lg border border-landing-orange/15 bg-landing-orangeLight px-4 py-3 text-sm text-muted">
                {plan.pricingNote}
              </p>
            )}
          </section>

          <DialogFooter className="mt-6 gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              asChild
              className="bg-landing-orange text-white hover:bg-landing-orangeDark"
            >
              <Link href={`/register?role=${plan.id}`}>Join as {plan.title}</Link>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
