"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type Job = {
  id: string;
  title: string;
  rewardAmount: number;
  employer: { companyName: string };
};

export default function NewReferralPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({
    jobId: "",
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    resumeUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/referrer/jobs").then((r) => r.json()).then(setJobs);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/referrer/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Submission failed");
      return;
    }
    router.push("/dashboard/referrer/referrals");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-primary">Submit a referral</h1>
      <Card className="shadow-card-hover">
        <CardHeader>
          <CardTitle>Candidate details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-error/20 bg-red-50 px-3 py-2 text-sm text-error">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label>Select job</Label>
              <select
                className="flex h-10 w-full rounded-sm border border-primary/15 px-3 text-sm shadow-subtle transition-all hover:border-primary/25 focus:ring-2 focus:ring-accent/40"
                value={form.jobId}
                onChange={(e) => setForm({ ...form, jobId: e.target.value })}
                required
              >
                <option value="">Choose a job...</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} — {j.employer.companyName} ({formatCurrency(j.rewardAmount)})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Candidate name</Label>
              <Input value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Candidate email</Label>
              <Input type="email" value={form.candidateEmail} onChange={(e) => setForm({ ...form, candidateEmail: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Candidate phone</Label>
              <Input value={form.candidatePhone} onChange={(e) => setForm({ ...form, candidatePhone: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Resume URL (optional)</Label>
              <Input value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} placeholder="https://" />
            </div>
            <Button type="submit" variant="accent" disabled={loading} className="hover-lift">
              {loading ? "Submitting..." : "Submit referral"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
