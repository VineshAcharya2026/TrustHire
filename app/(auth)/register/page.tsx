"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type RegisterRole = "REFERRER" | "EMPLOYER" | "MENTOR" | "MENTEE";

const ROLES: { id: RegisterRole; label: string }[] = [
  { id: "REFERRER", label: "Referrer" },
  { id: "EMPLOYER", label: "Employer" },
  { id: "MENTOR", label: "Mentor" },
  { id: "MENTEE", label: "Mentee" },
];

const VALID_ROLES: RegisterRole[] = ["REFERRER", "EMPLOYER", "MENTOR", "MENTEE"];

function parseRoleParam(value: string | null): RegisterRole {
  if (value && VALID_ROLES.includes(value as RegisterRole)) {
    return value as RegisterRole;
  }
  return "REFERRER";
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen auth-bg items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<RegisterRole>("REFERRER");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    companyName: "",
    website: "",
    title: "",
    expertise: "",
    goals: "",
    desiredSkills: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(parseRoleParam(searchParams.get("role")));
    setForm((prev) => ({
      ...prev,
      firstName: searchParams.get("firstName")?.trim() || prev.firstName,
      lastName: searchParams.get("lastName")?.trim() || prev.lastName,
      email: searchParams.get("email")?.trim() || prev.email,
    }));
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Registration failed");
      return;
    }

    router.push("/pending-approval");
  }

  return (
    <div className="flex min-h-screen auth-bg items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl animate-fade-in">
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="p-8">
          <h2 className="text-2xl font-bold text-primary">Create your account</h2>
          <p className="mt-1 text-sm text-muted">Join TrustHire — refer, hire, mentor, or learn</p>

          <div className="mb-6 mt-6 grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "rounded-md border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  role === r.id
                    ? "border-primary bg-primary text-white shadow-card"
                    : "border-primary/15 bg-white text-muted hover:border-primary/30"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="error">{error}</Alert>}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First name</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Last name</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            {role === "EMPLOYER" && (
              <>
                <div className="space-y-2">
                  <Label>Company name</Label>
                  <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Website (optional)</Label>
                  <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
                </div>
              </>
            )}

            {role === "MENTOR" && (
              <>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Current role / title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Expertise (comma-separated skills)</Label>
                  <Input value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} placeholder="React, Leadership" />
                </div>
              </>
            )}

            {role === "MENTEE" && (
              <>
                <div className="space-y-2">
                  <Label>Current role</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Career goals</Label>
                  <Input value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Desired skills</Label>
                  <Input value={form.desiredSkills} onChange={(e) => setForm({ ...form, desiredSkills: e.target.value })} placeholder="TypeScript, System Design" />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
            </div>
            <Button type="submit" className="w-full" variant="accent" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
