// Types shared with web app - kept in sync with src/types from main app

export type UserRole = 'homeowner' | 'contractor' | 'operator' | 'general_contractor' | 'subcontractor' | 'partner' | 'admin';
export type ContractorType = 'general_contractor' | 'subcontractor';

export type JobStatus = 'draft' | 'posted' | 'bidding' | 'assigned' | 'in_progress' | 'completed' | 'disputed';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type FinanceOption = 'full_payment' | 'installments' | 'financing';

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
  expoPushToken?: string;
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
  contractorType: ContractorType;
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
  operatorId?: string;
  specialties?: string[];
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
  imageUrls?: string[];
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
  jobId?: string;
  conversationId?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  jobId?: string;
}

export interface Attachment {
  type: 'image' | 'video' | 'document' | 'voice';
  url: string;
  name: string;
  size: number;
  duration?: number;
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
  type: 'job_posted' | 'bid_received' | 'bid_accepted' | 'message' | 'milestone_completed' | 'payment_received' | 'rating_received' | 'dispatch_ping';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

export interface Territory {
  id: string;
  name: string;
  stateCode: string;
  zipCodes: string[];
  operatorId?: string;
  monthlyPrice: number;
  operatorRevenueShare: number;
  approvedContractors: string[];
  generalContractors: string[];
  subcontractors: string[];
  stats: {
    totalJobs: number;
    monthlyJobVolume: number;
    activeContractors: number;
    averageRating: number;
    totalRevenue: number;
    monthlyRevenue: number;
    operatorEarnings: number;
  };
  purchasedAt?: Date;
  available: boolean;
}

export interface OperatorProfile {
  userId: string;
  territories: string[];
  totalInvestment: number;
  monthlyEarnings: number;
  totalEarnings: number;
  approvedContractors: number;
}

export interface Payment {
  id: string;
  jobId: string;
  homeownerId: string;
  contractorId: string;
  amount: number;
  status: PaymentStatus;
  financeOption: FinanceOption;
  installmentPlan?: {
    totalInstallments: number;
    paidInstallments: number;
    installmentAmount: number;
    nextDueDate: Date;
  };
  createdAt: Date;
  completedAt?: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  status: 'pending' | 'completed' | 'rewarded';
  reward: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Analytics {
  totalUsers: number;
  totalContractors: number;
  totalHomeowners: number;
  totalOperators: number;
  totalJobs: number;
  completedJobs: number;
  totalRevenue: number;
  averageJobValue: number;
  platformAccuracy: number;
  topStates: { state: string; jobs: number }[];
  topServices: { service: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  learningMetrics: {
    totalPredictions: number;
    averageAccuracy: number;
    improvementRate: number;
  };
}

// Lightning Dispatch™ Types
export type JobAssignmentStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'reassigned';

export interface JobAssignment {
  id: string;
  jobId: string;
  contractorId: string;
  status: JobAssignmentStatus;
  dispatchRound: number;
  distanceToJob: number;
  createdAt: Date;
  expiresAt: Date;
  respondedAt?: Date;
  pushNotificationId?: string;
}

export interface DispatchPingRequest {
  jobId: string;
  jobLocation: { lat: number; lng: number };
  jobType: string;
  estimatedValue: number;
  urgency: UrgencyLevel;
}

export interface DispatchPingResponse {
  success: boolean;
  dispatchId: string;
  contractorsNotified: number;
  assignments: JobAssignment[];
  nextDispatchAt?: Date;
}

// Intelligence API Types
export interface APIKey {
  id: string;
  key: string;
  userId: string;
  name: string;
  tier: 'free' | 'professional' | 'enterprise';
  status: 'active' | 'revoked' | 'expired';
  callsUsed: number;
  callsLimit: number;
  resetDate: Date;
  createdAt: Date;
  lastUsedAt?: Date;
  permissions: string[];
}

export interface APIUsage {
  apiKeyId: string;
  endpoint: string;
  timestamp: Date;
  responseTime: number;
  statusCode: number;
  requestId: string;
  metadata?: any;
}

export interface LearningFeedback {
  id: string;
  predictionId: string;
  endpoint: string;
  timestamp: Date;
  prediction: any;
  actualOutcome?: any;
  accuracyScore?: number;
  errorMargin?: number;
  userFeedback?: {
    rating: number;
    wasAccurate: boolean;
    comments?: string;
  };
  learningContext: {
    totalPredictions: number;
    avgAccuracy: number;
    confidenceAdjustment: number;
  };
}
