"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

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

    const paths: Record<string, string> = {
      ADMIN: "/dashboard/admin",
      EMPLOYER: "/dashboard/employer",
      REFERRER: "/dashboard/referrer",
    };
    router.push(paths[role] || "/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md animate-fade-in shadow-card-hover">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-card">
            <Briefcase className="h-6 w-6 text-accent" />
          </div>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your TrustHire account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-error/20 bg-red-50 px-3 py-2 text-sm text-error">
                {error}
              </div>
            )}
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
            <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
