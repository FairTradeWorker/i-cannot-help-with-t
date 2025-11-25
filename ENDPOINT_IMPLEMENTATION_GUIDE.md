# Building the Remaining 46 API Endpoints

## Template Pattern

Every endpoint follows this exact pattern. Copy, modify prompts, done.

## Step-by-Step Process

### 1. Copy Template File
```bash
cp src/api/intelligence/job-scope.ts src/api/intelligence/YOUR-NEW-ENDPOINT.ts
```

### 2. Find & Replace
- `jobScopeAPI` → `yourNewEndpointAPI`
- `JobScopeRequest` → `YourNewEndpointRequest`
- `JobScopeResponse` → `YourNewEndpointResponse`
- `'job_scope'` → `'your_new_endpoint'`

### 3. Update the Prompt
Change the Azure OpenAI prompt to match your endpoint's purpose.

### 4. Test
```typescript
const response = await yourNewEndpointAPI(request, apiKeyId);
console.log(response);
```

## Example: Building "Storm Alert API"

### File: `src/api/intelligence/storm-alert.ts`

```typescript
import { intelligenceDB, createAPIResponse } from '@/lib/intelligence-db';
import type {
  StormAlertRequest,
  StormAlertResponse,
  APIResponse,
  LearningFeedback
} from '@/types/intelligence-api';

export async function stormAlertAPI(
  request: StormAlertRequest,
  apiKeyId: string
): Promise<APIResponse<StormAlertResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const learningContext = await intelligenceDB.getLearningContext('storm_alert');

    const prompt = `You are a meteorological analyst specializing in storm impact predictions for home services.

LEARNING CONTEXT:
- Total storm predictions: ${learningContext.totalPredictions}
- Forecast accuracy: ${(learningContext.avgAccuracy * 100).toFixed(1)}%
- Confidence adjustment: ${learningContext.confidenceAdjustment}x

Analyze storm alerts for:

LOCATIONS: ${request.locations.map(l => `${l.zipCode}, ${l.state}`).join('; ')}
SERVICES: ${request.services.join(', ')}
ALERT THRESHOLD: ${request.alertThreshold}

Provide detailed storm impact predictions with demand forecasts.

Respond with valid JSON in this exact format:
{
  "alerts": [
    {
      "location": {
        "zipCode": "90210",
        "city": "Beverly Hills",
        "state": "CA"
      },
      "severity": "high",
      "stormType": "Hurricane",
      "expectedImpact": "High winds, roof damage likely",
      "timeline": "Next 48-72 hours",
      "estimatedDemandIncrease": 250,
      "recommendedActions": [
        "Pre-position crews in affected area",
        "Stock emergency repair materials",
        "Activate on-call teams"
      ]
    }
  ],
  "webhookRegistered": false
}`;

    const response = await window.spark.llm(prompt, 'gpt-4o', true);
    const alerts: StormAlertResponse = JSON.parse(response);

    const feedback: LearningFeedback = {
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'storm_alert',
      timestamp: new Date(),
      prediction: alerts,
      learningContext: {
        totalPredictions: learningContext.totalPredictions,
        avgAccuracy: learningContext.avgAccuracy,
        confidenceAdjustment: learningContext.confidenceAdjustment
      }
    };

    await intelligenceDB.saveLearningFeedback(feedback);

    const responseTime = Date.now() - startTime;
    await intelligenceDB.recordAPIUsage(apiKeyId, 'storm_alert', responseTime, 200, {
      locationsCount: request.locations.length,
      servicesCount: request.services.length
    });

    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);

    return createAPIResponse(
      true,
      alerts,
      undefined,
      {
        totalPredictions: learningContext.totalPredictions,
        currentAccuracy: learningContext.avgAccuracy,
        confidenceScore: 90
      },
      {
        callsUsed: rateLimitInfo.limit - rateLimitInfo.remaining,
        callsRemaining: rateLimitInfo.remaining,
        resetDate: rateLimitInfo.resetAt.toISOString()
      }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await intelligenceDB.recordAPIUsage(apiKeyId, 'storm_alert', responseTime, 500);

    return createAPIResponse<StormAlertResponse>(
      false,
      undefined,
      {
        code: 'STORM_ALERT_FAILED',
        message: 'Failed to generate storm alerts',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    );
  }
}
```

## Complete List of 50 Endpoints

### ✅ Completed (4)
1. ✅ Job Scope API
2. ✅ Instant Quote API
3. ✅ Contractor Match API
4. ✅ Demand Heatmap API

### ⏳ To Build (46)
5. Storm Alert API - Weather impact predictions
6. Material Price API - Current & predicted material costs
7. Permit Prediction API - Permit requirements & timing
8. Scope Creep Risk API - Project expansion probability
9. Contractor Performance API - Detailed contractor metrics
10. Win Probability API - Bid success likelihood
11. Dynamic Pricing API - Real-time price optimization
12. Damage Detection API - Image-based damage analysis
13. Roof Age Estimator API - Estimate roof age from images
14. Insurance Claim API - Xactimate JSON output
15. Labor Forecast API - Labor availability predictions
16. Competitive Bid API - Competitor pricing analysis
17. Renovation ROI API - Return on renovation investment
18. Supplier Inventory API - Material availability tracking
19. Weather Impact API - Weather delay predictions
20. Homeowner Behavior API - Customer behavior patterns
21. Contractor Recruitment API - Best contractors to recruit
22. Territory Valuation API - Territory worth estimation
23. Capacity Optimization API - Crew utilization optimization
24. Failure Prediction API - Project failure likelihood
25. Market Saturation API - Market competition analysis
26. Price Acceptance API - Price approval probability
27. Change Order API - Change order likelihood & cost
28. Dispute Prediction API - Dispute risk assessment
29. Lead Scoring API - Lead quality scoring
30. Capital Intelligence API - PE firm intelligence
31. Lumber Futures API - Lumber price predictions
32. Crew Efficiency API - Team productivity metrics
33. Warranty Claim API - Warranty claim predictions
34. Energy Savings API - Energy efficiency ROI
35. Real Estate Flip API - House flipping analysis
36. Insurance Risk API - Project insurance risk
37. Subcontractor Gap API - Subcontractor availability
38. Seasonal Demand API - Seasonal patterns
39. Voice Quote API - Voice-to-quote conversion
40. AR Overlay API - Augmented reality data
41. Batch Scope API - Bulk job analysis (1-10,000)
42. Profitability Forecast API - Project profit predictions
43. Macro Trend API - Industry trend analysis
44. Compliance Check API - Regulatory compliance
45. Customer Lifetime Value API - Customer value prediction
46. Optimal Start Date API - Best project start timing
47. Hidden Damage API - Unseen damage prediction
48. Benchmark API - Performance benchmarking
49. Pricing Oracle API - Advanced pricing intelligence
50. Master Intelligence API - All-in-one endpoint

## Prompt Engineering Tips

### For Analysis Endpoints
```
You are an expert [DOMAIN] analyst with [X] years of experience.

LEARNING CONTEXT:
- Total predictions: ${totalPredictions}
- Current accuracy: ${accuracy}%

Analyze [SUBJECT] and provide [OUTPUT].

Include:
- [Key metric 1]
- [Key metric 2]
- Confidence score
- Recommendations
```

### For Prediction Endpoints
```
You are a predictive analytics specialist for [DOMAIN].

LEARNING CONTEXT:
- Historical predictions: ${totalPredictions}
- Forecast accuracy: ${accuracy}%

Predict [SUBJECT] based on:
- [Input 1]
- [Input 2]

Provide:
- Prediction value
- Confidence range
- Risk factors
- Timeline
```

### For Optimization Endpoints
```
You are an optimization expert for [DOMAIN].

LEARNING CONTEXT:
- Optimizations performed: ${totalPredictions}
- Success rate: ${accuracy}%

Optimize [SUBJECT] to maximize [GOAL].

Consider:
- [Constraint 1]
- [Constraint 2]

Return:
- Optimized solution
- Expected improvement
- Implementation steps
```

## Quick Implementation Checklist

For each endpoint:

- [ ] Copy template file
- [ ] Rename function and types
- [ ] Update endpoint name string
- [ ] Write custom prompt
- [ ] Define expected response format
- [ ] Test with sample request
- [ ] Add to API documentation
- [ ] Update pricing/permissions if needed

## Testing Each Endpoint

```typescript
// Test in browser console or separate test file
const testEndpoint = async () => {
  // 1. Generate test API key
  const apiKey = await intelligenceDB.generateAPIKey('test-user', 'Test Key', 'professional');
  
  // 2. Call your endpoint
  const response = await yourNewEndpointAPI(
    {
      // Your test request data
    },
    apiKey.id
  );
  
  // 3. Verify response
  console.log('Success:', response.success);
  console.log('Data:', response.data);
  console.log('Learning Context:', response.metadata.learningContext);
  console.log('Usage:', response.usage);
};

testEndpoint();
```

## Parallel Development Strategy

### Week 1: Core Prediction APIs (10 endpoints)
- Storm Alert
- Material Price
- Permit Prediction
- Weather Impact
- Seasonal Demand
- Lumber Futures
- Hidden Damage
- Roof Age Estimator
- Damage Detection
- Optimal Start Date

### Week 2: Risk & Analysis APIs (10 endpoints)
- Scope Creep Risk
- Failure Prediction
- Dispute Prediction
- Insurance Risk
- Compliance Check
- Change Order
- Price Acceptance
- Win Probability
- Lead Scoring
- Warranty Claim

### Week 3: Optimization & Performance APIs (10 endpoints)
- Dynamic Pricing
- Pricing Oracle
- Capacity Optimization
- Crew Efficiency
- Route Optimization (already exists via routing-api.ts)
- Contractor Performance
- Competitive Bid
- Benchmark
- Profitability Forecast
- Market Saturation

### Week 4: Strategic & Capital APIs (10 endpoints)
- Territory Valuation
- Capital Intelligence
- Contractor Recruitment
- Homeowner Behavior
- Customer Lifetime Value
- Real Estate Flip
- Renovation ROI
- Macro Trend
- Subcontractor Gap
- Supplier Inventory

### Week 5: Advanced & Integration APIs (6 endpoints)
- Batch Scope (high volume)
- Master Intelligence (combines all)
- Voice Quote (speech-to-text)
- AR Overlay (computer vision)
- Energy Savings (complex calc)
- Insurance Claim (Xactimate format)

## Automation Script

Create this helper to generate endpoint boilerplate:

```typescript
// scripts/generate-endpoint.ts
const endpointName = process.argv[2];
const template = `// Copy from job-scope.ts and replace names`;
// Generate file with proper names
fs.writeFileSync(`src/api/intelligence/${endpointName}.ts`, template);
console.log(`Created ${endpointName}.ts`);
```

Usage:
```bash
npm run generate-endpoint storm-alert
npm run generate-endpoint material-price
# etc.
```

## Final Notes

- **Consistency is key** - All endpoints follow same pattern
- **Learning context always included** - This is what makes it special
- **Error handling is critical** - Never crash, always return proper response
- **Metadata adds value** - Users love seeing the learning metrics
- **Start simple, improve later** - Get all 50 working, then optimize

**You've got the foundation. Now just execute the pattern 46 more times! 🚀**
