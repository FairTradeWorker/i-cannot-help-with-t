/**
 * FairTradeWorker Load Testing Script
 * Simulates 1000 concurrent users hitting the API
 * 
 * Run with: k6 run load/load-test.js
 * Or with Docker: docker run -i grafana/k6 run - <load-test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import { randomIntBetween, randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Custom metrics
const apiErrors = new Counter('api_errors');
const apiSuccess = new Rate('api_success');
const quoteDuration = new Trend('quote_duration');
const matchDuration = new Trend('match_duration');

// Test configuration
export const options = {
  // Ramp up to 1000 users over 5 minutes
  stages: [
    { duration: '1m', target: 100 },   // Warm up
    { duration: '2m', target: 500 },   // Ramp up
    { duration: '5m', target: 1000 },  // Peak load
    { duration: '2m', target: 500 },   // Ramp down
    { duration: '1m', target: 0 },     // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.05'],    // Less than 5% errors
    api_success: ['rate>0.95'],        // 95% success rate
    quote_duration: ['p(95)<3000'],    // Quotes under 3s at p95
    match_duration: ['p(95)<2000'],    // Matches under 2s at p95
  },
};

// Configuration
const BASE_URL = __ENV.API_BASE_URL || 'https://api.fairtradeworker.com';
const API_KEY = __ENV.API_KEY || 'load_test_key';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

// Sample data for realistic tests
const jobTypes = [
  'roof_replacement',
  'roof_repair',
  'plumbing_repair',
  'hvac_installation',
  'electrical_work',
  'painting',
  'flooring',
  'kitchen_remodel',
  'bathroom_remodel',
  'deck_construction'
];

const zipCodes = [
  '78701', '78702', '78703', '78704', '78705', // Austin
  '90210', '90211', '90212', // LA
  '10001', '10002', '10003', // NYC
  '60601', '60602', '60603', // Chicago
  '33101', '33102', '33103', // Miami
];

// Helper functions
function randomJobType() {
  return randomItem(jobTypes);
}

function randomZip() {
  return randomItem(zipCodes);
}

function randomSquareFootage() {
  return randomIntBetween(500, 5000);
}

// Main test function
export default function () {
  // Each VU (virtual user) runs this function repeatedly
  
  group('Instant Quote API', () => {
    const payload = JSON.stringify({
      jobType: randomJobType(),
      squareFootage: randomSquareFootage(),
      location: { zip: randomZip() },
      materialGrade: randomItem(['economy', 'standard', 'premium']),
    });

    const startTime = Date.now();
    const response = http.post(`${BASE_URL}/v1/quotes/instant`, payload, { headers });
    const duration = Date.now() - startTime;

    quoteDuration.add(duration);

    const success = check(response, {
      'quote status is 200': (r) => r.status === 200,
      'quote has totalCost': (r) => JSON.parse(r.body).quote?.totalCost !== undefined,
      'quote has confidence': (r) => JSON.parse(r.body).quote?.confidence > 0.5,
      'response time < 3s': (r) => r.timings.duration < 3000,
    });

    if (success) {
      apiSuccess.add(1);
    } else {
      apiErrors.add(1);
      apiSuccess.add(0);
    }
  });

  sleep(randomIntBetween(1, 3));

  group('Contractor Match API', () => {
    const payload = JSON.stringify({
      jobType: randomJobType(),
      location: { zip: randomZip(), radius: 25 },
      urgency: randomItem(['urgent', 'normal', 'flexible']),
    });

    const startTime = Date.now();
    const response = http.post(`${BASE_URL}/v1/contractors/match`, payload, { headers });
    const duration = Date.now() - startTime;

    matchDuration.add(duration);

    const success = check(response, {
      'match status is 200': (r) => r.status === 200,
      'match has results': (r) => Array.isArray(JSON.parse(r.body).matches),
      'response time < 2s': (r) => r.timings.duration < 2000,
    });

    if (success) {
      apiSuccess.add(1);
    } else {
      apiErrors.add(1);
      apiSuccess.add(0);
    }
  });

  sleep(randomIntBetween(1, 3));

  group('Job Analysis API', () => {
    const payload = JSON.stringify({
      type: 'description',
      description: `${randomJobType().replace('_', ' ')} needed for ${randomSquareFootage()} sq ft area`,
      jobType: randomJobType(),
      location: { zip: randomZip() },
    });

    const response = http.post(`${BASE_URL}/v1/jobs/analyze`, payload, { headers });

    const success = check(response, {
      'analysis status is 200': (r) => r.status === 200,
      'analysis has scope': (r) => JSON.parse(r.body).analysis?.scope !== undefined,
    });

    if (success) {
      apiSuccess.add(1);
    } else {
      apiErrors.add(1);
      apiSuccess.add(0);
    }
  });

  sleep(randomIntBetween(1, 3));

  group('Territory Heatmap API', () => {
    const zip = randomZip();
    const response = http.get(`${BASE_URL}/v1/territories/${zip}/heatmap`, { headers });

    const success = check(response, {
      'heatmap status is 200': (r) => r.status === 200,
      'heatmap has data': (r) => JSON.parse(r.body).heatmap !== undefined,
    });

    if (success) {
      apiSuccess.add(1);
    } else {
      apiErrors.add(1);
      apiSuccess.add(0);
    }
  });

  sleep(randomIntBetween(1, 3));

  group('Market Rates API', () => {
    const jobType = randomJobType();
    const zip = randomZip();
    const response = http.get(`${BASE_URL}/v1/pricing/market-rates?zip=${zip}&jobType=${jobType}`, { headers });

    const success = check(response, {
      'rates status is 200': (r) => r.status === 200,
      'rates has laborRate': (r) => JSON.parse(r.body).rates?.laborRate !== undefined,
    });

    if (success) {
      apiSuccess.add(1);
    } else {
      apiErrors.add(1);
      apiSuccess.add(0);
    }
  });

  // Random think time between iterations
  sleep(randomIntBetween(2, 5));
}

// Setup function - runs once per VU
export function setup() {
  console.log('Starting load test...');
  console.log(`Target: ${BASE_URL}`);
  
  // Verify API is accessible
  const response = http.get(`${BASE_URL}/health`, { headers });
  if (response.status !== 200) {
    console.error('API health check failed!');
    return { healthy: false };
  }
  
  return { healthy: true, startTime: Date.now() };
}

// Teardown function - runs once at the end
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`Load test completed in ${duration}s`);
}

// Handle summary
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data),
    'summary.html': htmlReport(data),
  };
}

// Text summary helper
function textSummary(data, options) {
  const { metrics, thresholds } = data;
  
  let summary = '\n=== LOAD TEST SUMMARY ===\n\n';
  
  summary += `Total Requests: ${metrics.http_reqs.values.count}\n`;
  summary += `Request Rate: ${metrics.http_reqs.values.rate.toFixed(2)}/s\n`;
  summary += `Failed Requests: ${metrics.http_req_failed.values.rate.toFixed(4) * 100}%\n\n`;
  
  summary += `Response Times:\n`;
  summary += `  - Median: ${metrics.http_req_duration.values.med.toFixed(0)}ms\n`;
  summary += `  - 95th percentile: ${metrics.http_req_duration.values['p(95)'].toFixed(0)}ms\n`;
  summary += `  - 99th percentile: ${metrics.http_req_duration.values['p(99)'].toFixed(0)}ms\n\n`;
  
  summary += 'Threshold Results:\n';
  for (const [name, result] of Object.entries(thresholds)) {
    const status = result.ok ? '✓' : '✗';
    summary += `  ${status} ${name}\n`;
  }
  
  return summary;
}

// HTML report helper
function htmlReport(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>FairTradeWorker Load Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #1E3A5F; }
    .metric { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
    .pass { color: green; }
    .fail { color: red; }
    table { border-collapse: collapse; width: 100%; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #1E3A5F; color: white; }
  </style>
</head>
<body>
  <h1>FairTradeWorker Load Test Report</h1>
  <p>Generated: ${new Date().toISOString()}</p>
  
  <div class="metric">
    <h3>Request Summary</h3>
    <p>Total Requests: ${data.metrics.http_reqs.values.count}</p>
    <p>Request Rate: ${data.metrics.http_reqs.values.rate.toFixed(2)}/s</p>
    <p>Failed Rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%</p>
  </div>
  
  <div class="metric">
    <h3>Response Times</h3>
    <p>Median: ${data.metrics.http_req_duration.values.med.toFixed(0)}ms</p>
    <p>95th Percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(0)}ms</p>
    <p>99th Percentile: ${data.metrics.http_req_duration.values['p(99)'].toFixed(0)}ms</p>
  </div>
  
  <div class="metric">
    <h3>Threshold Results</h3>
    <table>
      <tr><th>Threshold</th><th>Status</th></tr>
      ${Object.entries(data.thresholds).map(([name, result]) => 
        `<tr><td>${name}</td><td class="${result.ok ? 'pass' : 'fail'}">${result.ok ? 'PASS' : 'FAIL'}</td></tr>`
      ).join('')}
    </table>
  </div>
</body>
</html>
  `;
}
