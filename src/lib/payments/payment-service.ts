/**
 * Payment Service
 * 
 * This module provides payment processing functionality including
 * Stripe integration, escrow management, and payment history.
 */

import { z } from 'zod';

// ============================================================================
// Types
// ============================================================================

/**
 * Payment status
 */
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'requires_action'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
  | 'in_escrow'
  | 'released';

/**
 * Payment method types
 */
export type PaymentMethodType = 'card' | 'bank_account' | 'apple_pay' | 'google_pay';

/**
 * Finance option types
 */
export type FinanceOption = 'full_payment' | 'installments_3' | 'installments_12' | 'financing';

/**
 * Payment method
 */
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  last4: string;
  brand?: string; // For cards
  bankName?: string; // For bank accounts
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
}

/**
 * Payment intent
 */
export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethodId?: string;
  metadata?: Record<string, string>;
}

/**
 * Payment record
 */
export interface Payment {
  id: string;
  jobId: string;
  jobTitle: string;
  payerId: string;
  payeeId: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  status: PaymentStatus;
  financeOption: FinanceOption;
  paymentMethodId: string;
  escrowReleaseDate?: string;
  refundedAmount?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/**
 * Installment plan
 */
export interface InstallmentPlan {
  totalAmount: number;
  installmentCount: number;
  installmentAmount: number;
  processingFee: number;
  schedule: {
    dueDate: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
    paidAt?: string;
  }[];
}

/**
 * Payout record
 */
export interface Payout {
  id: string;
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  method: 'instant' | 'standard';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  destinationId: string;
  requestedAt: string;
  completedAt?: string;
}

/**
 * Earnings summary
 */
export interface EarningsSummary {
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  escrowBalance: number;
  totalPaidOut: number;
}

// ============================================================================
// Validation Schemas
// ============================================================================

export const addCardSchema = z.object({
  number: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.number().min(new Date().getFullYear()),
  cvc: z.string().regex(/^\d{3,4}$/, 'Invalid CVC'),
  name: z.string().min(2, 'Cardholder name is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
});

export const bankAccountSchema = z.object({
  routingNumber: z.string().regex(/^\d{9}$/, 'Invalid routing number'),
  accountNumber: z.string().min(4).max(17),
  accountType: z.enum(['checking', 'savings']),
  accountHolderName: z.string().min(2),
});

export const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  paymentMethodId: z.string().uuid(),
  jobId: z.string().uuid(),
  financeOption: z.enum(['full_payment', 'installments_3', 'installments_12', 'financing']),
});

export const refundSchema = z.object({
  paymentId: z.string().uuid(),
  amount: z.number().positive().optional(), // Full refund if not specified
  reason: z.string().min(10),
});

// ============================================================================
// Constants
// ============================================================================

const PLATFORM_FEE = 20; // $20 flat fee for homeowners
const INSTALLMENT_3_FEE_PERCENT = 0.02; // 2% for 3-month installments
const INSTANT_PAYOUT_FEE = 1.5; // 1.5% for instant payouts
const STANDARD_PAYOUT_FEE = 0; // Free for standard payouts

// ============================================================================
// Payment Methods
// ============================================================================

/**
 * Get saved payment methods
 */
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  // In production, this would call the API
  // Mock data for now
  return [
    {
      id: 'pm_1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

/**
 * Add a new payment method
 */
export async function addPaymentMethod(
  type: PaymentMethodType,
  data: z.infer<typeof addCardSchema> | z.infer<typeof bankAccountSchema>
): Promise<PaymentMethod> {
  // In production, this would call Stripe and the backend API
  const method: PaymentMethod = {
    id: 'pm_' + Date.now(),
    type,
    last4: type === 'card' 
      ? (data as z.infer<typeof addCardSchema>).number.slice(-4)
      : (data as z.infer<typeof bankAccountSchema>).accountNumber.slice(-4),
    brand: type === 'card' ? 'Visa' : undefined,
    bankName: type === 'bank_account' ? 'Chase' : undefined,
    isDefault: false,
    createdAt: new Date().toISOString(),
  };
  
  return method;
}

/**
 * Delete a payment method
 */
export async function deletePaymentMethod(methodId: string): Promise<void> {
  // In production, this would call the API
  console.log('Deleted payment method:', methodId);
}

/**
 * Set default payment method
 */
export async function setDefaultPaymentMethod(methodId: string): Promise<void> {
  // In production, this would call the API
  console.log('Set default payment method:', methodId);
}

// ============================================================================
// Payment Processing
// ============================================================================

/**
 * Create a payment intent
 */
export async function createPaymentIntent(
  amount: number,
  jobId: string,
  payeeId: string,
  financeOption: FinanceOption = 'full_payment'
): Promise<PaymentIntent> {
  // Calculate fees
  const platformFee = PLATFORM_FEE;
  let totalAmount = amount + platformFee;
  
  if (financeOption === 'installments_3') {
    totalAmount += amount * INSTALLMENT_3_FEE_PERCENT;
  }
  
  // In production, this would call Stripe
  const intent: PaymentIntent = {
    id: 'pi_' + Date.now(),
    clientSecret: 'secret_' + Date.now(),
    amount: Math.round(totalAmount * 100), // Convert to cents
    currency: 'usd',
    status: 'pending',
    metadata: {
      jobId,
      payeeId,
      platformFee: String(platformFee),
      financeOption,
    },
  };
  
  return intent;
}

/**
 * Confirm a payment
 */
export async function confirmPayment(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<Payment> {
  // In production, this would confirm with Stripe and create the payment record
  const payment: Payment = {
    id: 'pay_' + Date.now(),
    jobId: 'job_123',
    jobTitle: 'Home Repair',
    payerId: 'user_payer',
    payeeId: 'user_payee',
    amount: 1000,
    platformFee: PLATFORM_FEE,
    netAmount: 1000 - PLATFORM_FEE,
    currency: 'usd',
    status: 'in_escrow',
    financeOption: 'full_payment',
    paymentMethodId,
    escrowReleaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return payment;
}

/**
 * Release escrow payment to contractor
 */
export async function releaseEscrow(paymentId: string): Promise<Payment> {
  // In production, this would update the payment and trigger payout
  const payment: Payment = {
    id: paymentId,
    jobId: 'job_123',
    jobTitle: 'Home Repair',
    payerId: 'user_payer',
    payeeId: 'user_payee',
    amount: 1000,
    platformFee: PLATFORM_FEE,
    netAmount: 1000 - PLATFORM_FEE,
    currency: 'usd',
    status: 'released',
    financeOption: 'full_payment',
    paymentMethodId: 'pm_123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };
  
  return payment;
}

/**
 * Process refund
 */
export async function processRefund(
  paymentId: string,
  amount?: number,
  reason?: string
): Promise<Payment> {
  // In production, this would process refund through Stripe
  const payment: Payment = {
    id: paymentId,
    jobId: 'job_123',
    jobTitle: 'Home Repair',
    payerId: 'user_payer',
    payeeId: 'user_payee',
    amount: 1000,
    platformFee: PLATFORM_FEE,
    netAmount: 1000 - PLATFORM_FEE,
    currency: 'usd',
    status: amount ? 'partially_refunded' : 'refunded',
    financeOption: 'full_payment',
    paymentMethodId: 'pm_123',
    refundedAmount: amount || 1000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return payment;
}

// ============================================================================
// Installment Plans
// ============================================================================

/**
 * Calculate installment plan
 */
export function calculateInstallmentPlan(
  amount: number,
  option: FinanceOption
): InstallmentPlan | null {
  if (option === 'full_payment' || option === 'financing') {
    return null;
  }
  
  const installmentCount = option === 'installments_3' ? 3 : 12;
  const feePercent = option === 'installments_3' ? INSTALLMENT_3_FEE_PERCENT : 0;
  const processingFee = amount * feePercent;
  const totalAmount = amount + processingFee;
  const installmentAmount = Math.ceil(totalAmount / installmentCount * 100) / 100;
  
  const schedule = Array.from({ length: installmentCount }, (_, i) => {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    
    return {
      dueDate: dueDate.toISOString(),
      amount: i === installmentCount - 1 
        ? totalAmount - (installmentAmount * (installmentCount - 1))
        : installmentAmount,
      status: 'pending' as const,
    };
  });
  
  return {
    totalAmount,
    installmentCount,
    installmentAmount,
    processingFee,
    schedule,
  };
}

// ============================================================================
// Payouts (for Contractors)
// ============================================================================

/**
 * Get earnings summary
 */
export async function getEarningsSummary(userId: string): Promise<EarningsSummary> {
  // In production, this would call the API
  return {
    totalEarnings: 15000,
    availableBalance: 8500,
    pendingBalance: 2500,
    escrowBalance: 4000,
    totalPaidOut: 12000,
  };
}

/**
 * Request payout
 */
export async function requestPayout(
  amount: number,
  method: 'instant' | 'standard' = 'standard',
  destinationId?: string
): Promise<Payout> {
  const fee = method === 'instant' 
    ? Math.round(amount * INSTANT_PAYOUT_FEE / 100 * 100) / 100
    : STANDARD_PAYOUT_FEE;
  
  const payout: Payout = {
    id: 'payout_' + Date.now(),
    amount,
    fee,
    netAmount: amount - fee,
    currency: 'usd',
    method,
    status: 'pending',
    destinationId: destinationId || 'bank_default',
    requestedAt: new Date().toISOString(),
  };
  
  return payout;
}

/**
 * Get payout history
 */
export async function getPayoutHistory(userId: string): Promise<Payout[]> {
  // In production, this would call the API
  return [
    {
      id: 'payout_1',
      amount: 1500,
      fee: 0,
      netAmount: 1500,
      currency: 'usd',
      method: 'standard',
      status: 'completed',
      destinationId: 'bank_1',
      requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// ============================================================================
// Payment History
// ============================================================================

/**
 * Get payment history
 */
export async function getPaymentHistory(
  userId: string,
  options?: {
    role?: 'payer' | 'payee';
    status?: PaymentStatus;
    limit?: number;
    offset?: number;
  }
): Promise<Payment[]> {
  // In production, this would call the API
  return [
    {
      id: 'pay_1',
      jobId: 'job_1',
      jobTitle: 'Kitchen Renovation',
      payerId: userId,
      payeeId: 'contractor_1',
      amount: 5000,
      platformFee: PLATFORM_FEE,
      netAmount: 5000 - PLATFORM_FEE,
      currency: 'usd',
      status: 'succeeded',
      financeOption: 'full_payment',
      paymentMethodId: 'pm_1',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

/**
 * Calculate platform fee
 */
export function calculatePlatformFee(): number {
  return PLATFORM_FEE;
}

/**
 * Check if payment is refundable
 */
export function isRefundable(payment: Payment): boolean {
  const refundableStatuses: PaymentStatus[] = ['succeeded', 'in_escrow', 'released'];
  const daysSincePayment = (Date.now() - new Date(payment.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  
  return refundableStatuses.includes(payment.status) && daysSincePayment <= 30;
}

// ============================================================================
// React Hook
// ============================================================================

/**
 * React hook for payments
 */
export function usePayments() {
  return {
    getPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    createPaymentIntent,
    confirmPayment,
    releaseEscrow,
    processRefund,
    calculateInstallmentPlan,
    getEarningsSummary,
    requestPayout,
    getPayoutHistory,
    getPaymentHistory,
    formatCurrency,
    calculatePlatformFee,
    isRefundable,
  };
}

export default {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  createPaymentIntent,
  confirmPayment,
  releaseEscrow,
  processRefund,
  calculateInstallmentPlan,
  getEarningsSummary,
  requestPayout,
  getPayoutHistory,
  getPaymentHistory,
  formatCurrency,
  calculatePlatformFee,
  isRefundable,
  usePayments,
};
