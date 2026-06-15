"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RolePlan } from "@/components/home/rolePlans";

export function RolePlanCard({
  plan,
  index,
  onOpen,
}: {
  plan: RolePlan;
  index: number;
  onOpen: (id: RolePlan["id"]) => void;
}) {
  const Icon = plan.icon;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(plan.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(plan.id);
        }
      }}
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border border-landing-blue/15 bg-white p-6 shadow-card opacity-0 animate-fade-in",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:border-landing-blue/40 hover:shadow-card-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-blue/50"
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-300 group-hover:scale-x-100",
          plan.accentClass
        )}
      />

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-landing-blueLight ring-1 ring-landing-blue/20 transition-all duration-300 group-hover:bg-landing-blue/15 group-hover:ring-landing-blue/40">
        <Icon className="h-6 w-6 text-landing-blue transition-transform duration-300 group-hover:scale-110" />
      </div>

      <h3 className="text-lg font-bold text-landing-navy">{plan.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{plan.summary}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {plan.highlights.map((h) => (
          <li
            key={h}
            className="rounded-md bg-landing-blueLight px-2 py-0.5 text-xs font-medium text-landing-blue transition-colors duration-200 group-hover:bg-landing-blue/15"
          >
            {h}
          </li>
        ))}
      </ul>

      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-landing-blue opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}
