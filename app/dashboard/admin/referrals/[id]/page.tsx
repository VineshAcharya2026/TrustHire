"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LeadOverviewHeader, InfoPanel, InfoRow } from "@/components/referrals/LeadOverview";
import { ReferralTimeline } from "@/components/referrals/ReferralTimeline";
import { RewardStatusBadge } from "@/components/referrals/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ReferralStatus, RewardStatus } from "@prisma/client";
import { Building2, Calendar, IndianRupee, Mail, Phone, User } from "lucide-react";

type Referral = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  resumeUrl?: string;
  status: ReferralStatus;
  submittedAt: string;
  updatedAt: string;
  job: { title: string; rewardAmount: number; employer: { companyName: string } };
  referrer: { email: string; profile?: { firstName: string; lastName: string } };
  reward?: {
    status: RewardStatus;
    totalAmount: number;
    releasedAmount: number;
    payouts: { amount: number; status: string }[];
  };
  milestones: { dayMark: number; percentage: number; confirmed: boolean }[];
};

export default function AdminReferralOverviewPage() {
  const { id } = useParams();
  const [referral, setReferral] = useState<Referral | null>(null);

  useEffect(() => {
    fetch(`/api/admin/referrals/${id}`)
      .then((r) => r.json())
      .then(setReferral);
  }, [id]);

  if (!referral?.id) {
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

  const referrerName = referral.referrer.profile
    ? `${referral.referrer.profile.firstName} ${referral.referrer.profile.lastName}`
    : referral.referrer.email;

  return (
    <div className="space-y-6">
      <LeadOverviewHeader
        candidateName={referral.candidateName}
        status={referral.status}
        subtitle={`${referral.job.title} at ${referral.job.employer.companyName}`}
        backHref="/dashboard/admin/referrals"
        backLabel="Back to all leads"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ReferralTimeline currentStatus={referral.status} />

          {referral.reward && (
            <InfoPanel title="Reward overview">
              <div className="mb-4 flex items-center justify-between">
                <RewardStatusBadge status={referral.reward.status} />
                <span className="text-lg font-bold text-accent">
                  {formatCurrency(referral.reward.totalAmount)}
                </span>
              </div>
              <InfoRow label="Released" value={formatCurrency(referral.reward.releasedAmount)} icon={<IndianRupee className="h-3.5 w-3.5" />} />
              <InfoRow label="Payouts" value={referral.reward.payouts.length} />
            </InfoPanel>
          )}
        </div>

        <div className="space-y-6">
          <InfoPanel title="Contact">
            <InfoRow label="Email" value={referral.candidateEmail} icon={<Mail className="h-3.5 w-3.5" />} />
            <InfoRow label="Phone" value={referral.candidatePhone} icon={<Phone className="h-3.5 w-3.5" />} />
            {referral.resumeUrl && (
              <InfoRow
                label="Resume"
                value={
                  <a href={referral.resumeUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                    View file
                  </a>
                }
              />
            )}
          </InfoPanel>

          <InfoPanel title="Referral details">
            <InfoRow label="Referrer" value={referrerName} icon={<User className="h-3.5 w-3.5" />} />
            <InfoRow label="Company" value={referral.job.employer.companyName} icon={<Building2 className="h-3.5 w-3.5" />} />
            <InfoRow label="Bounty" value={formatCurrency(referral.job.rewardAmount)} icon={<IndianRupee className="h-3.5 w-3.5" />} />
            <InfoRow label="Submitted" value={formatDate(referral.submittedAt)} icon={<Calendar className="h-3.5 w-3.5" />} />
            <InfoRow label="Last updated" value={formatDate(referral.updatedAt)} icon={<Calendar className="h-3.5 w-3.5" />} />
          </InfoPanel>
        </div>
      </div>
    </div>
  );
}
