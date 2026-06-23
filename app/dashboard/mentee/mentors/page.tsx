"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  AdvancedFilterBar,
  emptyFilters,
  filtersToParams,
  type AdvancedFilterValues,
} from "@/components/layout/AdvancedFilterBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { EntityCardGrid } from "@/components/layout/OverviewHeader";

type Mentor = {
  id: string;
  name: string;
  email: string;
  profile?: { company?: string; title?: string; expertise: string[]; yearsExp?: number; maxMentees?: number };
  activeMentees: number;
};

export default function MenteeMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filters, setFilters] = useState<AdvancedFilterValues>(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const params = filtersToParams(filters);
    fetch(`/api/mentee/mentors?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setMentors(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, []);

  async function requestMentor(mentorId: string) {
    const res = await fetch("/api/mentee/mentorships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorId, message: message || undefined }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Request sent!" : data.error || "Request failed");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Find mentors" description="Filter by company and skills to find the right guide." />

      {message && <Alert variant="info">{message}</Alert>}

      <AdvancedFilterBar
        values={filters}
        onChange={setFilters}
        onApply={load}
        onClear={() => {
          setFilters(emptyFilters);
          setTimeout(load, 0);
        }}
        searchPlaceholder="Search mentors by name, company, skills..."
        showBounty={false}
      />

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : mentors.length === 0 ? (
        <Alert variant="info">No mentors match your filters.</Alert>
      ) : (
        <EntityCardGrid>
          {mentors.map((m) => (
            <div key={m.id} className="rounded-xl border border-primary/8 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-primary">{m.name}</h3>
                  <p className="text-sm text-muted">{m.profile?.title || "Mentor"}</p>
                  {m.profile?.company && <p className="text-xs text-muted">{m.profile.company}</p>}
                </div>
                <Badge>{m.activeMentees}/{m.profile?.maxMentees ?? 5} mentees</Badge>
              </div>
              {m.profile?.expertise && m.profile.expertise.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {m.profile.expertise.map((s) => (
                    <span key={s} className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <Button size="sm" variant="accent" className="mt-4 w-full" onClick={() => requestMentor(m.id)}>
                Request mentorship
              </Button>
            </div>
          ))}
        </EntityCardGrid>
      )}
    </div>
  );
}
