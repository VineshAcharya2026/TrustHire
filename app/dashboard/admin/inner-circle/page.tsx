"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

type Application = {
  id: string;
  status: string;
  whyJoin: string | null;
  whatYouBring: string | null;
  nationBuildingCommit: string | null;
  thoughtLeadershipRefs: string | null;
  submittedAt: string | null;
  mentor: {
    user: { profile?: { firstName: string; lastName: string }; email: string };
  };
};

export default function AdminInnerCirclePage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/inner-circle")
      .then((r) => r.json())
      .then((data) => setApplications(Array.isArray(data) ? data : []));
  }

  useEffect(() => {
    load();
  }, []);

  async function review(id: string, status: "APPROVED" | "REJECTED") {
    const res = await fetch(`/api/admin/inner-circle/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setError("Failed to update application");
      return;
    }
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Inner Circle applications" description="Review mentor applications for the exclusive Inner Circle." />
      {error && <Alert variant="error">{error}</Alert>}
      {applications.length === 0 && (
        <p className="text-sm text-muted">No submitted applications yet.</p>
      )}
      <div className="space-y-4">
        {applications.map((app) => {
          const name = app.mentor.user.profile
            ? `${app.mentor.user.profile.firstName} ${app.mentor.user.profile.lastName}`
            : app.mentor.user.email;
          return (
            <div key={app.id} className="rounded-xl border border-primary/8 bg-white p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-primary">{name}</h3>
                <Badge>{app.status}</Badge>
              </div>
              {app.whyJoin && <p className="text-sm"><span className="font-medium">Why join:</span> {app.whyJoin}</p>}
              {app.whatYouBring && <p className="text-sm"><span className="font-medium">Brings:</span> {app.whatYouBring}</p>}
              {app.nationBuildingCommit && <p className="text-sm"><span className="font-medium">Nation building:</span> {app.nationBuildingCommit}</p>}
              {app.status === "PENDING" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="accent" onClick={() => review(app.id, "APPROVED")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => review(app.id, "REJECTED")}>
                    Reject
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
