"use client";

import { useState } from "react";
import { ROLE_PLANS, getRolePlan, type RolePlanId } from "@/components/home/rolePlans";
import { RolePlanCard } from "@/components/home/RolePlanCard";
import { RolePlanModal } from "@/components/home/RolePlanModal";

export function RolePlanSection() {
  const [selectedId, setSelectedId] = useState<RolePlanId | null>(null);
  const selectedPlan = selectedId ? getRolePlan(selectedId) ?? null : null;

  return (
    <section id="plans" className="border-t border-primary/8 bg-white/50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center animate-fade-in">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Choose your path
          </p>
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            One platform. Four ways to grow.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Whether you hire, refer, mentor, or learn — click a plan to see full details,
            then join in minutes.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ROLE_PLANS.map((plan, index) => (
            <RolePlanCard
              key={plan.id}
              plan={plan}
              index={index}
              onOpen={setSelectedId}
            />
          ))}
        </div>

        <RolePlanModal
          plan={selectedPlan}
          open={!!selectedId}
          onOpenChange={(open) => {
            if (!open) setSelectedId(null);
          }}
        />
      </div>
    </section>
  );
}
