import React from "react";
import { UserRole, UserProfile, Referral, RewardRecord, ReferralStatus, RewardStatus } from "../types";
import { Award, Briefcase, Users, HandCoins, ShieldAlert, ArrowUpRight, TrendingUp, DollarSign } from "lucide-react";

interface StatsProps {
  currentUser: UserProfile;
  referrals: Referral[];
  rewards: RewardRecord[];
  jobsCount: number;
}

export default function DashboardStats({ currentUser, referrals, rewards, jobsCount }: StatsProps) {
  // Referrer calculations
  const myReferrals = referrals.filter((r) => r.referrerId === currentUser.id);
  const myRewards = rewards.filter((r) => r.referrerId === currentUser.id);
  
  const myEarned = myRewards.reduce((sum, r) => sum + r.releasedAmount, 0);
  const myLocked = myRewards.reduce((sum, r) => sum + r.lockedAmount, 0);
  const myHiredCount = myReferrals.filter((r) => r.status === ReferralStatus.Hired).length;

  // Employer calculations
  const myCompanyId = currentUser.companyId;
  const companyReferrals = referrals.filter((r) => {
    // Find job company ID matches my company ID
    return true; // Simple mock, in full app map job to company
  });
  const companyHires = referrals.filter(r => r.status === ReferralStatus.Hired);
  const companyRewards = rewards; // mock

  const totalBountyCommitted = companyRewards.reduce((sum, r) => sum + r.totalAmount, 0);
  const bountyPaid = companyRewards.reduce((sum, r) => sum + r.releasedAmount, 0);
  const bountyOutstanding = totalBountyCommitted - bountyPaid;

  // Admin calculations
  const globalEarned = rewards.reduce((sum, r) => sum + r.releasedAmount, 0);
  const globalLocked = rewards.reduce((sum, r) => sum + r.lockedAmount, 0);
  const globalHires = referrals.filter((r) => r.status === ReferralStatus.Hired).length;
  const duplicateFlagsCount = referrals.filter((r) => r.duplicateFlag).length;

  if (currentUser.role === UserRole.Referrer) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6" id="referrer-stats-grid">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Bounty Earned</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">${myEarned.toLocaleString()}</h3>
            <span className="text-[10px] text-emerald-600 font-bold font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1.5 inline-block">
              Released & Settled
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shrink-0">
            <DollarSign className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Locked Bounty Escrow</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">${myLocked.toLocaleString()}</h3>
            <span className="text-[10px] text-indigo-600 font-bold font-mono bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 mt-1.5 inline-block">
              In Retention Lock
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 shrink-0">
            <HandCoins className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Total Submissions</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">{myReferrals.length}</h3>
            <span className="text-[10px] text-slate-600 font-bold font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-1.5 inline-block">
              {myReferrals.filter(r => r.duplicateFlag).length} Duplicate Flagged
            </span>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Successful Hires</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">{myHiredCount}</h3>
            <span className="text-[10px] text-amber-600 font-bold font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-150 mt-1.5 inline-block">
              Conversion: {myReferrals.length ? Math.round((myHiredCount / myReferrals.length) * 100) : 0}%
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-605 text-amber-600 rounded-lg border border-amber-100 shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role === UserRole.Employer) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6" id="employer-stats-grid">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Committed Bounty Reserve</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">${totalBountyCommitted.toLocaleString()}</h3>
            <span className="text-[10px] text-amber-600 font-bold font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-150 mt-1.5 inline-block">
              Total Budget Committed
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Released to Referrers</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">${bountyPaid.toLocaleString()}</h3>
            <span className="text-[10px] text-emerald-600 font-bold font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1.5 inline-block">
              Released on Milestones
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Remaining Escrow Lock</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">${bountyOutstanding.toLocaleString()}</h3>
            <span className="text-[10px] text-indigo-600 font-bold font-mono bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 mt-1.5 inline-block">
              Retained in Lock
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 shrink-0">
            <HandCoins className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Active Vacancies & Hires</p>
            <h3 className="text-xl font-bold font-display text-slate-900 mt-1">{jobsCount} Open / {companyHires.length} Hired</h3>
            <span className="text-[10px] text-indigo-650 font-bold font-mono bg-indigo-50/70 px-2 py-0.5 rounded border border-indigo-100 mt-1.5 inline-block">
              Governance Tracking
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6" id="admin-stats-grid">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.07)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.11)] transition-all duration-300 flex items-center justify-between bg-gradient-to-br from-indigo-50/10 to-white">
        <div>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Platform Released Payouts</p>
          <h3 className="text-2xl font-bold font-display text-indigo-950 mt-1">${globalEarned.toLocaleString()}</h3>
          <span className="text-[10px] text-emerald-600 font-bold font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1.5 inline-flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Released Audit Done
          </span>
        </div>
        <div className="p-3 bg-indigo-600 text-white rounded-lg border border-indigo-700 shadow-md shadow-indigo-100 shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Active Bounty Liability</p>
          <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">${globalLocked.toLocaleString()}</h3>
          <span className="text-[10px] text-indigo-650 font-bold font-mono bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 mt-1.5 inline-block">
            Locked in Smart Escrow
          </span>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 shrink-0">
          <HandCoins className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Platform Successes</p>
          <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">{globalHires} Hires</h3>
          <span className="text-[10px] text-slate-600 font-bold font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-1.5 inline-block">
            {referrals.length} referrals processed
          </span>
        </div>
        <div className="p-3 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 shrink-0">
          <Users className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Duplicate / Security Flags</p>
          <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">{duplicateFlagsCount} Referrals</h3>
          <span className="text-[10px] text-rose-600 font-semibold font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-100 mt-1.5 inline-block">
            Prevented Scrapes/Fraud
          </span>
        </div>
        <div className="p-3 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
