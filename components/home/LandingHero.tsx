import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function LandingHero() {
  return (
    <section className="landing-hero-gradient relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
        <div className="animate-fade-in text-center md:text-left">
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            Find mentors.{" "}
            <span className="underline decoration-white/40 decoration-2 underline-offset-4">
              Grow your career
            </span>{" "}
            <span className="text-white/95">with guidance</span>
          </h1>
          <p className="mt-6 inline-block rounded-full bg-white px-5 py-2.5 text-base font-bold text-landing-blue shadow-lg md:text-lg">
            Mentorship that fits your goals
          </p>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/90 md:text-base">
            TrustHire connects mentors and mentees — with structured requests,
            goal tracking, and super admin oversight.
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

        <div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm md:h-80 md:w-80">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-2xl md:h-48 md:w-48">
            <GraduationCap className="h-20 w-20 text-landing-blue md:h-24 md:w-24" />
          </div>
        </div>
      </div>
    </section>
  );
}
