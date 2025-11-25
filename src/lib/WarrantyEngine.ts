/**
 * WarrantyEngine - Scaling warranty calculation engine
 * 
 * Features:
 * - Auto-calculate warranty price based on job total
 * - 10/15/20/25-year tier options
 * - Smart tier recommendations
 * - Rounding to nearest $50
 * - 52% commission rate
 */

export interface WarrantyTier {
  id: string;
  name: string;
  years: number;
  /** Price multiplier based on job total */
  priceMultiplier: number;
  /** Features included in this tier */
  features: string[];
  /** Whether this tier is recommended */
  recommended?: boolean;
}

export interface WarrantyQuote {
  tier: WarrantyTier;
  /** Total warranty price (rounded to nearest $50) */
  price: number;
  /** Your commission (52% of price) */
  commission: number;
  /** Monthly payment if financed */
  monthlyPayment: number;
}

export interface WarrantyRecommendation {
  recommendedTier: WarrantyTier;
  allQuotes: WarrantyQuote[];
  reason: string;
}

/** The 52% commission rate you keep */
export const COMMISSION_RATE = 0.52;

/** Warranty tier definitions with price multipliers */
export const WARRANTY_TIERS: WarrantyTier[] = [
  {
    id: 'standard-10',
    name: '10-Year Standard',
    years: 10,
    priceMultiplier: 0.08,
    features: [
      'Workmanship coverage',
      'Material defects coverage',
      'Annual inspection',
      'Phone support (M-F 9-5)',
      'Transferable once',
    ],
  },
  {
    id: 'extended-15',
    name: '15-Year Extended',
    years: 15,
    priceMultiplier: 0.12,
    features: [
      'Everything in 10-Year Standard',
      'Extended coverage period',
      'Priority service response',
      'Bi-annual inspections',
      'Extended phone support (M-Sat)',
      'Unlimited transfers',
    ],
  },
  {
    id: 'premium-20',
    name: '20-Year Premium',
    years: 20,
    priceMultiplier: 0.18,
    features: [
      'Everything in 15-Year Extended',
      'Emergency 24/7 support',
      'Dedicated warranty manager',
      'Quarterly inspections',
      'Coverage for wear and tear',
      'Cosmetic repairs included',
    ],
  },
  {
    id: 'platinum-25',
    name: '25-Year Platinum',
    years: 25,
    priceMultiplier: 0.26,
    features: [
      'Everything in 20-Year Premium',
      'Maximum coverage period',
      'White-glove concierge service',
      'Full replacement guarantee',
      'Acts of nature coverage',
      'Zero deductible claims',
      'VIP priority scheduling',
    ],
  },
];

/**
 * Rounds a value to the nearest $50
 */
export function roundToNearest50(value: number): number {
  return Math.round(value / 50) * 50;
}

/**
 * Calculate warranty quote for a specific tier and job total
 */
export function calculateWarrantyQuote(
  jobTotal: number,
  tier: WarrantyTier
): WarrantyQuote {
  const rawPrice = jobTotal * tier.priceMultiplier;
  const price = roundToNearest50(rawPrice);
  const commission = Math.round(price * COMMISSION_RATE * 100) / 100;
  
  // Calculate monthly payment for 12-month financing
  const monthlyPayment = Math.round((price / 12) * 100) / 100;

  return {
    tier,
    price,
    commission,
    monthlyPayment,
  };
}

/**
 * Calculate all warranty quotes for a given job total
 */
export function calculateAllWarrantyQuotes(jobTotal: number): WarrantyQuote[] {
  return WARRANTY_TIERS.map((tier) => calculateWarrantyQuote(jobTotal, tier));
}

/** Job total thresholds for tier recommendations */
export const RECOMMENDATION_THRESHOLDS = {
  SMALL_JOB_MAX: 5000,
  MEDIUM_JOB_MAX: 15000,
  LARGE_JOB_MAX: 30000,
} as const;

/** Tier IDs for easy reference */
export const TIER_IDS = {
  STANDARD_10: 'standard-10',
  EXTENDED_15: 'extended-15',
  PREMIUM_20: 'premium-20',
  PLATINUM_25: 'platinum-25',
} as const;

/**
 * Get a warranty tier by its ID
 */
export function getTierById(tierId: string): WarrantyTier | undefined {
  return WARRANTY_TIERS.find((tier) => tier.id === tierId);
}

/**
 * Get recommended warranty tier based on job total
 * 
 * Recommendation logic:
 * - Jobs under $5,000: Recommend 10-Year Standard
 * - Jobs $5,000 - $15,000: Recommend 15-Year Extended
 * - Jobs $15,000 - $30,000: Recommend 20-Year Premium
 * - Jobs over $30,000: Recommend 25-Year Platinum
 */
export function getRecommendedTier(jobTotal: number): WarrantyTier {
  const { SMALL_JOB_MAX, MEDIUM_JOB_MAX, LARGE_JOB_MAX } = RECOMMENDATION_THRESHOLDS;
  
  if (jobTotal < SMALL_JOB_MAX) {
    return getTierById(TIER_IDS.STANDARD_10) || WARRANTY_TIERS[0];
  } else if (jobTotal < MEDIUM_JOB_MAX) {
    return getTierById(TIER_IDS.EXTENDED_15) || WARRANTY_TIERS[1];
  } else if (jobTotal < LARGE_JOB_MAX) {
    return getTierById(TIER_IDS.PREMIUM_20) || WARRANTY_TIERS[2];
  } else {
    return getTierById(TIER_IDS.PLATINUM_25) || WARRANTY_TIERS[3];
  }
}

/**
 * Get reason for warranty recommendation
 */
function getRecommendationReason(jobTotal: number, tier: WarrantyTier): string {
  const { SMALL_JOB_MAX, MEDIUM_JOB_MAX, LARGE_JOB_MAX } = RECOMMENDATION_THRESHOLDS;
  
  if (jobTotal >= LARGE_JOB_MAX) {
    return `For premium jobs over $${LARGE_JOB_MAX.toLocaleString()}, the ${tier.name} provides maximum protection with full replacement guarantee and zero-deductible claims.`;
  } else if (jobTotal >= MEDIUM_JOB_MAX) {
    return `For significant investments of $${MEDIUM_JOB_MAX.toLocaleString()}+, the ${tier.name} offers comprehensive coverage with 24/7 emergency support.`;
  } else if (jobTotal >= SMALL_JOB_MAX) {
    return `For mid-range projects, the ${tier.name} balances value with excellent coverage and priority service.`;
  } else {
    return `For smaller projects, the ${tier.name} provides solid protection at an affordable price point.`;
  }
}

/**
 * Get complete warranty recommendation with all quotes
 */
export function getWarrantyRecommendation(
  jobTotal: number
): WarrantyRecommendation {
  const recommendedTier = getRecommendedTier(jobTotal);
  const allQuotes = calculateAllWarrantyQuotes(jobTotal);
  const reason = getRecommendationReason(jobTotal, recommendedTier);

  // Mark the recommended tier
  const quotesWithRecommendation = allQuotes.map((quote) => ({
    ...quote,
    tier: {
      ...quote.tier,
      recommended: quote.tier.id === recommendedTier.id,
    },
  }));

  return {
    recommendedTier,
    allQuotes: quotesWithRecommendation,
    reason,
  };
}

/**
 * Get the platinum tier quote for the big upsell button
 */
export function getPlatinumQuote(jobTotal: number): WarrantyQuote {
  const platinumTier = getTierById(TIER_IDS.PLATINUM_25) || WARRANTY_TIERS[3];
  return calculateWarrantyQuote(jobTotal, platinumTier);
}

/**
 * Format warranty price for display
 */
export function formatWarrantyPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

/**
 * Format the upsell button text
 */
export function formatUpsellButtonText(quote: WarrantyQuote): string {
  return `Add ${quote.tier.years}-Year ${quote.tier.name.split(' ').pop()} (+${formatWarrantyPrice(quote.price)})`;
}
