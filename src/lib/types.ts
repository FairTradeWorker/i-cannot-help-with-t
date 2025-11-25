export type UserRole = 'homeowner' | 'contractor' | 'territory_owner';

export type JobStatus = 'draft' | 'posted' | 'bidding' | 'assigned' | 'in_progress' | 'completed' | 'disputed';

export type UrgencyLevel = 'normal' | 'urgent' | 'emergency';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  contractorProfile?: ContractorProfile;
  homeownerProfile?: HomeownerProfile;
  legalConsents?: LegalConsents;
  dataPrivacyConsent?: DataPrivacyConsent;
}

export interface LegalConsents {
  termsOfService: boolean;
  privacyPolicy: boolean;
  contractorAgreement?: boolean;
  independentContractorStatus?: boolean;
  territoryOwnerAgreement?: boolean;
  territoryRiskDisclosure?: boolean;
  dataProcessing: boolean;
  tcpaConsent: boolean;
  disputeResolution: boolean;
  acceptedAt: Date;
  ipAddress: string;
  userAgent: string;
}

export interface DataPrivacyConsent {
  userId: string;
  gdprConsent: boolean;
  ccpaConsent: boolean;
  tcpaConsent: boolean;
  marketingConsent: boolean;
  dataProcessingConsent: boolean;
  consentDate: Date;
  ipAddress: string;
  userAgent: string;
}

export interface ContractorProfile {
  userId: string;
  rating: number;
  completedJobs: number;
  skills: string[];
  serviceRadius: number;
  location: { lat: number; lng: number; address: string };
  hourlyRate: number;
  availability: 'available' | 'busy' | 'unavailable';
  verified: boolean;
  licenses: License[];
  insurance: Insurance;
  territoryId?: string;
}

export interface HomeownerProfile {
  userId: string;
  savedAddresses: Address[];
  completedProjects: number;
  loyaltyPoints: number;
}

export interface License {
  type: string;
  number: string;
  state: string;
  expiryDate: Date;
  verified: boolean;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  expiryDate: Date;
  coverageAmount: number;
  verified: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  homeownerId: string;
  contractorId?: string;
  address: Address;
  urgency: UrgencyLevel;
  videoUrl?: string;
  scope?: JobScope;
  estimatedCost: { min: number; max: number };
  actualCost?: number;
  laborHours: number;
  createdAt: Date;
  updatedAt: Date;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  completedAt?: Date;
  bids: Bid[];
  messages: Message[];
  milestones: Milestone[];
  rating?: Rating;
}

export interface JobScope {
  jobTitle: string;
  summary: string;
  estimatedSquareFootage: number;
  materials: Material[];
  laborHours: number;
  estimatedCost: { min: number; max: number };
  confidenceScore: number;
  recommendations: string[];
  warningsAndRisks: string[];
  permitRequired: boolean;
}

export interface Material {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  supplier?: string;
  ordered?: boolean;
}

export interface Bid {
  id: string;
  jobId: string;
  contractorId: string;
  contractor: {
    name: string;
    rating: number;
    completedJobs: number;
    avatar?: string;
    hourlyRate: number;
  };
  amount: number;
  timeline: { start: Date; end: Date };
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: Date;
  breakdown?: {
    materials: number;
    labor: number;
    overhead: number;
    profit: number;
  };
}

export interface Message {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
  read: boolean;
}

export interface Attachment {
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  size: number;
}

export interface Milestone {
  id: string;
  jobId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  amount: number;
  photos?: string[];
  completedAt?: Date;
  approvedAt?: Date;
}

export interface Rating {
  jobId: string;
  contractorId: string;
  homeownerId: string;
  overallScore: number;
  professionalism: number;
  quality: number;
  communication: number;
  timeliness: number;
  cleanliness: number;
  comment?: string;
  photos?: string[];
  createdAt: Date;
  response?: {
    comment: string;
    createdAt: Date;
  };
}

export interface Earnings {
  contractorId: string;
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  jobs: EarningEntry[];
  payouts: Payout[];
}

export interface EarningEntry {
  jobId: string;
  jobTitle: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: 'pending' | 'available' | 'paid_out';
  completedAt: Date;
}

export interface Payout {
  id: string;
  amount: number;
  method: 'instant' | 'standard';
  fee: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  completedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'job_posted' | 'bid_received' | 'bid_accepted' | 'message' | 'milestone_completed' | 'payment_received' | 'rating_received';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

export interface Territory {
  id: string;
  name: string;
  zipCodes: string[];
  ownerId: string;
  price: number;
  revenueShare: number;
  contractors: string[];
  stats: {
    totalJobs: number;
    activeContractors: number;
    averageRating: number;
    totalRevenue: number;
  };
  purchasedAt: Date;
}
