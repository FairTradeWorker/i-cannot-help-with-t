// TERRITORY PRICING: Stripe subscription logic for $20/mo First Priority
// This handles the subscription creation and management for First Priority status

export interface FirstPrioritySubscription {
  subscriptionId: string;
  customerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodEnd: Date;
  territoryZip: string;
  userId: string;
}

const FIRST_PRIORITY_PRICE_ID = 'price_first_priority_monthly'; // Replace with actual Stripe Price ID

/**
 * Create Stripe subscription for First Priority status
 */
export async function createFirstPrioritySubscription(
  userId: string,
  territoryZip: string,
  paymentMethodId: string
): Promise<FirstPrioritySubscription> {
  // In production, this would call Stripe API
  // For now, simulate the subscription creation
  
  const subscription: FirstPrioritySubscription = {
    subscriptionId: `sub_${Date.now()}`,
    customerId: `cus_${userId}`,
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    territoryZip,
    userId
  };

  // Store subscription in KV
  await window.spark.kv.set(`first-priority-sub:${userId}:${territoryZip}`, subscription);
  
  return subscription;
}

/**
 * Check if subscription is active
 */
export async function isFirstPriorityActive(
  userId: string,
  territoryZip: string
): Promise<boolean> {
  try {
    const subscription = await window.spark.kv.get<FirstPrioritySubscription>(
      `first-priority-sub:${userId}:${territoryZip}`
    );
    
    if (!subscription) return false;
    
    // Check if subscription is active and not expired
    if (subscription.status === 'active' && subscription.currentPeriodEnd > new Date()) {
      return true;
    }
    
    // If expired or canceled, downgrade to Second Priority
    if (subscription.status !== 'active' || subscription.currentPeriodEnd <= new Date()) {
      await downgradeToSecondPriority(userId, territoryZip);
      return false;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to check First Priority status:', error);
    return false;
  }
}

/**
 * Downgrade to Second Priority when subscription lapses
 */
export async function downgradeToSecondPriority(
  userId: string,
  territoryZip: string
): Promise<void> {
  try {
    // Update territory priority status in KV
    const claims = await window.spark.kv.get<any[]>('first300-claimed-zips');
    if (claims) {
      const updated = claims.map(claim => {
        if (claim.zip === territoryZip && claim.userId === userId) {
          return { ...claim, priorityStatus: 'second_priority' };
        }
        return claim;
      });
      await window.spark.kv.set('first300-claimed-zips', updated);
    }
    
    console.log(`Downgraded ${territoryZip} to Second Priority for user ${userId}`);
  } catch (error) {
    console.error('Failed to downgrade to Second Priority:', error);
  }
}

/**
 * Cancel subscription (user-initiated)
 */
export async function cancelFirstPrioritySubscription(
  userId: string,
  territoryZip: string
): Promise<void> {
  try {
    const subscription = await window.spark.kv.get<FirstPrioritySubscription>(
      `first-priority-sub:${userId}:${territoryZip}`
    );
    
    if (subscription) {
      // In production, cancel via Stripe API
      // For now, mark as canceled
      subscription.status = 'canceled';
      await window.spark.kv.set(`first-priority-sub:${userId}:${territoryZip}`, subscription);
      
      // Downgrade to Second Priority
      await downgradeToSecondPriority(userId, territoryZip);
    }
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
}

