import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function FilterBar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  filterOptions,
  placeholder = "Search leads...",
}: {
  search: string;
  onSearchChange: (v: string) => void;
  filter: string;
  onFilterChange: (v: string) => void;
  filterOptions: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-primary/8 bg-white p-4 shadow-subtle sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className={cn(
          "h-10 rounded-sm border border-primary/15 bg-white px-3 text-sm shadow-subtle",
          "transition-all duration-200 hover:border-primary/25 hover:shadow-card focus:ring-2 focus:ring-accent/40"
        )}
      >
        {filterOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-primary/15 bg-white px-6 py-16 text-center shadow-subtle">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5">
        <Search className="h-6 w-6 text-muted" />
      </div>
      <h3 className="font-semibold text-primary">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
