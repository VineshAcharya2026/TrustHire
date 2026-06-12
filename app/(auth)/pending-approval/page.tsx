import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md text-center animate-fade-in shadow-card-hover">
        <CardHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
            <Clock className="h-7 w-7 text-accent" />
          </div>
          <CardTitle>Pending approval</CardTitle>
          <CardDescription>
            Your account is under review. An administrator will approve your registration shortly.
            You&apos;ll receive a notification once your account is active.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild className="hover-lift">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
