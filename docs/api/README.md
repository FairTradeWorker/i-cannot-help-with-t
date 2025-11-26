# FairTradeWorker API Documentation

Welcome to the FairTradeWorker Intelligence API documentation. Our self-learning APIs help you build smarter home services applications.

## Quick Links

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Reference](#api-reference)
- [SDKs & Libraries](#sdks--libraries)
- [Rate Limits](#rate-limits)
- [Error Handling](#error-handling)

---

## Getting Started

### 1. Create an Account

Sign up at [app.fairtradeworker.com](https://app.fairtradeworker.com/signup) to get your API key.

### 2. Get Your API Key

Navigate to **Dashboard → API Keys** and click **Generate Key**.

### 3. Make Your First Request

```bash
curl -X POST https://api.fairtradeworker.com/v1/quotes/instant \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jobType": "roof_replacement",
    "squareFootage": 2500,
    "location": {"zip": "78701"}
  }'
```

### 4. Receive Your Response

```json
{
  "quote": {
    "totalCost": 12450,
    "laborCost": 7200,
    "materialCost": 5250,
    "timeline": "3-4 days",
    "confidence": 0.94,
    "accuracy": "97.3%"
  },
  "metadata": {
    "requestId": "req_abc123",
    "processingTime": 1.2
  }
}
```

---

## Authentication

All API requests require authentication using a Bearer token.

```
Authorization: Bearer YOUR_API_KEY
```

### API Key Types

| Type | Description | Permissions |
|------|-------------|-------------|
| `test_*` | Test keys for development | Sandbox only |
| `live_*` | Production keys | Full access |

### Security Best Practices

- Never expose API keys in client-side code
- Rotate keys periodically
- Use environment variables
- Restrict keys by IP if possible

---

## API Reference

### Base URL

```
https://api.fairtradeworker.com/v1
```

### Job Intelligence

#### Analyze Job

Analyze photos, videos, or descriptions to generate job scope.

```http
POST /jobs/analyze
```

**Request Body:**

```json
{
  "type": "photo",
  "url": "https://example.com/roof.jpg",
  "jobType": "roof_repair",
  "location": {"zip": "78701"}
}
```

**Response:**

```json
{
  "analysis": {
    "scope": {
      "summary": "Repair damaged shingles on south-facing roof section",
      "tasks": [
        {"name": "Remove damaged shingles", "hours": 2},
        {"name": "Install new shingles", "hours": 3}
      ]
    },
    "materials": [
      {"name": "Architectural shingles", "quantity": 2, "unit": "bundle"},
      {"name": "Roofing nails", "quantity": 1, "unit": "box"}
    ],
    "estimatedHours": 5,
    "complexity": "medium",
    "confidence": 0.89
  }
}
```

#### Generate Scope

Generate detailed scope from text description.

```http
POST /jobs/scope
```

### Pricing APIs

#### Instant Quote

Generate accurate cost estimates.

```http
POST /quotes/instant
```

**Request Body:**

```json
{
  "jobType": "roof_replacement",
  "squareFootage": 2500,
  "location": {"zip": "78701"},
  "materialGrade": "standard",
  "options": {
    "includeWarranty": true,
    "urgency": "normal"
  }
}
```

**Response:**

```json
{
  "quote": {
    "totalCost": 12450,
    "breakdown": {
      "labor": 7200,
      "materials": 4750,
      "permits": 300,
      "warranty": 200
    },
    "timeline": {
      "estimatedDays": 3,
      "startAvailability": "2024-12-20"
    },
    "confidence": 0.94
  }
}
```

#### Market Rates

Get current market rates for a location.

```http
GET /pricing/market-rates?zip={zip}&jobType={jobType}
```

#### Competitive Analysis

Analyze how your pricing compares to the market.

```http
POST /pricing/competitive-analysis
```

### Contractor Matching

#### Match Contractors

Find the best contractors for a job.

```http
POST /contractors/match
```

**Request Body:**

```json
{
  "jobType": "electrical_work",
  "location": {"zip": "78701", "radius": 25},
  "requirements": ["licensed", "insured"],
  "urgency": "normal"
}
```

**Response:**

```json
{
  "matches": [
    {
      "contractor": {
        "id": "con_123",
        "name": "Elite Electric",
        "rating": 4.9,
        "reviewCount": 127,
        "yearsExperience": 12
      },
      "matchScore": 0.95,
      "availability": "2024-12-18",
      "distance": 3.2
    }
  ]
}
```

### Territory Intelligence

#### Demand Heatmap

Get demand data for a territory.

```http
GET /territories/{territoryId}/heatmap
```

#### Demand Forecast

Predict future demand.

```http
GET /territories/{territoryId}/demand-forecast?days={days}
```

#### Route Optimization

Optimize routes between job sites.

```http
POST /routes/optimize
```

**Request Body:**

```json
{
  "stops": [
    {"address": "123 Main St, Austin, TX"},
    {"address": "456 Oak Ave, Austin, TX"},
    {"address": "789 Pine Rd, Austin, TX"}
  ],
  "returnToStart": true,
  "avoidTolls": false
}
```

### Market Intelligence

#### Market Trends

Get market trends for a region.

```http
GET /market/trends?region={region}&period={period}
```

#### Pricing Analytics

Get pricing analytics for job types.

```http
GET /market/pricing-analytics?jobType={jobType}&region={region}
```

### Capital Intelligence (Enterprise)

#### Portfolio Valuation

Value a portfolio of home service companies.

```http
POST /capital/portfolio-valuation
```

#### Market Opportunity

Analyze market opportunities.

```http
GET /capital/market-opportunity?region={region}&category={category}
```

---

## SDKs & Libraries

### JavaScript/TypeScript

```bash
npm install @fairtradeworker/sdk
```

```javascript
import { FairTradeWorker } from '@fairtradeworker/sdk';

const ftw = new FairTradeWorker('YOUR_API_KEY');

const quote = await ftw.quotes.instant({
  jobType: 'roof_replacement',
  squareFootage: 2500,
  location: { zip: '78701' }
});
```

### Python

```bash
pip install fairtradeworker
```

```python
from fairtradeworker import FairTradeWorker

ftw = FairTradeWorker('YOUR_API_KEY')

quote = ftw.quotes.instant(
    job_type='roof_replacement',
    square_footage=2500,
    location={'zip': '78701'}
)
```

### cURL

```bash
curl -X POST https://api.fairtradeworker.com/v1/quotes/instant \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jobType": "roof_replacement", "squareFootage": 2500}'
```

---

## Rate Limits

| Plan | Requests/Month | Requests/Minute |
|------|----------------|-----------------|
| Free | 100 | 10 |
| Professional | 10,000 | 100 |
| Enterprise | Unlimited | 1,000 |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1704067200
```

### Handling Rate Limits

When rate limited, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Retry after 60 seconds.",
    "retryAfter": 60
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid job type specified",
    "details": [
      {"field": "jobType", "issue": "must be a valid job type"}
    ]
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Webhooks

Subscribe to events for real-time updates.

### Available Events

- `job.created`
- `job.completed`
- `quote.generated`
- `contractor.matched`
- `payment.completed`

### Webhook Payload

```json
{
  "event": "quote.generated",
  "timestamp": "2024-12-15T10:30:00Z",
  "data": {
    "quoteId": "quote_abc123",
    "totalCost": 12450
  }
}
```

### Verifying Webhooks

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

---

## Support

- **Documentation:** docs.fairtradeworker.com
- **API Status:** status.fairtradeworker.com
- **Email:** support@fairtradeworker.com
- **Community:** community.fairtradeworker.com
