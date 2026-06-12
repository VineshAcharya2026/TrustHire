"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfigPage() {
  const [config, setConfig] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/config").then((r) => r.json()).then(setConfig);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
  }

  const fields = [
    { key: "day_30_pct", label: "Day 30 %" },
    { key: "day_60_pct", label: "Day 60 %" },
    { key: "day_90_pct", label: "Day 90 %" },
    { key: "max_referrals_per_day", label: "Max referrals/day" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Platform Config</h1>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Reward & rate limits</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            {fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label>{f.label}</Label>
                <Input
                  value={config[f.key] || ""}
                  onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })}
                />
              </div>
            ))}
            <Button type="submit" variant="accent">Save changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
