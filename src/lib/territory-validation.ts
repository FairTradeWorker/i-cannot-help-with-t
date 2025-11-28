export type EntityType = 'Individual' | 'LLC' | 'Corporation';

/**
 * Simple SHA-256 hash function for browser
 */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface TerritoryClaimRequest {
  entityType: EntityType;
  userId: string;
  email: string;
  taxId?: string; // EIN for LLC/Corporation
  territoryId: string;
}

export interface TerritoryOwnership {
  entityHash: string;
  entityType: EntityType;
  userId: string;
  email: string;
  territoryIds: string[];
  claimedAt: Date;
}

/**
 * Hash entity identifier for one-license-per-entity validation
 * For LLC/Corporation: hash EIN
 * For Individual: hash email + userId
 */
export async function hashEntityIdentifier(
  entityType: EntityType,
  email: string,
  userId: string,
  taxId?: string
): Promise<string> {
  let identifier: string;

  if (entityType === 'LLC' || entityType === 'Corporation') {
    if (!taxId) {
      throw new Error(`${entityType} requires a Tax ID (EIN)`);
    }
    // Normalize EIN (remove dashes, spaces)
    identifier = taxId.replace(/[-\s]/g, '').toUpperCase();
  } else {
    // Individual: hash email + userId
    identifier = `${email.toLowerCase()}:${userId}`;
  }

  // Create SHA-256 hash
  return await sha256(identifier);
}

/**
 * Check if entity already owns a territory
 */
export async function checkEntityOwnership(
  entityHash: string
): Promise<TerritoryOwnership | null> {
  // In production, this would query the database
  // For now, check localStorage/sessionStorage
  try {
    const stored = localStorage.getItem(`territory_owner_${entityHash}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to check entity ownership:', error);
  }
  return null;
}

/**
 * Validate territory claim request
 */
export async function validateTerritoryClaim(
  request: TerritoryClaimRequest
): Promise<{
  valid: boolean;
  error?: string;
  entityHash?: string;
  existingOwnership?: TerritoryOwnership;
}> {
  // Validate required fields
  if (!request.email || !request.userId || !request.territoryId) {
    return {
      valid: false,
      error: 'Missing required fields'
    };
  }

  // Validate entity type specific requirements
  if ((request.entityType === 'LLC' || request.entityType === 'Corporation') && !request.taxId) {
    return {
      valid: false,
      error: `${request.entityType} requires a Tax ID (EIN)`
    };
  }

  // Validate EIN format (basic check)
  if (request.taxId) {
    const einRegex = /^\d{2}-?\d{7}$/;
    const normalizedEIN = request.taxId.replace(/[-\s]/g, '');
    if (normalizedEIN.length !== 9 || !/^\d{9}$/.test(normalizedEIN)) {
      return {
        valid: false,
        error: 'Invalid EIN format. EIN must be 9 digits.'
      };
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.email)) {
    return {
      valid: false,
      error: 'Invalid email format'
    };
  }

  // Hash entity identifier
  let entityHash: string;
  try {
    entityHash = await hashEntityIdentifier(
      request.entityType,
      request.email,
      request.userId,
      request.taxId
    );
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Failed to hash entity identifier'
    };
  }

  // Check if entity already owns a territory
  const existingOwnership = await checkEntityOwnership(entityHash);

  if (existingOwnership) {
    // Check if they're trying to claim the same territory
    if (existingOwnership.territoryIds.includes(request.territoryId)) {
      return {
        valid: false,
        error: 'You already own this territory',
        entityHash,
        existingOwnership
      };
    }

    // Check if they're trying to claim a different territory (one-license rule)
    return {
      valid: false,
      error: `This ${request.entityType} already owns ${existingOwnership.territoryIds.length} territory/territories. Only one territory per entity is allowed.`,
      entityHash,
      existingOwnership
    };
  }

  return {
    valid: true,
    entityHash
  };
}

/**
 * Record territory ownership
 */
export async function recordTerritoryOwnership(
  entityHash: string,
  request: TerritoryClaimRequest
): Promise<void> {
  const ownership: TerritoryOwnership = {
    entityHash,
    entityType: request.entityType,
    userId: request.userId,
    email: request.email,
    territoryIds: [request.territoryId],
    claimedAt: new Date()
  };

  // In production, this would save to database
  // For now, save to localStorage
  try {
    localStorage.setItem(`territory_owner_${entityHash}`, JSON.stringify(ownership));
  } catch (error) {
    console.error('Failed to record territory ownership:', error);
    throw error;
  }
}

/**
 * Get owned territories for an entity
 */
export async function getOwnedTerritories(
  entityType: EntityType,
  email: string,
  userId: string,
  taxId?: string
): Promise<string[]> {
  try {
    const entityHash = await hashEntityIdentifier(entityType, email, userId, taxId);
    const ownership = await checkEntityOwnership(entityHash);
    return ownership?.territoryIds || [];
  } catch (error) {
    console.error('Failed to get owned territories:', error);
    return [];
  }
}

