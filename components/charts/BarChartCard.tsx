"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function BarChartCard({
  title,
  data,
  dataKey = "count",
  nameKey = "name",
}: {
  title: string;
  data: { name: string; count: number }[];
  dataKey?: string;
  nameKey?: string;
}) {
  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2E10" />
              <XAxis dataKey={nameKey} tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #1A1A2E15",
                  boxShadow: "0 2px 8px rgb(26 26 46 / 0.08)",
                }}
              />
              <Bar dataKey={dataKey} fill="#E8B84B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
