/**
 * Unit Tests for Payment Service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage before importing the module
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

import {
  formatCurrency,
  calculatePlatformFee,
  calculateInstallmentPlan,
  isRefundable,
  getPaymentMethods,
  getEarningsSummary,
  type Payment,
  type FinanceOption,
} from '../src/lib/payments/payment-service';

describe('Payment Service', () => {
  beforeEach(() => {
    localStorageMock.store = {};
    vi.clearAllMocks();
  });

  describe('formatCurrency', () => {
    it('formats USD amounts correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1500.50)).toBe('$1,500.50');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles decimal amounts', () => {
      expect(formatCurrency(99.99)).toBe('$99.99');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('formats large amounts with comma separators', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('calculatePlatformFee', () => {
    it('returns the correct platform fee', () => {
      const fee = calculatePlatformFee();
      expect(fee).toBe(20); // $20 flat fee
    });
  });

  describe('calculateInstallmentPlan', () => {
    it('returns null for full payment option', () => {
      const plan = calculateInstallmentPlan(1000, 'full_payment');
      expect(plan).toBeNull();
    });

    it('returns null for financing option', () => {
      const plan = calculateInstallmentPlan(1000, 'financing');
      expect(plan).toBeNull();
    });

    it('calculates 3-month installment plan correctly', () => {
      const plan = calculateInstallmentPlan(1000, 'installments_3');
      
      expect(plan).not.toBeNull();
      expect(plan?.installmentCount).toBe(3);
      expect(plan?.totalAmount).toBeGreaterThan(1000); // Includes fee
      expect(plan?.schedule.length).toBe(3);
    });

    it('calculates 12-month installment plan correctly', () => {
      const plan = calculateInstallmentPlan(1200, 'installments_12');
      
      expect(plan).not.toBeNull();
      expect(plan?.installmentCount).toBe(12);
      expect(plan?.schedule.length).toBe(12);
    });

    it('installment schedule has correct structure', () => {
      const plan = calculateInstallmentPlan(600, 'installments_3');
      
      expect(plan).not.toBeNull();
      plan?.schedule.forEach(installment => {
        expect(installment).toHaveProperty('dueDate');
        expect(installment).toHaveProperty('amount');
        expect(installment).toHaveProperty('status');
        expect(installment.status).toBe('pending');
      });
    });
  });

  describe('isRefundable', () => {
    it('returns true for succeeded payments within 30 days', () => {
      const payment: Payment = {
        id: 'pay_123',
        jobId: 'job_123',
        jobTitle: 'Test Job',
        payerId: 'user_1',
        payeeId: 'user_2',
        amount: 1000,
        platformFee: 20,
        netAmount: 980,
        currency: 'usd',
        status: 'succeeded',
        financeOption: 'full_payment',
        paymentMethodId: 'pm_123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      expect(isRefundable(payment)).toBe(true);
    });

    it('returns true for in_escrow payments', () => {
      const payment: Payment = {
        id: 'pay_123',
        jobId: 'job_123',
        jobTitle: 'Test Job',
        payerId: 'user_1',
        payeeId: 'user_2',
        amount: 1000,
        platformFee: 20,
        netAmount: 980,
        currency: 'usd',
        status: 'in_escrow',
        financeOption: 'full_payment',
        paymentMethodId: 'pm_123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      expect(isRefundable(payment)).toBe(true);
    });

    it('returns false for pending payments', () => {
      const payment: Payment = {
        id: 'pay_123',
        jobId: 'job_123',
        jobTitle: 'Test Job',
        payerId: 'user_1',
        payeeId: 'user_2',
        amount: 1000,
        platformFee: 20,
        netAmount: 980,
        currency: 'usd',
        status: 'pending',
        financeOption: 'full_payment',
        paymentMethodId: 'pm_123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      expect(isRefundable(payment)).toBe(false);
    });

    it('returns false for payments older than 30 days', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31);
      
      const payment: Payment = {
        id: 'pay_123',
        jobId: 'job_123',
        jobTitle: 'Test Job',
        payerId: 'user_1',
        payeeId: 'user_2',
        amount: 1000,
        platformFee: 20,
        netAmount: 980,
        currency: 'usd',
        status: 'succeeded',
        financeOption: 'full_payment',
        paymentMethodId: 'pm_123',
        createdAt: oldDate.toISOString(),
        updatedAt: oldDate.toISOString(),
      };
      
      expect(isRefundable(payment)).toBe(false);
    });
  });

  describe('getPaymentMethods', () => {
    it('returns an array of payment methods', async () => {
      const methods = await getPaymentMethods();
      
      expect(Array.isArray(methods)).toBe(true);
    });

    it('payment methods have required properties', async () => {
      const methods = await getPaymentMethods();
      
      methods.forEach(method => {
        expect(method).toHaveProperty('id');
        expect(method).toHaveProperty('type');
        expect(method).toHaveProperty('last4');
        expect(method).toHaveProperty('isDefault');
      });
    });
  });

  describe('getEarningsSummary', () => {
    it('returns earnings summary for a user', async () => {
      const summary = await getEarningsSummary('user_123');
      
      expect(summary).toHaveProperty('totalEarnings');
      expect(summary).toHaveProperty('availableBalance');
      expect(summary).toHaveProperty('pendingBalance');
      expect(summary).toHaveProperty('escrowBalance');
      expect(summary).toHaveProperty('totalPaidOut');
    });

    it('all amounts are non-negative', async () => {
      const summary = await getEarningsSummary('user_123');
      
      expect(summary.totalEarnings).toBeGreaterThanOrEqual(0);
      expect(summary.availableBalance).toBeGreaterThanOrEqual(0);
      expect(summary.pendingBalance).toBeGreaterThanOrEqual(0);
      expect(summary.escrowBalance).toBeGreaterThanOrEqual(0);
      expect(summary.totalPaidOut).toBeGreaterThanOrEqual(0);
    });
  });
});
