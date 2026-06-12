import React, { useState } from "react";
import { 
  UserProfile, 
  JobListing, 
  Referral, 
  RewardRecord, 
  BlacklistItem, 
  SystemLog, 
  PlatformConfig,
  UserRole,
  AccountStatus,
  MilestoneStatus,
  ReferralStatus,
  RewardStatus
} from "../types";
import { 
  ShieldAlert, 
  UserCheck, 
  Lock, 
  TrendingUp, 
  Grid, 
  Sliders, 
  ClipboardList, 
  UserX, 
  Banknote, 
  Check, 
  X, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Database,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ThumbsUp,
  Award,
  BookOpen
} from "lucide-react";

interface AdminProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  jobs: JobListing[];
  referrals: Referral[];
  rewards: RewardRecord[];
  blacklists: BlacklistItem[];
  logs: SystemLog[];
  config: PlatformConfig;
  onVerifyUser: (userId: string) => void;
  onSuspendUser: (userId: string, reason: string) => void;
  onReactivateUser: (userId: string) => void;
  onUpdateQualityScore: (userId: string, score: number) => void;
  onProcessAdminPayout: (rewardId: string, milestoneIdx: number, action: "RELEASE" | "HOLD" | "DISPUTE") => void;
  onResolveDispute: (rewardId: string, resolution: "RELEASE_ALL" | "CANCEL_REWARD" | "KEEP_AS_IS", resolutionNotes: string) => void;
  onOverrideDuplicate: (referralId: string) => void;
  onAddBlacklist: (value: string, type: "Email" | "Domain" | "Phone", reason: string) => void;
  onRemoveBlacklist: (id: string) => void;
  onUpdateConfig: (milestoneDays: number[], milestonePercentages: number[], maxReferralsPerDay: number) => void;
  onResetFactorySeed: () => void;
}

export default function AdminDashboard({
  currentUser,
  allUsers,
  jobs,
  referrals,
  rewards,
  blacklists,
  logs,
  config,
  onVerifyUser,
  onSuspendUser,
  onReactivateUser,
  onUpdateQualityScore,
  onProcessAdminPayout,
  onResolveDispute,
  onOverrideDuplicate,
  onAddBlacklist,
  onRemoveBlacklist,
  onUpdateConfig,
  onResetFactorySeed
}: AdminProps) {
  // Tabs management
  const [activeTab, setActiveTab] = useState<"users" | "payouts" | "disputes" | "blacklist" | "config" | "logs">("users");

  // Local config edits
  const [cfgDays, setCfgDays] = useState(config.milestoneDays.join(", "));
  const [cfgPercentages, setCfgPercentages] = useState(config.milestonePercentages.join(", "));
  const [cfgLimit, setCfgLimit] = useState(config.maxReferralsPerDay);

  // Blacklist form state
  const [blValue, setBlValue] = useState("");
  const [blType, setBlType] = useState<"Email" | "Domain" | "Phone">("Email");
  const [blReason, setBlReason] = useState("");

  // Search query for audit log
  const [searchLog, setSearchLog] = useState("");
  const [logFilter, setLogFilter] = useState<string>("ALL");

  // Moderate user dialog tracking
  const [toggleQualityUserId, setToggleQualityUserId] = useState<string | null>(null);
  const [tempScore, setTempScore] = useState(80);

  // Dispute resolution selection status
  const [arbitratingRewardId, setArbitratingRewardId] = useState<string | null>(null);
  const [arbitrationModel, setArbitrationModel] = useState<"RELEASE_ALL" | "CANCEL_REWARD">("RELEASE_ALL");
  const [arbitrationNotes, setArbitrationNotes] = useState("");

  const pendingApprovalsUsers = allUsers.filter((u) => u.status === AccountStatus.PendingApproval || !u.verified);
  const coreVerifiedReferrers = allUsers.filter((u) => u.role === UserRole.Referrer);

  const filterLogs = logs.filter((l) => {
    const matchSearch = l.description.toLowerCase().includes(searchLog.toLowerCase()) || l.userEmail.toLowerCase().includes(searchLog.toLowerCase());
    const matchFilter = logFilter === "ALL" || l.eventType === logFilter;
    return matchSearch && matchFilter;
  });

  const handleUpdateConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const daysArr = cfgDays.split(",").map(num => parseInt(num.trim())).filter(n => !isNaN(n));
    const pctArr = cfgPercentages.split(",").map(num => parseInt(num.trim())).filter(n => !isNaN(n));

    // Simple validation: sum must match 100
    const sumPct = pctArr.reduce((a, b) => a + b, 0);
    if (sumPct !== 100) {
      alert(`Milestone splits must sum exactly to 100%. (Current sum: ${sumPct}%)`);
      return;
    }
    if (daysArr.length !== pctArr.length) {
      alert("Milestone days count and split percentages count must match exactly.");
      return;
    }

    onUpdateConfig(daysArr, pctArr, cfgLimit);
    alert("Platform parameters updated in central database. Applied successfully!");
  };

  const handleAddBlacklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blValue || !blReason) {
      alert("Please designate a blacklist target and reason.");
      return;
    }
    onAddBlacklist(blValue, blType, blReason);
    setBlValue("");
    setBlReason("");
  };

  return (
    <div className="space-y-6" id="admin-dashboard-container">
      
      {/* Tab select indicators */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white p-2 rounded-xl border border-slate-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)]">
        {([
          { id: "users", label: "User Control & Verification", icon: UserCheck },
          { id: "payouts", label: "Escrow & Milestone Releases", icon: Banknote },
          { id: "disputes", label: "Dispute Arbitrator", icon: AlertTriangle },
          { id: "blacklist", label: "Security & Fraud Blacklist", icon: ShieldAlert },
          { id: "config", label: "System Config Adjusters", icon: Sliders },
          { id: "logs", label: "Production System Audit Trail", icon: ClipboardList }
        ] as const).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm font-bold scale-102"
                  : "text-slate-650 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TABS CONTAINER */}
      <div className="space-y-6">

        {/* TAB 1: USERS */}
        {activeTab === "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="admin-users-tab">
            {/* Approvals Section */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-xs">
                <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  Registrations Approvals Queue
                </h3>
                <p className="text-xs text-slate-500 mt-1">Review registering employers and confirm eligibility to submit open job bounties.</p>
                
                <div className="mt-4 space-y-3">
                  {pendingApprovalsUsers.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 font-mono bg-slate-50/50 rounded-xl border border-slate-150">
                      Zero pending corporate registration audits.
                    </div>
                  ) : (
                    pendingApprovalsUsers.map((user) => (
                      <div key={user.id} className="p-3 bg-amber-50/25 border border-amber-200/60 rounded-xl space-y-2">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                          <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.2 rounded-md font-bold uppercase tracking-wider font-mono">
                            {user.role} pending Verification
                          </span>
                        </div>
                        <div className="flex gap-2 pt-1 border-t border-amber-200/20">
                          <button
                            onClick={() => onVerifyUser(user.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-2.5 rounded-lg text-[10px] cursor-pointer flex-1 flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Approve Acc
                          </button>
                          <button
                            onClick={() => onSuspendUser(user.id, "Platform administrator denied corporate application.")}
                            className="bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold py-1 px-2.5 rounded-lg text-[10px] cursor-pointer flex-1 flex items-center justify-center gap-1"
                          >
                            <X className="w-3 h-3" /> Decline
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Duplicate check override panel */}
              <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-xs">
                <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-600" />
                  Referral Duplicate Overrides
                </h3>
                <p className="text-xs text-slate-500 mt-1">Review duplicates flagged by auto-validation. Click Override to whitelist manually and allocate correct reward priority.</p>
                
                <div className="mt-4 space-y-3">
                  {referrals.filter((r) => r.duplicateFlag).length === 0 ? (
                    <p className="text-xs text-slate-400 italic font-mono text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-150">No flagged duplicates active.</p>
                  ) : (
                    referrals.filter((r) => r.duplicateFlag).map((dup) => (
                      <div key={dup.id} className="p-3 border border-rose-100 bg-rose-50/10 rounded-xl space-y-1.5">
                        <div className="flex justify-between items-start text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{dup.candidateName}</p>
                            <span className="text-[10px] text-slate-400 font-mono">By Referrer ID {dup.referrerId}</span>
                          </div>
                          <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-md font-mono">FLAGGED</span>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-normal">
                          Matches candidate credentials under earlier Submission Ref ID {dup.duplicateReferralId || "Default"}.
                        </p>
                        <button
                          onClick={() => {
                            const confirm = window.confirm(`Override duplicate flag for ${dup.candidateName}? This will permit this referrer to lock milestones bonuses as well.`);
                            if (confirm) onOverrideDuplicate(dup.id);
                          }}
                          className="w-full bg-slate-900 text-white rounded-lg py-1 px-2 font-semibold text-[10px] hover:bg-slate-800 cursor-pointer"
                        >
                          Manual Override Flag
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Moderation section and Referrer scoring */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/85 p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-900">Platform Accounts Management Workspace</h3>
                    <p className="text-xs text-slate-500">Edit member standings, adjust suspension statuses, and audit internal metrics scores.</p>
                  </div>
                  <button
                    onClick={() => {
                      const ans = window.confirm("Reset data models in LocalStorage to default factory seeds? Useful to restore demonstration workflows.");
                      if (ans) onResetFactorySeed();
                    }}
                    className="p-1 px-3 text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center gap-1 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Simulated DB
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-550 border-b border-slate-200 font-mono">
                        <th className="p-3">User & Organization</th>
                        <th className="p-3">Role Type</th>
                        <th className="p-3 text-center">Quality Score (Admin Only)</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Moderator Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <p className="font-bold text-slate-850">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
                          </td>
                          <td className="p-3">
                            <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold font-mono">
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {user.role === UserRole.Referrer ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                                  {user.qualityScore}% Quality
                                </span>
                                <button
                                  onClick={() => {
                                    setToggleQualityUserId(user.id);
                                    setTempScore(user.qualityScore);
                                  }}
                                  className="text-[9px] text-indigo-600 font-semibold hover:underline cursor-pointer"
                                >
                                  Adjust Metric
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-350">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              user.status === AccountStatus.Active ? "bg-emerald-100 text-emerald-800" :
                              user.status === AccountStatus.Suspended ? "bg-rose-100 text-rose-800" :
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              {user.status === AccountStatus.Active ? (
                                <button
                                  onClick={() => {
                                    const reason = prompt(`Suspend account: ${user.name}? State reasons for suspension audit log:`, "Abusing duplicate candidate listings.");
                                    if (reason) onSuspendUser(user.id, reason);
                                  }}
                                  className="p-1 px-2 hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                                >
                                  <UserX className="w-3 h-3" /> Suspend
                                </button>
                              ) : (
                                <button
                                  disabled={user.role === UserRole.Admin}
                                  onClick={() => onReactivateUser(user.id)}
                                  className="p-1 px-2 hover:bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-lg text-[10px] font-semibold cursor-pointer disabled:opacity-50"
                                >
                                  Reactivate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Secret quality rating modifier floating box/subform */}
                {toggleQualityUserId && (
                  <div className="mt-5 p-4 bg-indigo-50/40 border border-indigo-200 rounded-2xl">
                    <p className="text-xs font-bold text-slate-800 font-display">Configure Referrer Quality Index Score</p>
                    <p className="text-[10px] text-slate-500 mb-2.5">
                      "Internal-only quality score visible to admin only. Not exposed to employers or referrers." - Used for auditing, cheat prevention, and prioritization.
                    </p>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={tempScore}
                        onChange={(e) => setTempScore(parseInt(e.target.value) || 70)}
                        className="flex-1 accent-indigo-600"
                      />
                      <span className="font-mono text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md">{tempScore}% score</span>
                      <button
                        onClick={() => {
                          onUpdateQualityScore(toggleQualityUserId, tempScore);
                          setToggleQualityUserId(null);
                        }}
                        className="bg-indigo-600 text-white rounded-lg text-[10px] px-3.5 py-1.5 font-semibold hover:bg-indigo-700 cursor-pointer"
                      >
                        Commit Score
                      </button>
                      <button
                        onClick={() => setToggleQualityUserId(null)}
                        className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYOUTS */}
        {activeTab === "payouts" && (
          <div className="bg-white rounded-2xl border border-slate-200/85 p-6 shadow-xs" id="admin-payouts-tab">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">Bounty Escrow & Milestone Release Ledger</h3>
              <p className="text-xs text-slate-500 mt-1">
                Release milestone shares, suspend accounts, under-represent audits, and manage payout pipelines. 
                <span className="font-semibold text-indigo-600"> Only Active Admins can approve releases.</span>
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {rewards.length === 0 ? (
                <div className="text-center py-12 text-slate-400 border border-slate-150 rounded-xl">
                  No escrow liabilities logged.
                </div>
              ) : (
                rewards.map((reward) => {
                  return (
                    <div key={reward.id} className="border border-slate-200/80 bg-slate-50/20 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-150 pb-3 text-xs">
                      <div>
                        <h4 className="font-extrabold text-slate-900">Hired Developer: {reward.candidateName}</h4>
                        <p className="text-slate-500">Position: {reward.jobTitle} at {reward.companyName} • Total Escrow: <span className="font-bold text-slate-800">${reward.totalAmount}</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-md uppercase">
                          Liability status: {reward.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {reward.milestones.map((mil, idx) => {
                        const isLocked = mil.status === "Locked";
                        const isEligible = mil.status === "Eligible";
                        const isPaid = mil.status === "Paid";
                        const isHold = mil.status === "Hold";

                        return (
                          <div 
                            key={idx} 
                            className={`p-4 rounded-xl border flex flex-col justify-between ${
                              isPaid ? "bg-emerald-50/10 border-emerald-200" :
                              isEligible ? "bg-amber-50/10 border-amber-200 animate-pulse" :
                              isHold ? "bg-rose-50/10 border-rose-200" :
                              "bg-white border-slate-200"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-850">{mil.days}-Day Retention Milestone</span>
                                <span className="font-mono text-[10px] font-bold text-slate-550">${mil.amount}</span>
                              </div>
                              <p className="text-[10px] text-slate-450 font-mono">Split Percent: {mil.percentage}%</p>
                              <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase font-mono">
                                <span className={`w-2 h-2 rounded-full ${
                                  isPaid ? "bg-emerald-500" :
                                  isEligible ? "bg-amber-400" :
                                  isHold ? "bg-rose-500" :
                                  "bg-slate-450"
                                }`}></span>
                                <span className="text-slate-550">{mil.status}</span>
                              </div>
                            </div>

                            <div className="mt-4 pt-3.5 border-t border-slate-100 gap-2 flex flex-col">
                              {isLocked && (
                                <p className="text-[10px] text-slate-400 italic text-center py-1 bg-slate-100 rounded-md">
                                  Running Candidate Onboarding
                                </p>
                              )}

                              {isEligible && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      const confirm = window.confirm(`Release Day ${mil.days} payment warrant ($${mil.amount}) for ${reward.candidateName}?`);
                                      if (confirm) onProcessAdminPayout(reward.id, idx, "RELEASE");
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-2 rounded-lg text-[10px] flex-1 cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Approve & Payout
                                  </button>
                                  <button
                                    onClick={() => {
                                      const ans = window.confirm("Flag this reward split in DISPUTED state? Employer retention check will freeze.");
                                      if (ans) onProcessAdminPayout(reward.id, idx, "DISPUTE");
                                    }}
                                    className="bg-rose-100 border border-rose-200 text-rose-700 hover:bg-rose-200 font-semibold py-1.5 px-2 rounded-lg text-[10px] shrink-0 cursor-pointer"
                                    title="Dispute"
                                  >
                                    Dispute
                                  </button>
                                </div>
                              )}

                              {isPaid && (
                                <div className="text-[9px] text-slate-500 font-mono text-center">
                                  Paid Date: {mil.approvedDate ? new Date(mil.approvedDate).toLocaleDateString() : "2026-06-01"}
                                </div>
                              )}

                              {isHold && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => onProcessAdminPayout(reward.id, idx, "RELEASE")}
                                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg py-1 px-2 flex-1 text-[10px] font-bold cursor-pointer"
                                  >
                                    Force Release
                                  </button>
                                  <button
                                    onClick={() => {
                                      setArbitratingRewardId(reward.id);
                                      setArbitrationNotes("");
                                      setActiveTab("disputes");
                                    }}
                                    className="bg-white border text-indigo-700 border-indigo-200 rounded-lg py-1 px-2 flex-1 text-[10px] font-semibold cursor-pointer text-center"
                                  >
                                    Arbitrate Dispute
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>
        )}

        {/* TAB 3: DISPUTES */}
        {activeTab === "disputes" && (
          <div className="bg-white rounded-2xl border border-slate-200/85 p-6 shadow-xs" id="admin-disputes-tab">
            <h3 className="text-base font-bold font-display text-slate-900">Dispute & Escalations Arbitrator Case Center</h3>
            <p className="text-xs text-slate-500 mt-1">Review locked payouts flagged as under dispute. Settle cases by completing manual payouts or canceling rewards.</p>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cases List */}
              <div className="lg:col-span-1 space-y-4">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">Disputed Payout Cases</p>
                {rewards.filter((r) => r.status === RewardStatus.Disputed || r.status === RewardStatus.OnHold).length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 bg-slate-50 border rounded-xl text-center">No active disputes logged.</p>
                ) : (
                  rewards.filter((r) => r.status === RewardStatus.Disputed || r.status === RewardStatus.OnHold).map((disCase) => (
                    <button
                      key={disCase.id}
                      onClick={() => {
                        setArbitratingRewardId(disCase.id);
                        setArbitrationNotes("");
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        arbitratingRewardId === disCase.id 
                          ? "border-indigo-600 bg-indigo-50/20" 
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <h4 className="text-xs font-bold text-slate-900">Developer: {disCase.candidateName}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{disCase.companyName} • {disCase.jobTitle}</p>
                      <div className="flex justify-between items-center mt-3 text-[10px] font-mono">
                        <span className="text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-md font-bold">DISPUTED</span>
                        <span className="font-bold text-slate-700">${disCase.totalAmount} Reward</span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Resolution Form */}
              <div className="lg:col-span-2">
                {arbitratingRewardId ? (
                  (() => {
                    const matchedRev = rewards.find((r) => r.id === arbitratingRewardId);
                    if (!matchedRev) return null;

                    return (
                      <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                        <div>
                          <span className="text-[9px] font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-bold uppercase">Case details: {matchedRev.id}</span>
                          <h4 className="text-sm font-bold text-slate-950 mt-1">Resolution Hearing for candidate: {matchedRev.candidateName}</h4>
                          <p className="text-xs text-slate-500">Employer: {matchedRev.companyName} • Expected Recipient Referrer: User ID {matchedRev.referrerId}</p>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 text-xs">
                          <p className="font-bold text-slate-800">Current Reward ledger:</p>
                          <p className="text-slate-655 font-mono">Total committed: ${matchedRev.totalAmount}</p>
                          <p className="text-slate-655 font-mono">Released so far: ${matchedRev.releasedAmount}</p>
                          <p className="text-slate-655 font-mono">Remaining closed: ${matchedRev.lockedAmount}</p>
                        </div>

                        <div className="space-y-3">
                          <p className="text-xs font-bold text-slate-850">Select Final Arbitration Decree *</p>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() => setArbitrationModel("RELEASE_ALL")}
                              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                arbitrationModel === "RELEASE_ALL" 
                                  ? "border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-500/10" 
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <p className="text-xs font-bold text-emerald-850">Release All Reserves</p>
                              <span className="text-[10px] text-slate-500">Overrule corporate objections! Pay total remaining reserves of ${matchedRev.lockedAmount} to Referrer.</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setArbitrationModel("CANCEL_REWARD")}
                              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                arbitrationModel === "CANCEL_REWARD" 
                                  ? "border-rose-600 bg-rose-50/20 ring-2 ring-rose-500/10" 
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <p className="text-xs font-bold text-rose-850">Freeze & Void Remaining</p>
                              <span className="text-[10px] text-slate-500">Milestone parameters failed retention checks. Void remaining locked reserves of ${matchedRev.lockedAmount}.</span>
                            </button>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Arbitration Resolution Review Log</label>
                            <textarea
                              required
                              value={arbitrationNotes}
                              onChange={(e) => setArbitrationNotes(e.target.value)}
                              placeholder="Record official justifications for the audit trail: e.g. Freelancer left at Day 45, validating only Partial 30-Day milestone."
                              rows={3}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:bg-white"
                            ></textarea>
                          </div>

                          <div className="flex justify-end gap-3 pt-3 border-t">
                            <button
                              type="button"
                              onClick={() => setArbitratingRewardId(null)}
                              className="px-4 py-2 hover:bg-slate-100 rounded-xl text-xs text-slate-650 cursor-pointer font-semibold"
                            >
                              Dismiss Case
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!arbitrationNotes) {
                                  alert("Please specify official audit resolution details first.");
                                  return;
                                }
                                onResolveDispute(matchedRev.id, arbitrationModel, arbitrationNotes);
                                setArbitratingRewardId(null);
                              }}
                              className="bg-indigo-650 hover:bg-indigo-700 bg-indigo-600 text-white font-semibold py-2 px-5 rounded-xl text-xs cursor-pointer"
                            >
                              Execute Decree
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="py-16 text-slate-400 border border-dashed rounded-2xl text-center bg-slate-50 text-xs">
                    <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    Select an active disputed case from the side pane to write arbitrations.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BLACKLIST */}
        {activeTab === "blacklist" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="admin-blacklist-tab">
            {/* Create form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-xs">
                <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-indigo-600" />
                  Add Blacklist Metric
                </h3>
                <p className="text-xs text-slate-500 mt-1">Submit blacklisted values. The application layer checks these targets to instantly block duplicate/scraper registrations.</p>

                <form onSubmit={handleAddBlacklistSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Identifier Type</label>
                    <select
                      value={blType}
                      onChange={(e) => setBlType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white"
                    >
                      <option value="Email">Email Address</option>
                      <option value="Phone">Phone Number</option>
                      <option value="Domain">Email Domain (e.g. cheat.com)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Identifiers Value *</label>
                    <input
                      type="text"
                      required
                      value={blValue}
                      onChange={(e) => setBlValue(e.target.value)}
                      placeholder={blType === "Email" ? "scam@gmail.com" : blType === "Domain" ? "scammer.com" : "+15550009999"}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Justification Reason *</label>
                    <textarea
                      required
                      value={blReason}
                      onChange={(e) => setBlReason(e.target.value)}
                      placeholder="e.g. Scraper address spamming mock candidates resumes."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-semibold cursor-pointer text-center"
                  >
                    Block Identifier
                  </button>
                </form>
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-xs">
                <h3 className="text-base font-bold font-display text-slate-900 border-b border-rose-100 pb-3 mb-4">
                  Active Blacklisted Guard Parameters
                </h3>
                
                {blacklists.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-8">Zero blacklists configured.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-500">
                          <th className="p-3">Target Value</th>
                          <th className="p-3">Block Type</th>
                          <th className="p-3">Incident Reason Log</th>
                          <th className="p-3">Banned Date</th>
                          <th className="p-3 text-right">Action Target</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {blacklists.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold font-mono text-rose-700">{item.value}</td>
                            <td className="p-3">
                              <span className="font-mono bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.2 rounded-md font-bold text-[10px]">
                                {item.type}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 max-w-xs">{item.reason}</td>
                            <td className="p-3 text-slate-400 font-mono text-[10px]">{item.dateAdded}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => onRemoveBlacklist(item.id)}
                                className="p-1 px-2.5 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg text-[10px] font-semibold cursor-pointer inline-flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Unban
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONFIG */}
        {activeTab === "config" && (
          <div className="max-w-2xl bg-white rounded-2xl border border-slate-200/85 p-6 shadow-xs" id="admin-config-tab">
            <h3 className="text-base font-bold font-display text-slate-900 border-b pb-3 mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-650" />
              Configure System Metrics splits
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              "The client will provide the specific reward rules (percentages, milestone days) and these will be configurable from the Admin Panel without developer intervention."
            </p>

            <form onSubmit={handleUpdateConfigSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Milestone Days Timeline (comma-separated) *</label>
                  <input
                    type="text"
                    required
                    value={cfgDays}
                    onChange={(e) => setCfgDays(e.target.value)}
                    placeholder="e.g. 30, 60, 90"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Timeline milestones checks in candidate days.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reward splits percentages (comma-separated) *</label>
                  <input
                    type="text"
                    required
                    value={cfgPercentages}
                    onChange={(e) => setCfgPercentages(e.target.value)}
                    placeholder="e.g. 30, 30, 40"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Sum must equal exactly 100%.</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Referrer Daily Submissions Rate Limit *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={cfgLimit}
                  onChange={(e) => setCfgLimit(parseInt(e.target.value) || 5)}
                  className="w-48 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Maximum applications a single Referrer profile can submit per day. Prevents script spam.</span>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold font-display px-5 py-2 rounded-xl text-xs cursor-pointer shadow-md shadow-indigo-100"
                >
                  Save Parameter Adjustments
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: LOGS */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-2xl border border-slate-200/85 p-6 shadow-xs" id="admin-logs-tab">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-4 gap-4">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">Production Audit Logs Telemetry</h3>
                <p className="text-xs text-slate-500">Terminal audit trails indexing all platform-wide system mutations, logins, and releases.</p>
              </div>

              {/* Filtering */}
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="text"
                  placeholder="Filter logs description..."
                  value={searchLog}
                  onChange={(e) => setSearchLog(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border rounded-xl text-xs focus:bg-white w-48"
                />

                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="bg-slate-50 border rounded-xl px-3 py-1.5 text-xs font-mono"
                >
                  <option value="ALL">ALL TYPES</option>
                  <option value="AUTH">AUTH</option>
                  <option value="REFERRAL_SUBMIT">REFERRALS</option>
                  <option value="STAGES">INTERVIEWS</option>
                  <option value="PAYOUT">PAYOUTS</option>
                  <option value="DISPUTE">DISPUTES</option>
                  <option value="MODERATION">MODERATION</option>
                  <option value="CONFIG">CONFIGS</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-950 font-mono text-xs rounded-xl overflow-hidden shadow-inner border border-slate-900">
              <div className="bg-slate-900 text-slate-450 px-4 py-2 border-b border-slate-950 flex items-center justify-between text-[11px]">
                <span>TERMINAL_REPORTER: v1.0.3_SHIELDS_UP</span>
                <span className="text-indigo-400">STATUS: AUDITED</span>
              </div>
              <div className="p-4 space-y-2.5 max-h-[420px] overflow-y-auto">
                {filterLogs.length === 0 ? (
                  <p className="text-slate-500 italic py-4">No matching audit logs.</p>
                ) : (
                  filterLogs.map((log) => (
                    <div key={log.id} className="text-slate-300 leading-relaxed text-[11px]">
                      <span className="text-indigo-400">[{log.timestamp}]</span>{" "}
                      <span className="text-emerald-400 font-bold">({log.eventType})</span>{" "}
                      <span className="text-slate-400">&lt;{log.userEmail}&gt;</span> -{" "}
                      <span className="text-slate-100 font-sans text-xs">{log.description}</span>{" "}
                      <span className="text-[10px] text-slate-500 font-mono">(IP: {log.ipAddress})</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
