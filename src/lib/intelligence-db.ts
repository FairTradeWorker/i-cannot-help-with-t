import { useKV } from '@github/spark/hooks';
import type {
  APIKey,
  APIUsage,
  LearningFeedback,
  APIResponse,
  RateLimitInfo
} from '@/types/intelligence-api';

const API_KEYS_KEY = 'intelligence-api-keys';
const API_USAGE_KEY = 'intelligence-api-usage';
const LEARNING_FEEDBACK_KEY = 'intelligence-learning-feedback';

class IntelligenceDB {
  async generateAPIKey(userId: string, name: string, tier: 'free' | 'professional' | 'enterprise'): Promise<APIKey> {
    const key: APIKey = {
      id: `ak_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      key: `sk_${tier}_${this.generateSecureKey()}`,
      userId,
      name,
      tier,
      status: 'active',
      callsUsed: 0,
      callsLimit: this.getTierLimit(tier),
      resetDate: this.getResetDate(),
      createdAt: new Date(),
      permissions: this.getTierPermissions(tier)
    };

    const existingKeys = await this.getAllAPIKeys();
    existingKeys.push(key);
    await window.spark.kv.set(API_KEYS_KEY, existingKeys);

    console.log(`✨ Generated ${tier} API key for user ${userId}`);
    return key;
  }

  async validateAPIKey(keyString: string): Promise<{ valid: boolean; key?: APIKey; error?: string }> {
    const allKeys = await this.getAllAPIKeys();
    const key = allKeys.find(k => k.key === keyString);

    if (!key) {
      return { valid: false, error: 'Invalid API key' };
    }

    if (key.status !== 'active') {
      return { valid: false, error: 'API key is not active' };
    }

    if (new Date() > new Date(key.resetDate)) {
      key.callsUsed = 0;
      key.resetDate = this.getResetDate();
      await this.updateAPIKey(key);
    }

    if (key.callsUsed >= key.callsLimit) {
      return { valid: false, error: 'API key rate limit exceeded' };
    }

    return { valid: true, key };
  }

  async recordAPIUsage(apiKeyId: string, endpoint: string, responseTime: number, statusCode: number, metadata?: any): Promise<void> {
    const usage: APIUsage = {
      apiKeyId,
      endpoint,
      timestamp: new Date(),
      responseTime,
      statusCode,
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata
    };

    const allUsage = await window.spark.kv.get<APIUsage[]>(API_USAGE_KEY) || [];
    allUsage.push(usage);
    await window.spark.kv.set(API_USAGE_KEY, allUsage);

    const allKeys = await this.getAllAPIKeys();
    const key = allKeys.find(k => k.id === apiKeyId);
    if (key) {
      key.callsUsed++;
      key.lastUsedAt = new Date();
      await this.updateAPIKey(key);
    }
  }

  async saveLearningFeedback(feedback: LearningFeedback): Promise<void> {
    const allFeedback = await this.getAllLearningFeedback();
    allFeedback.push(feedback);
    await window.spark.kv.set(LEARNING_FEEDBACK_KEY, allFeedback);
    
    console.log(`🧠 Learning feedback saved for ${feedback.endpoint}: ${(feedback.accuracyScore || 0) * 100}%`);
  }

  async updateLearningOutcome(predictionId: string, actualOutcome: any, accuracyScore: number): Promise<void> {
    const allFeedback = await this.getAllLearningFeedback();
    const feedback = allFeedback.find(f => f.predictionId === predictionId);
    
    if (feedback) {
      feedback.actualOutcome = actualOutcome;
      feedback.accuracyScore = accuracyScore;
      feedback.errorMargin = this.calculateErrorMargin(feedback.prediction, actualOutcome);
      await window.spark.kv.set(LEARNING_FEEDBACK_KEY, allFeedback);
      
      console.log(`📊 Updated outcome for ${predictionId}: ${(accuracyScore * 100).toFixed(1)}% accurate`);
    }
  }

  async getLearningContext(endpoint: string): Promise<{ totalPredictions: number; avgAccuracy: number; confidenceAdjustment: number }> {
    const allFeedback = await this.getAllLearningFeedback();
    const endpointFeedback = allFeedback.filter(f => f.endpoint === endpoint);
    const recentFeedback = endpointFeedback.slice(-100);

    const withAccuracy = recentFeedback.filter(f => f.accuracyScore !== undefined);
    const avgAccuracy = withAccuracy.length > 0
      ? withAccuracy.reduce((sum, f) => sum + (f.accuracyScore || 0), 0) / withAccuracy.length
      : 0.85;

    const confidenceAdjustment = avgAccuracy > 0.9 ? 1.1 : avgAccuracy > 0.8 ? 1.0 : 0.9;

    return {
      totalPredictions: endpointFeedback.length,
      avgAccuracy,
      confidenceAdjustment
    };
  }

  async getGlobalLearningMetrics(): Promise<{
    totalPredictions: number;
    averageAccuracy: number;
    accuracyByEndpoint: Record<string, number>;
    improvementRate: number;
    compoundingFactor: number;
  }> {
    const allFeedback = await this.getAllLearningFeedback();
    const withAccuracy = allFeedback.filter(f => f.accuracyScore !== undefined);

    const totalPredictions = withAccuracy.length;
    const averageAccuracy = totalPredictions > 0
      ? withAccuracy.reduce((sum, f) => sum + (f.accuracyScore || 0), 0) / totalPredictions
      : 0.85;

    const accuracyByEndpoint: Record<string, number> = {};
    const endpoints = [...new Set(allFeedback.map(f => f.endpoint))];
    
    for (const endpoint of endpoints) {
      const endpointData = withAccuracy.filter(f => f.endpoint === endpoint);
      accuracyByEndpoint[endpoint] = endpointData.length > 0
        ? endpointData.reduce((sum, f) => sum + (f.accuracyScore || 0), 0) / endpointData.length
        : 0.85;
    }

    const first100 = withAccuracy.slice(0, 100);
    const last100 = withAccuracy.slice(-100);
    const first100Avg = first100.length > 0
      ? first100.reduce((sum, f) => sum + (f.accuracyScore || 0), 0) / first100.length
      : 0.82;
    const last100Avg = last100.length > 0
      ? last100.reduce((sum, f) => sum + (f.accuracyScore || 0), 0) / last100.length
      : averageAccuracy;

    const improvementRate = ((last100Avg - first100Avg) / first100Avg) * 100;
    const compoundingFactor = totalPredictions > 0 ? Math.pow(1 + improvementRate / 100, totalPredictions / 1000) : 1.0;

    return {
      totalPredictions,
      averageAccuracy,
      accuracyByEndpoint,
      improvementRate,
      compoundingFactor: Math.min(compoundingFactor, 50)
    };
  }

  async getRateLimitInfo(apiKeyId: string): Promise<RateLimitInfo> {
    const allKeys = await this.getAllAPIKeys();
    const key = allKeys.find(k => k.id === apiKeyId);

    if (!key) {
      throw new Error('API key not found');
    }

    return {
      limit: key.callsLimit,
      remaining: Math.max(0, key.callsLimit - key.callsUsed),
      resetAt: new Date(key.resetDate),
      burstLimit: this.getBurstLimit(key.tier)
    };
  }

  async getUserUsageMetrics(userId: string): Promise<{
    totalCalls: number;
    callsByEndpoint: Record<string, number>;
    avgResponseTime: number;
    errorRate: number;
  }> {
    const allUsage = await window.spark.kv.get<APIUsage[]>(API_USAGE_KEY) || [];
    const allKeys = await this.getAllAPIKeys();
    const userKeys = allKeys.filter(k => k.userId === userId);
    const userKeyIds = userKeys.map(k => k.id);
    
    const userUsage = allUsage.filter(u => userKeyIds.includes(u.apiKeyId));
    
    const callsByEndpoint: Record<string, number> = {};
    let totalResponseTime = 0;
    let errorCount = 0;

    for (const usage of userUsage) {
      callsByEndpoint[usage.endpoint] = (callsByEndpoint[usage.endpoint] || 0) + 1;
      totalResponseTime += usage.responseTime;
      if (usage.statusCode >= 400) {
        errorCount++;
      }
    }

    return {
      totalCalls: userUsage.length,
      callsByEndpoint,
      avgResponseTime: userUsage.length > 0 ? totalResponseTime / userUsage.length : 0,
      errorRate: userUsage.length > 0 ? errorCount / userUsage.length : 0
    };
  }

  private async getAllAPIKeys(): Promise<APIKey[]> {
    return await window.spark.kv.get<APIKey[]>(API_KEYS_KEY) || [];
  }

  private async updateAPIKey(key: APIKey): Promise<void> {
    const allKeys = await this.getAllAPIKeys();
    const index = allKeys.findIndex(k => k.id === key.id);
    if (index !== -1) {
      allKeys[index] = key;
      await window.spark.kv.set(API_KEYS_KEY, allKeys);
    }
  }

  private async getAllLearningFeedback(): Promise<LearningFeedback[]> {
    return await window.spark.kv.get<LearningFeedback[]>(LEARNING_FEEDBACK_KEY) || [];
  }

  private generateSecureKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  private getTierLimit(tier: string): number {
    switch (tier) {
      case 'free': return 100;
      case 'professional': return 10000;
      case 'enterprise': return 1000000;
      default: return 100;
    }
  }

  private getBurstLimit(tier: string): number {
    switch (tier) {
      case 'free': return 10;
      case 'professional': return 100;
      case 'enterprise': return 1000;
      default: return 10;
    }
  }

  private getTierPermissions(tier: string): string[] {
    const basePermissions = ['job_scope', 'instant_quote', 'pricing_oracle', 'contractor_match'];
    const proPermissions = [...basePermissions, 'demand_heatmap', 'storm_alert', 'material_price', 'permit_prediction'];
    const enterprisePermissions = [...proPermissions, 'capital_intelligence', 'batch_scope', 'master_intelligence'];

    switch (tier) {
      case 'free': return basePermissions;
      case 'professional': return proPermissions;
      case 'enterprise': return enterprisePermissions;
      default: return basePermissions;
    }
  }

  private getResetDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private calculateErrorMargin(prediction: any, actual: any): number {
    if (!prediction || !actual) return 0;
    
    if (typeof prediction === 'number' && typeof actual === 'number') {
      return Math.abs(prediction - actual) / actual;
    }

    if (prediction.estimatedCost && actual.actualCost) {
      const predictedAvg = (prediction.estimatedCost.min + prediction.estimatedCost.max) / 2;
      return Math.abs(predictedAvg - actual.actualCost) / actual.actualCost;
    }

    return 0;
  }
}

export const intelligenceDB = new IntelligenceDB();

export function createAPIResponse<T>(
  success: boolean,
  data?: T,
  error?: { code: string; message: string; details?: any },
  learningContext?: any,
  usage?: any
): APIResponse<T> {
  return {
    success,
    data,
    error,
    metadata: {
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      learningContext: learningContext || {
        totalPredictions: 0,
        currentAccuracy: 0.85,
        confidenceScore: 85
      }
    },
    usage
  };
}
