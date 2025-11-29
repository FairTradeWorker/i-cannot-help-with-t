// src/lib/learning-db.ts
// Core of exponential learning

// FIXED: Updated interface to support both scope and pricing, added optional userFeedback
export interface LearningFeedback {
  predictionId: string;
  jobId: string;
  timestamp: Date;
  predictionType: "scope" | "pricing";
  prediction: any;
  actualOutcome: { materials: any[]; laborHours: number; totalCost: number };
  performanceMetrics: {
    accuracy: number;
    costAccuracy: number;
    laborAccuracy: number;
    errorMargin: number;
  };
  userFeedback?: {
    rating?: number;
    wasAccurate?: boolean;
    comments?: string;
  };
}

class LearningDatabase {
  private KEY = "fairtrade-learning-v1";

  async getAll(): Promise<LearningFeedback[]> {
    try {
      const data = await window.spark.kv.get<LearningFeedback[]>(this.KEY);
      return data || [];
    } catch {
      return [];
    }
  }

  async save(feedback: LearningFeedback) {
    const all = await this.getAll();
    all.push(feedback);
    await window.spark.kv.set(this.KEY, all);
  }

  async getContext(trade?: string, zipPrefix?: string): Promise<any> {
    // FIXED: Use type guard for filtering
    const all = (await this.getAll()).filter((f): f is LearningFeedback => f.predictionType === "scope");
    const recent = all.slice(-100);

    const avgAccuracy = recent.length
      ? recent.reduce((s, f) => s + f.performanceMetrics.accuracy, 0) / recent.length
      : 0.6;

    const confidenceBoost = avgAccuracy > 0.9 ? 1.1 : avgAccuracy > 0.8 ? 1.05 : 1.0;

    return {
      totalJobs: all.length,
      avgAccuracy,
      confidenceBoost,
      isLearning: all.length > 5
    };
  }
}

// FIXED: Export learningDB and LearningFeedback
export const learningDB = new LearningDatabase();
