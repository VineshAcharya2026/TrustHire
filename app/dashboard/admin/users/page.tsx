"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UserCard } from "@/components/users/UserCard";
import { EntityCardGrid } from "@/components/layout/OverviewHeader";
import { EmptyState, PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchJson } from "@/lib/api-utils";

type User = {
  id: string;
  email: string;
  role: string;
  status: string;
  profile?: { firstName: string; lastName: string };
  mentorProfile?: { company: string; title: string };
  menteeProfile?: { currentRole: string };
};

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  MENTOR: "Mentor",
  MENTEE: "Mentee",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (roleFilter) params.set("role", roleFilter);
    const q = params.toString() ? `?${params.toString()}` : "";
    fetchJson<User[]>(`/api/admin/users${q}`).then(({ data, error: err }) => {
      setLoading(false);
      if (err) setError(err);
      else setUsers(data ?? []);
    });
  }, [statusFilter, roleFilter]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const name = u.profile ? `${u.profile.firstName} ${u.profile.lastName}`.toLowerCase() : "";
      const mentorMeta = u.mentorProfile
        ? `${u.mentorProfile.company} ${u.mentorProfile.title}`.toLowerCase()
        : "";
      const menteeMeta = u.menteeProfile?.currentRole?.toLowerCase() ?? "";
      return (
        name.includes(q) ||
        u.email.toLowerCase().includes(q) ||
        mentorMeta.includes(q) ||
        menteeMeta.includes(q)
      );
    });
  }, [users, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader title="Users" description="Manage mentor and mentee accounts." />
        <Button variant="accent" asChild>
          <Link href="/dashboard/admin/users/new">Add user</Link>
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 rounded-md border border-primary/10 bg-white px-3 text-sm"
        >
          <option value="">All roles</option>
          <option value="MENTOR">Mentor</option>
          <option value="MENTEE">Mentee</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-primary/10 bg-white px-3 text-sm"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {loading ? (
        <EntityCardGrid>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-primary/5" />
          ))}
        </EntityCardGrid>
      ) : filtered.length === 0 ? (
        <EmptyState title="No users found" description="Try adjusting your filters." />
      ) : (
        <EntityCardGrid>
          {filtered.map((u) => (
            <UserCard
              key={u.id}
              user={{
                id: u.id,
                name: u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : u.email,
                email: u.email,
                role: ROLE_LABELS[u.role] ?? u.role,
                status: u.status,
                companyName: u.mentorProfile?.company,
                href: `/dashboard/admin/users/${u.id}`,
              }}
            />
          ))}
        </EntityCardGrid>
      )}
    </div>
  );
}
