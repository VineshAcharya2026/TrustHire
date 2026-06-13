"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/layout/PageHeader";
import { parseApiError } from "@/lib/api-utils";
import { ArrowLeft, Briefcase } from "lucide-react";

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    rewardAmount: 5000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      requirements: form.requirements || undefined,
      rewardAmount: Number(form.rewardAmount),
    };

    const res = await fetch("/api/employer/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(parseApiError(data, "Failed to post job"));
      return;
    }

    router.push(`/dashboard/employer/jobs/${data.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Post a new job"
        description="Set a bounty and start receiving qualified referrals."
        actions={
          <Button variant="outline" asChild>
            <Link href="/dashboard/employer/jobs">
              <ArrowLeft className="h-4 w-4" />
              Back to jobs
            </Link>
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-primary/8 bg-white shadow-card">
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary/30" />
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && <Alert variant="error">{error}</Alert>}

          <div className="space-y-2">
            <Label htmlFor="title">Job title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Senior Frontend Engineer"
              required
              minLength={3}
            />
            <p className="text-xs text-muted">At least 3 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="flex min-h-32 w-full rounded-md border border-primary/15 bg-white px-3 py-2 text-sm shadow-subtle transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the role, team, and what success looks like..."
              required
              minLength={10}
            />
            <p className="text-xs text-muted">At least 10 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements (optional)</Label>
            <Input
              id="requirements"
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              placeholder="5+ years React, TypeScript..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward">Referral bounty (₹)</Label>
            <Input
              id="reward"
              type="number"
              min={1}
              value={form.rewardAmount}
              onChange={(e) => setForm({ ...form, rewardAmount: Number(e.target.value) })}
              required
            />
          </div>

          <Button type="submit" variant="accent" disabled={loading} className="w-full sm:w-auto">
            <Briefcase className="h-4 w-4" />
            {loading ? "Posting..." : "Post job"}
          </Button>
        </form>
      </div>
    </div>
  );
}
