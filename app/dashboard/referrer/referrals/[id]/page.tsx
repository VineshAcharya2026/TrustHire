"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LeadOverviewHeader, InfoPanel, InfoRow } from "@/components/referrals/LeadOverview";
import { ReferralTimeline } from "@/components/referrals/ReferralTimeline";
import { Alert } from "@/components/ui/alert";
import { fetchJson } from "@/lib/api-utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ReferralStatus } from "@prisma/client";
import { Building2, Calendar, IndianRupee, Mail } from "lucide-react";

type Referral = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  status: ReferralStatus;
  submittedAt: string;
  job: { title: string; rewardAmount: number; employer: { companyName: string } };
};

export default function ReferrerReferralOverviewPage() {
  const { id } = useParams();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<Referral>(`/api/referrer/referrals/${id}`).then(({ data, error: err }) => {
      setLoading(false);
      if (err) setError(err);
      else if (data) setReferral(data);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 rounded-lg bg-primary/5" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-64 rounded-lg bg-primary/5 lg:col-span-2" />
          <div className="h-64 rounded-lg bg-primary/5" />
        </div>
      </div>
    );
  }

  if (error || !referral) {
    return <Alert variant="error">{error || "Referral not found"}</Alert>;
  }

  return (
    <div className="space-y-6">
      <LeadOverviewHeader
        candidateName={referral.candidateName}
        status={referral.status}
        subtitle={`${referral.job.title} at ${referral.job.employer.companyName}`}
        backHref="/dashboard/referrer/referrals"
        backLabel="Back to my referrals"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReferralTimeline currentStatus={referral.status} />
        </div>

        <InfoPanel title="Candidate">
          <InfoRow label="Email" value={referral.candidateEmail} icon={<Mail className="h-3.5 w-3.5" />} />
          <InfoRow
            label="Company"
            value={referral.job.employer.companyName}
            icon={<Building2 className="h-3.5 w-3.5" />}
          />
          <InfoRow label="Role" value={referral.job.title} />
          <InfoRow
            label="Bounty"
            value={formatCurrency(referral.job.rewardAmount)}
            icon={<IndianRupee className="h-3.5 w-3.5" />}
          />
          <InfoRow
            label="Submitted"
            value={formatDate(referral.submittedAt)}
            icon={<Calendar className="h-3.5 w-3.5" />}
          />
        </InfoPanel>
      </div>
    </div>
  );
}
