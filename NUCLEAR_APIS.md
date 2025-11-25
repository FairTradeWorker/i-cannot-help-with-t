# Nuclear Intelligence APIs - Documentation

## Overview
10 high-powered intelligence endpoints integrated into the existing ServiceHub platform. Every API call feeds the `learning_feedback` table for continuous improvement.

## Authentication
All endpoints require API key authentication via Bearer token:
```
Authorization: Bearer sk_professional_YourAPIKey
```

## Endpoints

### 1. POST /api/v1/hailstrike
Real-time hail event detection and demand surge prediction.

**Request:**
```typescript
{
  zipCodes: string[];      // Array of ZIP codes to monitor
  radius: number;          // Search radius in miles (1-500)
  severity?: 'minor' | 'moderate' | 'severe' | 'catastrophic';
}
```

**Response:**
```typescript
{
  hotspots: Array<{
    zipCode: string;
    city: string;
    state: string;
    hailProbability: number;        // 0-1
    estimatedSize: string;          // e.g., "2 inch"
    demandSurge: number;            // multiplier
    avgJobValue: number;            // USD
    competitorCount: number;
    opportunityScore: number;       // 0-100
  }>;
  totalLeads: number;
  peakWindow: { start: string; end: string };
  recommendations: string[];
}
```

---

### 2. POST /api/v1/catastrophe-alpha
Pre-event catastrophe intelligence and deployment recommendations.

**Request:**
```typescript
{
  region: string;
  eventType: 'hurricane' | 'tornado' | 'wildfire' | 'flood' | 'earthquake';
  forecastDays: number;    // 1-30
}
```

**Response:**
```typescript
{
  threatLevel: number;     // 0-10
  affectedZips: string[];
  estimatedImpact: {
    properties: number;
    estimatedDamage: number;
    serviceOpportunities: number;
  };
  demandForecast: Array<{
    service: string;
    demandIncrease: number;  // percentage
    pricingPower: number;    // multiplier
  }>;
  earlyMoverAdvantage: string;
  deploymentRecommendations: string[];
}
```

---

### 3. POST /api/v1/ghostbid
Competitive bid analysis and strategic pricing recommendations.

**Request:**
```typescript
{
  jobId: string;
  targetPrice: number;
  materialsCost: number;
  laborHours: number;
}
```

**Response:**
```typescript
{
  ghostBid: {
    suggestedPrice: number;
    margin: number;          // percentage
    winProbability: number;  // 0-1
  };
  competitorAnalysis: {
    estimatedBids: Array<{ low: number; high: number }>;
    yourPosition: 'lowest' | 'competitive' | 'premium';
  };
  strategicRecommendation: string;
  riskFactors: string[];
}
```

---

### 4. GET /api/v1/contractor-dna/:id
Deep behavioral analysis and performance prediction.

**URL Parameters:**
- `id` - Contractor ID

**Response:**
```typescript
{
  dna: {
    reliability: number;      // 0-1
    speed: number;
    quality: number;
    communication: number;
    profitability: number;
  };
  behaviorProfile: {
    avgBidRatio: number;
    completionRate: number;
    customerSatisfaction: number;  // 0-5
    repeatBusinessRate: number;
  };
  predictedPerformance: {
    onTimeCompletion: number;
    budgetAdherence: number;
    qualityScore: number;
  };
  redFlags: string[];
  strengths: string[];
}
```

---

### 5. POST /api/v1/creep-oracle
Material price forecasting with buy/wait recommendations.

**Request:**
```typescript
{
  materialCategory: string;
  region: string;
  forecastMonths: number;  // 1-12
}
```

**Response:**
```typescript
{
  currentPrice: number;
  forecastedPrices: Array<{
    month: string;
    price: number;
    confidence: number;   // 0-1
  }>;
  priceMovement: 'rising' | 'stable' | 'falling';
  totalChange: number;    // percentage
  buyingRecommendation: {
    action: 'buy_now' | 'wait' | 'stockpile';
    reasoning: string;
    savingsOpportunity: number;
  };
}
```

---

### 6. GET /api/v1/arbitrage-heat
Cross-market pricing arbitrage opportunities.

**Response:**
```typescript
{
  opportunities: Array<{
    fromZip: string;
    toZip: string;
    service: string;
    priceDifferential: number;  // percentage
    demandRatio: number;
    arbitrageScore: number;     // 0-100
    monthlyPotential: number;   // USD revenue
  }>;
  topArbitrage: {
    service: string;
    avgSpread: number;
    monthlyRevenue: number;
  };
}
```

---

### 7. GET /api/v1/permit-velocity
Jurisdiction-specific permit processing times.

**Query Parameters:**
- `jurisdiction` - Jurisdiction name or code

**Response:**
```typescript
{
  jurisdiction: string;
  avgProcessingDays: number;
  currentBacklog: number;
  trends: {
    lastMonth: number;
    lastQuarter: number;
    yearOverYear: number;
  };
  expeditePossible: boolean;
  estimatedCost: number;
  recommendations: string[];
}
```

---

### 8. GET /api/v1/silent-rollup/:name
Acquisition target analysis for contractor consolidation.

**URL Parameters:**
- `name` - Contractor name

**Response:**
```typescript
{
  contractorProfile: {
    name: string;
    id: string;
    revenue: number;
    jobCount: number;
    territories: string[];
  };
  acquisitionMetrics: {
    estimatedValue: number;
    ebidta: number;
    revenueMultiple: number;
    synergies: number;
  };
  integrationComplexity: 'low' | 'medium' | 'high';
  dealStructure: {
    suggestedPrice: number;
    earnoutPotential: number;
    paybackPeriod: number;  // years
  };
  strategicFit: number;  // 0-1
}
```

---

### 9. GET /api/v1/weather-weapon
7-day predictive demand and revenue intelligence.

**Query Parameters:**
- `zipCode` - Target ZIP code

**Response:**
```typescript
{
  forecast: Array<{
    date: string;
    zipCode: string;
    events: string[];
    demandMultiplier: number;
    serviceOpportunities: string[];
  }>;
  preparedness: {
    inventoryNeeds: Array<{ material: string; quantity: number }>;
    crewAllocation: string;
    pricingStrategy: string;
  };
  revenue7Day: number;
  revenue30Day: number;
}
```

---

### 10. GET /api/v1/doomsday
Market collapse scenarios and survival strategies.

**Response:**
```typescript
{
  marketCollapse: {
    probability: number;   // 0-1
    timeline: string;
    triggers: string[];
  };
  survivalStrategy: {
    diversification: string[];
    cashReserves: number;
    hedgePositions: string[];
  };
  opportunities: {
    distressedAssets: string[];
    counterCyclicalPlays: string[];
  };
  actionPlan: string[];
}
```

---

## Response Format
All endpoints return a standardized response:

```typescript
{
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    learningContext: {
      totalPredictions: number;
      currentAccuracy: number;
      confidenceScore: number;
    };
  };
  usage?: {
    callsUsed: number;
    callsRemaining: number;
    resetDate: string;
  };
}
```

## Learning Feedback
Every API call automatically:
- Records prediction data
- Tracks accuracy over time
- Adjusts confidence scores
- Feeds machine learning models

The `learningContext` in responses shows:
- Total predictions made by the endpoint
- Current accuracy rate
- Confidence score (influenced by historical performance)

## Rate Limits
- **Free Tier**: 100 calls/month
- **Professional**: 10,000 calls/month
- **Enterprise**: Unlimited

## Billing
All API calls are metered via Stripe. Overage charges apply beyond tier limits.

## Integration Example

```typescript
import { 
  hailstrikeAPI, 
  catastropheAlphaAPI,
  ghostbidAPI 
} from '@/api/intelligence/nuclear-apis';

// Example: Detect hail opportunities
const response = await hailstrikeAPI(
  {
    zipCodes: ['78701', '78704', '78759'],
    radius: 50,
    severity: 'moderate'
  },
  'your-api-key-id'
);

if (response.success) {
  console.log('Hotspots:', response.data.hotspots);
  console.log('Learning:', response.metadata.learningContext);
}
```

## Support
- Professional tier: Email support
- Enterprise tier: Dedicated account manager + priority support

---

*All endpoints are fully typed with Zod validation and TypeScript interfaces.*
