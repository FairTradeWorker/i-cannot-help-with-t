// TERRITORY PRICING: New $500 + $20/mo model
import { getFirst300Count, isFirst300Complete, recordFirst300Claim, type First300Claim } from './first300';
import { hashEntityIdentifier, type EntityType } from './territory-validation';

export interface TerritoryPricing {
  isFirst300: boolean;
  initialFee: number;
  monthlyFee: number;
  priorityStatus: 'first_priority' | 'second_priority';
  description: string;
}

/**
 * Get pricing for territory claim
 */
export async function getTerritoryPricing(
  entityType: EntityType,
  email: string,
  userId: string,
  taxId?: string
): Promise<TerritoryPricing> {
  const isComplete = await isFirst300Complete();
  const count = await getFirst300Count();
  
  // Check if this entity is already in First 300
  let isFirst300 = false;
  if (!isComplete && count > 0) {
    // Check if entity already has a First 300 claim
    try {
      const entityHash = await hashEntityIdentifier(entityType, email, userId, taxId);
      const claims = await window.spark.kv.get<First300Claim[]>('first300-claimed-zips');
      isFirst300 = claims?.some(c => c.entityHash === entityHash && c.priorityStatus === 'first_priority') || false;
    } catch (error) {
      console.error('Failed to check First 300 status:', error);
    }
  }

  if (isFirst300 || (!isComplete && count > 0)) {
    return {
      isFirst300: true,
      initialFee: 0,
      monthlyFee: 0,
      priorityStatus: 'first_priority',
      description: 'First Priority — Forever Free'
    };
  }

  return {
    isFirst300: false,
    initialFee: 500,
    monthlyFee: 20,
    priorityStatus: 'second_priority', // Will be upgraded to first_priority after payment
    description: '$500 one-time + $20/month to maintain First Priority'
  };
}

/**
 * Process territory claim with pricing
 */
export async function processTerritoryClaim(
  zip: string,
  entityType: EntityType,
  email: string,
  userId: string,
  taxId?: string
): Promise<{ success: boolean; priorityStatus: 'first_priority' | 'second_priority'; requiresPayment: boolean }> {
  const pricing = await getTerritoryPricing(entityType, email, userId, taxId);
  const isComplete = await isFirst300Complete();
  const count = await getFirst300Count();

  // If in First 300, record claim
  if (pricing.isFirst300 && count > 0 && !isComplete) {
    try {
      const entityHash = await hashEntityIdentifier(entityType, email, userId, taxId);
      const claim: First300Claim = {
        zip,
        userId,
        entityHash,
        claimedAt: new Date(),
        priorityStatus: 'first_priority'
      };
      await recordFirst300Claim(claim);
      return { success: true, priorityStatus: 'first_priority', requiresPayment: false };
    } catch (error) {
      console.error('Failed to record First 300 claim:', error);
      return { success: false, priorityStatus: 'second_priority', requiresPayment: true };
    }
  }

  // After First 300, requires payment
  return { success: true, priorityStatus: 'second_priority', requiresPayment: true };
}

