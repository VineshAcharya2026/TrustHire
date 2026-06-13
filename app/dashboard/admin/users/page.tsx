"use client";

import { useEffect, useMemo, useState } from "react";
import { UserCard } from "@/components/users/UserCard";
import { EntityCardGrid } from "@/components/layout/OverviewHeader";
import { EmptyState, FilterBar, PageHeader } from "@/components/layout/PageHeader";
import { LeadCardSkeleton } from "@/components/referrals/LeadCard";
import { Alert } from "@/components/ui/alert";
import { fetchJson } from "@/lib/api-utils";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = filter ? `?status=${filter}` : "";
    fetchJson<User[]>(`/api/admin/users${q}`).then(({ data, error: err }) => {
      setLoading(false);
      if (err) setError(err);
      else setUsers(data ?? []);
    });
  }, [filter]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const name = u.profile ? `${u.profile.firstName} ${u.profile.lastName}`.toLowerCase() : "";
      return name.includes(q) || u.email.toLowerCase().includes(q) || u.employer?.companyName?.toLowerCase().includes(q);
    });
  }, [users, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage platform accounts, approvals, and access."
      />

      {error && <Alert variant="error">{error}</Alert>}

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        placeholder="Search users..."
        filterOptions={[
          { value: "", label: "All statuses" },
          { value: "PENDING", label: "Pending" },
          { value: "ACTIVE", label: "Active" },
          { value: "SUSPENDED", label: "Suspended" },
          { value: "FROZEN", label: "Frozen" },
        ]}
      />

      {loading ? (
        <EntityCardGrid>
          {[1, 2, 3].map((i) => <LeadCardSkeleton key={i} />)}
        </EntityCardGrid>
      ) : filtered.length === 0 ? (
        <EmptyState title="No users found" description="Try adjusting your search or filters." />
      ) : (
        <EntityCardGrid>
          {filtered.map((u) => (
            <UserCard
              key={u.id}
              user={{
                id: u.id,
                name: u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : u.email,
                email: u.email,
                role: u.role,
                status: u.status,
                companyName: u.employer?.companyName,
                href: `/dashboard/admin/users/${u.id}`,
              }}
            />
          ))}
        </EntityCardGrid>
      )}
    </div>
  );
}
