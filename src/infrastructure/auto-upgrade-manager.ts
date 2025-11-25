/**
 * Auto-Upgrade Manager
 * Monitors usage metrics and triggers infrastructure upgrades automatically
 * Everything coded now but inactive until triggered
 */

import type { 
  InfrastructureTier, 
  UsageMetrics, 
  FeatureFlags 
} from './feature-flags';
import { 
  determineInfrastructureTier, 
  getFeatureFlagsForTier,
  getUpgradeRecommendation,
  getMonthlyCostForTier,
  UPGRADE_THRESHOLDS
} from './feature-flags';
import { 
  generateInfrastructureConfig, 
  estimateMonthlyCost,
  type InfrastructureConfig 
} from './infrastructure-config';

export interface UpgradeEvent {
  id: string;
  timestamp: Date;
  fromTier: InfrastructureTier;
  toTier: InfrastructureTier;
  trigger: string;
  metrics: UsageMetrics;
  costBefore: number;
  costAfter: number;
  autoApproved: boolean;
}

export interface UpgradeManagerState {
  currentTier: InfrastructureTier;
  featureFlags: FeatureFlags;
  config: InfrastructureConfig;
  lastMetricsCheck: Date;
  upgradeHistory: UpgradeEvent[];
  pendingUpgrade: UpgradeEvent | null;
}

const METRICS_CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const AUTO_APPROVE_THRESHOLD = 'scale'; // Auto-approve upgrades up to this tier

/**
 * Auto-Upgrade Manager Class
 * Handles monitoring and automatic infrastructure scaling
 */
export class AutoUpgradeManager {
  private state: UpgradeManagerState;
  private metricsProvider: () => Promise<UsageMetrics>;
  private onUpgrade?: (event: UpgradeEvent) => void;
  private checkInterval?: ReturnType<typeof setInterval>;

  constructor(
    metricsProvider: () => Promise<UsageMetrics>,
    onUpgrade?: (event: UpgradeEvent) => void
  ) {
    this.metricsProvider = metricsProvider;
    this.onUpgrade = onUpgrade;
    
    // Initialize with free tier
    const initialFlags = getFeatureFlagsForTier('free');
    this.state = {
      currentTier: 'free',
      featureFlags: initialFlags,
      config: generateInfrastructureConfig('free', initialFlags),
      lastMetricsCheck: new Date(),
      upgradeHistory: [],
      pendingUpgrade: null,
    };
  }

  /**
   * Get current state
   */
  getState(): UpgradeManagerState {
    return { ...this.state };
  }

  /**
   * Get current feature flags
   */
  getFeatureFlags(): FeatureFlags {
    return { ...this.state.featureFlags };
  }

  /**
   * Get current infrastructure config
   */
  getConfig(): InfrastructureConfig {
    return { ...this.state.config };
  }

  /**
   * Check if a specific feature is enabled
   */
  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.state.featureFlags[feature];
  }

  /**
   * Start automatic metrics monitoring
   */
  startMonitoring(): void {
    if (this.checkInterval) {
      return;
    }

    // Initial check
    this.checkAndUpgrade();

    // Schedule periodic checks
    this.checkInterval = setInterval(() => {
      this.checkAndUpgrade();
    }, METRICS_CHECK_INTERVAL_MS);

    console.log('📊 Auto-upgrade monitoring started');
  }

  /**
   * Stop automatic metrics monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
      console.log('📊 Auto-upgrade monitoring stopped');
    }
  }

  /**
   * Check current metrics and upgrade if needed
   */
  async checkAndUpgrade(): Promise<UpgradeEvent | null> {
    try {
      const metrics = await this.metricsProvider();
      this.state.lastMetricsCheck = new Date();

      const recommendation = getUpgradeRecommendation(
        this.state.currentTier,
        metrics
      );

      if (recommendation.shouldUpgrade) {
        const event = this.createUpgradeEvent(
          this.state.currentTier,
          recommendation.recommendedTier,
          recommendation.reason || 'Usage threshold exceeded',
          metrics
        );

        // Auto-approve if within threshold
        const recommendedIndex = UPGRADE_THRESHOLDS.findIndex(
          t => t.tier === recommendation.recommendedTier
        );
        const autoApproveIndex = UPGRADE_THRESHOLDS.findIndex(
          t => t.tier === AUTO_APPROVE_THRESHOLD
        );

        if (recommendedIndex <= autoApproveIndex) {
          await this.applyUpgrade(event);
          return event;
        } else {
          // Store as pending for manual approval
          this.state.pendingUpgrade = event;
          console.log(`⚠️ Upgrade to ${recommendation.recommendedTier} pending manual approval`);
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to check metrics:', error);
      return null;
    }
  }

  /**
   * Manually trigger an upgrade to a specific tier
   */
  async manualUpgrade(
    targetTier: InfrastructureTier,
    reason: string = 'Manual upgrade'
  ): Promise<UpgradeEvent> {
    const metrics = await this.metricsProvider();
    const event = this.createUpgradeEvent(
      this.state.currentTier,
      targetTier,
      reason,
      metrics
    );
    
    await this.applyUpgrade(event);
    return event;
  }

  /**
   * Approve a pending upgrade
   */
  async approvePendingUpgrade(): Promise<UpgradeEvent | null> {
    if (!this.state.pendingUpgrade) {
      return null;
    }

    const event = this.state.pendingUpgrade;
    this.state.pendingUpgrade = null;
    await this.applyUpgrade(event);
    return event;
  }

  /**
   * Reject a pending upgrade
   */
  rejectPendingUpgrade(): void {
    this.state.pendingUpgrade = null;
    console.log('❌ Pending upgrade rejected');
  }

  /**
   * Create an upgrade event
   */
  private createUpgradeEvent(
    fromTier: InfrastructureTier,
    toTier: InfrastructureTier,
    trigger: string,
    metrics: UsageMetrics
  ): UpgradeEvent {
    return {
      id: `upgrade_${Date.now()}`,
      timestamp: new Date(),
      fromTier,
      toTier,
      trigger,
      metrics,
      costBefore: getMonthlyCostForTier(fromTier),
      costAfter: getMonthlyCostForTier(toTier),
      autoApproved: false,
    };
  }

  /**
   * Apply an upgrade
   */
  private async applyUpgrade(event: UpgradeEvent): Promise<void> {
    const newFlags = getFeatureFlagsForTier(event.toTier);
    const newConfig = generateInfrastructureConfig(event.toTier, newFlags);

    this.state.currentTier = event.toTier;
    this.state.featureFlags = newFlags;
    this.state.config = newConfig;
    this.state.upgradeHistory.push(event);

    console.log(`🚀 Upgraded from ${event.fromTier} to ${event.toTier}`);
    console.log(`💰 New monthly cost: $${event.costAfter}`);

    if (this.onUpgrade) {
      this.onUpgrade(event);
    }
  }

  /**
   * Get upgrade cost breakdown for a target tier
   */
  getCostBreakdown(targetTier: InfrastructureTier): {
    currentCost: number;
    targetCost: number;
    difference: number;
    breakdown: { infrastructure: number; estimatedOpenAI: number; total: number };
  } {
    const currentCost = getMonthlyCostForTier(this.state.currentTier);
    const targetCost = getMonthlyCostForTier(targetTier);
    
    return {
      currentCost,
      targetCost,
      difference: targetCost - currentCost,
      breakdown: estimateMonthlyCost(targetTier),
    };
  }

  /**
   * Get the next recommended upgrade tier
   */
  getNextTier(): InfrastructureTier | null {
    const currentIndex = UPGRADE_THRESHOLDS.findIndex(
      t => t.tier === this.state.currentTier
    );
    
    if (currentIndex < UPGRADE_THRESHOLDS.length - 1) {
      return UPGRADE_THRESHOLDS[currentIndex + 1].tier;
    }
    
    return null;
  }

  /**
   * Get all available tiers with their costs
   */
  getAllTiers(): Array<{
    tier: InfrastructureTier;
    cost: number;
    isCurrent: boolean;
    isAvailable: boolean;
  }> {
    return UPGRADE_THRESHOLDS.map((threshold, index) => ({
      tier: threshold.tier,
      cost: threshold.monthlyCost,
      isCurrent: threshold.tier === this.state.currentTier,
      isAvailable: index >= UPGRADE_THRESHOLDS.findIndex(
        t => t.tier === this.state.currentTier
      ),
    }));
  }
}

/**
 * Create a mock metrics provider for development
 */
export function createMockMetricsProvider(
  initialMetrics: Partial<UsageMetrics> = {}
): () => Promise<UsageMetrics> {
  let metrics: UsageMetrics = {
    totalUsers: 0,
    activeUsers24h: 0,
    dailyApiRequests: 0,
    databaseSizeMB: 0,
    monthlyRedisRequests: 0,
    monthlyOpenAICalls: 0,
    averageResponseTimeMs: 200,
    errorRate: 0.01,
    ...initialMetrics,
  };

  return async () => metrics;
}

/**
 * Singleton instance for global access
 */
let upgradeManagerInstance: AutoUpgradeManager | null = null;

export function initializeUpgradeManager(
  metricsProvider: () => Promise<UsageMetrics>,
  onUpgrade?: (event: UpgradeEvent) => void
): AutoUpgradeManager {
  if (!upgradeManagerInstance) {
    upgradeManagerInstance = new AutoUpgradeManager(metricsProvider, onUpgrade);
  }
  return upgradeManagerInstance;
}

export function getUpgradeManager(): AutoUpgradeManager | null {
  return upgradeManagerInstance;
}
