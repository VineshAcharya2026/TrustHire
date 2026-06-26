"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

type Outcome = {
  id: string;
  outcomeType: string;
  city: string | null;
  industry: string | null;
  notes: string | null;
  mentorship: {
    mentor: { profile?: { firstName: string; lastName: string } };
    mentee: { profile?: { firstName: string; lastName: string } };
  };
};

export default function AdminOutcomesPage() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/outcomes")
      .then((r) => r.json())
      .then((data) => setOutcomes(Array.isArray(data) ? data : []));
  }

  useEffect(() => {
    load();
  }, []);

  async function verify(id: string, verified: boolean) {
    const res = await fetch(`/api/admin/outcomes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified }),
    });
    if (!res.ok) {
      setError("Failed to update outcome");
      return;
    }
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Nation-building outcomes" description="Verify mentor-reported impact outcomes." />
      {error && <Alert variant="error">{error}</Alert>}
      {outcomes.length === 0 && (
        <p className="text-sm text-muted">No pending outcomes to verify.</p>
      )}
      <div className="space-y-4">
        {outcomes.map((o) => {
          const mentor = o.mentorship.mentor.profile
            ? `${o.mentorship.mentor.profile.firstName} ${o.mentorship.mentor.profile.lastName}`
            : "Mentor";
          const mentee = o.mentorship.mentee.profile
            ? `${o.mentorship.mentee.profile.firstName} ${o.mentorship.mentee.profile.lastName}`
            : "Mentee";
          return (
            <div key={o.id} className="rounded-xl border border-primary/8 bg-white p-5 shadow-card space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-primary">{mentor} → {mentee}</p>
                <Badge>{o.outcomeType.replace(/_/g, " ")}</Badge>
              </div>
              {(o.city || o.industry) && (
                <p className="text-sm text-muted">{[o.city, o.industry].filter(Boolean).join(" · ")}</p>
              )}
              {o.notes && <p className="text-sm">{o.notes}</p>}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="accent" onClick={() => verify(o.id, true)}>
                  Verify
                </Button>
                <Button size="sm" variant="outline" onClick={() => verify(o.id, false)}>
                  Reject
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
