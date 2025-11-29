// Payment Service for Stripe Integration
// Territory claiming and subscription payments

import { apiClient } from '@fairtradeworker/shared';

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: Date;
  planId: string;
}

export class PaymentService {
  /**
   * Create payment intent for territory claim
   */
  async createTerritoryPaymentIntent(
    territoryId: string,
    amount: number,
    zipCode: string
  ): Promise<PaymentIntent> {
    try {
      const response = await apiClient.post<PaymentIntent>('/payments/create-intent', {
        territoryId,
        amount,
        zipCode,
        type: 'territory_claim',
      });
      return response;
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Create subscription for First Priority monthly fee
   */
  async createSubscription(
    territoryId: string,
    priceId: string
  ): Promise<Subscription> {
    try {
      const response = await apiClient.post<Subscription>('/payments/subscription', {
        territoryId,
        priceId,
      });
      return response;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await apiClient.post(`/payments/subscription/${subscriptionId}/cancel`);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Get subscription status
   */
  async getSubscription(territoryId: string): Promise<Subscription | null> {
    try {
      const response = await apiClient.get<Subscription>(`/payments/subscription/${territoryId}`);
      return response;
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return null;
    }
  }

  /**
   * Confirm payment with Stripe
   */
  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; error?: string }>(
        '/payments/confirm',
        {
          paymentIntentId,
          paymentMethodId,
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      return { success: false, error: 'Payment confirmation failed' };
    }
  }
}

export const paymentService = new PaymentService();

