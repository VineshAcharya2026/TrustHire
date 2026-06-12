"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Item = { id: string; type: string; value: string; reason?: string };

export default function BlacklistPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [type, setType] = useState<"EMAIL" | "PHONE" | "DOMAIN">("EMAIL");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");

  const load = () => fetch("/api/admin/blacklist").then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/blacklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value, reason }),
    });
    setValue("");
    setReason("");
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/blacklist/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Blacklist</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={add} className="flex flex-wrap gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "EMAIL" | "PHONE" | "DOMAIN")}
              className="rounded-sm border border-primary/15 px-3 py-2 text-sm"
            >
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
              <option value="DOMAIN">Domain</option>
            </select>
            <Input placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} required className="max-w-xs" />
            <Input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="max-w-xs" />
            <Button type="submit" variant="accent">Add</Button>
          </form>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="hover-lift">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <span className="font-medium">{item.value}</span>
                <span className="ml-2 text-xs text-muted">({item.type})</span>
                {item.reason && <p className="text-sm text-muted">{item.reason}</p>}
              </div>
              <Button size="sm" variant="destructive" onClick={() => remove(item.id)}>Remove</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
