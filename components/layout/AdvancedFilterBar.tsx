"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, Search, X } from "lucide-react";

export type AdvancedFilterValues = {
  q: string;
  company: string[];
  skills: string[];
  role: string[];
  status: string;
  minBounty: string;
  maxBounty: string;
};

export const emptyFilters: AdvancedFilterValues = {
  q: "",
  company: [],
  skills: [],
  role: [],
  status: "",
  minBounty: "",
  maxBounty: "",
};

type FilterOptions = {
  companies: string[];
  skills: string[];
  roles: string[];
};

export function AdvancedFilterBar({
  values,
  onChange,
  onApply,
  onClear,
  showStatus = false,
  showBounty = true,
  searchPlaceholder = "Search...",
  statusOptions = [],
}: {
  values: AdvancedFilterValues;
  onChange: (v: AdvancedFilterValues) => void;
  onApply: () => void;
  onClear: () => void;
  showStatus?: boolean;
  showBounty?: boolean;
  searchPlaceholder?: string;
  statusOptions?: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<FilterOptions>({ companies: [], skills: [], roles: [] });

  useEffect(() => {
    fetch("/api/filters/options")
      .then((r) => r.json())
      .then(setOptions)
      .catch(() => {});
  }, []);

  function toggleInList(key: "company" | "skills" | "role", item: string) {
    const list = values[key];
    const next = list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
    onChange({ ...values, [key]: next });
  }

  const activeCount =
    (values.q ? 1 : 0) +
    values.company.length +
    values.skills.length +
    values.role.length +
    (values.status ? 1 : 0) +
    (values.minBounty ? 1 : 0) +
    (values.maxBounty ? 1 : 0);

  return (
    <div className="rounded-xl border border-primary/8 bg-white/90 shadow-subtle backdrop-blur-sm">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={values.q}
            onChange={(e) => onChange({ ...values, q: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && onApply()}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(!open)}>
            <Filter className="h-4 w-4" />
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </Button>
          <Button type="button" variant="accent" size="sm" onClick={onApply}>
            Apply
          </Button>
          {activeCount > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={onClear}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {open && (
        <div className="grid gap-4 border-t border-primary/8 p-4 md:grid-cols-2 lg:grid-cols-3">
          <FilterChipGroup
            label="Company"
            items={options.companies}
            selected={values.company}
            onToggle={(item) => toggleInList("company", item)}
          />
          <FilterChipGroup
            label="Role / Job title"
            items={options.roles}
            selected={values.role}
            onToggle={(item) => toggleInList("role", item)}
          />
          <FilterChipGroup
            label="Skills"
            items={options.skills}
            selected={values.skills}
            onToggle={(item) => toggleInList("skills", item)}
          />

          {showStatus && statusOptions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted">Status</Label>
              <select
                value={values.status}
                onChange={(e) => onChange({ ...values, status: e.target.value })}
                className="h-10 w-full rounded-md border border-primary/15 bg-white px-3 text-sm"
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showBounty && (
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label className="text-xs uppercase tracking-wider text-muted">Bounty range (₹)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={values.minBounty}
                  onChange={(e) => onChange({ ...values, minBounty: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={values.maxBounty}
                  onChange={(e) => onChange({ ...values, maxBounty: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {activeCount > 0 && !open && (
        <div className="flex flex-wrap gap-2 border-t border-primary/8 px-4 py-2">
          {values.q && <ActiveChip label={`"${values.q}"`} onRemove={() => onChange({ ...values, q: "" })} />}
          {values.company.map((c) => (
            <ActiveChip key={c} label={c} onRemove={() => toggleInList("company", c)} />
          ))}
          {values.role.map((r) => (
            <ActiveChip key={r} label={r} onRemove={() => toggleInList("role", r)} />
          ))}
          {values.skills.map((s) => (
            <ActiveChip key={s} label={s} onRemove={() => toggleInList("skills", s)} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChipGroup({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted">{label}</Label>
      <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto rounded-md border border-primary/8 bg-surface p-2">
        {items.length === 0 ? (
          <span className="text-xs text-muted">No options yet</span>
        ) : (
          items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                selected.includes(item)
                  ? "bg-primary text-white"
                  : "bg-white text-muted ring-1 ring-primary/10 hover:text-primary"
              )}
            >
              {item}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-primary">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-error">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export function filtersToParams(values: AdvancedFilterValues): URLSearchParams {
  const params = new URLSearchParams();
  if (values.q) params.set("q", values.q);
  if (values.company.length) params.set("company", values.company.join(","));
  if (values.skills.length) params.set("skills", values.skills.join(","));
  if (values.role.length) params.set("role", values.role.join(","));
  if (values.status) params.set("status", values.status);
  if (values.minBounty) params.set("minBounty", values.minBounty);
  if (values.maxBounty) params.set("maxBounty", values.maxBounty);
  return params;
}
