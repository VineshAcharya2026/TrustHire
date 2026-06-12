"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    rewardAmount: 5000,
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/employer/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) router.push("/dashboard/employer/jobs");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-primary">Post a new job</h1>
      <Card className="shadow-card-hover">
        <CardHeader>
          <CardTitle>Job details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                className="flex min-h-32 w-full rounded-sm border border-primary/15 px-3 py-2 text-sm shadow-subtle transition-all focus:ring-2 focus:ring-accent/40"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Requirements</Label>
              <Input value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Reward amount ($)</Label>
              <Input
                type="number"
                value={form.rewardAmount}
                onChange={(e) => setForm({ ...form, rewardAmount: Number(e.target.value) })}
                required
              />
            </div>
            <Button type="submit" variant="accent" disabled={loading}>
              {loading ? "Posting..." : "Post job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
