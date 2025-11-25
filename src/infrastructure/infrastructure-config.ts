/**
 * Infrastructure Configuration
 * All services coded now but inactive until triggered by feature flags
 * Launch cost: ~$15/mo (Vercel serverless + domain)
 */

import type { FeatureFlags, InfrastructureTier } from './feature-flags';

export interface DatabaseConfig {
  provider: 'supabase' | 'postgres';
  tier: 'free' | 'pro' | 'team';
  connectionPooling: boolean;
  poolSize: number;
  readReplicas: number;
  regions: string[];
  backupFrequencyHours: number;
  pointInTimeRecoveryDays: number;
}

export interface CacheConfig {
  provider: 'upstash' | 'redis';
  tier: 'free' | 'pro' | 'enterprise';
  globalCluster: boolean;
  regions: string[];
  maxMemoryMB: number;
  defaultTTLSeconds: number;
  aiResponseTTLDays: number;
}

export interface ComputeConfig {
  provider: 'vercel' | 'kubernetes';
  tier: 'hobby' | 'pro' | 'enterprise';
  kubernetes: {
    enabled: boolean;
    minPods: number;
    maxPods: number;
    regions: string[];
  };
  autoScaling: {
    enabled: boolean;
    cpuThreshold: number;
    memoryThreshold: number;
    requestQueueThreshold: number;
    scaleUpPods: number;
    scaleDownDelay: number;
  };
}

export interface CDNConfig {
  provider: 'cloudflare';
  tier: 'free' | 'pro' | 'business';
  waf: boolean;
  ddosProtection: boolean;
  imageOptimization: boolean;
  cacheEverything: boolean;
}

export interface MonitoringConfig {
  sentry: {
    enabled: boolean;
    tier: 'free' | 'team' | 'business';
    sampleRate: number;
  };
  datadog: {
    enabled: boolean;
    apm: boolean;
    logs: boolean;
    customMetrics: boolean;
  };
  alerting: {
    errorRateThreshold: number;
    responseTimeThreshold: number;
    uptimeMonitoring: boolean;
  };
}

export interface QueueConfig {
  provider: 'none' | 'bullmq';
  enabled: boolean;
  queues: string[];
  workersPerQueue: number;
  concurrentJobsPerQueue: number;
  retryAttempts: number;
  priorityQueues: boolean;
}

export interface APIGatewayConfig {
  provider: 'none' | 'kong';
  enabled: boolean;
  rateLimiting: {
    enabled: boolean;
    freeLimit: number;
    proLimit: number;
    enterpriseLimit: number;
  };
  throttling: {
    enabled: boolean;
    requestsPerSecond: number;
  };
  versioning: boolean;
}

export interface InfrastructureConfig {
  tier: InfrastructureTier;
  monthlyCost: number;
  database: DatabaseConfig;
  cache: CacheConfig;
  compute: ComputeConfig;
  cdn: CDNConfig;
  monitoring: MonitoringConfig;
  queue: QueueConfig;
  apiGateway: APIGatewayConfig;
}

// Free tier configuration - Launch cost ~$15/mo
const FREE_TIER_CONFIG: InfrastructureConfig = {
  tier: 'free',
  monthlyCost: 0,
  database: {
    provider: 'supabase',
    tier: 'free',
    connectionPooling: false,
    poolSize: 10,
    readReplicas: 0,
    regions: ['us-east-1'],
    backupFrequencyHours: 24,
    pointInTimeRecoveryDays: 0,
  },
  cache: {
    provider: 'upstash',
    tier: 'free',
    globalCluster: false,
    regions: ['us-east-1'],
    maxMemoryMB: 256,
    defaultTTLSeconds: 3600,
    aiResponseTTLDays: 7,
  },
  compute: {
    provider: 'vercel',
    tier: 'hobby',
    kubernetes: {
      enabled: false,
      minPods: 0,
      maxPods: 0,
      regions: [],
    },
    autoScaling: {
      enabled: false,
      cpuThreshold: 70,
      memoryThreshold: 80,
      requestQueueThreshold: 500,
      scaleUpPods: 0,
      scaleDownDelay: 0,
    },
  },
  cdn: {
    provider: 'cloudflare',
    tier: 'free',
    waf: false,
    ddosProtection: false,
    imageOptimization: false,
    cacheEverything: true,
  },
  monitoring: {
    sentry: {
      enabled: true,
      tier: 'free',
      sampleRate: 0.1,
    },
    datadog: {
      enabled: false,
      apm: false,
      logs: false,
      customMetrics: false,
    },
    alerting: {
      errorRateThreshold: 5,
      responseTimeThreshold: 5000,
      uptimeMonitoring: false,
    },
  },
  queue: {
    provider: 'none',
    enabled: false,
    queues: [],
    workersPerQueue: 0,
    concurrentJobsPerQueue: 0,
    retryAttempts: 0,
    priorityQueues: false,
  },
  apiGateway: {
    provider: 'none',
    enabled: false,
    rateLimiting: {
      enabled: false,
      freeLimit: 100,
      proLimit: 10000,
      enterpriseLimit: 1000000,
    },
    throttling: {
      enabled: false,
      requestsPerSecond: 100,
    },
    versioning: false,
  },
};

/**
 * Generate infrastructure configuration based on feature flags
 */
export function generateInfrastructureConfig(
  tier: InfrastructureTier,
  flags: FeatureFlags
): InfrastructureConfig {
  const config: InfrastructureConfig = JSON.parse(JSON.stringify(FREE_TIER_CONFIG));
  config.tier = tier;
  
  // Database configuration
  if (flags.supabasePro) {
    config.database.tier = 'pro';
    config.monthlyCost += 25;
  }
  if (flags.connectionPooling) {
    config.database.connectionPooling = true;
    config.database.poolSize = 100;
  }
  if (flags.readReplicas) {
    config.database.readReplicas = 3;
    config.database.regions = ['us-east-1', 'us-west-2', 'eu-west-1'];
    config.database.backupFrequencyHours = 6;
    config.database.pointInTimeRecoveryDays = 7;
    config.monthlyCost += 500;
  }
  
  // Cache configuration
  if (flags.redisPro) {
    config.cache.tier = 'pro';
    config.cache.maxMemoryMB = 1024;
    config.monthlyCost += 40;
  }
  if (flags.globalRedisCluster) {
    config.cache.globalCluster = true;
    config.cache.regions = ['us-east-1', 'us-west-2', 'eu-west-1'];
    config.monthlyCost += 200;
  }
  if (flags.aiResponseCaching) {
    config.cache.aiResponseTTLDays = 30;
  }
  
  // Compute configuration
  if (flags.kubernetes) {
    config.compute.provider = 'kubernetes';
    config.compute.tier = 'pro';
    config.compute.kubernetes = {
      enabled: true,
      minPods: 3,
      maxPods: 50,
      regions: ['us-east-1'],
    };
    config.monthlyCost += 500;
  }
  if (flags.multiRegion && flags.kubernetes) {
    config.compute.kubernetes.regions = ['us-east-1', 'us-west-2', 'eu-west-1'];
    config.monthlyCost += 1000;
  }
  if (flags.autoScaling) {
    config.compute.autoScaling = {
      enabled: true,
      cpuThreshold: 70,
      memoryThreshold: 80,
      requestQueueThreshold: 500,
      scaleUpPods: 3,
      scaleDownDelay: 600,
    };
  }
  
  // CDN configuration
  if (flags.cloudflareProEnabled) {
    config.cdn.tier = 'pro';
    config.cdn.imageOptimization = true;
    config.monthlyCost += 200;
  }
  if (flags.wafEnabled) {
    config.cdn.waf = true;
    config.cdn.tier = 'business';
    config.monthlyCost += 200;
  }
  if (flags.ddosProtection) {
    config.cdn.ddosProtection = true;
  }
  
  // Monitoring configuration
  if (flags.sentryEnabled) {
    config.monitoring.sentry.enabled = true;
    config.monitoring.sentry.sampleRate = 1.0;
  }
  if (flags.datadogEnabled) {
    config.monitoring.datadog = {
      enabled: true,
      apm: true,
      logs: true,
      customMetrics: flags.customDashboards,
    };
    config.monthlyCost += 100;
  }
  if (flags.customDashboards) {
    config.monitoring.alerting = {
      errorRateThreshold: 1,
      responseTimeThreshold: 3000,
      uptimeMonitoring: true,
    };
  }
  
  // Queue configuration
  if (flags.bullmqEnabled) {
    config.queue = {
      provider: 'bullmq',
      enabled: true,
      queues: ['openai-requests', 'webhooks', 'emails', 'analytics', 'video-processing'],
      workersPerQueue: 5,
      concurrentJobsPerQueue: 100,
      retryAttempts: 3,
      priorityQueues: flags.priorityQueues,
    };
    if (flags.priorityQueues) {
      config.queue.workersPerQueue = 10;
      config.queue.concurrentJobsPerQueue = 1000;
    }
  }
  
  // API Gateway configuration
  if (flags.kongGateway) {
    config.apiGateway = {
      provider: 'kong',
      enabled: true,
      rateLimiting: {
        enabled: flags.rateLimiting,
        freeLimit: 100,
        proLimit: 10000,
        enterpriseLimit: 1000000,
      },
      throttling: {
        enabled: true,
        requestsPerSecond: 100,
      },
      versioning: flags.apiVersioning,
    };
    config.monthlyCost += 100;
  }
  
  return config;
}

/**
 * Get the current infrastructure configuration
 * Reads from environment/feature flags and generates appropriate config
 */
export function getCurrentInfrastructureConfig(): InfrastructureConfig {
  // In production, this would read from feature flag service
  // For now, return free tier config
  return FREE_TIER_CONFIG;
}

/**
 * Estimate monthly cost based on usage projection
 */
export function estimateMonthlyCost(tier: InfrastructureTier): {
  infrastructure: number;
  estimatedOpenAI: number;
  total: number;
} {
  const costs: Record<InfrastructureTier, { infra: number; openai: number }> = {
    'free': { infra: 0, openai: 50 },
    'starter': { infra: 25, openai: 100 },
    'growth': { infra: 65, openai: 500 },
    'scale': { infra: 165, openai: 1500 },
    'kubernetes': { infra: 665, openai: 5000 },
    'multi-region': { infra: 2500, openai: 10000 },
    'enterprise': { infra: 5000, openai: 15000 },
  };
  
  const tierCosts = costs[tier];
  return {
    infrastructure: tierCosts.infra,
    estimatedOpenAI: tierCosts.openai,
    total: tierCosts.infra + tierCosts.openai,
  };
}
