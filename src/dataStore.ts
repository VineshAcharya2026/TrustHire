import {
  UserProfile,
  UserRole,
  AccountStatus,
  JobListing,
  Referral,
  ReferralStatus,
  RewardRecord,
  RewardStatus,
  MilestoneStatus,
  MilestoneReward,
  BlacklistItem,
  NotificationItem,
  SystemLog,
  PlatformConfig
} from "./types";

// Helper keys for LocalStorage
const STORE_PREFIX = "referral_platform_";

// Helper to safely fetch from localStorage or fallback
function getStoredOrDefault<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(STORE_PREFIX + key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

// Helper to save to localStorage
function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    // Fail silently or log
  }
}

// Initial Mock Users
const INITIAL_USERS: UserProfile[] = [
  {
    id: "user_admin",
    name: "Eleanor Vance (Head HR Platform)",
    email: "admin@referralplatform.com",
    phone: "+1 (555) 019-9231",
    role: UserRole.Admin,
    verified: true,
    status: AccountStatus.Active,
    qualityScore: 100,
    joinDate: "2025-01-10"
  },
  {
    id: "user_emp_acme",
    name: "Marcus Vance (Talent Acquisition)",
    email: "recruiting@acme.com",
    phone: "+1 (555) 012-3211",
    role: UserRole.Employer,
    companyId: "company_acme",
    verified: true,
    status: AccountStatus.Active,
    qualityScore: 95,
    joinDate: "2025-02-15"
  },
  {
    id: "user_emp_stellar",
    name: "Diana Prince (Chief of People)",
    email: "careers@stellar.tech",
    phone: "+1 (555) 014-9988",
    role: UserRole.Employer,
    companyId: "company_stellar",
    verified: true,
    status: AccountStatus.Active,
    qualityScore: 90,
    joinDate: "2025-03-01"
  },
  {
    id: "user_emp_bubble",
    name: "Bobby Bubble (Founder)",
    email: "jobs@bubble.web",
    phone: "+1 (555) 016-7722",
    role: UserRole.Employer,
    companyId: "company_bubble",
    verified: false,
    status: AccountStatus.PendingApproval,
    qualityScore: 50,
    joinDate: "2026-06-11"
  },
  {
    id: "user_ref_jane",
    name: "Jane Doe (Staffing Specialist)",
    email: "jane.doe@staffing.com",
    phone: "+1 (555) 111-2222",
    role: UserRole.Referrer,
    verified: true,
    status: AccountStatus.Active,
    qualityScore: 94,
    joinDate: "2025-04-10"
  },
  {
    id: "user_ref_alex",
    name: "Alex Rivera (Lead Network Engineer)",
    email: "alex.rivera@talent.io",
    phone: "+1 (555) 333-4444",
    role: UserRole.Referrer,
    verified: true,
    status: AccountStatus.Active,
    qualityScore: 82,
    joinDate: "2025-05-20"
  },
  {
    id: "user_ref_spammer",
    name: "Suspicious Sam",
    email: "fraudulent.user@spam.com",
    phone: "+1 (555) 666-9999",
    role: UserRole.Referrer,
    verified: false,
    status: AccountStatus.Suspended,
    qualityScore: 15,
    joinDate: "2026-05-01"
  }
];

// Initial Mock Jobs
const INITIAL_JOBS: JobListing[] = [
  {
    id: "job_acme_frontend",
    companyId: "company_acme",
    companyName: "Acme Corp",
    title: "Senior Frontend Engineer (React)",
    description: "Looking for an expert with React 19, Tailwind, and Vite to build blazing-fast admin products and modern dashboards. You will build and take ownership of our next-generation customer analytics products.",
    requirements: ["5+ years React experience", "Deep knowledge of Tailwind CSS", "Proven track record with bundlers like Vite/Webpack", "Excellent communication skills"],
    compensation: "$140,000 - $170,000 per annum",
    rewardAmount: 6000,
    status: "Active",
    postedDate: "2026-06-01"
  },
  {
    id: "job_acme_backend",
    companyId: "company_acme",
    companyName: "Acme Corp",
    title: "Rust Core Developer",
    description: "Join our core services team to help us scale data pipelines. We're migrating critical services from Python to Rust, expecting high throughput, ultra-low latency, and tight memory limits.",
    requirements: ["3+ years core Rust experience", "Strong acquaintance with Tokio and async Rust", "Experience with PostgreSQL optimization", "Enterprise systems background"],
    compensation: "$160,000 - $190,000 per annum",
    rewardAmount: 8000,
    status: "Active",
    postedDate: "2026-06-03"
  },
  {
    id: "job_stellar_pm",
    companyId: "company_stellar",
    companyName: "Stellar Tech",
    title: "Lead Technical Product Manager",
    description: "Lead the API platform and developer tools group. Work with engineering and stakeholders to set API design rules, SDK developer experience, and third-party integrations roadmap.",
    requirements: ["Technical degree or background in software engineering", "3+ years API/Platform product management", "Shipped products for developer audiences", "Agile leadership"],
    compensation: "$150,000 - $180,000 per annum",
    rewardAmount: 5000,
    status: "Active",
    postedDate: "2026-05-28"
  },
  {
    id: "job_stellar_designer",
    companyId: "company_stellar",
    companyName: "Stellar Tech",
    title: "Senior UI/UX & Brand Designer",
    description: "Define the brand and visual styling guidelines across Stellar. Build clean, minimal landing pages and maintain consistent layout, spacing, and micro-interactions across stellar products.",
    requirements: ["4+ years UX/UI design experience", "Mastery of Figma and vector assets creation", "Basic understanding of Tailwind classes", "Stunning digital design portfolio"],
    compensation: "$110,000 - $135,000 per annum",
    rewardAmount: 4000,
    status: "Active",
    postedDate: "2026-06-05"
  },
  {
    id: "job_bubble_dev",
    companyId: "company_bubble",
    companyName: "Bubble Web",
    title: "Junior full-stack contractor",
    description: "Generalist Web creator for local business products, maintaining legacy databases and creating simple customer landing interfaces.",
    requirements: ["Intermediate JS and CSS knowledge", "Basic CRUD skills"],
    compensation: "$60,000 - $80,000 per annum",
    rewardAmount: 2000,
    status: "Active",
    postedDate: "2026-06-11"
  }
];

// Setup dynamic initial dates relative to current date (June 2026)
const INITIAL_REFERRALS: Referral[] = [
  {
    id: "ref_001",
    jobId: "job_acme_frontend",
    referrerId: "user_ref_jane",
    candidateName: "Alice Carter",
    candidateEmail: "alice.carter@developer.com",
    candidatePhone: "+1 (555) 777-1234",
    resumeFileName: "Alice_Carter_Resume.pdf",
    resumeTextSummary: "Expert Frontend Engineer with 6 years experience. Shipped large SaaS analytics dashboards. Advanced React, TypeScript, and state optimization systems.",
    duplicateFlag: false,
    status: ReferralStatus.Submitted,
    submittedAt: "2026-06-11T09:30:00Z",
    notes: "I worked with Alice at our previous company. She is incredibly detail-oriented and builds exceptionally clean React layouts.",
    timeline: [
      { stage: ReferralStatus.Submitted, timestamp: "2026-06-11T09:30:00Z", updatedBy: "user_ref_jane", note: "Referral submitted against Senior Frontend Engineer listing." }
    ]
  },
  {
    id: "ref_002",
    jobId: "job_stellar_pm",
    referrerId: "user_ref_alex",
    candidateName: "Bob Vance",
    candidateEmail: "bob.vance@techlead.org",
    candidatePhone: "+1 (555) 888-5678",
    resumeFileName: "Bob_Vance_FigmaAPI.pdf",
    resumeTextSummary: "Technical PM. Former backend engineer. Managed GraphQL migration and developer developer SDKs. Strong team motivator.",
    duplicateFlag: false,
    status: ReferralStatus.Shortlisted,
    submittedAt: "2026-06-08T14:15:00Z",
    notes: "Bob has a stellar background in technical product management and API standards. Recommended highly.",
    timeline: [
      { stage: ReferralStatus.Submitted, timestamp: "2026-06-08T14:15:00Z", updatedBy: "user_ref_alex", note: "Referral submitted by Alex Rivera." },
      { stage: ReferralStatus.Shortlisted, timestamp: "2026-06-09T11:00:00Z", updatedBy: "user_emp_stellar", note: "Acquires stellar technical skills! CV shortlisted; setting up introductory call." }
    ]
  },
  {
    id: "ref_003",
    jobId: "job_acme_backend",
    referrerId: "user_ref_jane",
    candidateName: "Claire Dunphy",
    candidateEmail: "claire.d@moderntech.net",
    candidatePhone: "+1 (555) 999-0012",
    resumeFileName: "Claire_Dunphy_CV.pdf",
    resumeTextSummary: "Senior Systems engineer specializing in Rust, backend performance tuning, Postgres clusters, and distributed actor systems.",
    duplicateFlag: false,
    status: ReferralStatus.Interview,
    submittedAt: "2026-06-04T10:00:00Z",
    notes: "Claire operates on a high-throughput framework. Perfect candidate for Rust migrating project.",
    timeline: [
      { stage: ReferralStatus.Submitted, timestamp: "2026-06-04T10:00:00Z", updatedBy: "user_ref_jane", note: "Referral submitted." },
      { stage: ReferralStatus.Shortlisted, timestamp: "2026-06-05T09:30:00Z", updatedBy: "user_emp_acme", note: "Resume approved by Acme HR." },
      { stage: ReferralStatus.Interview, timestamp: "2026-06-06T16:00:00Z", updatedBy: "user_emp_acme", note: "Technical stage 1 cleared. Final system architecture interview scheduled." }
    ]
  },
  {
    id: "ref_004",
    jobId: "job_stellar_designer",
    referrerId: "user_ref_alex",
    candidateName: "David Brent",
    candidateEmail: "david.brent@sloughoffice.com",
    candidatePhone: "+1 (555) 444-7711",
    resumeFileName: "David_Brent_Portfolio.pdf",
    resumeTextSummary: "UI Specialist and graphics artist. High-fidelity layouts, interaction design, micro-copy, typography pairing.",
    duplicateFlag: false,
    status: ReferralStatus.Hired,
    submittedAt: "2026-05-15T11:20:00Z",
    notes: "David possesses great design sensitivity. Has worked with several agencies.",
    timeline: [
      { stage: ReferralStatus.Submitted, timestamp: "2026-05-15T11:20:00Z", updatedBy: "user_ref_alex", note: "Referral submitted." },
      { stage: ReferralStatus.Shortlisted, timestamp: "2026-05-16T14:00:00Z", updatedBy: "user_emp_stellar", note: "Shortlisted based on portfolio review." },
      { stage: ReferralStatus.Interview, timestamp: "2026-05-18T10:00:00Z", updatedBy: "user_emp_stellar", note: "Interviews completed successfully." },
      { stage: ReferralStatus.Hired, timestamp: "2026-05-25T15:30:00Z", updatedBy: "user_emp_stellar", note: "Candidate accepted the offer and is officially hired! Starting work June 1st." }
    ]
  },
  {
    id: "ref_005",
    jobId: "job_acme_frontend",
    referrerId: "user_ref_jane",
    candidateName: "Eve Polastri",
    candidateEmail: "eve.polastri@mi6.gov.uk",
    candidatePhone: "+1 (555) 222-8800",
    resumeFileName: "Eve_Polastri_Resume.pdf",
    resumeTextSummary: "Frontend Developer with 8 years experience in building high security systems dashboards and robust layouts.",
    duplicateFlag: false,
    status: ReferralStatus.Hired,
    submittedAt: "2026-04-10T09:00:00Z",
    notes: "Eve is amazing with responsive structures and data pipelines.",
    timeline: [
      { stage: ReferralStatus.Submitted, timestamp: "2026-04-10T09:00:00Z", updatedBy: "user_ref_jane" },
      { stage: ReferralStatus.Shortlisted, timestamp: "2026-04-12T11:00:00Z", updatedBy: "user_emp_acme" },
      { stage: ReferralStatus.Interview, timestamp: "2026-04-15T10:00:00Z", updatedBy: "user_emp_acme" },
      { stage: ReferralStatus.Hired, timestamp: "2026-04-20T17:00:00Z", updatedBy: "user_emp_acme", note: "Eve Hired! Started Day 1 on May 1st." }
    ]
  }
];

// Seed Reward Records corresponding to hired candidates
const INITIAL_REWARDS: RewardRecord[] = [
  {
    id: "rew_004", // David Brent
    referralId: "ref_004",
    referrerId: "user_ref_alex",
    jobId: "job_stellar_designer",
    candidateName: "David Brent",
    jobTitle: "Senior UI/UX & Brand Designer",
    companyName: "Stellar Tech",
    totalAmount: 4000,
    lockedAmount: 4000,
    releasedAmount: 0,
    status: RewardStatus.Locked,
    lastUpdated: "2026-05-25T15:30:00Z",
    milestones: [
      { id: "m1", days: 30, percentage: 30, amount: 1200, status: MilestoneStatus.Eligible, disputeNotes: "" }, // Currently eligible (David started June 1st / hired 18 days ago, let's treat his day 30 as close or test-ready!)
      { id: "m2", days: 60, percentage: 30, amount: 1200, status: MilestoneStatus.Locked, disputeNotes: "" },
      { id: "m3", days: 90, percentage: 40, amount: 1600, status: MilestoneStatus.Locked, disputeNotes: "" }
    ]
  },
  {
    id: "rew_005", // Eve Polastri
    referralId: "ref_005",
    referrerId: "user_ref_jane",
    jobId: "job_acme_frontend",
    candidateName: "Eve Polastri",
    jobTitle: "Senior Frontend Engineer (React)",
    companyName: "Acme Corp",
    totalAmount: 6000,
    lockedAmount: 4200,
    releasedAmount: 1800,
    status: RewardStatus.PartialReleased,
    lastUpdated: "2026-06-01T12:00:00Z",
    milestones: [
      { id: "m1", days: 30, percentage: 30, amount: 1800, status: MilestoneStatus.Paid, approvedDate: "2026-06-01T12:00:00Z" }, // Paid on June 1st (Eve hired late April, hit 30 days around June 1st)
      { id: "m2", days: 60, percentage: 30, amount: 1800, status: MilestoneStatus.Eligible }, // Hit 60 days approaching
      { id: "m3", days: 90, percentage: 40, amount: 2400, status: MilestoneStatus.Locked }
    ]
  }
];

// Initial Blacklists
const INITIAL_BLACKLISTS: BlacklistItem[] = [
  {
    id: "bl_1",
    value: "scammer.com",
    type: "Domain",
    reason: "Repeated resume farming using automated scrapers.",
    dateAdded: "2026-03-10"
  },
  {
    id: "bl_2",
    value: "fake@gmail.com",
    type: "Email",
    reason: "Suspious identity details, failed basic interview video check.",
    dateAdded: "2026-05-18"
  },
  {
    id: "bl_3",
    value: "+15559990000",
    type: "Phone",
    reason: "Sms spamming and automated registration loops.",
    dateAdded: "2026-05-22"
  }
];

// Initial System Config
const DEFAULT_CONFIG: PlatformConfig = {
  milestoneDays: [30, 60, 90],
  milestonePercentages: [30, 30, 40],
  maxReferralsPerDay: 5
};

// Initial Notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "not_1",
    recipientEmail: "jane.doe@staffing.com",
    recipientRole: UserRole.Referrer,
    title: "Milestone Payout Released 🎉",
    message: "Admin approved of your 30-Day Retention Milestone Payout for Eve Polastri at Acme Corp. $1,800 has been released.",
    channel: "All",
    timestamp: "2026-06-01T12:05:00Z",
    read: false
  },
  {
    id: "not_2",
    recipientEmail: "careers@stellar.tech",
    recipientRole: UserRole.Employer,
    title: "New Referral Submitted Alert",
    message: "Alex Rivera referred Bob Vance for Lead Technical Product Manager.",
    channel: "In-App",
    timestamp: "2026-06-08T14:15:00Z",
    read: true
  },
  {
    id: "not_3",
    recipientEmail: "recruiting@acme.com",
    recipientRole: UserRole.Employer,
    title: "Urgent: Complete Retention Verification",
    message: "Candidate Eve Polastri is approaching the 60-Day milestone check. Please verify her retention status.",
    channel: "All",
    timestamp: "2026-06-11T09:00:00Z",
    read: false
  }
];

// Initial System Logs
const INITIAL_LOGS: SystemLog[] = [
  {
    id: "log_1",
    eventType: "AUTH",
    description: "System admin logged in successfully.",
    userEmail: "admin@referralplatform.com",
    timestamp: "2026-06-12T04:10:00-07:00",
    ipAddress: "192.168.1.100"
  },
  {
    id: "log_2",
    eventType: "PAYOUT",
    description: "Approved Eve Polastri 30-Day Milestone Payout ($1,800).",
    userEmail: "admin@referralplatform.com",
    timestamp: "2026-06-01T12:00:00Z",
    ipAddress: "192.168.1.100"
  },
  {
    id: "log_3",
    eventType: "CONFIG",
    description: "Referrer Jane Doe account details verified and quality score updated to 94.",
    userEmail: "admin@referralplatform.com",
    timestamp: "2026-06-05T15:00:00Z",
    ipAddress: "192.168.1.102"
  }
];

class DataStore {
  users: UserProfile[];
  jobs: JobListing[];
  referrals: Referral[];
  rewards: RewardRecord[];
  blacklists: BlacklistItem[];
  notifications: NotificationItem[];
  logs: SystemLog[];
  config: PlatformConfig;

  constructor() {
    this.users = getStoredOrDefault("users", INITIAL_USERS);
    this.jobs = getStoredOrDefault("jobs", INITIAL_JOBS);
    this.referrals = getStoredOrDefault("referrals", INITIAL_REFERRALS);
    this.rewards = getStoredOrDefault("rewards", INITIAL_REWARDS);
    this.blacklists = getStoredOrDefault("blacklists", INITIAL_BLACKLISTS);
    this.notifications = getStoredOrDefault("notifications", INITIAL_NOTIFICATIONS);
    this.logs = getStoredOrDefault("logs", INITIAL_LOGS);
    this.config = getStoredOrDefault("config", DEFAULT_CONFIG);
  }

  save() {
    setStored("users", this.users);
    setStored("jobs", this.jobs);
    setStored("referrals", this.referrals);
    setStored("rewards", this.rewards);
    setStored("blacklists", this.blacklists);
    setStored("notifications", this.notifications);
    setStored("logs", this.logs);
    setStored("config", this.config);
  }

  // --- Utility logging ---
  addSystemLog(eventType: SystemLog["eventType"], description: string, userEmail: string) {
    const newLog: SystemLog = {
      id: "log_" + Date.now(),
      eventType,
      description,
      userEmail,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1 (Self-Simulated)"
    };
    this.logs.unshift(newLog);
    this.save();
  }

  addNotification(recipientEmail: string, recipientRole: UserRole, title: string, message: string, channel: NotificationItem["channel"] = "All") {
    const newNotif: NotificationItem = {
      id: "not_" + Date.now(),
      recipientEmail,
      recipientRole,
      title,
      message,
      channel,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.notifications.unshift(newNotif);
    this.save();
  }

  // --- User Profile Handling ---
  registerUser(name: string, email: string, phone: string, role: UserRole, companyName?: string) {
    // Basic verification check: Admins automatically approve most referrers, employers need manual approve
    const id = "user_" + role.toLowerCase() + "_" + Date.now();
    const companyId = companyName ? "company_" + Date.now() : undefined;
    
    const isEmployer = role === UserRole.Employer;
    const verified = !isEmployer; // Referrers start verified for easy immediate MVP testing. Employers pending.
    const status = isEmployer ? AccountStatus.PendingApproval : AccountStatus.Active;

    const newUser: UserProfile = {
      id,
      name,
      email,
      phone,
      role,
      companyId,
      verified,
      status,
      qualityScore: 70, // Default quality score
      joinDate: new Date().toISOString().split("T")[0]
    };

    // If companyId is created, store virtual company details or create a mock job as well in future
    this.users.push(newUser);
    this.save();

    this.addSystemLog("AUTH", `New ${role} registered: ${name} (${email})`, email);
    this.addNotification(email, role, "Welcome to ReferralPlatform!", "Your registration is successful. Discover candidates and secure your rewards.");

    return newUser;
  }

  verifyUser(userId: string, adminEmail: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.verified = true;
      user.status = AccountStatus.Active;
      this.save();
      this.addSystemLog("CONFIG", `Admin approved registration for user: ${user.name}`, adminEmail);
      this.addNotification(user.email, user.role, "Account Approved!", "Your account has been fully reviewed and approved by the administrator.");
    }
  }

  suspendUser(userId: string, adminEmail: string, reason: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = AccountStatus.Suspended;
      this.save();
      this.addSystemLog("MODERATION", `Account suspended: ${user.name} (${user.email}). Reason: ${reason}`, adminEmail);
      this.addNotification(user.email, user.role, "Account Suspended", `Your account has been suspended by administration. Reason: ${reason}`);
    }
  }

  reactivateUser(userId: string, adminEmail: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = AccountStatus.Active;
      this.save();
      this.addSystemLog("MODERATION", `Account reactivated: ${user.name} (${user.email})`, adminEmail);
      this.addNotification(user.email, user.role, "Account Restored", "Your account has been reviewed and reactivated. You are ready to participate on the platform.");
    }
  }

  updateQualityScore(userId: string, score: number, adminEmail: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.qualityScore = Math.max(1, Math.min(100, score));
      this.save();
      this.addSystemLog("CONFIG", `Updated quality score for referrer: ${user.name} to ${user.qualityScore}`, adminEmail);
    }
  }

  // --- Job listings ---
  postJob(companyName: string, title: string, description: string, requirements: string[], compensation: string, rewardAmount: number, employerId: string) {
    const emp = this.users.find(u => u.id === employerId);
    const newJob: JobListing = {
      id: "job_" + Date.now(),
      companyId: emp?.companyId || "company_guest",
      companyName,
      title,
      description,
      requirements,
      compensation,
      rewardAmount,
      status: "Active",
      postedDate: new Date().toISOString().split("T")[0]
    };
    this.jobs.unshift(newJob);
    this.save();

    this.addSystemLog("CONFIG", `New job posted: ${title} at ${companyName}`, emp?.email || "employer@unknown.com");
    // Notify all active referrers about new job
    this.users.filter(u => u.role === UserRole.Referrer).forEach(r => {
      this.addNotification(r.email, UserRole.Referrer, `New Job Opportunity: ${title}`, `Refer your top connections and earn $${rewardAmount} bounty! See ${companyName}'s latest opening.`);
    });

    return newJob;
  }

  // --- Referral lifecycle ---
  submitReferral(jobId: string, referrerId: string, candidateName: string, candidateEmail: string, candidatePhone: string, notes: string, resumeName: string, resumeSummaryText: string) {
    const referrer = this.users.find(u => u.id === referrerId);
    if (!referrer) {
      throw new Error("Invalid referrer account.");
    }
    if (referrer.status === AccountStatus.Suspended) {
      throw new Error("Your referrer account is suspended. Submissions blocked.");
    }

    const job = this.jobs.find(j => j.id === jobId);
    if (!job) {
      throw new Error("Target job posting no longer exists.");
    }

    const cleanedEmail = candidateEmail.trim().toLowerCase();
    const cleanedPhone = candidatePhone.trim().replace(/[\s\-\(\)]/g, "");

    // 1. Blacklist Check
    const isBlacklisted = this.blacklists.some(b => {
      if (b.type === "Email" && b.value.trim().toLowerCase() === cleanedEmail) return true;
      if (b.type === "Phone" && b.value.trim().replace(/[\s\-\(\)]/g, "") === cleanedPhone) return true;
      if (b.type === "Domain") {
        const domain = cleanedEmail.split("@")[1];
        if (domain && domain.toLowerCase() === b.value.trim().toLowerCase()) return true;
      }
      return false;
    });

    if (isBlacklisted) {
      const errMsg = `Submission blocked: Profile associated with ${candidateEmail} contains blacklisted credentials.`;
      this.addSystemLog("REFERRAL_SUBMIT", `Blocked blacklisted submission attempt: ${candidateName} for Job ${job.title}`, referrer.email);
      throw new Error(errMsg);
    }

    // 2. Self Referral Check
    const cleanedRefEmail = referrer.email.trim().toLowerCase();
    const cleanedRefPhone = referrer.phone.trim().replace(/[\s\-\(\)]/g, "");
    if (cleanedEmail === cleanedRefEmail || cleanedPhone === cleanedRefPhone) {
      const errMsg = "Self-Referral Prevention: You are not allowed to refer yourself.";
      this.addSystemLog("REFERRAL_SUBMIT", `Blocked self-referral attempt by ${referrer.name}`, referrer.email);
      throw new Error(errMsg);
    }

    // 3. Rate Limit Check
    const todayStr = new Date().toISOString().split("T")[0];
    const todaySubmissions = this.referrals.filter(ref => {
      return ref.referrerId === referrerId && ref.submittedAt.startsWith(todayStr);
    });

    if (todaySubmissions.length >= this.config.maxReferralsPerDay) {
      const errMsg = `Daily submission rate limit reached (${this.config.maxReferralsPerDay}). Please submit more tomorrow.`;
      this.addSystemLog("REFERRAL_SUBMIT", `Rate limit hit. Submit rejected for ${candidateName}`, referrer.email);
      throw new Error(errMsg);
    }

    // 4. Duplicate Check
    // "If two or more referrers submit the same candidate for the same job, the earliest timestamp is active, subsequent are flagged as duplicate"
    const isDuplicate = this.referrals.some(ref => {
      const matchJob = ref.jobId === jobId;
      const matchCandidate = ref.candidateEmail.trim().toLowerCase() === cleanedEmail || 
                             ref.candidatePhone.trim().replace(/[\s\-\(\)]/g, "") === cleanedPhone;
      return matchJob && matchCandidate && ref.status !== ReferralStatus.Rejected;
    });

    const activeDuplicateRef = this.referrals.find(ref => {
      const matchJob = ref.jobId === jobId;
      const matchCandidate = ref.candidateEmail.trim().toLowerCase() === cleanedEmail;
      return matchJob && matchCandidate && !ref.duplicateFlag;
    });

    const newReferral: Referral = {
      id: "ref_" + Date.now(),
      jobId,
      referrerId,
      candidateName,
      candidateEmail: cleanedEmail,
      candidatePhone: candidatePhone,
      resumeFileName: resumeName,
      resumeTextSummary: resumeSummaryText,
      duplicateFlag: isDuplicate,
      duplicateReferralId: activeDuplicateRef?.id,
      status: ReferralStatus.Submitted,
      submittedAt: new Date().toISOString(),
      notes,
      timeline: [
        {
          stage: ReferralStatus.Submitted,
          timestamp: new Date().toISOString(),
          updatedBy: referrer.id,
          note: isDuplicate 
            ? "Duplicate Referral Flagged: Earlier valid referral occupies this candidate position." 
            : "Referral submitted successfully. Application is pending Employer review."
        }
      ]
    };

    this.referrals.unshift(newReferral);
    this.save();

    this.addSystemLog("REFERRAL_SUBMIT", `Referral of ${candidateName} added for Job ${job.title} by ${referrer.name} (Duplicate: ${isDuplicate})`, referrer.email);

    // Notify Employer
    const employerProfile = this.users.find(u => u.role === UserRole.Employer && u.companyId === job.companyId);
    if (employerProfile) {
      this.addNotification(
        employerProfile.email,
        UserRole.Employer,
        "New Referral Application Received",
        `${referrer.name} referred candidate ${candidateName} for your job opening "${job.title}".`
      );
    }

    // Notify Referrer
    this.addNotification(
      referrer.email,
      UserRole.Referrer,
      isDuplicate ? "Candidate Referral Flagged (Duplicate)" : "Candidate Referral Registered",
      isDuplicate 
        ? `We received your application for ${candidateName}, but an earlier valid referral holds priority. If verified, the payout goes to the earliest referrer details. Admin can override this.`
        : `Your referral application for ${candidateName} has been recorded and submitted to the employer.`
    );

    // Notify Candidate (In-App simulation and Mock log detail)
    this.addNotification(
      cleanedEmail,
      UserRole.Candidate,
      "Application Submitted",
      `Hello ${candidateName}, ${referrer.name} has submitted you as a candidate for the "${job.title}" role at ${job.companyName}. We will keep you updated!`
    );

    return newReferral;
  }

  updateReferralStage(referralId: string, newStage: ReferralStatus, updatedByUserId: string, note?: string) {
    const referral = this.referrals.find(r => r.id === referralId);
    if (!referral) return;

    const job = this.jobs.find(j => j.id === referral.jobId);
    const updater = this.users.find(u => u.id === updatedByUserId);
    const referrer = this.users.find(u => u.id === referral.referrerId);

    if (!job || !updater) return;

    referral.status = newStage;
    referral.timeline.push({
      stage: newStage,
      timestamp: new Date().toISOString(),
      updatedBy: updater.id,
      note: note || `Application updated to ${newStage}`
    });

    this.save();

    this.addSystemLog("STAGES", `Referral ${referral.candidateName} updated to stage ${newStage} by ${updater.name}`, updater.email);

    // Trigger Reward setup if marked Hired
    if (newStage === ReferralStatus.Hired) {
      this.createRewardRecord(referral, job);
    }

    // Notify Referrer
    if (referrer) {
      let title = `Referral Status Update: ${referral.candidateName}`;
      let msg = `Candidate ${referral.candidateName} has been moved to "${newStage}" stage for ${job.title} at ${job.companyName}.`;
      if (newStage === ReferralStatus.Hired) {
        title = "Hooray! Candidate Hired 🎉";
        msg = `Your referral ${referral.candidateName} has been officially hired for ${job.title}! A reward of $${job.rewardAmount} has been locked and retention milestones are now tracking.`;
      } else if (newStage === ReferralStatus.Rejected) {
        title = "Referral Declinature Update";
        msg = `${job.companyName} has decided not to proceed with ${referral.candidateName} for the "${job.title}" role. Thank you for your referral!`;
      }
      this.addNotification(referrer.email, UserRole.Referrer, title, msg);
    }

    // Notify Candidate
    const candidateTitle = `Application Progress: ${job.companyName}`;
    let candidateMsg = `Hi ${referral.candidateName}, your application for "${job.title}" has been updated to stage: ${newStage}.`;
    if (newStage === ReferralStatus.Hired) {
      candidateMsg = `Great news, ${referral.candidateName}! You have been marked as HIRED for ${job.title} at ${job.companyName}. Details are on their way!`;
    } else if (newStage === ReferralStatus.Rejected) {
      candidateMsg = `Hi ${referral.candidateName}, thank you for your patience. Unfortunately, ${job.companyName} has closed this role or advanced other candidates. Keep in touch for other listings.`;
    }
    
    this.addNotification(referral.candidateEmail, UserRole.Candidate, candidateTitle, candidateMsg);
  }

  // --- Reward Operations ---
  createRewardRecord(referral: Referral, job: JobListing) {
    // Check if reward record already exists
    const existing = this.rewards.some(r => r.referralId === referral.id);
    if (existing) return;

    const total = job.rewardAmount;
    const percentages = this.config.milestonePercentages;
    const days = this.config.milestoneDays;

    const milestones: MilestoneReward[] = days.map((dayNum, idx) => {
      const percentage = percentages[idx] || 33.3;
      const amount = Math.round((total * percentage) / 100);
      return {
        id: `m_${dayNum}_${Date.now()}`,
        days: dayNum,
        percentage,
        amount,
        status: MilestoneStatus.Locked
      };
    });

    const newReward: RewardRecord = {
      id: "rew_" + Date.now(),
      referralId: referral.id,
      referrerId: referral.referrerId,
      jobId: referral.jobId,
      candidateName: referral.candidateName,
      jobTitle: job.title,
      companyName: job.companyName,
      totalAmount: total,
      lockedAmount: total,
      releasedAmount: 0,
      status: RewardStatus.Locked,
      milestones,
      lastUpdated: new Date().toISOString()
    };

    this.rewards.push(newReward);
    this.save();

    this.addSystemLog("PAYOUT", `Created and Locked Reward structure for ${referral.candidateName}. Total: $${total}`, "system@referralplatform.com");
  }

  confirmMilestoneRetention(rewardId: string, milestoneIdx: number, employerUserId: string) {
    const reward = this.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    const employer = this.users.find(u => u.id === employerUserId);
    if (!employer) return;

    const mil = reward.milestones[milestoneIdx];
    if (mil && mil.status === MilestoneStatus.Locked) {
      mil.status = MilestoneStatus.Eligible; // Verified by employer, now eligible for Admin release!
      reward.lastUpdated = new Date().toISOString();
      this.save();

      this.addSystemLog("PAYOUT", `Employer verified retention milestone Day ${mil.days} for candidate ${reward.candidateName}`, employer.email);

      // Notify Admin
      const admins = this.users.filter(u => u.role === UserRole.Admin);
      admins.forEach(admin => {
        this.addNotification(
          admin.email,
          UserRole.Admin,
          "Urgent: Reward Payout Approval Required",
          `Employer ${employer.name} at ${reward.companyName} confirmed retention milestone Day ${mil.days} for candidate ${reward.candidateName}. Payout $${mil.amount} is ready for approval.`
        );
      });

      // Notify Referrer
      const referrer = this.users.find(u => u.id === reward.referrerId);
      if (referrer) {
        this.addNotification(
          referrer.email,
          UserRole.Referrer,
          `Retention Confirmed: Day ${mil.days}`,
          `The employer ${reward.companyName} has verified that ${reward.candidateName} completed ${mil.days} days! Payout $${mil.amount} is being processed for Admin release.`
        );
      }
    }
  }

  processAdminPayout(rewardId: string, milestoneIdx: number, adminEmail: string, action: "RELEASE" | "HOLD" | "DISPUTE") {
    const reward = this.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    const mil = reward.milestones[milestoneIdx];
    if (!mil) return;

    const referrer = this.users.find(u => u.id === reward.referrerId);
    const previousStatus = mil.status;

    if (action === "RELEASE") {
      mil.status = MilestoneStatus.Paid;
      mil.approvedDate = new Date().toISOString();

      reward.releasedAmount += mil.amount;
      reward.lockedAmount = Math.max(0, reward.lockedAmount - mil.amount);

      // check if all milestones paid
      const allPaid = reward.milestones.every(m => m.status === MilestoneStatus.Paid);
      reward.status = allPaid ? RewardStatus.FullyPaid : RewardStatus.PartialReleased;
      reward.lastUpdated = new Date().toISOString();

      this.save();

      this.addSystemLog("PAYOUT", `Admin approved and released payout of $${mil.amount} for ${reward.candidateName}, milestone Day ${mil.days}`, adminEmail);

      // If all paid, close referral loop
      const referral = this.referrals.find(ref => ref.id === reward.referralId);
      if (referral && allPaid) {
        this.addSystemLog("REFERRAL_SUBMIT", `Referral lifecycle complete for ${reward.candidateName}`, "system@referralplatform.com");
      }

      // Notify Referrer
      if (referrer) {
        this.addNotification(
          referrer.email,
          UserRole.Referrer,
          allPaid ? "Platform Final Payout Received! 💰" : "Retention Milestone Payout Released Part 1",
          allPaid 
            ? `Your Final Milestone Payout has been approved! Total bounty of $${reward.totalAmount} is now fully paid. Thank you for using our platform.`
            : `Your recruitment milestone Day ${mil.days} ($${mil.amount}) was approved! Locked reserves reduced. Keep track of subsequent checkpoints.`
        );
      }

    } else if (action === "HOLD") {
      mil.status = MilestoneStatus.Hold;
      reward.status = RewardStatus.OnHold;
      reward.lastUpdated = new Date().toISOString();
      this.save();

      this.addSystemLog("PAYOUT", `Admin placed hold on payout milestone Day ${mil.days} for candidate ${reward.candidateName}`, adminEmail);

      if (referrer) {
        this.addNotification(
          referrer.email,
          UserRole.Referrer,
          "Milestone Payout on Temporary Hold",
          `Payout of $${mil.amount} for candidate ${reward.candidateName} was placed on status HOLD by the Administrator. We will contact you shortly if verification is required.`
        );
      }
    } else if (action === "DISPUTE") {
      mil.status = MilestoneStatus.Hold;
      reward.status = RewardStatus.Disputed;
      reward.lastUpdated = new Date().toISOString();
      this.save();

      this.addSystemLog("DISPUTE", `Disputed: Payout milestone Day ${mil.days} for candidate ${reward.candidateName} put in dispute`, adminEmail);

      if (referrer) {
        this.addNotification(
          referrer.email,
          UserRole.Referrer,
          "Reward Payout Flagged as Disputed",
          `Your milestone payment for ${reward.candidateName} (${reward.companyName}) is disputed. Administration is investigating the retention claim.`
        );
      }
    }
  }

  resolveDispute(rewardId: string, resolution: "RELEASE_ALL" | "CANCEL_REWARD" | "KEEP_AS_IS", adminEmail: string, resolutionNotes: string) {
    const reward = this.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    this.addSystemLog("DISPUTE", `Resolving dispute for ${reward.candidateName}. Mode: ${resolution}. Notes: ${resolutionNotes}`, adminEmail);

    if (resolution === "RELEASE_ALL") {
      // Find all hold/eligible milestones and release them
      reward.milestones.forEach((mil, idx) => {
        if (mil.status === MilestoneStatus.Hold || mil.status === MilestoneStatus.Eligible) {
          mil.status = MilestoneStatus.Paid;
          mil.approvedDate = new Date().toISOString();
          reward.releasedAmount += mil.amount;
          reward.lockedAmount = Math.max(0, reward.lockedAmount - mil.amount);
        }
      });
      reward.status = RewardStatus.FullyPaid;
    } else if (resolution === "CANCEL_REWARD") {
      reward.status = RewardStatus.OnHold;
      // Mark unlocked/eligible milestones as locked/hold
      reward.milestones.forEach(mil => {
        if (mil.status !== MilestoneStatus.Paid) {
          mil.status = MilestoneStatus.Locked;
          mil.disputeNotes = resolutionNotes;
        }
      });
    } else {
      reward.status = RewardStatus.Locked;
    }
    reward.lastUpdated = new Date().toISOString();
    this.save();

    const referrer = this.users.find(u => u.id === reward.referrerId);
    if (referrer) {
      this.addNotification(
        referrer.email,
        UserRole.Referrer,
        "Dispute Resolution Finalized",
        `Resolution logged for ${reward.candidateName}. Resolution Status: ${resolution}. Detail: ${resolutionNotes}`
      );
    }
  }

  overrideDuplicateStatus(referralId: string, adminEmail: string) {
    const referral = this.referrals.find(r => r.id === referralId);
    if (!referral) return;

    const previousFlag = referral.duplicateFlag;
    referral.duplicateFlag = false; // Override flag to FALSE, rendering it valid!
    referral.timeline.push({
      stage: "DUPLICATE_OVERRIDE",
      timestamp: new Date().toISOString(),
      updatedBy: "admin",
      note: "Admin administrative manual override. Marked duplicate referral as VALID and eligible for rewards."
    });

    this.save();

    this.addSystemLog("MODERATION", `Manual override on duplicate referral ID ${referralId} (${referral.candidateName}). Checked as VALID.`, adminEmail);

    const referrer = this.users.find(u => u.id === referral.referrerId);
    if (referrer) {
      this.addNotification(
        referrer.email,
        UserRole.Referrer,
        "Referral Priority Override Success!",
        `Congratulations! The Administrator reviewed your flagged duplicate referral for ${referral.candidateName} and manual overrode the priority. Your referral is now valid!`
      );
    }
  }

  // --- Blacklist management ---
  addBlacklistItem(value: string, type: "Email" | "Domain" | "Phone", reason: string, adminEmail: string) {
    const newItem: BlacklistItem = {
      id: "bl_" + Date.now(),
      value: value.trim().toLowerCase(),
      type,
      reason,
      dateAdded: new Date().toISOString().split("T")[0]
    };
    this.blacklists.unshift(newItem);
    this.save();

    this.addSystemLog("MODERATION", `Blacklist added: ${type} "${value}" due to: ${reason}`, adminEmail);
    return newItem;
  }

  removeBlacklistItem(id: string, adminEmail: string) {
    const idx = this.blacklists.findIndex(b => b.id === id);
    if (idx !== -1) {
      const item = this.blacklists[idx];
      this.blacklists.splice(idx, 1);
      this.save();
      this.addSystemLog("MODERATION", `Blacklist removed: ${item.type} "${item.value}"`, adminEmail);
    }
  }

  // --- Configurations ---
  updateConfig(milestoneDays: number[], milestonePercentages: number[], maxReferralsPerDay: number, adminEmail: string) {
    this.config = {
      milestoneDays,
      milestonePercentages,
      maxReferralsPerDay
    };
    this.save();
    this.addSystemLog("CONFIG", `Updated platform configs: Milestones [${milestoneDays.join(", ")}], rate limit: ${maxReferralsPerDay} p/d`, adminEmail);
  }

  clearAllDataForSeeding() {
    this.users = INITIAL_USERS;
    this.jobs = INITIAL_JOBS;
    this.referrals = INITIAL_REFERRALS;
    this.rewards = INITIAL_REWARDS;
    this.blacklists = INITIAL_BLACKLISTS;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.logs = INITIAL_LOGS;
    this.config = DEFAULT_CONFIG;
    this.save();
    this.addSystemLog("CONFIG", "Simulated database re-seeded to factory metrics.", "system@referralplatform.com");
  }
}

export const dbStore = new DataStore();
