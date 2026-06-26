"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Linkedin, Trash2, Upload } from "lucide-react";

type Skill = { skill: string; masteryLevel: number };
type ContentItem = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  fileUrl: string;
  publishedAt: string;
};

const TABS = ["About", "Content", "Connect"] as const;
const CONTENT_TYPES = ["POST", "PODCAST", "VIDEO", "IMAGE"] as const;

export default function MentorProfilePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("About");
  const [form, setForm] = useState({
    company: "",
    title: "",
    expertise: "",
    yearsExp: "",
    maxMentees: "5",
    linkedInUrl: "",
    city: "",
    industry: "",
    seniorityLevel: "",
    interests: "",
    offersFreeMentorship: false,
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ skill: "", masteryLevel: "3" });
  const [content, setContent] = useState<ContentItem[]>([]);
  const [contentForm, setContentForm] = useState({
    type: "POST" as (typeof CONTENT_TYPES)[number],
    title: "",
    description: "",
    file: null as File | null,
  });
  const [contentCount, setContentCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function loadProfile() {
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
            linkedInUrl: p.linkedInUrl || "",
            city: p.city || "",
            industry: p.industry || "",
            seniorityLevel: p.seniorityLevel || "",
            interests: (p.interests || []).join(", "),
            offersFreeMentorship: p.offersFreeMentorship ?? false,
          });
          setSkills(p.skills || []);
          setContentCount(p._count?.content ?? 0);
        }
      });
  }

  function loadContent() {
    fetch("/api/mentor/content")
      .then((r) => r.json())
      .then((items) => {
        if (Array.isArray(items)) {
          setContent(items);
          setContentCount(items.length);
        }
      });
  }

  useEffect(() => {
    loadProfile();
    loadContent();
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const res = await fetch("/api/mentor/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        yearsExp: form.yearsExp ? Number(form.yearsExp) : undefined,
        maxMentees: Number(form.maxMentees),
        seniorityLevel: form.seniorityLevel || null,
        skills,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save");
      return;
    }
    setSaved(true);
    loadProfile();
  }

  function addSkill() {
    if (!newSkill.skill.trim()) return;
    setSkills([
      ...skills.filter((s) => s.skill.toLowerCase() !== newSkill.skill.toLowerCase()),
      { skill: newSkill.skill.trim(), masteryLevel: Number(newSkill.masteryLevel) },
    ]);
    setNewSkill({ skill: "", masteryLevel: "3" });
  }

  async function publishContent(e: React.FormEvent) {
    e.preventDefault();
    if (!contentForm.file || !contentForm.title) {
      setError("Title and file are required");
      return;
    }
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", contentForm.file);
    const uploadRes = await fetch("/api/mentor/upload", { method: "POST", body: fd });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      setError(uploadData.error || "Upload failed");
      setUploading(false);
      return;
    }
    const res = await fetch("/api/mentor/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: contentForm.type,
        title: contentForm.title,
        description: contentForm.description || undefined,
        fileUrl: uploadData.fileUrl,
        storageKey: uploadData.storageKey,
        mimeType: uploadData.mimeType,
        fileSize: uploadData.fileSize,
      }),
    });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to publish");
      return;
    }
    setContentForm({ type: "POST", title: "", description: "", file: null });
    loadContent();
    setSaved(true);
  }

  async function deleteContent(id: string) {
    await fetch(`/api/mentor/content/${id}`, { method: "DELETE" });
    loadContent();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Mentor profile"
        description="Showcase your expertise, publish content, and connect with the community."
      />
      <p className="text-sm text-muted">
        TrustHire posts: <span className="font-semibold text-primary">{contentCount}</span>
      </p>
      {saved && <Alert variant="success">Saved successfully.</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex gap-2 border-b border-primary/10 pb-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === t ? "bg-accent text-white" : "text-muted hover:bg-primary/5"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "About" && (
        <form onSubmit={saveProfile} className="space-y-4 rounded-xl border border-primary/8 bg-white p-6 shadow-card">
          <div className="space-y-2">
            <Label>Company</Label>
            <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Current role / title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Expertise (comma-separated)</Label>
            <Input value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
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
            <Label>Seniority</Label>
            <select
              className="flex h-10 w-full rounded-sm border border-primary/15 bg-white px-3 text-sm"
              value={form.seniorityLevel}
              onChange={(e) => setForm({ ...form, seniorityLevel: e.target.value })}
            >
              <option value="">Select</option>
              <option value="MID">Mid-level</option>
              <option value="SENIOR">Senior</option>
              <option value="EXECUTIVE">Executive</option>
              <option value="FOUNDER">Founder</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Interests (comma-separated)</Label>
            <Input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
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
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-accent"
              checked={form.offersFreeMentorship}
              onChange={(e) => setForm({ ...form, offersFreeMentorship: e.target.checked })}
            />
            I offer free or concessional mentorship (nation building)
          </label>

          <div className="space-y-3 border-t border-primary/8 pt-4">
            <Label>Skills & mastery (1–5)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Skill name"
                value={newSkill.skill}
                onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
              />
              <select
                className="rounded-sm border border-primary/15 px-2 text-sm"
                value={newSkill.masteryLevel}
                onChange={(e) => setNewSkill({ ...newSkill, masteryLevel: e.target.value })}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" onClick={addSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <Badge key={s.skill} className="gap-1">
                  {s.skill} ({s.masteryLevel}/5)
                  <button type="button" onClick={() => setSkills(skills.filter((x) => x.skill !== s.skill))}>
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" variant="accent">
            Save profile
          </Button>
        </form>
      )}

      {tab === "Content" && (
        <div className="space-y-6">
          <form onSubmit={publishContent} className="space-y-4 rounded-xl border border-primary/8 bg-white p-6 shadow-card">
            <div className="space-y-2">
              <Label>Content type</Label>
              <select
                className="flex h-10 w-full rounded-sm border border-primary/15 bg-white px-3 text-sm"
                value={contentForm.type}
                onChange={(e) =>
                  setContentForm({ ...contentForm, type: e.target.value as (typeof CONTENT_TYPES)[number] })
                }
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={contentForm.title}
                onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={contentForm.description}
                onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Upload file</Label>
              <Input
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={(e) =>
                  setContentForm({ ...contentForm, file: e.target.files?.[0] ?? null })
                }
              />
            </div>
            <Button type="submit" variant="accent" disabled={uploading} className="gap-2">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Publish content"}
            </Button>
          </form>

          <div className="space-y-3">
            {content.map((item) => (
              <div key={item.id} className="flex items-start justify-between rounded-xl border border-primary/8 bg-white p-4 shadow-card">
                <div>
                  <Badge>{item.type}</Badge>
                  <p className="mt-1 font-medium text-primary">{item.title}</p>
                  {item.description && <p className="text-sm text-muted">{item.description}</p>}
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-1 text-xs text-accent hover:underline">
                    View file
                  </a>
                </div>
                <Button variant="outline" size="sm" onClick={() => deleteContent(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Connect" && (
        <form onSubmit={saveProfile} className="space-y-4 rounded-xl border border-primary/8 bg-white p-6 shadow-card">
          <div className="space-y-2">
            <Label>LinkedIn profile URL</Label>
            <Input
              value={form.linkedInUrl}
              onChange={(e) => setForm({ ...form, linkedInUrl: e.target.value })}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          {form.linkedInUrl && (
            <a
              href={form.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/10 px-4 py-3 text-sm text-accent hover:bg-accent/5"
            >
              <Linkedin className="h-4 w-4" />
              Preview LinkedIn profile
            </a>
          )}
          <Button type="submit" variant="accent">
            Save connection details
          </Button>
        </form>
      )}
    </div>
  );
}
