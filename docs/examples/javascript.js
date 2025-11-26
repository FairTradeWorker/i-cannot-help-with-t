// JavaScript/TypeScript Examples for FairTradeWorker API

// Installation: npm install @fairtradeworker/sdk
// Or use fetch directly

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.fairtradeworker.com/v1';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }
  
  return response.json();
}

// ============================================
// EXAMPLE 1: Generate Instant Quote
// ============================================
async function getInstantQuote() {
  try {
    const quote = await apiCall('/quotes/instant', {
      method: 'POST',
      body: JSON.stringify({
        jobType: 'roof_replacement',
        squareFootage: 2500,
        location: { zip: '78701' },
        materialGrade: 'standard',
        options: {
          includeWarranty: true,
          urgency: 'normal'
        }
      }),
    });
    
    console.log('Quote generated:');
    console.log(`  Total: $${quote.quote.totalCost}`);
    console.log(`  Labor: $${quote.quote.breakdown.labor}`);
    console.log(`  Materials: $${quote.quote.breakdown.materials}`);
    console.log(`  Timeline: ${quote.quote.timeline.estimatedDays} days`);
    console.log(`  Confidence: ${(quote.quote.confidence * 100).toFixed(1)}%`);
    
    return quote;
  } catch (error) {
    console.error('Failed to get quote:', error.message);
  }
}

// ============================================
// EXAMPLE 2: Analyze Job from Photo
// ============================================
async function analyzeJobPhoto(photoUrl) {
  try {
    const analysis = await apiCall('/jobs/analyze', {
      method: 'POST',
      body: JSON.stringify({
        type: 'photo',
        url: photoUrl,
        jobType: 'roof_repair',
        location: { zip: '78701' }
      }),
    });
    
    console.log('Job Analysis:');
    console.log(`  Summary: ${analysis.analysis.scope.summary}`);
    console.log(`  Estimated Hours: ${analysis.analysis.estimatedHours}`);
    console.log(`  Complexity: ${analysis.analysis.complexity}`);
    console.log('  Tasks:');
    analysis.analysis.scope.tasks.forEach(task => {
      console.log(`    - ${task.name} (${task.hours}h)`);
    });
    console.log('  Materials:');
    analysis.analysis.materials.forEach(mat => {
      console.log(`    - ${mat.quantity} ${mat.unit} ${mat.name}`);
    });
    
    return analysis;
  } catch (error) {
    console.error('Failed to analyze job:', error.message);
  }
}

// ============================================
// EXAMPLE 3: Find Matching Contractors
// ============================================
async function findContractors(jobType, zip, radius = 25) {
  try {
    const matches = await apiCall('/contractors/match', {
      method: 'POST',
      body: JSON.stringify({
        jobType,
        location: { zip, radius },
        requirements: ['licensed', 'insured'],
        urgency: 'normal'
      }),
    });
    
    console.log(`Found ${matches.matches.length} contractors:`);
    matches.matches.forEach((match, i) => {
      console.log(`\n  ${i + 1}. ${match.contractor.name}`);
      console.log(`     Rating: ${match.contractor.rating}/5 (${match.contractor.reviewCount} reviews)`);
      console.log(`     Experience: ${match.contractor.yearsExperience} years`);
      console.log(`     Match Score: ${(match.matchScore * 100).toFixed(0)}%`);
      console.log(`     Distance: ${match.distance} miles`);
      console.log(`     Available: ${match.availability}`);
    });
    
    return matches;
  } catch (error) {
    console.error('Failed to find contractors:', error.message);
  }
}

// ============================================
// EXAMPLE 4: Optimize Route
// ============================================
async function optimizeRoute(stops) {
  try {
    const route = await apiCall('/routes/optimize', {
      method: 'POST',
      body: JSON.stringify({
        stops: stops.map(address => ({ address })),
        returnToStart: true,
        avoidTolls: false
      }),
    });
    
    console.log('Optimized Route:');
    console.log(`  Total Distance: ${route.route.totalDistance} miles`);
    console.log(`  Total Duration: ${route.route.totalDuration} minutes`);
    console.log(`  Estimated Cost: $${route.route.estimatedCost}`);
    console.log('  Order:');
    route.route.optimizedOrder.forEach((stop, i) => {
      console.log(`    ${i + 1}. ${stop.address}`);
    });
    
    return route;
  } catch (error) {
    console.error('Failed to optimize route:', error.message);
  }
}

// ============================================
// EXAMPLE 5: Get Market Rates
// ============================================
async function getMarketRates(zip, jobType) {
  try {
    const rates = await apiCall(`/pricing/market-rates?zip=${zip}&jobType=${jobType}`);
    
    console.log(`Market Rates for ${jobType} in ${zip}:`);
    console.log(`  Labor Rate: $${rates.rates.laborRate}/hour`);
    console.log(`  Material Multiplier: ${rates.rates.materialMultiplier}x`);
    console.log(`  Average Job Cost: $${rates.rates.averageJobCost}`);
    console.log(`  Price Range: $${rates.rates.priceRange.min} - $${rates.rates.priceRange.max}`);
    
    return rates;
  } catch (error) {
    console.error('Failed to get market rates:', error.message);
  }
}

// ============================================
// EXAMPLE 6: Get Demand Heatmap
// ============================================
async function getDemandHeatmap(territoryId) {
  try {
    const heatmap = await apiCall(`/territories/${territoryId}/heatmap`);
    
    console.log(`Demand Heatmap for ${territoryId}:`);
    console.log(`  Total Cells: ${heatmap.heatmap.cells.length}`);
    console.log('  Top Demand Areas:');
    heatmap.heatmap.cells
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 5)
      .forEach((cell, i) => {
        console.log(`    ${i + 1}. ${cell.area}: ${cell.demand} jobs/month`);
      });
    
    return heatmap;
  } catch (error) {
    console.error('Failed to get heatmap:', error.message);
  }
}

// ============================================
// EXAMPLE 7: Competitive Pricing Analysis
// ============================================
async function analyzePricing(jobType, zip, proposedPrice) {
  try {
    const analysis = await apiCall('/pricing/competitive-analysis', {
      method: 'POST',
      body: JSON.stringify({
        jobType,
        location: { zip },
        proposedPrice
      }),
    });
    
    console.log('Competitive Analysis:');
    console.log(`  Your Price: $${proposedPrice}`);
    console.log(`  Market Position: ${analysis.analysis.marketPosition}`);
    console.log(`  Recommended Range: $${analysis.analysis.recommendedRange.min} - $${analysis.analysis.recommendedRange.max}`);
    console.log(`  Win Probability: ${(analysis.analysis.winProbability * 100).toFixed(0)}%`);
    
    return analysis;
  } catch (error) {
    console.error('Failed to analyze pricing:', error.message);
  }
}

// ============================================
// EXAMPLE 8: Webhook Handler (Express.js)
// ============================================
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = 'your_webhook_secret';

function verifyWebhookSignature(payload, signature) {
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature || ''),
    Buffer.from(expected)
  );
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-ftw-signature'];
  
  if (!verifyWebhookSignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const { event, data } = req.body;
  
  switch (event) {
    case 'quote.generated':
      console.log('New quote generated:', data.quoteId);
      break;
    case 'job.completed':
      console.log('Job completed:', data.jobId);
      break;
    case 'contractor.matched':
      console.log('Contractor matched:', data.contractorId);
      break;
    default:
      console.log('Unknown event:', event);
  }
  
  res.json({ received: true });
});

// ============================================
// EXAMPLE 9: Batch Quote Processing
// ============================================
async function batchQuotes(jobs) {
  const quotes = await Promise.all(
    jobs.map(job =>
      apiCall('/quotes/instant', {
        method: 'POST',
        body: JSON.stringify(job),
      }).catch(error => ({
        error: true,
        message: error.message,
        job
      }))
    )
  );
  
  const successful = quotes.filter(q => !q.error);
  const failed = quotes.filter(q => q.error);
  
  console.log(`Batch complete: ${successful.length} successful, ${failed.length} failed`);
  
  return { successful, failed };
}

// ============================================
// EXAMPLE 10: Real-time Usage Monitoring
// ============================================
class UsageMonitor {
  constructor(apiKey, warningThreshold = 0.8) {
    this.apiKey = apiKey;
    this.warningThreshold = warningThreshold;
  }
  
  async checkUsage() {
    const response = await fetch(`${BASE_URL}/usage`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });
    
    const usage = await response.json();
    const percentage = usage.used / usage.limit;
    
    if (percentage >= 0.9) {
      console.warn('⚠️ CRITICAL: 90% of API quota used!');
    } else if (percentage >= this.warningThreshold) {
      console.warn(`⚠️ WARNING: ${(percentage * 100).toFixed(0)}% of API quota used`);
    }
    
    return usage;
  }
}

// ============================================
// RUN EXAMPLES
// ============================================
async function runExamples() {
  console.log('=== FairTradeWorker API Examples ===\n');
  
  // Example 1
  console.log('1. Instant Quote:');
  await getInstantQuote();
  
  console.log('\n2. Find Contractors:');
  await findContractors('electrical_work', '78701');
  
  console.log('\n3. Market Rates:');
  await getMarketRates('78701', 'roof_replacement');
}

// Export for use in other files
module.exports = {
  apiCall,
  getInstantQuote,
  analyzeJobPhoto,
  findContractors,
  optimizeRoute,
  getMarketRates,
  getDemandHeatmap,
  analyzePricing,
  batchQuotes,
  UsageMonitor
};
