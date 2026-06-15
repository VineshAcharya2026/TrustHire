import { Gift } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { EXAMPLE_BOUNTY, MILESTONE_SPLITS } from "@/components/home/landingContent";

export function RewardsTierSection() {
  const tiers = MILESTONE_SPLITS.map((m) => ({
    ...m,
    amount: Math.round((EXAMPLE_BOUNTY * m.pct) / 100),
  }));

  return (
    <section id="rewards" className="landing-section-alt py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-landing-navy md:text-3xl">
            Share opportunity. Grow community.{" "}
            <span className="text-landing-blue">Earn rewards!</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
            Example bounty of {formatCurrency(EXAMPLE_BOUNTY)} split across retention milestones
            — employers set bounties per role.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-8 md:flex-row md:justify-center">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-landing-blue/10 ring-1 ring-landing-blue/20">
            <Gift className="h-16 w-16 text-landing-blue" />
          </div>

          <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.day}
                className="rounded-xl border border-landing-blue/20 bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-landing-blue">
                  Day {tier.day}
                </p>
                <p className="mt-2 text-xl font-bold text-landing-navy">
                  {formatCurrency(tier.amount)}
                </p>
                <p className="mt-1 text-xs text-muted">{tier.pct}% of bounty</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted">
          Total: {formatCurrency(EXAMPLE_BOUNTY)} when all three milestones are confirmed by admin.
        </p>
      </div>
    </section>
  );
}
