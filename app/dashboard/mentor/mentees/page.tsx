"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

type Mentorship = {
  id: string;
  status: string;
  message?: string;
  mentee: {
    email: string;
    profile?: { firstName: string; lastName: string };
    menteeProfile?: { currentRole?: string; goals?: string; desiredSkills: string[] };
  };
};

export default function MentorMenteesPage() {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);

  const load = () => fetch("/api/mentor/mentees").then((r) => r.json()).then(setMentorships);

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: "ACTIVE" | "REJECTED") {
    await fetch(`/api/mentor/mentorships/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My mentees" description="Review requests and manage active mentorships." />

      <div className="space-y-3">
        {mentorships.length === 0 ? (
          <Alert variant="info">No mentorship requests yet.</Alert>
        ) : (
          mentorships.map((m) => {
            const name = m.mentee.profile
              ? `${m.mentee.profile.firstName} ${m.mentee.profile.lastName}`
              : m.mentee.email;
            return (
              <div key={m.id} className="rounded-xl border border-primary/8 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-primary">{name}</h3>
                    <p className="text-sm text-muted">{m.mentee.email}</p>
                    {m.mentee.menteeProfile?.currentRole && (
                      <p className="mt-1 text-sm">Role: {m.mentee.menteeProfile.currentRole}</p>
                    )}
                    {m.mentee.menteeProfile?.goals && (
                      <p className="mt-1 text-sm text-muted">Goals: {m.mentee.menteeProfile.goals}</p>
                    )}
                    {m.message && <p className="mt-2 text-sm italic">&ldquo;{m.message}&rdquo;</p>}
                  </div>
                  <Badge variant="accent">{m.status}</Badge>
                </div>
                {m.status === "PENDING" && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="accent" onClick={() => updateStatus(m.id, "ACTIVE")}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(m.id, "REJECTED")}>
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
