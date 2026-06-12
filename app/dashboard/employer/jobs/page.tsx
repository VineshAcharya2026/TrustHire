"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

type Job = {
  id: string;
  title: string;
  rewardAmount: number;
  isActive: boolean;
  _count: { referrals: number };
};

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    fetch("/api/employer/jobs").then((r) => r.json()).then(setJobs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Job Postings</h1>
        <Button variant="accent" asChild className="hover-lift">
          <Link href="/dashboard/employer/jobs/new">
            <Plus className="h-4 w-4" /> New job
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <Link key={job.id} href={`/dashboard/employer/jobs/${job.id}`}>
            <Card className="h-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <CardHeader>
                <CardTitle className="text-base">{job.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between text-sm">
                <span className="font-semibold text-accent">{formatCurrency(job.rewardAmount)} bounty</span>
                <span className="text-muted">{job._count.referrals} referrals</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
