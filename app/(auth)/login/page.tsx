"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Briefcase, Shield, Users } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  PENDING_APPROVAL: "Your account is pending admin approval.",
  ACCOUNT_SUSPENDED: "Your account has been suspended. Contact support.",
  ACCOUNT_FROZEN: "Your account is frozen. Contact support.",
  ACCOUNT_DELETED: "This account no longer exists.",
  CredentialsSignin: "Invalid email or password.",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result?.ok) {
      setError(ERROR_MESSAGES[result?.error ?? ""] || "Login failed. Please try again.");
      return;
    }

    if (result?.error) {
      setError(ERROR_MESSAGES[result.error] || "Login failed. Please try again.");
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const role = session?.user?.role;
    const status = session?.user?.status;

    if (status === "PENDING") {
      router.push("/pending-approval");
      return;
    }

    await fetch("/api/auth/login-log", { method: "POST" });

    const paths: Record<string, string> = {
      SUPER_ADMIN: "/dashboard/admin",
      MENTOR: "/dashboard/mentor",
      MENTEE: "/dashboard/mentee",
    };
    router.push(paths[role] || "/");
  }

  return (
    <div className="flex min-h-screen auth-bg">
      <div className="hidden flex-1 flex-col justify-between p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent shadow-card">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">TrustHire</span>
        </div>
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Grow through mentorship
          </h1>
          <p className="text-lg text-white/70">
            Connect mentors and mentees. Set goals, find guidance, and track mentorship journeys.
          </p>
          <div className="space-y-4 pt-4">
            {[
              { icon: Users, text: "Expert mentor network" },
              { icon: Shield, text: "Super admin oversight" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-white/40">© TrustHire · Mentorship platform</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-surface px-4 py-12 lg:rounded-l-[2rem]">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-primary">TrustHire</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary">Welcome back</h2>
          <p className="mt-1 text-sm text-muted">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && <Alert variant="error">{error}</Alert>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" variant="accent" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            No account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
