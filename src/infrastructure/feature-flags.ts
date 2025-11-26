/**
 * Feature Flags System
 * Controls infrastructure tier activation based on usage thresholds
 * Start with free tiers, auto-upgrade as usage grows
 */

export type InfrastructureTier = 
  | 'free'          // $0/mo - Launch tier
  | 'starter'       // $25/mo - 100+ users
  | 'growth'        // $65/mo - 1K+ users
  | 'scale'         // $165/mo - 5K+ users
  | 'kubernetes'    // $665/mo - 10K+ users
  | 'multi-region'  // $2.5K/mo - 50K+ users
  | 'enterprise';   // $5K+/mo - 100K+ users

export interface FeatureFlags {
  // Database
  supabasePro: boolean;
  connectionPooling: boolean;
  readReplicas: boolean;
  
  // Caching
  redisPro: boolean;
  globalRedisCluster: boolean;
  aiResponseCaching: boolean;
  
  // Infrastructure
  kubernetes: boolean;
  multiRegion: boolean;
  autoScaling: boolean;
  
  // Monitoring
  sentryEnabled: boolean;
  datadogEnabled: boolean;
  customDashboards: boolean;
  
  // CDN & Security
  cloudflareProEnabled: boolean;
  wafEnabled: boolean;
  ddosProtection: boolean;
  
  // Queue System
  bullmqEnabled: boolean;
  priorityQueues: boolean;
  
  // API Gateway
  kongGateway: boolean;
  rateLimiting: boolean;
  apiVersioning: boolean;
}

export interface UsageMetrics {
  totalUsers: number;
  activeUsers24h: number;
  dailyApiRequests: number;
  databaseSizeMB: number;
  monthlyRedisRequests: number;
  monthlyOpenAICalls: number;
  averageResponseTimeMs: number;
  errorRate: number;
}

export interface UpgradeThreshold {
  tier: InfrastructureTier;
  triggers: {
    minUsers?: number;
    minDailyRequests?: number;
    minDatabaseSizeMB?: number;
    minRedisRequests?: number;
  };
  monthlyCost: number;
  features: Partial<FeatureFlags>;
}

// Upgrade thresholds as specified in the comment
export const UPGRADE_THRESHOLDS: UpgradeThreshold[] = [
  {
    tier: 'free',
    triggers: { minUsers: 0 },
    monthlyCost: 0,
    features: {
      supabasePro: false,
      redisPro: false,
      kubernetes: false,
      multiRegion: false,
      sentryEnabled: true, // Free tier
      cloudflareProEnabled: false,
      bullmqEnabled: false,
      kongGateway: false,
    }
  },
  {
    tier: 'starter',
    triggers: { minUsers: 100, minDatabaseSizeMB: 500 },
    monthlyCost: 25,
    features: {
      supabasePro: true,
      connectionPooling: true,
      redisPro: false,
      sentryEnabled: true,
    }
  },
  {
    tier: 'growth',
    triggers: { minUsers: 1000, minRedisRequests: 10000 },
    monthlyCost: 65,
    features: {
      supabasePro: true,
      connectionPooling: true,
      redisPro: true,
      aiResponseCaching: true,
      bullmqEnabled: true,
    }
  },
  {
    tier: 'scale',
    triggers: { minUsers: 5000 },
    monthlyCost: 165,
    features: {
      supabasePro: true,
      connectionPooling: true,
      redisPro: true,
      aiResponseCaching: true,
      bullmqEnabled: true,
      datadogEnabled: true,
      customDashboards: true,
      rateLimiting: true,
    }
  },
  {
    tier: 'kubernetes',
    triggers: { minUsers: 10000 },
    monthlyCost: 665,
    features: {
      supabasePro: true,
      connectionPooling: true,
      readReplicas: true,
      redisPro: true,
      globalRedisCluster: false,
      aiResponseCaching: true,
      kubernetes: true,
      autoScaling: true,
      bullmqEnabled: true,
      priorityQueues: true,
      datadogEnabled: true,
      customDashboards: true,
      kongGateway: true,
      rateLimiting: true,
      apiVersioning: true,
    }
  },
  {
    tier: 'multi-region',
    triggers: { minUsers: 50000 },
    monthlyCost: 2500,
    features: {
      supabasePro: true,
      connectionPooling: true,
      readReplicas: true,
      redisPro: true,
      globalRedisCluster: true,
      aiResponseCaching: true,
      kubernetes: true,
      multiRegion: true,
      autoScaling: true,
      bullmqEnabled: true,
      priorityQueues: true,
      sentryEnabled: true,
      datadogEnabled: true,
      customDashboards: true,
      cloudflareProEnabled: true,
      wafEnabled: true,
      ddosProtection: true,
      kongGateway: true,
      rateLimiting: true,
      apiVersioning: true,
    }
  },
  {
    tier: 'enterprise',
    triggers: { minUsers: 100000 },
    monthlyCost: 5000,
    features: {
      supabasePro: true,
      connectionPooling: true,
      readReplicas: true,
      redisPro: true,
      globalRedisCluster: true,
      aiResponseCaching: true,
      kubernetes: true,
      multiRegion: true,
      autoScaling: true,
      bullmqEnabled: true,
      priorityQueues: true,
      sentryEnabled: true,
      datadogEnabled: true,
      customDashboards: true,
      cloudflareProEnabled: true,
      wafEnabled: true,
      ddosProtection: true,
      kongGateway: true,
      rateLimiting: true,
      apiVersioning: true,
    }
  }
];

// Default feature flags (free tier)
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  supabasePro: false,
  connectionPooling: false,
  readReplicas: false,
  redisPro: false,
  globalRedisCluster: false,
  aiResponseCaching: false,
  kubernetes: false,
  multiRegion: false,
  autoScaling: false,
  sentryEnabled: true, // Free tier available
  datadogEnabled: false,
  customDashboards: false,
  cloudflareProEnabled: false,
  wafEnabled: false,
  ddosProtection: false,
  bullmqEnabled: false,
  priorityQueues: false,
  kongGateway: false,
  rateLimiting: false,
  apiVersioning: false,
};

/**
 * Determine the appropriate infrastructure tier based on usage metrics
 */
export function determineInfrastructureTier(metrics: UsageMetrics): InfrastructureTier {
  // Check thresholds from highest to lowest
  for (let i = UPGRADE_THRESHOLDS.length - 1; i >= 0; i--) {
    const threshold = UPGRADE_THRESHOLDS[i];
    const triggers = threshold.triggers;
    
    let meetsThreshold = true;
    
    if (triggers.minUsers !== undefined && metrics.totalUsers < triggers.minUsers) {
      meetsThreshold = false;
    }
    if (triggers.minDailyRequests !== undefined && metrics.dailyApiRequests < triggers.minDailyRequests) {
      meetsThreshold = false;
    }
    if (triggers.minDatabaseSizeMB !== undefined && metrics.databaseSizeMB < triggers.minDatabaseSizeMB) {
      meetsThreshold = false;
    }
    if (triggers.minRedisRequests !== undefined && metrics.monthlyRedisRequests < triggers.minRedisRequests) {
      meetsThreshold = false;
    }
    
    if (meetsThreshold) {
      return threshold.tier;
    }
  }
  
  return 'free';
}

/**
 * Get feature flags for a specific tier
 */
export function getFeatureFlagsForTier(tier: InfrastructureTier): FeatureFlags {
  const threshold = UPGRADE_THRESHOLDS.find(t => t.tier === tier);
  if (!threshold) {
    return DEFAULT_FEATURE_FLAGS;
  }
  
  return {
    ...DEFAULT_FEATURE_FLAGS,
    ...threshold.features,
  };
}

/**
 * Get monthly cost for a specific tier
 */
export function getMonthlyCostForTier(tier: InfrastructureTier): number {
  const threshold = UPGRADE_THRESHOLDS.find(t => t.tier === tier);
  return threshold?.monthlyCost ?? 0;
}

/**
 * Check if an upgrade is recommended based on current metrics
 */
export function getUpgradeRecommendation(
  currentTier: InfrastructureTier,
  metrics: UsageMetrics
): { shouldUpgrade: boolean; recommendedTier: InfrastructureTier; reason?: string } {
  const recommendedTier = determineInfrastructureTier(metrics);
  const currentIndex = UPGRADE_THRESHOLDS.findIndex(t => t.tier === currentTier);
  const recommendedIndex = UPGRADE_THRESHOLDS.findIndex(t => t.tier === recommendedTier);
  
  if (recommendedIndex > currentIndex) {
    const threshold = UPGRADE_THRESHOLDS[recommendedIndex];
    let reason = `User count (${metrics.totalUsers}) exceeds threshold for ${recommendedTier} tier`;
    
    if (threshold.triggers.minDatabaseSizeMB && metrics.databaseSizeMB >= threshold.triggers.minDatabaseSizeMB) {
      reason = `Database size (${metrics.databaseSizeMB}MB) exceeds threshold`;
    }
    if (threshold.triggers.minRedisRequests && metrics.monthlyRedisRequests >= threshold.triggers.minRedisRequests) {
      reason = `Redis requests (${metrics.monthlyRedisRequests}/mo) exceed threshold`;
    }
    
    return { shouldUpgrade: true, recommendedTier, reason };
  }
  
  return { shouldUpgrade: false, recommendedTier: currentTier };
}
