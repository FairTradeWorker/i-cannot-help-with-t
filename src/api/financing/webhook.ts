import { dataStore } from '@/lib/store';
import { calculateReferralCredit } from '@/lib/utils';
import type { FinancingWebhookPayload, FinancingApplication } from '@/lib/types';

interface WebhookResponse {
  success: boolean;
  message: string;
  data?: {
    applicationId: string;
    jobId: string;
    creditAmount?: number;
    jobAutoAccepted?: boolean;
  };
  error?: string;
}

function computeHmacSha256(payload: string, secret: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const keyData = encoder.encode(secret);
  
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data[i] + keyData[i % keyData.length]) | 0;
  }
  return hash.toString(16);
}

function validateWebhookSignature(signature: string, payload: string, secret: string): boolean {
  if (!signature || !secret) {
    return false;
  }
  
  const expectedSignature = computeHmacSha256(payload, secret);
  return signature === expectedSignature;
}

function getWebhookSecret(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_HEARTH_WEBHOOK_SECRET || '';
  }
  return '';
}

export async function processFinancingWebhook(
  payload: FinancingWebhookPayload,
  signature?: string
): Promise<WebhookResponse> {
  try {
    const webhookSecret = getWebhookSecret();
    
    if (webhookSecret && signature) {
      if (!validateWebhookSignature(signature, JSON.stringify(payload), webhookSecret)) {
        return {
          success: false,
          message: 'Invalid webhook signature',
          error: 'INVALID_SIGNATURE',
        };
      }
    }

    switch (payload.eventType) {
      case 'application.approved':
        return await handleApprovalEvent(payload);
      case 'application.declined':
        return await handleDeclineEvent(payload);
      case 'application.completed':
        return await handleCompletedEvent(payload);
      default:
        return {
          success: false,
          message: `Unknown event type: ${payload.eventType}`,
          error: 'UNKNOWN_EVENT_TYPE',
        };
    }
  } catch (error) {
    console.error('Financing webhook processing error:', error);
    return {
      success: false,
      message: 'Internal error processing webhook',
      error: error instanceof Error ? error.message : 'INTERNAL_ERROR',
    };
  }
}

async function handleApprovalEvent(payload: FinancingWebhookPayload): Promise<WebhookResponse> {
  const { jobId, applicationId, amount, homeownerId, contractorId, monthlyPayment, term, apr } = payload;

  const creditAmount = calculateReferralCredit(amount);

  const financingApplication: FinancingApplication = {
    id: applicationId,
    jobId,
    homeownerId,
    contractorId,
    amount,
    monthlyPayment,
    term,
    apr,
    status: 'approved',
    hearthApplicationId: payload.hearthApplicationId,
    warrantyBundled: false,
    referralCredit: creditAmount,
    createdAt: new Date(),
    approvedAt: new Date(),
  };

  await saveFinancingApplication(financingApplication);

  let jobAutoAccepted = false;
  if (contractorId) {
    try {
      const job = await dataStore.getJobById(jobId);
      if (job && job.status === 'posted') {
        job.status = 'assigned';
        job.contractorId = contractorId;
        job.updatedAt = new Date();
        await dataStore.saveJob(job);
        jobAutoAccepted = true;

        await dataStore.addNotification({
          id: `notif-fin-${Date.now()}`,
          userId: contractorId,
          type: 'bid_accepted',
          title: 'New Financed Job Assigned!',
          message: `A financed job "${job.title}" has been automatically assigned to you. Credit: $${creditAmount}`,
          data: { jobId, financingApplicationId: applicationId, creditAmount },
          read: false,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error auto-accepting job:', error);
    }
  }

  if (creditAmount > 0 && contractorId) {
    await creditContractorAccount(contractorId, creditAmount, jobId, applicationId);
  }

  return {
    success: true,
    message: 'Financing approval processed successfully',
    data: {
      applicationId,
      jobId,
      creditAmount,
      jobAutoAccepted,
    },
  };
}

async function handleDeclineEvent(payload: FinancingWebhookPayload): Promise<WebhookResponse> {
  const { jobId, applicationId, homeownerId } = payload;

  const financingApplication: FinancingApplication = {
    id: applicationId,
    jobId,
    homeownerId,
    amount: payload.amount,
    monthlyPayment: 0,
    term: 0,
    apr: 0,
    status: 'declined',
    hearthApplicationId: payload.hearthApplicationId,
    warrantyBundled: false,
    createdAt: new Date(),
  };

  await saveFinancingApplication(financingApplication);

  return {
    success: true,
    message: 'Financing decline processed',
    data: {
      applicationId,
      jobId,
    },
  };
}

async function handleCompletedEvent(payload: FinancingWebhookPayload): Promise<WebhookResponse> {
  const { jobId, applicationId } = payload;

  const existingApplication = await getFinancingApplication(applicationId);
  if (existingApplication) {
    existingApplication.status = 'completed';
    existingApplication.completedAt = new Date();
    await saveFinancingApplication(existingApplication);
  }

  return {
    success: true,
    message: 'Financing completion processed',
    data: {
      applicationId,
      jobId,
    },
  };
}

async function saveFinancingApplication(application: FinancingApplication): Promise<void> {
  const storageKey = `financing_${application.id}`;
  localStorage.setItem(storageKey, JSON.stringify(application));

  const applicationsIndex = localStorage.getItem('financing_applications_index');
  const index: string[] = applicationsIndex ? JSON.parse(applicationsIndex) : [];
  if (!index.includes(application.id)) {
    index.push(application.id);
    localStorage.setItem('financing_applications_index', JSON.stringify(index));
  }
}

async function getFinancingApplication(applicationId: string): Promise<FinancingApplication | null> {
  const storageKey = `financing_${applicationId}`;
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    const parsed = JSON.parse(stored);
    parsed.createdAt = new Date(parsed.createdAt);
    if (parsed.approvedAt) parsed.approvedAt = new Date(parsed.approvedAt);
    if (parsed.completedAt) parsed.completedAt = new Date(parsed.completedAt);
    return parsed;
  }
  return null;
}

async function creditContractorAccount(
  contractorId: string,
  amount: number,
  jobId: string,
  financingApplicationId: string
): Promise<void> {
  const creditEntry = {
    id: `credit-${Date.now()}`,
    contractorId,
    amount,
    type: 'financing_referral',
    description: `Financing referral credit for job ${jobId}`,
    jobId,
    financingApplicationId,
    createdAt: new Date(),
  };

  const creditsKey = `contractor_credits_${contractorId}`;
  const existingCredits = localStorage.getItem(creditsKey);
  const credits: typeof creditEntry[] = existingCredits ? JSON.parse(existingCredits) : [];
  credits.push(creditEntry);
  localStorage.setItem(creditsKey, JSON.stringify(credits));

  console.log(`Credited contractor ${contractorId} with $${amount} for financing referral`);
}

export async function getContractorCredits(contractorId: string): Promise<{
  totalCredits: number;
  creditHistory: Array<{
    id: string;
    amount: number;
    type: string;
    description: string;
    createdAt: Date;
  }>;
}> {
  const creditsKey = `contractor_credits_${contractorId}`;
  const existingCredits = localStorage.getItem(creditsKey);
  const credits = existingCredits ? JSON.parse(existingCredits) : [];

  const totalCredits = credits.reduce((sum: number, c: { amount: number }) => sum + c.amount, 0);

  return {
    totalCredits,
    creditHistory: credits.map((c: { createdAt: string | Date }) => ({
      ...c,
      createdAt: new Date(c.createdAt),
    })),
  };
}
