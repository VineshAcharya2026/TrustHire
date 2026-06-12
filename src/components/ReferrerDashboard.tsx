import React, { useState, useRef } from "react";
import { UserProfile, JobListing, Referral, ReferralStatus, RewardRecord } from "../types";
import { 
  BadgeAlert, 
  Search, 
  Send, 
  Upload, 
  Grid, 
  FileCheck, 
  Calendar, 
  Building, 
  CircleDot,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  UserCheck
} from "lucide-react";

interface ReferrerProps {
  currentUser: UserProfile;
  jobs: JobListing[];
  referrals: Referral[];
  rewards: RewardRecord[];
  onSubmitReferral: (
    jobId: string,
    candidateName: string,
    candidateEmail: string,
    candidatePhone: string,
    notes: string,
    resumeName: string,
    resumeSummary: string
  ) => void;
  errorMsg: string | null;
  successMsg: string | null;
  clearBanners: () => void;
}

export default function ReferrerDashboard({
  currentUser,
  jobs,
  referrals,
  rewards,
  onSubmitReferral,
  errorMsg,
  successMsg,
  clearBanners
}: ReferrerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  
  // Form State
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [referralNotes, setReferralNotes] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [resumeTextSummary, setResumeTextSummary] = useState("");
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expandable referrals tracker state
  const [expandedRefId, setExpandedRefId] = useState<string | null>(null);

  const filteredJobs = jobs.filter(
    (job) =>
      job.status === "Active" &&
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const myReferrals = referrals.filter((r) => r.referrerId === currentUser.id);

  // Preset resumes templates for mock testing
  const selectPresetResume = (type: "Frontend" | "Rust" | "Designer" | "Product") => {
    if (type === "Frontend") {
      setCandidateName("Alice Carter");
      setCandidateEmail("alice.carter@developer.com");
      setCandidatePhone("+1 (555) 777-1234");
      setResumeName("Alice_Carter_ReactCore_2026.pdf");
      setResumeTextSummary("Senior React Architect with 6+ years experience. Expert skills in state management (Zustand, React 19), styling systems (Tailwind CSS v4), and modern Vite compiler configurations.");
      setReferralNotes("Alice is an absolute star React developer. I worked with her directly at Acme, where she improved core rendering performance by over 40%. Highly recommend!");
    } else if (type === "Rust") {
      setCandidateName("Silas Marner");
      setCandidateEmail("silas.ruster@microservices.io");
      setCandidatePhone("+1 (555) 999-5511");
      setResumeName("Silas_Rust_Systems_Engineer.pdf");
      setResumeTextSummary("Systems programmer. Expert in async Tokio streams, highly optimized network caches, gRPC APIs, and zero-allocation memory architectures in Rust.");
      setReferralNotes("Silas is one of the brightest Rust, systems devs in our circle. He is excellent for Acme's Rust migration work.");
    } else if (type === "Designer") {
      setCandidateName("Vanya Hargreeves");
      setCandidateEmail("vanya.h@designgenius.net");
      setCandidatePhone("+1 (555) 444-2233");
      setResumeName("Vanya_Designs_Portfolio.pdf");
      setResumeTextSummary("Experienced UI designer and vector artist. Brand guidelines designer. Prototyped multiple visual bento-grids and design system rules.");
      setReferralNotes("A designer of unmatched artistic precision. You should check out her portfolio directly. Strong styling sense!");
    } else {
      setCandidateName("Logan Roy");
      setCandidateEmail("logan@waystar.com");
      setCandidatePhone("+1 (555) 333-8888");
      setResumeName("Logan_Roy_TechnicalPM_CV.pdf");
      setResumeTextSummary("Executive product officer with API standardization background. Leads multiple development SDK cycles, and agile engineering squads.");
      setReferralNotes("Lead-level candidate with impeccable system coordination and team alignment.");
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setResumeName(file.name);
      setResumeTextSummary(`Uploaded relative document summary for ${file.name} (Size: ${Math.round(file.size / 1024)} KB)`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeName(file.name);
      setResumeTextSummary(`Uploaded document summary for ${file.name} (Size: ${Math.round(file.size / 1024)} KB)`);
    }
  };

  const triggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    if (!candidateName || !candidateEmail || !candidatePhone || !resumeName) {
      alert("Please ensure candidate details and resume attachment are completed.");
      return;
    }

    onSubmitReferral(
      selectedJob.id,
      candidateName,
      candidateEmail,
      candidatePhone,
      referralNotes,
      resumeName,
      resumeTextSummary
    );

    // If success, reset form
    if (!errorMsg) {
      setCandidateName("");
      setCandidateEmail("");
      setCandidatePhone("");
      setReferralNotes("");
      setResumeName("");
      setResumeTextSummary("");
      setSelectedJob(null);
    }
  };

  const toggleExpandReferral = (id: string) => {
    setExpandedRefId(expandedRefId === id ? null : id);
  };

  return (
    <div className="space-y-6" id="referrer-dashboard">
      
      {/* Search and Jobs Grid */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.06)] hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.09)] transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-900">Explore Open Opportunities</h2>
            <p className="text-xs text-slate-500">Select an active job opening to submit a trusted candidate and lock high-value bounty rewards.</p>
          </div>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by title, role or firm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-500">
            <p className="text-sm font-medium">No matching job listings found</p>
            <p className="text-xs text-slate-400 mt-1">Try refining your search terms or verify that postings are active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className={`p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  selectedJob?.id === job.id 
                    ? "border-indigo-600 bg-indigo-50/25 ring-2 ring-indigo-500/10 shadow-sm"
                    : "border-slate-200/85 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <span className="text-[10px] font-mono tracking-wider font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      BOUNTY: ${job.rewardAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Posted: {job.postedDate}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 font-display">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.companyName}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {job.requirements.slice(0, 3).map((req, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 font-mono">{job.compensation}</span>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      clearBanners();
                      // scroll to form
                      const formEl = document.getElementById("submission-container");
                      formEl?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      selectedJob?.id === job.id
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    }`}
                  >
                    Refer Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submit Referral Form Area */}
      {selectedJob && (
        <section className="bg-white rounded-xl border border-indigo-200 p-6 shadow-[4px_4px_0px_0px_rgba(99,102,241,0.08)] scroll-mt-6" id="submission-container">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-4 mb-5">
            <div>
              <span className="text-[9px] font-mono tracking-wider font-bold text-indigo-700 uppercase bg-indigo-100 px-2 py-0.5 rounded-md">
                REFERRAL REGISTRATION PORTAL
              </span>
              <h2 className="text-lg font-bold font-display text-slate-900 mt-1">
                Referring for: <span className="text-indigo-600 font-semibold">{selectedJob.title}</span>
              </h2>
              <p className="text-xs text-slate-500">{selectedJob.companyName} • Bounty worth ${selectedJob.rewardAmount.toLocaleString()}</p>
            </div>
            <button
              onClick={() => setSelectedJob(null)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Form Banner notifications */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs mb-4 flex items-start gap-2.5">
              <BadgeAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Invalid Submission Match</p>
                <p className="text-[11px] text-rose-600 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs mb-4 flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Referral Logged Verification</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={triggerSubmit} className="space-y-4">
            
            {/* Quick Presets Selection for Testing */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-display mb-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                Instant MVP Testing Autofills:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => selectPresetResume("Frontend")}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer font-medium"
                >
                  👩‍💻 Alice Carter (React Specialist)
                </button>
                <button
                  type="button"
                  onClick={() => selectPresetResume("Rust")}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer font-medium"
                >
                  🦀 Silas Marner (Rust Systems)
                </button>
                <button
                  type="button"
                  onClick={() => selectPresetResume("Designer")}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer font-medium"
                >
                  🎨 Vanya Hargreeves (UI Designer)
                </button>
                <button
                  type="button"
                  onClick={() => selectPresetResume("Product")}
                  className="bg-slate-900 text-slate-100 hover:bg-slate-800 text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer font-medium"
                  title="Will trigger self-referral exception if matches active user, or test blacklist!"
                >
                  ⚠️ Trigger Multi-sub / Flag
                </button>
              </div>
              <p className="text-[9px] text-slate-400 font-mono mt-1">
                Useful for testing matching blacklist checks or self-referral blocks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Alice Carter"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Candidate Email Address *</label>
                <input
                  type="email"
                  required
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="e.g. alice@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Phone Number *</label>
                <input
                  type="text"
                  required
                  value={candidatePhone}
                  onChange={(e) => setCandidatePhone(e.target.value)}
                  placeholder="e.g. +1 (555) 777-1234"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Drag and Drop File Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Attach Resume CV Document *</label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? "border-indigo-600 bg-indigo-50" 
                    : resumeName 
                      ? "border-emerald-300 bg-emerald-50/10" 
                      : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                
                {resumeName ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileCheck className="w-8 h-8 text-emerald-500" />
                    <p className="text-xs font-bold text-slate-850">{resumeName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Click here or drag-drop to change document</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-slate-400" />
                    <p className="text-xs font-medium text-slate-700">Drag & Drop Resume attachment here, or <span className="text-indigo-600 hover:underline">browse files</span></p>
                    <p className="text-[10px] text-slate-400 font-mono">Supports PDF, DOCX (Max 10MB)</p>
                  </div>
                )}
              </div>
            </div>

            {resumeName && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resume Structured Summary (Auto-Simulated OCR)</label>
                <textarea
                  value={resumeTextSummary}
                  onChange={(e) => setResumeTextSummary(e.target.value)}
                  placeholder="Summary text of credentials..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:bg-white focus:outline-hidden font-mono"
                ></textarea>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Endorsement Endorsements & Notes</label>
              <textarea
                value={referralNotes}
                onChange={(e) => setReferralNotes(e.target.value)}
                placeholder="Give recruitment team background on your relationship or why they are a great fit..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-hidden"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 hover:bg-slate-100 rounded-xl text-xs text-slate-600 cursor-pointer font-semibold"
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold font-display px-5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-indigo-150 cursor-pointer transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Application
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Submissions Tracker & Rewards Status */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900">Your Candidate Submissions Portfolio</h2>
          <p className="text-xs text-slate-500">Track interview progress, duplicate overrides, and live bounty milestones status.</p>
        </div>

        <div className="mt-6 space-y-3.5">
          {myReferrals.length === 0 ? (
            <div className="py-12 text-center text-slate-400 border border-slate-150 rounded-xl">
              <UserCheck className="w-8 h-8 text-slate-350 mx-auto mb-2" />
              <p className="text-xs font-medium">You have not submitted any referrals yet.</p>
              <p className="text-[11px] text-slate-400">Click Refer Candidate on any active job listing to begin.</p>
            </div>
          ) : (
            myReferrals.map((ref) => {
              const matchedJob = jobs.find((j) => j.id === ref.jobId);
              const matchedReward = rewards.find((r) => r.referralId === ref.id);
              const isExpanded = expandedRefId === ref.id;

              // Timeline Stage Indicators
              const getIndicatorStage = (current: ReferralStatus) => {
                if (current === ReferralStatus.Submitted) return 1;
                if (current === ReferralStatus.Shortlisted) return 2;
                if (current === ReferralStatus.Interview) return 3;
                if (current === ReferralStatus.Hired) return 4;
                return 0; // rejected
              };

              const currentStageNum = getIndicatorStage(ref.status);

              return (
                <div 
                  key={ref.id} 
                  className={`border rounded-2xl transition-all duration-200 p-4 ${
                    ref.duplicateFlag 
                      ? "border-rose-100 bg-rose-50/5" 
                      : ref.status === ReferralStatus.Hired 
                        ? "border-emerald-200 bg-emerald-50/5 hover:border-emerald-300"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-100 rounded-xl shrink-0">
                        {ref.duplicateFlag ? (
                          <BadgeAlert className="text-rose-600 w-5 h-5 animate-pulse" />
                        ) : (
                          <FileText className="text-indigo-600 w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{ref.candidateName}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">({ref.candidateEmail})</span>
                          
                          {ref.duplicateFlag && (
                            <span className="text-[9px] font-bold text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.2 rounded-full uppercase tracking-wider font-mono">
                              ⚠️ Flagged Duplicate
                            </span>
                          )}

                          {ref.status === ReferralStatus.Hired && (
                            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.2 rounded-full uppercase tracking-wider font-mono">
                              🎉 Hired!
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Referral for <span className="font-semibold text-slate-800">{matchedJob?.title || "Staff Position"}</span> at <span className="font-semibold text-indigo-600">{matchedJob?.companyName || "Vendor"}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Filed on {new Date(ref.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-0 pt-3.5 sm:pt-0 border-slate-100">
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">Active Pipeline</p>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 mt-1 inline-block rounded-md uppercase tracking-wider ${
                          ref.status === ReferralStatus.Hired ? "bg-emerald-100 text-emerald-800" :
                          ref.status === ReferralStatus.Rejected ? "bg-rose-100 text-rose-800" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {ref.status}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => toggleExpandReferral(ref.id)}
                        className="p-1 px-3 text-slate-400 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center gap-1 text-xs"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        <span>Status</span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Pipeline Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                      {/* Interactive Visual Stepper Progress Bar */}
                      {ref.status !== ReferralStatus.Rejected ? (
                        <div className="bg-slate-50 p-4 rounded-xl">
                          <p className="text-xs font-bold text-slate-800 mb-2 font-display">End-to-End Governance Progress</p>
                          <div className="flex items-center justify-between relative mt-4">
                            {/* Stepper connections bar */}
                            <div className="absolute top-2 w-full h-1 bg-slate-200 left-0 -z-1"></div>
                            <div 
                              className="absolute top-2 h-1 bg-indigo-600 left-0 -z-1 transition-all duration-300"
                              style={{ width: `${currentStageNum === 4 ? 100 : ((currentStageNum - 1) / 3) * 100}%` }}
                            ></div>

                            <div className="flex flex-col items-center">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold ${
                                currentStageNum >= 1 ? "bg-indigo-600 text-white border border-indigo-700" : "bg-slate-200 text-slate-600"
                              }`}>✓</span>
                              <span className="text-[9px] font-semibold text-slate-500 font-mono mt-1.5 uppercase">Registered</span>
                            </div>

                            <div className="flex flex-col items-center">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold ${
                                currentStageNum >= 2 ? "bg-indigo-600 text-white border border-indigo-700" : "bg-slate-200 text-slate-600"
                              }`}>{currentStageNum >= 2 ? "✓" : "2"}</span>
                              <span className="text-[9px] font-semibold text-slate-500 font-mono mt-1.5 uppercase">Shortlisted</span>
                            </div>

                            <div className="flex flex-col items-center">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold ${
                                currentStageNum >= 3 ? "bg-indigo-600 text-white border border-indigo-700" : "bg-slate-200 text-slate-600"
                              }`}>{currentStageNum >= 3 ? "✓" : "3"}</span>
                              <span className="text-[9px] font-semibold text-slate-500 font-mono mt-1.5 uppercase">Interviews</span>
                            </div>

                            <div className="flex flex-col items-center">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold ${
                                currentStageNum >= 4 ? "bg-emerald-600 text-white border border-emerald-700" : "bg-slate-200 text-slate-600"
                              }`}>{currentStageNum >= 4 ? "✓" : "4"}</span>
                              <span className="text-[9px] font-semibold text-slate-500 font-mono mt-1.5 uppercase">Offered & Hired</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-xs text-rose-800">
                          <p className="font-semibold">Application Rejected</p>
                          <p className="text-[11px] text-rose-600 mt-0.5">The employer decided not to proceed with this candidate at this time.</p>
                        </div>
                      )}

                      {/* Display Associated Rewards Record details */}
                      {matchedReward && (
                        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                            <span className="text-slate-400 font-bold tracking-wider uppercase text-[10px]">💰 Reward Escrow Breakdown</span>
                            <span className="text-amber-400 font-bold">${matchedReward.releasedAmount} Paid / ${matchedReward.lockedAmount} Locked</span>
                          </div>
                          
                          <div className="space-y-2">
                            {matchedReward.milestones.map((mil, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-2.5 h-2.5 rounded-full ${
                                    mil.status === "Paid" ? "bg-emerald-500" :
                                    mil.status === "Eligible" ? "bg-amber-400 animate-pulse" :
                                    mil.status === "Hold" ? "bg-rose-500" :
                                    "bg-slate-600"
                                  }`}></span>
                                  <span>{mil.days}-Day Retention Milestone</span>
                                  <span className="text-slate-500">({mil.percentage}%)</span>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-slate-200">${mil.amount}</p>
                                  <p className="text-[9px] text-slate-400 uppercase tracking-widest">{mil.status}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-500 italic mt-2.5">
                            * Only Platform Admin can approve releases. Payouts are triggered in real-time as retention checks complete.
                          </p>
                        </div>
                      )}

                      {/* Timeline Events list */}
                      <div>
                        <p className="text-xs font-bold text-slate-800 mb-2 font-display">Status Logs & History</p>
                        <div className="space-y-2 relative pl-4 border-l border-slate-200">
                          {ref.timeline.map((evt, idx) => (
                            <div key={idx} className="relative text-[11px] text-slate-600">
                              <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 border border-white"></span>
                              <p className="font-semibold text-slate-800">{evt.stage && evt.stage.toUpperCase()}</p>
                              <p className="text-slate-500 text-[10px]">{evt.note || "No comments log"}</p>
                              <span className="text-[9px] text-slate-400 font-mono">By ID {evt.updatedBy} • {new Date(evt.timestamp).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
