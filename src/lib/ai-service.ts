export interface JobScope {
  jobTitle: string;
  summary: string;
  estimatedSquareFootage: number;
  materials: Array<{
    name: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
  }>;
  laborHours: number;
  estimatedCost: { min: number; max: number };
  confidenceScore: number;
  recommendations: string[];
  warningsAndRisks: string[];
  permitRequired: boolean;
}

export interface VideoAnalysis {
  transcript: string;
  keyObservations: string[];
  damageType: string;
  urgencyLevel: "normal" | "urgent" | "emergency";
  location: { area: string; accessDifficulty: "easy" | "moderate" | "difficult" };
}

export interface PricingSuggestion {
  suggestedPrice: number;
  reasoning: string;
  competitiveAdvantage: string;
  winProbability: number;
  priceBreakdown: { materials: number; labor: number; overhead: number; profit: number };
  alternativePrices: { aggressive: number; balanced: number; premium: number };
}

export interface LearningFeedback {
  predictionId: string;
  timestamp: Date;
  predictionType: "scope" | "pricing" | "matching";
  prediction: any;
  actualOutcome: any;
  userFeedback?: { 
    rating?: number; 
    comments?: string; 
    wasAccurate: boolean;
    scopeAccurate?: boolean;
    actualMaterialsUsed?: string;
  };
  performanceMetrics: { 
    accuracy?: number; 
    errorMargin?: number;
    costError?: number;
    laborError?: number;
    costAccuracy?: number;
    laborAccuracy?: number;
  };
}

class LearningDatabase {
  private storageKey = "ai-learning-feedback";

  async saveFeedback(feedback: LearningFeedback): Promise<void> {
    const allFeedback = await this.getAllFeedback();
    allFeedback.push(feedback);
    
    await window.spark.kv.set(this.storageKey, allFeedback);
    console.log(`💾 Learning: Saved ${feedback.predictionType} feedback`);
  }

  async getAllFeedback(): Promise<LearningFeedback[]> {
    const data = await window.spark.kv.get<LearningFeedback[]>(this.storageKey);
    return data || [];
  }

  async getLearningContext(type: string): Promise<any> {
    const allFeedback = await this.getAllFeedback();
    const feedbackList = allFeedback.filter(f => f.predictionType === type);
    const recent = feedbackList.slice(-50);
    
    const avgAccuracy = recent.length > 0
      ? recent.reduce((sum, f) => sum + (f.performanceMetrics.accuracy || 0), 0) / recent.length
      : 0.85;

    return {
      totalFeedback: recent.length,
      avgAccuracy,
      confidenceAdjustment: avgAccuracy > 0.9 ? 1.1 : 0.9,
      recentErrors: recent.filter(f => (f.performanceMetrics.accuracy || 0) < 0.7)
    };
  }
}

export const learningDB = new LearningDatabase();

export async function extractVideoFrame(videoFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.preload = 'metadata';
    video.src = URL.createObjectURL(videoFile);
    
    video.onloadedmetadata = () => {
      video.currentTime = video.duration / 2;
    };
    
    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0);
      
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(video.src);
      resolve(base64);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };
  });
}

export async function analyzeVideoFrames(
  videoBase64: string
): Promise<VideoAnalysis> {
  const promptText = `You are an expert construction inspector analyzing video footage of home damage.

Extract:
- Detailed observations of visible damage
- Type of damage (roof, foundation, plumbing, electrical, HVAC, etc.)
- Urgency level (normal, urgent, emergency)
- Location/area affected
- Access difficulty

Be specific and technical. Analyze this image from a home repair video and extract key observations, damage type, urgency, and location.

IMAGE DATA: ${videoBase64.substring(0, 100)}...

Respond with valid JSON in this exact format:
{
  "transcript": "detailed description of what you see in the image",
  "keyObservations": ["observation 1", "observation 2", "observation 3"],
  "damageType": "specific type of damage",
  "urgencyLevel": "normal or urgent or emergency",
  "location": {
    "area": "specific area description",
    "accessDifficulty": "easy or moderate or difficult"
  }
}`;

  const response = await window.spark.llm(promptText, "gpt-4o", true);
  
  try {
    return JSON.parse(response) as VideoAnalysis;
  } catch (error) {
    console.error("Failed to parse video analysis:", error);
    throw new Error("Failed to analyze video frames");
  }
}

import { learningDB } from './learning-db';

export async function analyzeJobFromVideo(
  videoAnalysis: VideoAnalysis,
  zipCode?: string
): Promise<{ scope: JobScope; predictionId: string }> {
  // Get learning context
  const context = await learningDB.getContext();
  
  const observations = videoAnalysis.keyObservations.map((obs: string) => `- ${obs}`).join('\n');
  
  const promptText = `You are an expert construction estimator with 20+ years of experience.

LEARNING CONTEXT:
- Total predictions made: ${context.totalJobs}
- Current accuracy: ${(context.avgAccuracy * 100).toFixed(1)}%
- Confidence boost: ${context.confidenceBoost}x
- Learning active: ${context.isLearning ? 'Yes' : 'No'}

Analyze home repair videos and provide detailed scopes. Be specific with measurements, materials, labor hours, and costs.

Analyze this job:

VIDEO TRANSCRIPT: "${videoAnalysis.transcript}"

OBSERVATIONS:
${observations}

DETAILS:
- Damage Type: ${videoAnalysis.damageType}
- Urgency: ${videoAnalysis.urgencyLevel}
- Location: ${videoAnalysis.location.area}
- Access: ${videoAnalysis.location.accessDifficulty}

Respond with valid JSON in this exact format:
{
  "jobTitle": "descriptive title",
  "summary": "detailed summary",
  "estimatedSquareFootage": 100,
  "materials": [
    {"name": "material name", "quantity": 10, "unit": "unit", "estimatedCost": 100}
  ],
  "laborHours": 8,
  "estimatedCost": {"min": 1000, "max": 2000},
  "confidenceScore": 85,
  "recommendations": ["recommendation 1", "recommendation 2"],
  "warningsAndRisks": ["warning 1"],
  "permitRequired": false
}`;

  const response = await window.spark.llm(promptText, "gpt-4o", true);
  
  try {
    const scope = JSON.parse(response) as JobScope;
    
    // Apply learned confidence boost
    scope.confidenceScore = Math.min(100, scope.confidenceScore * context.confidenceBoost);
    
    // Store prediction with unique ID
    const predictionId = `pred-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    await window.spark.kv.set(`prediction:${predictionId}`, {
      id: predictionId,
      type: 'scope',
      prediction: scope,
      createdAt: new Date().toISOString(),
      damageType: videoAnalysis.damageType,
      urgency: videoAnalysis.urgencyLevel,
      metadata: { zipCode, createdAt: new Date().toISOString() }
    });

    console.log("AI Prediction stored:", predictionId, "Confidence:", scope.confidenceScore);

    return { scope, predictionId };
  } catch (error) {
    console.error("Failed to parse job scope:", error);
    throw new Error("Failed to generate job scope");
  }
}

// Record real outcome so AI learns
export async function recordLearningFeedback(
  predictionId: string,
  jobId: string,
  actual: { totalCost: number; laborHours: number }
) {
  const pred = await window.spark.kv.get<any>(`prediction:${predictionId}`);
  if (!pred || !pred.prediction) {
    console.warn(`Prediction ${predictionId} not found or invalid`);
    return;
  }

  const scope = pred.prediction;
  const predictedAvg = (scope.estimatedCost.min + scope.estimatedCost.max) / 2;
  const costError = Math.abs(actual.totalCost - predictedAvg) / Math.max(predictedAvg, 1);
  const laborError = Math.abs(actual.laborHours - scope.laborHours) / Math.max(scope.laborHours, 1);
  const accuracy = Math.max(0.1, 1 - (costError * 0.6 + laborError * 0.4));

  await learningDB.save({
    predictionId,
    jobId,
    timestamp: new Date(),
    predictionType: "scope",
    prediction: scope,
    actualOutcome: {
      materials: [], // Will be populated if available
      laborHours: actual.laborHours,
      totalCost: actual.totalCost
    },
    performanceMetrics: {
      accuracy,
      costAccuracy: Math.max(0, 1 - costError),
      laborAccuracy: Math.max(0, 1 - laborError),
      errorMargin: costError
    }
  });

  console.log("Learning saved | Accuracy:", (accuracy * 100).toFixed(1) + "%");
}

export async function suggestOptimalPricing(
  jobScope: JobScope,
  marketData: { avgRate: number; competitorMin: number; competitorMax: number; demandScore: number },
  contractorProfile: { rating: number; completedJobs: number }
): Promise<PricingSuggestion> {
  const context = await learningDB.getLearningContext("pricing");
  const totalMaterials = jobScope.materials.reduce((sum, m) => sum + m.estimatedCost, 0);

  const promptText = `You are a pricing strategist for contractors. Maximize earnings while maintaining high win rates.

LEARNING CONTEXT:
- Historical pricing accuracy: ${(context.avgAccuracy * 100).toFixed(1)}%
- Successful bids analyzed: ${context.totalFeedback}

Consider: market rates, urgency, contractor reputation, materials cost, overhead (20%), profit (25-40%).

Suggest pricing:

JOB: ${jobScope.jobTitle}
- Labor Hours: ${jobScope.laborHours}
- Materials: $${totalMaterials}
- AI Estimate: $${jobScope.estimatedCost.min}-$${jobScope.estimatedCost.max}

MARKET:
- Avg Rate: $${marketData.avgRate}/hr
- Competitor Range: $${marketData.competitorMin}-$${marketData.competitorMax}
- Demand: ${marketData.demandScore}/100

CONTRACTOR:
- Rating: ${contractorProfile.rating}/100
- Jobs Done: ${contractorProfile.completedJobs}

Respond with valid JSON in this exact format:
{
  "suggestedPrice": 5000,
  "reasoning": "explanation of pricing strategy",
  "competitiveAdvantage": "why this price wins",
  "winProbability": 85,
  "priceBreakdown": {"materials": 2000, "labor": 2000, "overhead": 400, "profit": 600},
  "alternativePrices": {"aggressive": 4500, "balanced": 5000, "premium": 5500}
}`;

  const response = await window.spark.llm(promptText, "gpt-4o", true);
  
  try {
    return JSON.parse(response) as PricingSuggestion;
  } catch (error) {
    console.error("Failed to parse pricing suggestion:", error);
    throw new Error("Failed to generate pricing suggestion");
  }
}

export async function recordPredictionOutcome(
  predictionId: string,
  predictionType: "scope" | "pricing" | "matching",
  prediction: any,
  actualOutcome: any,
  userFeedback?: { 
    rating?: number; 
    scopeAccurate?: boolean;
    actualMaterialsUsed?: string;
    comments?: string;
  }
): Promise<void> {
  const accuracy = calculateAccuracy(prediction, actualOutcome, predictionType);
  
  await learningDB.saveFeedback({
    predictionId,
    timestamp: new Date(),
    predictionType,
    prediction,
    actualOutcome,
    userFeedback: userFeedback ? { ...userFeedback, wasAccurate: accuracy > 0.8 } : undefined,
    performanceMetrics: { accuracy }
  });
  
  console.log(`🎓 Learning: ${predictionType} accuracy = ${(accuracy * 100).toFixed(1)}%`);
}

function calculateAccuracy(prediction: any, actual: any, type: string): number {
  if (type === "scope") {
    const predictedCost = (prediction.estimatedCost.min + prediction.estimatedCost.max) / 2;
    const actualCost = actual.finalCost;
    const errorMargin = Math.abs(predictedCost - actualCost) / actualCost;
    return Math.max(0, 1 - errorMargin);
  }
  
  if (type === "pricing") {
    return actual.wasAccepted ? 0.9 : 0.5;
  }
  
  return 0.85;
}

export async function recordJobOutcome(
  jobId: string,
  actual: {
    materials: Array<{ name: string; quantity: number; unit: string; estimatedCost: number }>;
    laborHours: number;
    totalCost: number;
  }
): Promise<void> {
  const { dataStore } = await import('@/lib/store');
  
  // Get the job
  const job = await dataStore.getJobById(jobId);
  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  // Get prediction from KV storage
  if (!job.predictionId) {
    throw new Error(`Job ${jobId} has no predictionId`);
  }

  const prediction = await window.spark.kv.get<{
    type: string;
    prediction: JobScope;
    createdAt: string;
    damageType?: string;
    urgency?: string;
  }>(`prediction:${job.predictionId}`);

  if (!prediction || !prediction.prediction) {
    throw new Error(`Prediction not found for job ${jobId}`);
  }

  const jobScope = prediction.prediction;
  
  // Calculate average predicted cost
  const avgPredictedCost = (jobScope.estimatedCost.min + jobScope.estimatedCost.max) / 2;

  // Calculate accuracy metrics
  const costAccuracy = 1 - Math.abs(actual.totalCost - avgPredictedCost) / Math.max(avgPredictedCost, 1);
  const laborAccuracy = 1 - Math.abs(actual.laborHours - jobScope.laborHours) / Math.max(jobScope.laborHours, 1);
  
  // Clamp accuracy values between 0 and 1
  const clampedCostAccuracy = Math.max(0, Math.min(1, costAccuracy));
  const clampedLaborAccuracy = Math.max(0, Math.min(1, laborAccuracy));
  const overallAccuracy = (clampedCostAccuracy + clampedLaborAccuracy) / 2;

  // Save to learning database
  await learningDB.saveFeedback({
    predictionId: job.predictionId,
    timestamp: new Date(),
    predictionType: 'scope',
    prediction: jobScope,
    actualOutcome: {
      materials: actual.materials,
      laborHours: actual.laborHours,
      totalCost: actual.totalCost,
    },
    performanceMetrics: {
      accuracy: overallAccuracy,
      costError: Math.abs(actual.totalCost - avgPredictedCost),
      laborError: Math.abs(actual.laborHours - jobScope.laborHours),
      costAccuracy: clampedCostAccuracy,
      laborAccuracy: clampedLaborAccuracy,
    }
  });

  console.log(`📊 Job outcome recorded: Cost accuracy ${(clampedCostAccuracy * 100).toFixed(1)}%, Labor accuracy ${(clampedLaborAccuracy * 100).toFixed(1)}%`);
}
