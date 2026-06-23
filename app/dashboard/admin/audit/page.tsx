"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type Log = {
  id: string;
  action: string;
  entity: string;
  createdAt: string;
  user?: { profile?: { firstName: string; lastName: string } };
  metadata?: Record<string, unknown>;
};

export default function AuditPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  useEffect(() => {
    fetch("/api/admin/audit").then((r) => r.json()).then(setLogs);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Audit Log</h1>
      <div className="space-y-2">
        {logs.map((log) => (
          <Card key={log.id} className="transition-all hover:shadow-card">
            <CardContent className="flex items-center justify-between py-3 text-sm">
              <div>
                <span className="font-medium text-primary">{log.action}</span>
                <span className="text-muted"> · {log.entity}</span>
                {log.user?.profile && (
                  <span className="text-muted">
                    {" "}by {log.user.profile.firstName} {log.user.profile.lastName}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted">{formatDate(log.createdAt)}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
