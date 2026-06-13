import Link from "next/link";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/referral-utils";
import { ArrowRight, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type UserCardData = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  companyName?: string;
  href: string;
};

export function UserCard({ user }: { user: UserCardData }) {
  const initials = getInitials(user.name);

  return (
    <Link href={user.href} className="group block">
      <article
        className={cn(
          "relative overflow-hidden rounded-xl border border-primary/8 bg-white p-5 shadow-card",
          "transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-card-hover"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent/80 to-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-sm font-bold text-primary ring-1 ring-primary/10 transition-all group-hover:bg-accent/20">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-primary">{user.name}</h3>
                <p className="mt-0.5 truncate text-xs text-muted">{user.email}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="accent">{user.role}</Badge>
                <Badge>{user.status}</Badge>
              </div>
            </div>
            {user.companyName && (
              <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                <Building2 className="h-3 w-3" />
                {user.companyName}
              </p>
            )}
          </div>
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100" />
        </div>
      </article>
    </Link>
  );
}
