"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function MentorInnerCirclePage() {
  const [form, setForm] = useState({
    whyJoin: "",
    whatYouBring: "",
    nationBuildingCommit: "",
    thoughtLeadershipRefs: "",
    gentleCommitment: false,
  });
  const [status, setStatus] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/mentor/inner-circle")
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setForm({
            whyJoin: data.whyJoin ?? "",
            whatYouBring: data.whatYouBring ?? "",
            nationBuildingCommit: data.nationBuildingCommit ?? "",
            thoughtLeadershipRefs: data.thoughtLeadershipRefs ?? "",
            gentleCommitment: data.gentleCommitment ?? false,
          });
          setStatus(data.status);
          setSubmittedAt(data.submittedAt);
        }
      });
  }, []);

  async function save(submit: boolean) {
    setError("");
    setSaved(false);
    const res = await fetch("/api/mentor/inner-circle", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, submit }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Failed to save");
      return;
    }
    setStatus(data.status);
    setSubmittedAt(data.submittedAt);
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Mentor's Inner Circle"
        description="Apply for an exclusive circle of trusted mentors shaping the community."
      />
      {status && submittedAt && (
        <div className="flex items-center gap-2">
          <Badge variant={status === "APPROVED" ? "accent" : "default"}>{status}</Badge>
          <span className="text-sm text-muted">Submitted {new Date(submittedAt).toLocaleDateString()}</span>
        </div>
      )}
      {saved && <Alert variant="success">Application saved.</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save(true);
        }}
        className="space-y-6 rounded-xl border border-primary/8 bg-white p-6 shadow-card"
      >
        <div className="space-y-2">
          <Label>Why do you want to join the Inner Circle?</Label>
          <Textarea value={form.whyJoin} onChange={(e) => setForm({ ...form, whyJoin: e.target.value })} rows={4} />
        </div>
        <div className="space-y-2">
          <Label>What do you bring to this community?</Label>
          <Textarea value={form.whatYouBring} onChange={(e) => setForm({ ...form, whatYouBring: e.target.value })} rows={4} />
        </div>
        <div className="space-y-2">
          <Label>Nation-building commitment and examples</Label>
          <Textarea value={form.nationBuildingCommit} onChange={(e) => setForm({ ...form, nationBuildingCommit: e.target.value })} rows={4} />
        </div>
        <div className="space-y-2">
          <Label>References / links to thought leadership</Label>
          <Textarea value={form.thoughtLeadershipRefs} onChange={(e) => setForm({ ...form, thoughtLeadershipRefs: e.target.value })} rows={3} />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1 accent-accent"
            checked={form.gentleCommitment}
            onChange={(e) => setForm({ ...form, gentleCommitment: e.target.checked })}
          />
          I commit to integrity, generosity, and contributing positively to this exclusive community.
        </label>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => save(false)}>
            Save draft
          </Button>
          <Button type="submit" variant="accent">
            Submit application
          </Button>
        </div>
      </form>
    </div>
  );
}
