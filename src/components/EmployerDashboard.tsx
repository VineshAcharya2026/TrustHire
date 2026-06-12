import React, { useState } from "react";
import { UserProfile, JobListing, Referral, ReferralStatus, RewardRecord } from "../types";
import { 
  Building, 
  MapPin, 
  Plus, 
  FileText, 
  Send, 
  Search, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  Award, 
  Check,
  ShieldCheck
} from "lucide-react";

interface EmployerProps {
  currentUser: UserProfile;
  jobs: JobListing[];
  referrals: Referral[];
  rewards: RewardRecord[];
  onPostJob: (
    title: string,
    description: string,
    requirements: string[],
    compensation: string,
    rewardAmount: number
  ) => void;
  onUpdateStage: (referralId: string, newStage: ReferralStatus, note?: string) => void;
  onConfirmRetention: (rewardId: string, milestoneIdx: number) => void;
}

export default function EmployerDashboard({
  currentUser,
  jobs,
  referrals,
  rewards,
  onPostJob,
  onUpdateStage,
  onConfirmRetention
}: EmployerProps) {
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  
  // Job Post States
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCompensation, setNewCompensation] = useState("");
  const [newReward, setNewReward] = useState(3000);
  const [requirementInput, setRequirementInput] = useState("");
  const [reqsList, setReqsList] = useState<string[]>([]);

  // Filtering candidates
  const [candidateFilter, setCandidateFilter] = useState<"All" | ReferralStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter jobs for this specific employer/company if applicable
  const myCompanyId = currentUser.companyId || "company_acme";
  const myCompanyJobs = jobs.filter((j) => j.companyId === myCompanyId);
  const myCompanyJobIds = myCompanyJobs.map((j) => j.id);

  // Group referrals matching company jobs
  const myReferredCandidates = referrals.filter((r) => myCompanyJobIds.includes(r.jobId));
  
  const filteredReferrals = myReferredCandidates.filter((r) => {
    const matchesFilter = candidateFilter === "All" || r.status === candidateFilter;
    const matchesSearch = 
      r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const myCompanyRewards = rewards.filter((r) => myCompanyJobIds.includes(r.jobId));

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setReqsList([...reqsList, requirementInput.trim()]);
      setRequirementInput("");
    }
  };

  const removeRequirement = (idx: number) => {
    setReqsList(reqsList.filter((_, i) => i !== idx));
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newCompensation || newReward <= 0 || reqsList.length === 0) {
      alert("Please configure a valid title, description, budget compensation, and at least 1 requirement.");
      return;
    }

    onPostJob(newTitle, newDesc, reqsList, newCompensation, newReward);
    
    // reset form states
    setNewTitle("");
    setNewDesc("");
    setNewCompensation("");
    setNewReward(3000);
    setReqsList([]);
    setShowPostJobModal(false);
  };

  return (
    <div className="space-y-6" id="employer-dashboard">
      
      {/* Header action panel */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900">Company Portal - {myCompanyJobs[0]?.companyName || "Acme & Associates"}</h2>
          <p className="text-xs text-slate-500">Configure corporate vacancies, audit referred developers, and update recruitment milestone validations.</p>
        </div>
        <button
          onClick={() => setShowPostJobModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-md shadow-indigo-150"
        >
          <Plus className="w-4 h-4" />
          Post New Vacancy
        </button>
      </section>

      {/* Post Job Dialog */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in-50 zoom-in-95 duration-200">
            <h3 className="text-base font-bold font-display text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Add Corporate Job Opportunity
            </h3>
            <form onSubmit={handlePostJobSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Role Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer (Go)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Role Description *</label>
                <textarea
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Responsibilities, stack description..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs focus:bg-white focus:outline-hidden"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Compensation Package *</label>
                  <input
                    type="text"
                    required
                    value={newCompensation}
                    onChange={(e) => setNewCompensation(e.target.value)}
                    placeholder="e.g. $130,000 - $150,000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Referral Reward Bounty ($) *</label>
                  <input
                    type="number"
                    required
                    value={newReward}
                    onChange={(e) => setNewReward(parseInt(e.target.value) || 0)}
                    placeholder="e.g. 5000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Requirements Adder */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Requirements Criteria *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="e.g. 3+ years experience with Kubernetes"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="bg-slate-900 text-white rounded-xl px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                
                {reqsList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-h-24 overflow-y-auto bg-slate-50 p-2 rounded-xl">
                    {reqsList.map((req, idx) => (
                      <span key={idx} className="bg-white border border-slate-200 text-[10px] text-slate-700 px-2 py-1 rounded-md flex items-center gap-1.5">
                        {req}
                        <button type="button" onClick={() => removeRequirement(idx)} className="text-slate-400 hover:text-red-600 font-bold">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-4 py-2 hover:bg-slate-100 rounded-xl text-xs text-slate-600 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Publish Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Referred Candidates Pipeline Review Unit */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">Referred Candidates Inbox</h3>
            <p className="text-xs text-slate-500">Review resumes and progress developers along interview milestones.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden w-48"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
            </div>

            <div className="flex bg-slate-100 rounded-xl p-1 text-[11px] font-medium border border-slate-200">
              {(["All", "Submitted", "Shortlisted", "Interview", "Hired", "Rejected"] as const).map((stage) => (
                <button
                  key={stage}
                  onClick={() => setCandidateFilter(stage)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    candidateFilter === stage 
                      ? "bg-white text-slate-900 shadow-xs font-semibold" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredReferrals.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-150 rounded-xl">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-500">No referred developers found matching metrics</p>
            <p className="text-[11px] text-slate-400">Keep and wait for referrers to pitch outstanding profiles.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReferrals.map((candidate) => {
              const matchedJob = jobs.find((j) => j.id === candidate.jobId);
              
              return (
                <div 
                  key={candidate.id} 
                  className={`border rounded-2xl p-5 ${
                    candidate.status === ReferralStatus.Hired 
                      ? "bg-emerald-50/10 border-emerald-150" 
                      : candidate.status === ReferralStatus.Rejected
                        ? "bg-rose-50/5 border-rose-100"
                        : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    
                    {/* Candidate Info and Resume Summary */}
                    <div className="flex-1 space-y-3.5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400">APPLICATION REFERENCE: {candidate.id}</span>
                          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            {candidate.candidateName}
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              candidate.status === "Hired" ? "bg-emerald-100 text-emerald-800" :
                              candidate.status === "Rejected" ? "bg-rose-100 text-rose-800" :
                              "bg-slate-150 text-slate-700"
                            }`}>
                              {candidate.status}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-600">
                            Applied for <span className="font-semibold text-slate-800">{matchedJob?.title}</span>
                          </p>
                        </div>
                        <div className="text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 text-right">
                          <p className="font-mono text-[9px] text-indigo-500 uppercase font-bold">Assigned Bounty</p>
                          <p className="font-bold text-sm leading-tight">${matchedJob?.rewardAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Resume Box */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-mono text-xs text-slate-700 space-y-2">
                        <p className="font-bold text-slate-850 flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5 uppercase tracking-wide text-[10px]">
                          <FileText className="w-3.5 h-3.5 text-indigo-600" />
                          Attached Resume: {candidate.resumeFileName}
                        </p>
                        <p className="leading-relaxed text-[11px] text-slate-600">
                          {candidate.resumeTextSummary || "No detailed CV summary attached."}
                        </p>
                        {candidate.notes && (
                          <div className="border-t border-dashed border-slate-200 pt-2 text-slate-500 text-[10px] italic">
                            <span className="font-bold block not-italic uppercase tracking-wider text-[9px] text-slate-400 mb-0.5">Referrer Endorsement Notes:</span>
                            "{candidate.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Flow Gates */}
                    <div className="w-full lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-150 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mb-2">Gate Progress Stages</p>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">To progress candidate interviews, toggle stages below.</p>
                      </div>

                      <div className="space-y-2">
                        {candidate.status !== ReferralStatus.Hired && candidate.status !== ReferralStatus.Rejected && (
                          <>
                            {candidate.status === ReferralStatus.Submitted && (
                              <button
                                onClick={() => onUpdateStage(candidate.id, ReferralStatus.Shortlisted, "Verified candidate credentials; moved to shortlist.")}
                                className="w-full bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between"
                              >
                                <span>Approve For Shortlist</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}

                            {candidate.status === ReferralStatus.Shortlisted && (
                              <button
                                onClick={() => onUpdateStage(candidate.id, ReferralStatus.Interview, "CV approved; scheduled panel code-review stage.")}
                                className="w-full bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between"
                              >
                                <span>Schedule Interviews</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}

                            {candidate.status === ReferralStatus.Interview && (
                              <button
                                onClick={() => onUpdateStage(candidate.id, ReferralStatus.Hired, "Interviews completed beautifully. Offer signed! Welcome aboard.")}
                                className="w-full bg-emerald-600 text-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-between shadow-xs shadow-emerald-200"
                              >
                                <span>Confirm & Hire Candidate 🎉</span>
                                <Check className="w-4 h-4 font-bold" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                const reason = prompt("Enter declinature feedback comments:", "Candidate does not possess enough professional React experience.");
                                if (reason) onUpdateStage(candidate.id, ReferralStatus.Rejected, `Discontinued: ${reason}`);
                              }}
                              className="w-full bg-slate-105 border border-slate-200 text-rose-700 rounded-xl px-4 py-2 text-xs font-semibold hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer text-left flex items-center justify-between"
                            >
                              <span>Reject Candidate</span>
                              <XCircle className="w-4 h-4 text-rose-500" />
                            </button>
                          </>
                        )}

                        {candidate.status === ReferralStatus.Hired && (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-850 rounded-xl text-xs flex items-center gap-2 font-medium">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Bounty reward committed! Locked in escrow reserve.</span>
                          </div>
                        )}

                        {candidate.status === ReferralStatus.Rejected && (
                          <div className="p-3 bg-rose-50 border border-slate-250 text-slate-500 rounded-xl text-xs">
                            <p className="font-semibold text-slate-700">Decline logged</p>
                            <span className="text-[11px]">Developer has been archived out of the recruitment flow.</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Active Hires & Payout Milestones Verification */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900">Active Hires Retention Milestones Tracker</h3>
          <p className="text-xs text-slate-500">Confirm milestones (Day 30, Day 60, Day 90) as candidate completes onboarding weeks to release fractional payments.</p>
        </div>

        {myCompanyRewards.length === 0 ? (
          <div className="py-12 text-center text-slate-400 border border-slate-150 rounded-xl mt-6">
            <Award className="w-7 h-7 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium">No active hired candidates detected.</p>
            <p className="text-[11px] text-slate-400">Bounty trackers activate once a referred developer receives a formal Hired stage update.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {myCompanyRewards.map((reward) => (
              <div key={reward.id} className="border border-slate-200 bg-slate-50/20 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-150 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Hired Candiate: {reward.candidateName}</h4>
                    <p className="text-xs text-slate-500">{reward.jobTitle} • Total Bounty Escrow Locked Value: <span className="font-bold text-slate-800">${reward.totalAmount}</span></p>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-900 text-white px-2.5 py-1 rounded-md">
                    REWARD REF: {reward.id}
                  </span>
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
                          isEligible ? "bg-amber-50/10 border-amber-200" :
                          isHold ? "bg-rose-50/10 border-rose-200" :
                          "bg-white border-slate-200"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 font-display">{mil.days}-Day Retention Milestone</span>
                            <span className="text-[10px] text-slate-405 font-mono">{mil.percentage}% / ${mil.amount}</span>
                          </div>
                          
                          <div className="mt-2.5 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              isPaid ? "bg-emerald-500" :
                              isEligible ? "bg-amber-400" :
                              isHold ? "bg-rose-500" :
                              "bg-slate-400"
                            }`}></span>
                            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-600">
                              {mil.status === "Locked" && "🕒 Running Onboarding"}
                              {mil.status === "Eligible" && "⌛ Unlocked / Payout Pending"}
                              {mil.status === "Paid" && "💸 Released & Dispatched"}
                              {mil.status === "Hold" && "⚠️ Freeze State - Under Audit"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3.5 border-t border-slate-100">
                          {isLocked && (
                            <button
                              onClick={() => {
                                const confirm = window.confirm(`Confirm that ${reward.candidateName} has successfully met the Day ${mil.days} retention parameters?`);
                                if (confirm) onConfirmRetention(reward.id, idx);
                              }}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer text-center"
                            >
                              Confirm Milestone Met
                            </button>
                          )}

                          {isEligible && (
                            <div className="text-[10px] text-amber-700 font-medium bg-amber-50/80 p-1.5 rounded-lg text-center border border-amber-100">
                              Awaiting Platform Admin release
                            </div>
                          )}

                          {isPaid && (
                            <div className="text-[10px] text-emerald-700 font-medium bg-emerald-50/80 p-1.5 rounded-lg text-center border border-emerald-100 flex items-center justify-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Bounty Dispatched
                            </div>
                          )}

                          {isHold && (
                            <div className="text-[10px] text-rose-700 font-bold bg-rose-50 p-1.5 rounded-lg text-center border border-rose-100">
                              Payout Frozen - Disputed
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
