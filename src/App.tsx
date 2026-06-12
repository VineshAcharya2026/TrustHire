import React, { useState, useEffect } from "react";
import { dbStore } from "./dataStore";
import { UserProfile, UserRole, JobListing, Referral, ReferralStatus, RewardRecord, BlacklistItem, NotificationItem, SystemLog, PlatformConfig } from "./types";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import ReferrerDashboard from "./components/ReferrerDashboard";
import EmployerDashboard from "./components/EmployerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import CandidatePortal from "./components/CandidatePortal";
import { Sparkles, ArrowRightLeft, BookOpen, Fingerprint } from "lucide-react";

export default function App() {
  // Sync state with simulated local storage DB
  const [currentUser, setCurrentUser] = useState<UserProfile>(dbStore.users[4]); // Jane Doe default (Referrer)
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [blacklists, setBlacklists] = useState<BlacklistItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [config, setConfig] = useState<PlatformConfig>(dbStore.config);

  // Form banners
  const [refError, setRefError] = useState<string | null>(null);
  const [refSuccess, setRefSuccess] = useState<string | null>(null);

  // Synchronise state hooks with memory database
  const syncWithDb = () => {
    setAllUsers([...dbStore.users]);
    setJobs([...dbStore.jobs]);
    setReferrals([...dbStore.referrals]);
    setRewards([...dbStore.rewards]);
    setBlacklists([...dbStore.blacklists]);
    setNotifications([...dbStore.notifications]);
    setLogs([...dbStore.logs]);
    setConfig({ ...dbStore.config });

    // Ensure currently selected user reference is active
    const freshUser = dbStore.users.find((u) => u.id === currentUser.id);
    if (freshUser) {
      setCurrentUser(freshUser);
    }
  };

  useEffect(() => {
    syncWithDb();
  }, []);

  const handleSwitchUser = (userId: string) => {
    const target = dbStore.users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setRefError(null);
      setRefSuccess(null);
      dbStore.addSystemLog("AUTH", `Persona switched active status to ${target.name} (${target.role})`, target.email);
      syncWithDb();
    }
  };

  const handleMarkAllRead = () => {
    dbStore.notifications.forEach(n => {
      n.read = true;
    });
    dbStore.save();
    syncWithDb();
  };

  const handleClearNotifications = () => {
    dbStore.notifications = [];
    dbStore.save();
    syncWithDb();
  };

  // --- ACTIONS ---

  // Submit candidate referral
  const handleReferralSubmit = (
    jobId: string,
    candidateName: string,
    candidateEmail: string,
    candidatePhone: string,
    notes: string,
    resumeName: string,
    resumeSummary: string
  ) => {
    setRefError(null);
    setRefSuccess(null);

    try {
      dbStore.submitReferral(
        jobId,
        currentUser.id,
        candidateName,
        candidateEmail,
        candidatePhone,
        notes,
        resumeName,
        resumeSummary
      );
      setRefSuccess(`Excellent! Referral of candidate "${candidateName}" registered successfully against listing.`);
      syncWithDb();
    } catch (err: any) {
      setRefError(err.message || "An unexpected validation exception arose.");
    }
  };

  // Employer action: Post a Job
  const handlePostJob = (
    title: string,
    description: string,
    requirements: string[],
    compensation: string,
    rewardAmount: number
  ) => {
    dbStore.postJob(
      currentUser.companyId === "company_stellar" ? "Stellar Tech" : "Acme Corp",
      title,
      description,
      requirements,
      compensation,
      rewardAmount,
      currentUser.id
    );
    syncWithDb();
  };

  // Employer action: progress stage gates
  const handleUpdateStage = (referralId: string, newStage: ReferralStatus, note?: string) => {
    dbStore.updateReferralStage(referralId, newStage, currentUser.id, note);
    syncWithDb();
  };

  // Employer action: Confirm Day 30/60/90 retention met
  const handleConfirmRetention = (rewardId: string, milestoneIdx: number) => {
    dbStore.confirmMilestoneRetention(rewardId, milestoneIdx, currentUser.id);
    syncWithDb();
  };

  // Admin Action: process payouts
  const handleAdminProcessPayout = (rewardId: string, milestoneIdx: number, action: "RELEASE" | "HOLD" | "DISPUTE") => {
    dbStore.processAdminPayout(rewardId, milestoneIdx, currentUser.email, action);
    syncWithDb();
  };

  // Admin Action: arbitrate dispute
  const handleResolveDispute = (rewardId: string, resolution: "RELEASE_ALL" | "CANCEL_REWARD" | "KEEP_AS_IS", resolutionNotes: string) => {
    dbStore.resolveDispute(rewardId, resolution, currentUser.email, resolutionNotes);
    syncWithDb();
  };

  // Admin Action: duplicate override
  const handleOverrideDuplicate = (referralId: string) => {
    dbStore.overrideDuplicateStatus(referralId, currentUser.email);
    syncWithDb();
  };

  // Admin Account controls
  const handleVerifyUser = (userId: string) => {
    dbStore.verifyUser(userId, currentUser.email);
    syncWithDb();
  };

  const handleSuspendUser = (userId: string, reason: string) => {
    dbStore.suspendUser(userId, currentUser.email, reason);
    syncWithDb();
  };

  const handleReactivateUser = (userId: string) => {
    dbStore.reactivateUser(userId, currentUser.email);
    syncWithDb();
  };

  const handleUpdateQualityScore = (userId: string, score: number) => {
    dbStore.updateQualityScore(userId, score, currentUser.email);
    syncWithDb();
  };

  // Blacklist Management
  const handleAddBlacklist = (value: string, type: "Email" | "Domain" | "Phone", reason: string) => {
    dbStore.addBlacklistItem(value, type, reason, currentUser.email);
    syncWithDb();
  };

  const handleRemoveBlacklist = (id: string) => {
    dbStore.removeBlacklistItem(id, currentUser.email);
    syncWithDb();
  };

  // Parameter Configurations Update
  const handleUpdateConfig = (milestoneDays: number[], milestonePercentages: number[], maxReferralsPerDay: number) => {
    dbStore.updateConfig(milestoneDays, milestonePercentages, maxReferralsPerDay, currentUser.email);
    syncWithDb();
  };

  // Reset simulated data
  const handleResetFactorySeed = () => {
    dbStore.clearAllDataForSeeding();
    syncWithDb();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900" id="app-root">
      {/* Header bar and Switcher */}
      <Header
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onClearNotifications={handleClearNotifications}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Banner Alert informing what active view represents */}
        <div className="bg-indigo-900 text-indigo-100 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md shadow-indigo-900/10 border border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-800 rounded-lg shrink-0">
              <Sparkles className="text-amber-400 w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <p className="text-xs font-bold font-mono tracking-wider text-indigo-400 uppercase">ACTIVE TESTING CANVAS: {currentUser.role.toUpperCase()}</p>
              <h2 className="text-sm font-semibold text-white leading-snug">
                Representing user <span className="underline font-bold">{currentUser.name}</span>. 
                {currentUser.role === UserRole.Referrer && " Submit candidate files and track passive milestones income."}
                {currentUser.role === UserRole.Employer && " Create company listings, move interviews, or log retention checks."}
                {currentUser.role === UserRole.Admin && " Settle disputes, bypass flagged duplicates, or modify contract specs."}
                {currentUser.role === UserRole.Candidate && " Search by email to track horizontal recruitment steppers."}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium font-mono text-indigo-300">
            <ArrowRightLeft className="w-4 h-4 shrink-0" />
            <span>Switch persona above to view multi-role interactions!</span>
          </div>
        </div>

        {/* Global Bento Stats Row based on active user role */}
        {currentUser.role !== UserRole.Candidate && (
          <DashboardStats
            currentUser={currentUser}
            referrals={referrals}
            rewards={rewards}
            jobsCount={jobs.length}
          />
        )}

        {/* ACTIVE MODULE VIEWRENDER */}
        <div id="active-dashboard-canvas">
          {currentUser.role === UserRole.Referrer && (
            <ReferrerDashboard
              currentUser={currentUser}
              jobs={jobs}
              referrals={referrals}
              rewards={rewards}
              onSubmitReferral={handleReferralSubmit}
              errorMsg={refError}
              successMsg={refSuccess}
              clearBanners={() => {
                setRefError(null);
                setRefSuccess(null);
              }}
            />
          )}

          {currentUser.role === UserRole.Employer && (
            <EmployerDashboard
              currentUser={currentUser}
              jobs={jobs}
              referrals={referrals}
              rewards={rewards}
              onPostJob={handlePostJob}
              onUpdateStage={handleUpdateStage}
              onConfirmRetention={handleConfirmRetention}
            />
          )}

          {currentUser.role === UserRole.Admin && (
            <AdminDashboard
              currentUser={currentUser}
              allUsers={allUsers}
              jobs={jobs}
              referrals={referrals}
              rewards={rewards}
              blacklists={blacklists}
              logs={logs}
              config={config}
              onVerifyUser={handleVerifyUser}
              onSuspendUser={handleSuspendUser}
              onReactivateUser={handleReactivateUser}
              onUpdateQualityScore={handleUpdateQualityScore}
              onProcessAdminPayout={handleAdminProcessPayout}
              onResolveDispute={handleResolveDispute}
              onOverrideDuplicate={handleOverrideDuplicate}
              onAddBlacklist={handleAddBlacklist}
              onRemoveBlacklist={handleRemoveBlacklist}
              onUpdateConfig={handleUpdateConfig}
              onResetFactorySeed={handleResetFactorySeed}
            />
          )}

          {currentUser.role === UserRole.Candidate && (
            <CandidatePortal
              currentUser={currentUser}
              jobs={jobs}
              referrals={referrals}
              notifications={notifications}
            />
          )}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500 font-mono tracking-wide">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RefBounty Governance Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <Fingerprint className="w-3.5 h-3.5 text-indigo-500" />
              Secure BCrypt-Hashed Hashing
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              SLA Resolution committed (30 Mins Guaranteed)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
