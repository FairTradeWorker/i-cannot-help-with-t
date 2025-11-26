# FairTradeWorker Intelligence API - Quick Start Guide

> **Death of the Middleman. Birth of the Trade Infrastructure.**

**Website**: FairTradeWorker.com  
**Launch Date**: November 27, 2025  
**Intelligence Platform Unlock**: May 27, 2026

## 🚀 What You Have Now

A **production-ready foundation** for a self-learning Intelligence API platform with:

### ✅ Completed Features
1. **Intelligence Database System** - Full CRUD for API keys, usage tracking, learning feedback
2. **Learning Loop Infrastructure** - Every API call feeds the learning system
3. **4 Working API Endpoints** - AI Scope, Instant Quote, Contractor Match, Demand Heatmap
4. **34 Premium APIs** - Locked until May 27, 2026
5. **User Dashboard** - API key management, usage metrics, documentation
6. **Admin Dashboard** - Learning metrics, accuracy tracking, compounding visualization
7. **Navigation Integration** - "Intelligence API" tab in main app
8. **Type Safety** - Complete TypeScript definitions for all endpoints

### 🎯 Core Innovation: The Learning Loop

Every API call follows this pattern:
```typescript
User Request → Load Learning Context → Generate Prediction → 
Save Feedback → Track Outcome → Improve Future Predictions
```

**Result**: The system gets smarter with every use, creating a compounding moat.

## 📊 How to Use

### For Users

#### Understanding the Payment Model
- **Homeowners**: Pay $20 one-time platform fee per job
- **Contractors**: Pay $0 - keep 100% of earnings
- **Territory Operators**: Pay $0 - build the network, don't pay into it
- **First 10 Territories**: FREE
- **Additional Territories**: $500 (#11), $1,000 (#12), $1,500 (#13), $2,000 (#14), $2,500+ (#15+)
- **⚠️ ONE LICENSE PER INDIVIDUAL/LLC/CORPORATION**

#### 1. Generate an API Key
```
1. Click "Intelligence API" tab in navigation
2. Enter a key name (e.g., "Production Key")
3. Select tier (Free, Professional, Enterprise)
4. Click "Generate API Key"
5. Copy the key (starts with sk_)
```

#### 2. View Usage
```
1. Go to "Usage" tab
2. See total calls, response times, success rate
3. View breakdown by endpoint
```

#### 3. Read Documentation
```
1. Go to "Documentation" tab
2. Select an endpoint from the list
3. See request/response examples
4. Copy curl command with your API key
```

### For Admins

#### View Learning Metrics
```
1. Click the admin icon (ChartBar) in header
2. See "Learning Intelligence Dashboard" section
3. View:
   - Total predictions made
   - Current accuracy (%)
   - Improvement rate
   - Compounding factor
   - Accuracy by endpoint
```

#### Track Platform Performance
```
- Total API calls across all users
- Revenue from API subscriptions
- Most popular endpoints
- Learning insights (what's improving)
```

## 🛠️ For Developers

### Adding a New API Endpoint

Use the existing endpoints as templates. Example for "Material Price API":

```typescript
// src/api/intelligence/material-price.ts
import { intelligenceDB, createAPIResponse } from '@/lib/intelligence-db';
import type { MaterialPriceRequest, MaterialPriceResponse, APIResponse, LearningFeedback } from '@/types/intelligence-api';

export async function materialPriceAPI(
  request: MaterialPriceRequest,
  apiKeyId: string
): Promise<APIResponse<MaterialPriceResponse>> {
  const startTime = Date.now();
  const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    // 1. Load learning context
    const learningContext = await intelligenceDB.getLearningContext('material_price');

    // 2. Build prompt with context
    const prompt = `You are a materials pricing expert...
    
LEARNING CONTEXT:
- Total price predictions: ${learningContext.totalPredictions}
- Current accuracy: ${(learningContext.avgAccuracy * 100).toFixed(1)}%

[Your specific prompt here]`;

    // 3. Call Azure OpenAI
    const response = await window.spark.llm(prompt, 'gpt-4o', true);
    const data: MaterialPriceResponse = JSON.parse(response);

    // 4. Adjust confidence based on learning
    data.confidenceScore *= learningContext.confidenceAdjustment;

    // 5. Save learning feedback
    await intelligenceDB.saveLearningFeedback({
      id: `fb_${Date.now()}`,
      predictionId,
      endpoint: 'material_price',
      timestamp: new Date(),
      prediction: data,
      learningContext
    });

    // 6. Record usage
    const responseTime = Date.now() - startTime;
    await intelligenceDB.recordAPIUsage(apiKeyId, 'material_price', responseTime, 200);

    // 7. Return response
    const rateLimitInfo = await intelligenceDB.getRateLimitInfo(apiKeyId);
    return createAPIResponse(true, data, undefined, learningContext, rateLimitInfo);

  } catch (error) {
    return createAPIResponse(false, undefined, { code: 'ERROR', message: 'Failed' });
  }
}
```

### Recording Actual Outcomes

When you learn the actual outcome of a prediction:

```typescript
// After job completes and actual cost is known
await intelligenceDB.updateLearningOutcome(
  predictionId,
  { actualCost: 4200, actualHours: 18 },
  0.94 // 94% accuracy (calculated by comparing predicted vs actual)
);
```

### Checking User Usage

```typescript
const metrics = await intelligenceDB.getUserUsageMetrics(userId);
// Returns: { totalCalls, callsByEndpoint, avgResponseTime, errorRate }
```

### Getting Global Metrics

```typescript
const metrics = await intelligenceDB.getGlobalLearningMetrics();
// Returns: { totalPredictions, averageAccuracy, improvementRate, compoundingFactor }
```

## 📈 API Tiers & Pricing

### Available at Launch (4 APIs)
| API | Price | Description |
|-----|-------|-------------|
| AI Scope API | $2,499/mo | ENTERPRISE - premium deterrent pricing |
| Instant Quote API | $499/mo | Fast pricing estimates with confidence |
| Contractor Match API | $299/mo | Match contractors to jobs |
| Demand Heatmap API | $199/mo | Regional demand visualization |

### Locked Until May 27, 2026 (34 APIs)
- Job Intelligence APIs (10)
- Contractor Intelligence APIs (10)
- Market Intelligence APIs (10)
- Financial Intelligence APIs (4)

**Note**: 34 Premium Intelligence APIs unlock May 27, 2026 (6 months after launch)

## 🎯 Territory Claiming for Operators

### How It Works
1. **Sign Up** as Territory Operator
2. **First 10 Territories**: Completely FREE
3. **Additional Territories**:
   - #11: $500
   - #12: $1,000
   - #13: $1,500
   - #14: $2,000
   - #15+: $2,500 each
4. **Operators pay $0 fees** - you BUILD the network, not pay into it
5. **⚠️ ONE LICENSE PER INDIVIDUAL/LLC/CORPORATION**

### What You Get
- Exclusive lead access in your territories
- Contractor recruitment tools
- Territory analytics
- Zero recurring fees

## 🎨 UI Components Explained

### IntelligenceAPIManager.tsx
Main user-facing component with 4 tabs:
1. **API Keys** - Generate, view, copy keys
2. **Usage** - See your API usage metrics
3. **Documentation** - Interactive API docs
4. **Pricing** - View and upgrade plans

### AdminLearningDashboard.tsx
Admin-only component showing:
1. **Overview Cards** - Total predictions, accuracy, improvement, endpoints
2. **Accuracy by Endpoint** - Bar chart visualization
3. **Learning Insights** - Recent discoveries
4. **Compounding Effect** - Historical accuracy progression

## 🔐 Security & Rate Limiting

### API Key Format
```
sk_free_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
sk_professional_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
sk_enterprise_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
```

### Rate Limits
- **Free**: 100/month, no burst
- **Professional**: 10,000/month, 100/minute burst
- **Enterprise**: Unlimited, 1000/minute burst

### Validation Flow
```typescript
const { valid, key, error } = await intelligenceDB.validateAPIKey(apiKeyString);

if (!valid) {
  return { error: 'Invalid API key' };
}

if (key.callsUsed >= key.callsLimit) {
  return { error: 'Rate limit exceeded' };
}

// Process request...
```

## 📊 Data Storage (Spark KV)

### Keys Used
- `intelligence-api-keys` - All API keys
- `intelligence-api-usage` - Usage logs
- `intelligence-learning-feedback` - Learning data

### Data Retention
- API keys: Forever (until revoked)
- Usage logs: Last 90 days
- Learning feedback: Forever (improves accuracy)

## 🎯 Extending the System

### Add Individual API Products

```typescript
// src/api/intelligence/storm-alert.ts
// Follow same pattern as other endpoints
// Add to pricing plans as individual product ($49/mo)
```

### Add Webhooks

```typescript
interface WebhookSubscription {
  userId: string;
  event: 'storm_alert' | 'demand_spike';
  url: string;
  secret: string;
}

// When event occurs, POST to user's webhook URL
fetch(webhook.url, {
  method: 'POST',
  headers: {
    'X-Webhook-Secret': webhook.secret,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(eventData)
});
```

### Add Stripe Billing

```typescript
import Stripe from 'stripe';

// Create subscription when user upgrades
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: 'price_professional_199' }],
  metadata: { userId, apiKeyId }
});

// Track usage for billing
await stripe.subscriptionItems.createUsageRecord(
  subscriptionItemId,
  { quantity: apiCallCount }
);
```

## 🚀 Next Steps

### Immediate (Available at Launch - November 27, 2025)
1. ✅ 4 Premium APIs live
2. ✅ Territory claiming system
3. ✅ Zero fees for contractors AND operators
4. ✅ $20 homeowner platform fee

### May 27, 2026 (6 Months After Launch)
1. 🔒 34 Premium Intelligence APIs unlock
2. 🔒 Capital Layer Portal
3. 🔒 Enterprise Data Licensing
4. 🔒 Advanced analytics features

### Post-Launch Development
1. Add batch processing for high-volume users
2. Create API playground for testing
3. Implement usage alerts (90% quota)
4. Add response caching
5. Launch mobile apps (iOS & Android)

### Future Development
1. Build SDKs (JavaScript, Python, Go)
2. White-label solutions for enterprises
3. Custom model training for large customers
4. Real-time collaboration features
5. International expansion

## 💡 Tips & Best Practices

### For API Endpoint Developers
- ✅ Always load learning context first
- ✅ Adjust confidence based on historical accuracy
- ✅ Save feedback after every prediction
- ✅ Record usage for rate limiting
- ✅ Handle errors gracefully
- ✅ Return consistent response format

### For Frontend Developers
- ✅ Show learning metrics prominently
- ✅ Display accuracy improvements over time
- ✅ Make API keys easy to copy
- ✅ Provide clear documentation
- ✅ Show usage limits clearly

### For Business/Product
- ✅ Emphasize the learning/compounding aspect
- ✅ Show concrete accuracy improvements
- ✅ Price based on value, not just volume
- ✅ Target high-value customers (PE firms, insurance)
- ✅ Bundle APIs into intelligent packages

## 📚 Additional Resources

- **Architecture Doc**: See `INTELLIGENCE_API_ARCHITECTURE.md`
- **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md`
- **Type Definitions**: See `src/types/intelligence-api.ts`
- **Example Endpoints**: See `src/api/intelligence/*.ts`

## 🎉 Success!

You now have a production-ready foundation for an Intelligence API platform that:
- ✅ Learns from every API call
- ✅ Improves accuracy over time
- ✅ Tracks all metrics transparently
- ✅ Premium priced APIs ($199-$2,499/mo)
- ✅ Zero fees for contractors AND operators
- ✅ 34 Premium APIs unlock May 2026

The key is the **learning loop** - it creates a moat that compounds over time. The more it's used, the better it gets, the more valuable it becomes.

---

**FairTradeWorker - Launching November 27, 2025**

*Death of the Middleman. Birth of the Trade Infrastructure.*

**Website**: FairTradeWorker.com
