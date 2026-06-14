import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ReferralIntentStrip() {
  return (
    <section className="bg-landing-orange py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="text-lg font-bold text-white">Ready to refer top talent?</p>
          <p className="mt-1 text-sm text-white/85">
            Join as a referrer and earn INR milestone rewards on every successful hire.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/register?role=REFERRER"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-landing-orange transition-all hover:scale-[1.02] hover:shadow-lg"
          >
            Start as Referrer
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="rounded-md border-2 border-white/70 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            Sign in to track
          </Link>
        </div>
      </div>
    </section>
  );
}
