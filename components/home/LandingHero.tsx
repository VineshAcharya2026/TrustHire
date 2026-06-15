import Link from "next/link";
import { Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { EXAMPLE_BOUNTY } from "@/components/home/landingContent";

export function LandingHero() {
  return (
    <section className="landing-hero-gradient relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
        <div className="animate-fade-in text-center md:text-left">
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            Refer talent &amp; share this{" "}
            <span className="underline decoration-white/40 decoration-2 underline-offset-4">
              unbeatable hiring
            </span>{" "}
            <span className="text-white/95">OPPORTUNITY</span>
          </h1>
          <p className="mt-6 inline-block rounded-full bg-white px-5 py-2.5 text-base font-bold text-landing-blue shadow-lg md:text-lg">
            Earn up to {formatCurrency(EXAMPLE_BOUNTY)} per successful hire!
          </p>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/90 md:text-base">
            TrustHire connects employers and referrers — with milestone-based INR
            rewards and full lifecycle tracking.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              href="#get-started"
              className="rounded-md bg-white px-6 py-3 text-sm font-bold text-landing-blue shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              Start now
            </Link>
            <Link
              href="#plans"
              className="rounded-md border-2 border-white/80 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
            >
              Explore roles
            </Link>
          </div>
        </div>

        <div className="relative hidden animate-fade-in md:block">
          <div className="relative overflow-hidden rounded-2xl bg-white/10 p-1 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm">
            <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-gradient-to-br from-white/20 to-white/5">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/30">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <p className="text-lg font-semibold text-white">Trusted hiring network</p>
                <p className="mt-1 text-sm text-white/80">Employers · Referrers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
