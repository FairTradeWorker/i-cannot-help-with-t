/**
 * Infrastructure Module Index
 * Auto-upgrade infrastructure system
 * 
 * Launch cost: ~$15/mo (Vercel serverless + domain)
 * Scales automatically based on usage thresholds
 * 
 * Upgrade Triggers:
 * - At 100 users → Enable Supabase Pro ($25/mo)
 * - At 1K users → Enable Redis Pro ($40/mo)
 * - At 5K users → Add monitoring ($100/mo)
 * - At 10K users → Deploy Kubernetes ($500/mo)
 * - At 50K users → Multi-region ($2K/mo)
 * - At 100K users → Full stack ($5K/mo)
 */

// Feature Flags
export {
  type InfrastructureTier,
  type FeatureFlags,
  type UsageMetrics,
  type UpgradeThreshold,
  UPGRADE_THRESHOLDS,
  DEFAULT_FEATURE_FLAGS,
  determineInfrastructureTier,
  getFeatureFlagsForTier,
  getMonthlyCostForTier,
  getUpgradeRecommendation,
} from './feature-flags';

// Infrastructure Configuration
export {
  type DatabaseConfig,
  type CacheConfig,
  type ComputeConfig,
  type CDNConfig,
  type MonitoringConfig,
  type QueueConfig,
  type APIGatewayConfig,
  type InfrastructureConfig,
  generateInfrastructureConfig,
  getCurrentInfrastructureConfig,
  estimateMonthlyCost,
} from './infrastructure-config';

// Auto-Upgrade Manager
export {
  type UpgradeEvent,
  type UpgradeManagerState,
  AutoUpgradeManager,
  createMockMetricsProvider,
  initializeUpgradeManager,
  getUpgradeManager,
} from './auto-upgrade-manager';

// Database Adapter
export {
  type DatabaseProvider,
  type DatabaseAdapter,
  databaseFactory,
  getDatabase,
  migrateData,
} from './database-adapter';

// Cache Adapter
export {
  type CacheProvider,
  type CacheOptions,
  type CacheAdapter,
  type CacheStats,
  cacheFactory,
  getCache,
  AIResponseCache,
} from './cache-adapter';

/**
 * Initialize the infrastructure system
 * Call this at app startup
 */
export async function initializeInfrastructure(): Promise<void> {
  const { getDatabase } = await import('./database-adapter');
  const { getCache } = await import('./cache-adapter');
  const { initializeUpgradeManager, createMockMetricsProvider } = await import('./auto-upgrade-manager');
  
  // Initialize database adapter
  const db = await getDatabase();
  console.log(`📦 Database: ${db.provider}`);
  
  // Initialize cache adapter
  const cache = await getCache();
  console.log(`💾 Cache: ${cache.provider}`);
  
  // Initialize upgrade manager with mock metrics
  // In production, replace with real metrics provider
  const metricsProvider = createMockMetricsProvider({
    totalUsers: 0,
    activeUsers24h: 0,
    dailyApiRequests: 0,
    databaseSizeMB: 0,
    monthlyRedisRequests: 0,
    monthlyOpenAICalls: 0,
    averageResponseTimeMs: 200,
    errorRate: 0.01,
  });
  
  const upgradeManager = initializeUpgradeManager(metricsProvider, (event) => {
    console.log(`🚀 Infrastructure upgraded: ${event.fromTier} → ${event.toTier}`);
    console.log(`💰 New monthly cost: $${event.costAfter}`);
  });
  
  // Start monitoring (checks hourly)
  upgradeManager.startMonitoring();
  
  console.log('✅ Infrastructure initialized (free tier)');
  console.log('📊 Auto-upgrade monitoring active');
}

/**
 * Get current infrastructure status
 */
export async function getInfrastructureStatus(): Promise<{
  tier: string;
  monthlyCost: number;
  features: string[];
}> {
  const { getUpgradeManager } = await import('./auto-upgrade-manager');
  const manager = getUpgradeManager();
  
  if (!manager) {
    return {
      tier: 'free',
      monthlyCost: 0,
      features: ['Spark KV', 'In-memory cache', 'Vercel serverless'],
    };
  }
  
  const state = manager.getState();
  const flags = manager.getFeatureFlags();
  
  const enabledFeatures: string[] = [];
  if (flags.supabasePro) enabledFeatures.push('Supabase Pro');
  if (flags.redisPro) enabledFeatures.push('Upstash Redis Pro');
  if (flags.kubernetes) enabledFeatures.push('Kubernetes');
  if (flags.multiRegion) enabledFeatures.push('Multi-region');
  if (flags.datadogEnabled) enabledFeatures.push('Datadog monitoring');
  if (flags.kongGateway) enabledFeatures.push('Kong API Gateway');
  if (flags.bullmqEnabled) enabledFeatures.push('BullMQ Queues');
  
  if (enabledFeatures.length === 0) {
    enabledFeatures.push('Spark KV', 'In-memory cache', 'Vercel serverless');
  }
  
  return {
    tier: state.currentTier,
    monthlyCost: state.config.monthlyCost,
    features: enabledFeatures,
  };
}
