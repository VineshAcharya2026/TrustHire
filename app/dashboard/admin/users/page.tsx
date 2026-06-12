"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type User = {
  id: string;
  email: string;
  role: string;
  status: string;
  profile?: { firstName: string; lastName: string };
  employer?: { companyName: string };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState("");

  const load = () => {
    const q = filter ? `?status=${filter}` : "";
    fetch(`/api/admin/users${q}`).then((r) => r.json()).then(setUsers);
  };

  useEffect(() => { load(); }, [filter]);

  async function approve(id: string) {
    await fetch(`/api/admin/users/${id}/approve`, { method: "PATCH" });
    load();
  }

  async function suspend(id: string) {
    const reason = prompt("Suspension reason:");
    if (!reason) return;
    await fetch(`/api/admin/users/${id}/suspend`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">Users</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-sm border border-primary/15 px-3 py-2 text-sm shadow-subtle transition-all hover:shadow-card"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="FROZEN">Frozen</option>
        </select>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <Card key={u.id} className="transition-all duration-200 hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base">
                  {u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : u.email}
                </CardTitle>
                <p className="text-sm text-muted">{u.email} · {u.employer?.companyName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="accent">{u.role}</Badge>
                <Badge>{u.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2 pb-4">
              {u.status === "PENDING" && (
                <Button size="sm" variant="accent" onClick={() => approve(u.id)}>Approve</Button>
              )}
              {u.status === "ACTIVE" && (
                <Button size="sm" variant="outline" onClick={() => suspend(u.id)}>Suspend</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
