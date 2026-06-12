export enum UserRole {
  Employer = "Employer",
  Referrer = "Referrer",
  Candidate = "Candidate",
  Admin = "Admin"
}

export enum AccountStatus {
  Active = "Active",
  Suspended = "Suspended",
  PendingApproval = "PendingApproval"
}

export enum ReferralStatus {
  Submitted = "Submitted",
  Shortlisted = "Shortlisted",
  Interview = "Interview",
  Hired = "Hired",
  Rejected = "Rejected"
}

export enum RewardStatus {
  Locked = "Locked",
  PartialReleased = "Partial Released",
  FullyPaid = "Fully Paid",
  Disputed = "Disputed",
  OnHold = "On Hold"
}

export enum MilestoneStatus {
  Locked = "Locked",
  Eligible = "Eligible",
  Paid = "Paid",
  Hold = "Hold"
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  companyId?: string;
  verified: boolean;
  status: AccountStatus;
  qualityScore: number; // Internal Admin eye score (1-100)
  joinDate: string;
}

export interface JobListing {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  requirements: string[];
  compensation: string;
  rewardAmount: number;
  status: "Active" | "Closed";
  postedDate: string;
}

export interface ReferralTimelineEvent {
  stage: ReferralStatus | string;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface Referral {
  id: string;
  jobId: string;
  referrerId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  resumeFileName: string;
  resumeTextSummary?: string;
  duplicateFlag: boolean;
  duplicateReferralId?: string;
  status: ReferralStatus;
  timeline: ReferralTimelineEvent[];
  notes: string;
  submittedAt: string;
}

export interface MilestoneReward {
  id: string;
  days: number;
  percentage: number;
  amount: number;
  status: MilestoneStatus;
  approvedDate?: string;
  disputeNotes?: string;
}

export interface RewardRecord {
  id: string;
  referralId: string;
  referrerId: string;
  jobId: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  totalAmount: number;
  lockedAmount: number;
  releasedAmount: number;
  status: RewardStatus;
  milestones: MilestoneReward[];
  lastUpdated: string;
}

export interface BlacklistItem {
  id: string;
  value: string; // e.g., "scammer@gmail.com", "cheatdomain.com", "0712345678"
  type: "Email" | "Domain" | "Phone";
  reason: string;
  dateAdded: string;
}

export interface NotificationItem {
  id: string;
  recipientEmail: string;
  recipientRole: UserRole;
  title: string;
  message: string;
  channel: "Email" | "WhatsApp" | "In-App" | "All";
  timestamp: string;
  read: boolean;
}

export interface SystemLog {
  id: string;
  eventType: "AUTH" | "REFERRAL_SUBMIT" | "STAGES" | "PAYOUT" | "DISPUTE" | "MODERATION" | "CONFIG";
  description: string;
  userEmail: string;
  timestamp: string;
  ipAddress: string;
}

export interface PlatformConfig {
  milestoneDays: number[]; // e.g., [30, 60, 90]
  milestonePercentages: number[]; // e.g., [30, 30, 40]
  maxReferralsPerDay: number; // rate limit
}
