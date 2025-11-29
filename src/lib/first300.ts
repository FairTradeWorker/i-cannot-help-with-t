// FIRST 300: Core logic for First 300 launch system
// Tracks countdown and claimed territories

export const FIRST_300_TOTAL = 300;
export const FIRST_300_KEY = 'first300-count';
export const FIRST_300_CLAIMED_KEY = 'first300-claimed-zips';

export interface First300Claim {
  zip: string;
  userId: string;
  entityHash: string;
  claimedAt: Date;
  priorityStatus: 'first_priority' | 'second_priority';
}

/**
 * Get current countdown (starts at 300, counts down)
 */
export async function getFirst300Count(): Promise<number> {
  try {
    const count = await window.spark.kv.get<number>(FIRST_300_KEY);
    // Initialize if not exists
    if (count === null || count === undefined) {
      await window.spark.kv.set(FIRST_300_KEY, FIRST_300_TOTAL);
      return FIRST_300_TOTAL;
    }
    return count;
  } catch (error) {
    console.error('Failed to get First 300 count:', error);
    return FIRST_300_TOTAL;
  }
}

/**
 * Decrement countdown when territory is claimed
 */
export async function decrementFirst300Count(): Promise<number> {
  try {
    const current = await getFirst300Count();
    if (current > 0) {
      const newCount = current - 1;
      await window.spark.kv.set(FIRST_300_KEY, newCount);
      return newCount;
    }
    return 0;
  } catch (error) {
    console.error('Failed to decrement First 300 count:', error);
    return 0;
  }
}

/**
 * Get all claimed zips for First 300
 */
export async function getFirst300ClaimedZips(): Promise<First300Claim[]> {
  try {
    const claims = await window.spark.kv.get<First300Claim[]>(FIRST_300_CLAIMED_KEY);
    return claims || [];
  } catch (error) {
    console.error('Failed to get First 300 claimed zips:', error);
    return [];
  }
}

/**
 * Record a First 300 claim
 */
export async function recordFirst300Claim(claim: First300Claim): Promise<void> {
  try {
    const existing = await getFirst300ClaimedZips();
    const updated = [...existing, claim];
    await window.spark.kv.set(FIRST_300_CLAIMED_KEY, updated);
    
    // Decrement count if still in First 300
    const count = await getFirst300Count();
    if (count > 0) {
      await decrementFirst300Count();
    }
  } catch (error) {
    console.error('Failed to record First 300 claim:', error);
    throw error;
  }
}

/**
 * Check if user is in First 300
 */
export async function isFirst300Claim(zip: string): Promise<boolean> {
  try {
    const claims = await getFirst300ClaimedZips();
    return claims.some(c => c.zip === zip && c.priorityStatus === 'first_priority');
  } catch (error) {
    console.error('Failed to check First 300 claim:', error);
    return false;
  }
}

/**
 * Check if countdown has reached zero
 */
export async function isFirst300Complete(): Promise<boolean> {
  const count = await getFirst300Count();
  return count <= 0;
}

