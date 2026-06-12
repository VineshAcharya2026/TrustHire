import React, { useState } from "react";
import { UserProfile, JobListing, Referral, ReferralStatus, NotificationItem, UserRole } from "../types";
import { 
  Search, 
  MapPin, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  MessageSquare, 
  Lock, 
  Sparkles,
  Mail,
  Smartphone
} from "lucide-react";

interface CandidatePortalProps {
  currentUser: UserProfile;
  jobs: JobListing[];
  referrals: Referral[];
  notifications: NotificationItem[];
}

export default function CandidatePortal({
  currentUser,
  jobs,
  referrals,
  notifications
}: CandidatePortalProps) {
  const [candidateEmailInput, setCandidateEmailInput] = useState("");
  const [activeCandidateEmail, setActiveCandidateEmail] = useState<string | null>(null);

  // Quick select presets for demo testing
  const demoCandidates = [
    { name: "Alice Carter", email: "alice.carter@developer.com" },
    { name: "Bob Vance", email: "bob.vance@techlead.org" },
    { name: "David Brent", email: "david.brent@sloughoffice.com" }
  ];

  // Retrieve current active candidate referrals
  const matchedCandidateReferrals = referrals.filter(
    (r) => r.candidateEmail.trim().toLowerCase() === (activeCandidateEmail || "").trim().toLowerCase()
  );

  // Retrieve matching mock notification emails
  const myAlerts = notifications.filter(
    (n) => n.recipientEmail.trim().toLowerCase() === (activeCandidateEmail || "").trim().toLowerCase()
  );

  return (
    <div className="space-y-6" id="candidate-portal-container">
      
      {/* Intro Portal Screen */}
      <section className="bg-white rounded-2xl border border-slate-205 p-6 shadow-xs">
        <div className="max-w-2xl">
          <span className="text-[9px] font-mono tracking-wider font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md uppercase">
            Candidate Application Tracker
          </span>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-2">Track Your Referral Journey Real-Time</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Referred candidates receive transactional update reports at each major recruiting gateway stage. Enter your personal email below (or use a quick-demo shortcut) to audit your current interviewing standing.
          </p>

          {/* Quick Shortcuts for testers */}
          <div className="mt-4 flex flex-wrap gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-550 font-display">Testing Presets:</span>
            {demoCandidates.map((dc) => (
              <button
                key={dc.email}
                onClick={() => {
                  setActiveCandidateEmail(dc.email);
                  setCandidateEmailInput(dc.email);
                }}
                className={`p-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                  activeCandidateEmail === dc.email
                    ? "bg-sky-600 text-white border-sky-700 shadow-xs"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                👤 {dc.name}
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setActiveCandidateEmail(candidateEmailInput);
            }} 
            className="mt-4 flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={candidateEmailInput}
                onChange={(e) => setCandidateEmailInput(e.target.value)}
                placeholder="Enter your email e.g. alice.carter@developer.com..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="bg-slate-900 text-white font-semibold font-display px-5 py-2 rounded-xl text-xs hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              Verify Standing
            </button>
          </form>
        </div>
      </section>

      {/* Dynamic Results Display */}
      {activeCandidateEmail ? (
        matchedCandidateReferrals.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl border text-center text-slate-400">
            <p className="text-xs font-medium">No candidate referral file detected associated with "{activeCandidateEmail}"</p>
            <p className="text-[11px] text-slate-500 mt-1">Please ensure spelling matches exactly, or check that your Referrer has completed submission.</p>
          </div>
        ) : (
          matchedCandidateReferrals.map((candidateRef) => {
            const matchedJob = jobs.find((j) => j.id === candidateRef.jobId);
            
            // Stepper progress indicator count
            const getProgressValue = (current: ReferralStatus) => {
              if (current === ReferralStatus.Submitted) return 25;
              if (current === ReferralStatus.Shortlisted) return 50;
              if (current === ReferralStatus.Interview) return 75;
              if (current === ReferralStatus.Hired) return 100;
              return 0; // rejected
            };

            const num = getProgressValue(candidateRef.status);

            return (
              <div key={candidateRef.id} className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-induration-300">
                
                {/* Steppers progress visual and status logs */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Visual Timeline Card */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300 space-y-5">
                    <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-500 font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Referral Standing</span>
                        <h3 className="text-base font-bold font-display text-slate-900 mt-2">
                          Role: {matchedJob?.title || "Technical Staff"}
                        </h3>
                        <p className="text-xs text-slate-500">Corporate Member: <span className="font-semibold">{matchedJob?.companyName}</span></p>
                      </div>
                      <span className="text-xs font-mono bg-slate-100 border border-slate-200 px-2.5 py-1 rounded text-slate-600">
                        REF_ID: {candidateRef.id}
                      </span>
                    </div>

                    {candidateRef.status !== ReferralStatus.Rejected ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800">Review Stage Progress</span>
                          <span className="font-mono font-bold text-indigo-650">{num}% Gateway Completed</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2.5 relative">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-501" 
                            style={{ width: `${num}%` }}
                          ></div>
                        </div>

                        {/* Beautiful labels */}
                        <div className="grid grid-cols-4 text-center text-[10px] font-mono tracking-wider font-bold text-slate-450 uppercase">
                          <div className={num >= 25 ? "text-indigo-600" : ""}>Submitted</div>
                          <div className={num >= 50 ? "text-indigo-600" : ""}>Shortlisted</div>
                          <div className={num >= 75 ? "text-indigo-600" : ""}>Interviewing</div>
                          <div className={num >= 100 ? "text-emerald-600" : ""}>Onboarded Hired</div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl">
                        <p className="font-bold text-sm">Application archived</p>
                        <p className="text-[11px] text-rose-500 mt-1">Thank you for your interest. The recruiting firm has closed the interview pipeline or hired another applicant.</p>
                      </div>
                    )}

                    {/* Timeline History log */}
                    <div className="pt-4 border-t">
                      <p className="text-xs font-bold text-slate-800 font-display mb-3">Verification History & Stages Remarks</p>
                      <div className="space-y-3.5 relative pl-4 border-l border-slate-200">
                        {candidateRef.timeline.map((item, idx) => (
                          <div key={idx} className="relative text-[11px] text-slate-600 leading-normal">
                            <span className={`absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full border border-white ${
                              item.stage === "Hired" ? "bg-emerald-500" : "bg-slate-400"
                            }`}></span>
                            <p className="font-bold text-slate-850 uppercase tracking-wide text-[10px]">{item.stage}</p>
                            <p className="text-slate-500 mt-0.5">{item.note || "Transition gateway updated."}</p>
                            <span className="text-[10px] text-slate-400 mt-0.5 inline-block font-mono">
                              Timestamp: {new Date(item.timestamp).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Candidate Alerts and WhatsApp Simulated Inbox */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Mock message inbox */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300">
                    <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2 mb-4">
                      <MessageSquare className="w-4 h-4 text-sky-600" />
                      Candidate Communications Log
                    </h3>
                    
                    <div className="space-y-4">
                      {myAlerts.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-6 bg-slate-50 rounded-xl">No messages logged yet.</p>
                      ) : (
                        myAlerts.map((alert) => (
                          <div key={alert.id} className="space-y-2 border-b pb-3.5 last:border-0 last:pb-0">
                            <div className="flex items-center gap-1.5 text-xs font-bold font-display text-slate-900">
                              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                              <span>{alert.title}</span>
                            </div>
                            <p className="text-xs text-slate-600 bg-slate-100/50 p-2.5 rounded-xl leading-relaxed">
                              "{alert.message}"
                            </p>
                            
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-md text-sky-700 bg-sky-50 border border-sky-100 flex items-center gap-1 font-bold">
                                <Mail className="w-2.5 h-2.5" /> MOCK EMAIL
                              </span>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-md text-emerald-700 bg-emerald-50 border border-emerald-100 flex items-center gap-1 font-bold">
                                <Smartphone className="w-2.5 h-2.5" /> WHATSAPP OTP
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Portal Security Guarantee */}
                  <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-display mb-1.5">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      Candidate Privacy Locked
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      We check credentials domains and phone databases to avoid automated harvesting scripts. All resume attachments remain encrypted with Cloud Run ephemeral storage parameters.
                    </p>
                  </div>
                </div>

              </div>
            );
          })
        )
      ) : (
        <div className="bg-white rounded-2xl border p-12 text-center text-slate-450 space-y-3">
          <BookOpen className="w-8 h-8 text-sky-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-850">Awaiting Search Credentials</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Select any candidate shortcut preset or enter your personal email address above to view active tracking streams.</p>
        </div>
      )}

    </div>
  );
}
