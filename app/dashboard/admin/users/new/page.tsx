"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateRole = "MENTOR" | "MENTEE";

export default function AdminCreateUserPage() {
  const router = useRouter();
  const [role, setRole] = useState<CreateRole>("MENTEE");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    companyName: "",
    title: "",
    expertise: "",
    currentRole: "",
    goals: "",
    desiredSkills: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Failed to create user");
      return;
    }

    router.push(`/dashboard/admin/users/${data.id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add user"
        description="Create a mentor or mentee account."
        actions={
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/users">Cancel</Link>
          </Button>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-xl border border-primary/8 bg-white p-6 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as CreateRole)}
            className="h-10 w-full rounded-md border border-primary/10 bg-white px-3 text-sm"
          >
            <option value="MENTOR">Mentor</option>
            <option value="MENTEE">Mentee</option>
          </select>
        </div>

        {role === "MENTOR" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company</Label>
              <Input
                id="companyName"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertise">Expertise (comma-separated)</Label>
              <Input
                id="expertise"
                value={form.expertise}
                onChange={(e) => setForm({ ...form, expertise: e.target.value })}
              />
            </div>
          </>
        )}

        {role === "MENTEE" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="currentRole">Current role</Label>
              <Input
                id="currentRole"
                value={form.currentRole}
                onChange={(e) => setForm({ ...form, currentRole: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Goals</Label>
              <Input
                id="goals"
                value={form.goals}
                onChange={(e) => setForm({ ...form, goals: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desiredSkills">Desired skills (comma-separated)</Label>
              <Input
                id="desiredSkills"
                value={form.desiredSkills}
                onChange={(e) => setForm({ ...form, desiredSkills: e.target.value })}
              />
            </div>
          </>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create user"}
        </Button>
      </form>
    </div>
  );
}
