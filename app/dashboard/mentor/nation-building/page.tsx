"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const OUTCOME_TYPES = [
  { value: "PLACED", label: "Placed in new role" },
  { value: "PROMOTED", label: "Promoted" },
  { value: "STARTED_VENTURE", label: "Started own venture" },
  { value: "CHANGED_INDUSTRY", label: "Changed industry" },
  { value: "CHANGED_JOB", label: "Changed job" },
] as const;

type Outcome = {
  id: string;
  outcomeType: string;
  city: string | null;
  industry: string | null;
  verified: boolean;
  mentorship: { mentee: { profile?: { firstName: string; lastName: string } } };
};

type Mentorship = {
  id: string;
  mentee: { profile?: { firstName: string; lastName: string } };
};

export default function NationBuildingPage() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [form, setForm] = useState({
    mentorshipId: "",
    outcomeType: "PLACED",
    city: "",
    industry: "",
    notes: "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/mentor/outcomes")
      .then((r) => r.json())
      .then((data) => {
        setOutcomes(data.outcomes ?? []);
        setMentorships(data.mentorships ?? []);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const res = await fetch("/api/mentor/outcomes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to log outcome");
      return;
    }
    setSaved(true);
    setForm({ mentorshipId: "", outcomeType: "PLACED", city: "", industry: "", notes: "" });
    load();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Nation building"
        description="Log impact outcomes from your mentorship. Verified outcomes earn credits and boost your thought leadership score."
      />
      {saved && <Alert variant="success">Outcome logged. Pending admin verification.</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={submit} className="space-y-4 rounded-xl border border-primary/8 bg-white p-6 shadow-card">
        <div className="space-y-2">
          <Label>Mentorship</Label>
          <select
            className="flex h-10 w-full rounded-sm border border-primary/15 bg-white px-3 text-sm"
            value={form.mentorshipId}
            onChange={(e) => setForm({ ...form, mentorshipId: e.target.value })}
            required
          >
            <option value="">Select mentee</option>
            {mentorships.map((m) => (
              <option key={m.id} value={m.id}>
                {m.mentee.profile
                  ? `${m.mentee.profile.firstName} ${m.mentee.profile.lastName}`
                  : m.id}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Outcome type</Label>
          <select
            className="flex h-10 w-full rounded-sm border border-primary/15 bg-white px-3 text-sm"
            value={form.outcomeType}
            onChange={(e) => setForm({ ...form, outcomeType: e.target.value })}
          >
            {OUTCOME_TYPES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>City</Label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Industry</Label>
            <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
        </div>
        <Button type="submit" variant="accent">
          Log outcome
        </Button>
      </form>

      {outcomes.length > 0 && (
        <div className="rounded-xl border border-primary/8 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-semibold text-primary">Logged outcomes</h2>
          <ul className="space-y-3">
            {outcomes.map((o) => (
              <li key={o.id} className="flex items-center justify-between text-sm">
                <span>
                  {o.mentorship.mentee.profile
                    ? `${o.mentorship.mentee.profile.firstName} ${o.mentorship.mentee.profile.lastName}`
                    : "Mentee"}{" "}
                  — {o.outcomeType.replace(/_/g, " ").toLowerCase()}
                  {o.city ? ` · ${o.city}` : ""}
                </span>
                <Badge variant={o.verified ? "accent" : "default"}>
                  {o.verified ? "Verified" : "Pending"}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
