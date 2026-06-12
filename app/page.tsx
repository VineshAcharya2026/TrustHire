import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, Shield, TrendingUp, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-primary/8 bg-white shadow-subtle">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary shadow-subtle transition-transform duration-200 hover:scale-105">
              <Briefcase className="h-4 w-4 text-accent" />
            </div>
            <span className="text-lg font-bold text-primary">TrustHire</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button variant="accent" asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-20 text-center animate-fade-in">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Referral hiring, done right</p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-primary md:text-5xl">
            Hire through trusted referrals. Reward the people who find your best talent.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            TrustHire connects employers, referrers, and candidates with milestone-based rewards,
            fraud prevention, and full lifecycle tracking.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="accent" asChild className="hover-lift">
              <Link href="/register">Join as Referrer</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="hover-lift">
              <Link href="/register">Post jobs as Employer</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 md:grid-cols-3">
          {[
            { icon: Users, title: "Trusted referrals", desc: "Vetted referrers submit candidates with duplicate and fraud checks." },
            { icon: Shield, title: "Retention milestones", desc: "Rewards release at 30, 60, and 90 days — only when hires stick." },
            { icon: TrendingUp, title: "Full transparency", desc: "Employers, referrers, and admins track every stage in real time." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-primary/8 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <f.icon className="mb-4 h-8 w-8 text-accent" />
              <h3 className="font-bold text-primary">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
