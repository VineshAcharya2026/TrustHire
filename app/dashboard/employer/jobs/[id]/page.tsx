"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { OverviewHeader } from "@/components/layout/OverviewHeader";
import { InfoPanel, InfoRow } from "@/components/referrals/LeadOverview";
import { LeadCard, LeadCardGrid } from "@/components/referrals/LeadCard";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchJson, parseApiError } from "@/lib/api-utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ReferralStatus } from "@prisma/client";
import { Briefcase, Calendar, DollarSign, FileText, ToggleLeft, Users } from "lucide-react";

type Job = {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  rewardAmount: number;
  isActive: boolean;
  createdAt: string;
  referrals: {
    id: string;
    candidateName: string;
    candidateEmail: string;
    status: ReferralStatus;
    submittedAt: string;
  }[];
};

export default function JobOverviewPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", requirements: "", rewardAmount: 0 });
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetchJson<Job>(`/api/employer/jobs/${id}`).then(({ data, error: err }) => {
      if (err) {
        setError(err);
        return;
      }
      if (data) {
        setJob(data);
        setForm({
          title: data.title,
          description: data.description,
          requirements: data.requirements ?? "",
          rewardAmount: data.rewardAmount,
        });
      }
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  async function toggleActive() {
    if (!job) return;
    const res = await fetch(`/api/employer/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !job.isActive }),
    });
    if (res.ok) load();
  }

  async function saveJob(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    const res = await fetch(`/api/employer/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        requirements: form.requirements || undefined,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setSaveError(parseApiError(data));
      return;
    }
    setEditMode(false);
    load();
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (!job) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 rounded-xl bg-primary/5" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-48 rounded-xl bg-primary/5 lg:col-span-2" />
          <div className="h-48 rounded-xl bg-primary/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OverviewHeader
        title={job.title}
        subtitle={`Posted ${formatDate(job.createdAt)} · ${job.referrals.length} referrals`}
        backHref="/dashboard/employer/jobs"
        backLabel="Back to jobs"
        icon={<Briefcase className="h-7 w-7" />}
        badge={<Badge variant={job.isActive ? "accent" : "default"}>{job.isActive ? "Active" : "Closed"}</Badge>}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={toggleActive}>
              <ToggleLeft className="h-4 w-4" />
              {job.isActive ? "Close job" : "Reopen job"}
            </Button>
            <Button variant="accent" size="sm" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel edit" : "Edit job"}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {editMode ? (
            <InfoPanel title="Edit job">
              <form onSubmit={saveJob} className="space-y-4">
                {saveError && <Alert variant="error">{saveError}</Alert>}
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea
                    className="flex min-h-28 w-full rounded-md border border-primary/15 px-3 py-2 text-sm"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <Input
                    value={form.requirements}
                    onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bounty ($)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.rewardAmount}
                    onChange={(e) => setForm({ ...form, rewardAmount: Number(e.target.value) })}
                    required
                  />
                </div>
                <Button type="submit" variant="accent" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </InfoPanel>
          ) : (
            <InfoPanel title="Job description">
              <p className="text-sm leading-relaxed text-primary/90">{job.description}</p>
              {job.requirements && (
                <div className="mt-4 border-t border-primary/5 pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Requirements</p>
                  <p className="text-sm text-primary/80">{job.requirements}</p>
                </div>
              )}
            </InfoPanel>
          )}

          <div>
            <h2 className="mb-4 text-lg font-semibold text-primary">
              Referrals ({job.referrals.length})
            </h2>
            {job.referrals.length === 0 ? (
              <p className="rounded-xl border border-dashed border-primary/15 bg-white p-8 text-center text-sm text-muted">
                No referrals yet. Referrers will submit candidates for this role.
              </p>
            ) : (
              <LeadCardGrid>
                {job.referrals.map((r) => (
                  <LeadCard
                    key={r.id}
                    lead={{
                      id: r.id,
                      candidateName: r.candidateName,
                      candidateEmail: r.candidateEmail,
                      status: r.status,
                      submittedAt: r.submittedAt,
                      jobTitle: job.title,
                      rewardAmount: job.rewardAmount,
                      href: `/dashboard/employer/referrals/${r.id}`,
                    }}
                    showReward
                  />
                ))}
              </LeadCardGrid>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <InfoPanel title="Job summary">
            <InfoRow label="Bounty" value={formatCurrency(job.rewardAmount)} icon={<DollarSign className="h-3.5 w-3.5" />} />
            <InfoRow label="Referrals" value={job.referrals.length} icon={<Users className="h-3.5 w-3.5" />} />
            <InfoRow label="Posted" value={formatDate(job.createdAt)} icon={<Calendar className="h-3.5 w-3.5" />} />
            <InfoRow label="Status" value={job.isActive ? "Accepting referrals" : "Closed"} icon={<FileText className="h-3.5 w-3.5" />} />
          </InfoPanel>
        </div>
      </div>
    </div>
  );
}
