"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

export default function MentorProfilePage() {
  const [form, setForm] = useState({
    company: "",
    title: "",
    expertise: "",
    yearsExp: "",
    maxMentees: "5",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/mentor/profile")
      .then((r) => r.json())
      .then((p) => {
        if (p?.id) {
          setForm({
            company: p.company || "",
            title: p.title || "",
            expertise: (p.expertise || []).join(", "),
            yearsExp: p.yearsExp?.toString() || "",
            maxMentees: p.maxMentees?.toString() || "5",
          });
        }
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const res = await fetch("/api/mentor/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: form.company,
        title: form.title,
        expertise: form.expertise,
        yearsExp: form.yearsExp ? Number(form.yearsExp) : undefined,
        maxMentees: Number(form.maxMentees),
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save");
      return;
    }
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="Mentor profile" description="Help mentees find you with company, role, and skills." />
      {saved && <Alert variant="success">Profile saved.</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
      <form onSubmit={save} className="space-y-4 rounded-xl border border-primary/8 bg-white p-6 shadow-card">
        <div className="space-y-2">
          <Label>Company</Label>
          <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Current role / title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Expertise (comma-separated skills)</Label>
          <Input
            value={form.expertise}
            onChange={(e) => setForm({ ...form, expertise: e.target.value })}
            placeholder="React, Leadership, System Design"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Years of experience</Label>
            <Input type="number" value={form.yearsExp} onChange={(e) => setForm({ ...form, yearsExp: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Max mentees</Label>
            <Input type="number" value={form.maxMentees} onChange={(e) => setForm({ ...form, maxMentees: e.target.value })} />
          </div>
        </div>
        <Button type="submit" variant="accent">
          Save profile
        </Button>
      </form>
    </div>
  );
}
