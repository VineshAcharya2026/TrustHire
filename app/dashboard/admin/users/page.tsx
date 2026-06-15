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
  mentorProfile?: { company: string; title: string };
  menteeProfile?: { currentRole: string; targetRole: string };
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  EMPLOYER: "Employer",
  REFERRER: "Referrer",
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
      const menteeMeta = u.menteeProfile
        ? `${u.menteeProfile.currentRole} ${u.menteeProfile.targetRole}`.toLowerCase()
        : "";
      return (
        name.includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.employer?.companyName?.toLowerCase().includes(q) ||
        mentorMeta.includes(q) ||
        menteeMeta.includes(q)
      );
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
        filter={statusFilter}
        onFilterChange={setStatusFilter}
        placeholder="Search users..."
        filterOptions={[
          { value: "", label: "All statuses" },
          { value: "PENDING", label: "Pending" },
          { value: "ACTIVE", label: "Active" },
          { value: "SUSPENDED", label: "Suspended" },
          { value: "FROZEN", label: "Frozen" },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {[
          { value: "", label: "All roles" },
          { value: "ADMIN", label: "Admin" },
          { value: "EMPLOYER", label: "Employer" },
          { value: "REFERRER", label: "Referrer" },
        ].map((opt) => (
          <button
            key={opt.value || "all"}
            type="button"
            onClick={() => setRoleFilter(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              roleFilter === opt.value
                ? "bg-primary text-white"
                : "bg-white text-muted ring-1 ring-primary/10 hover:text-primary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <EntityCardGrid>
          {[1, 2, 3].map((i) => (
            <LeadCardSkeleton key={i} />
          ))}
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
                role: ROLE_LABELS[u.role] ?? u.role,
                status: u.status,
                companyName:
                  u.employer?.companyName ??
                  u.mentorProfile?.company ??
                  (u.menteeProfile
                    ? `${u.menteeProfile.currentRole} → ${u.menteeProfile.targetRole}`
                    : undefined),
                href: `/dashboard/admin/users/${u.id}`,
              }}
            />
          ))}
        </EntityCardGrid>
      )}
    </div>
  );
}
