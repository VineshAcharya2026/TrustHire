"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { OverviewHeader } from "@/components/layout/OverviewHeader";
import { InfoPanel, InfoRow } from "@/components/referrals/LeadOverview";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/api-utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Banknote, Building2, Calendar, User } from "lucide-react";

type Payout = {
  id: string;
  amount: number;
  status: string;
  approvedAt?: string;
  note?: string;
  reward: {
    totalAmount: number;
    releasedAmount: number;
    referral: {
      id: string;
      candidateName: string;
      candidateEmail: string;
      job: { title: string; employer: { companyName: string } };
      referrer: { profile?: { firstName: string; lastName: string }; email: string };
    };
    payouts: { id: string; amount: number; status: string; approvedAt?: string }[];
  };
};

export default function AdminPayoutOverviewPage() {
  const { id } = useParams();
  const [payout, setPayout] = useState<Payout | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    fetchJson<Payout>(`/api/admin/payouts/${id}`).then(({ data, error: err }) => {
      if (err) setError(err);
      else if (data) setPayout(data);
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  async function approve() {
    await fetch(`/api/admin/payouts/${id}/approve`, { method: "PATCH" });
    load();
  }

  async function hold() {
    await fetch(`/api/admin/payouts/${id}/hold`, { method: "PATCH" });
    load();
  }

  if (error) return <Alert variant="error">{error}</Alert>;

  if (!payout) {
    return <div className="h-32 animate-pulse rounded-xl bg-primary/5" />;
  }

  const ref = payout.reward.referral;
  const referrerName = ref.referrer.profile
    ? `${ref.referrer.profile.firstName} ${ref.referrer.profile.lastName}`
    : ref.referrer.email;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title={formatCurrency(payout.amount)}
        subtitle={`Payout for ${ref.candidateName} · ${ref.job.title}`}
        backHref="/dashboard/admin/payouts"
        backLabel="Back to payouts"
        icon={<Banknote className="h-7 w-7" />}
        badge={<Badge>{payout.status}</Badge>}
        accent="from-accent via-primary to-accent/30"
        actions={
          payout.status === "PENDING" ? (
            <>
              <Button variant="accent" size="sm" onClick={approve}>Approve payout</Button>
              <Button variant="outline" size="sm" onClick={hold}>Hold</Button>
            </>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <InfoPanel title="Candidate & role">
            <InfoRow label="Candidate" value={ref.candidateName} />
            <InfoRow label="Email" value={ref.candidateEmail} />
            <InfoRow label="Job" value={ref.job.title} />
            <InfoRow label="Company" value={ref.job.employer.companyName} icon={<Building2 className="h-3.5 w-3.5" />} />
            <InfoRow label="Referrer" value={referrerName} icon={<User className="h-3.5 w-3.5" />} />
          </InfoPanel>

          {payout.reward.payouts.length > 0 && (
            <InfoPanel title="Payout history">
              {payout.reward.payouts.map((p) => (
                <InfoRow
                  key={p.id}
                  label={p.status}
                  value={
                    <>
                      {formatCurrency(p.amount)}
                      {p.approvedAt && (
                        <span className="ml-2 text-xs text-muted">{formatDate(p.approvedAt)}</span>
                      )}
                    </>
                  }
                />
              ))}
            </InfoPanel>
          )}
        </div>

        <InfoPanel title="Reward summary">
          <InfoRow label="This payout" value={formatCurrency(payout.amount)} />
          <InfoRow label="Total bounty" value={formatCurrency(payout.reward.totalAmount)} />
          <InfoRow label="Released so far" value={formatCurrency(payout.reward.releasedAmount)} />
          {payout.approvedAt && (
            <InfoRow label="Approved" value={formatDate(payout.approvedAt)} icon={<Calendar className="h-3.5 w-3.5" />} />
          )}
          <div className="mt-4 border-t border-primary/5 pt-4">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={`/dashboard/admin/referrals/${ref.id}`}>View referral overview</Link>
            </Button>
          </div>
        </InfoPanel>
      </div>
    </div>
  );
}
