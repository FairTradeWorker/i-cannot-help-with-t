"""
Python Examples for FairTradeWorker API

Installation: pip install fairtradeworker
Or use requests directly: pip install requests
"""

import os
import json
import hmac
import hashlib
from typing import Optional, Dict, List, Any
import requests

API_KEY = os.environ.get('FTW_API_KEY', 'YOUR_API_KEY')
BASE_URL = 'https://api.fairtradeworker.com/v1'


class FairTradeWorkerAPI:
    """FairTradeWorker API Client"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make an API request"""
        url = f"{BASE_URL}{endpoint}"
        response = self.session.request(method, url, **kwargs)
        
        if not response.ok:
            error = response.json().get('error', {})
            raise Exception(error.get('message', 'API request failed'))
        
        return response.json()
    
    # ============================================
    # QUOTES
    # ============================================
    
    def instant_quote(
        self,
        job_type: str,
        square_footage: int,
        zip_code: str,
        material_grade: str = 'standard',
        include_warranty: bool = True,
        urgency: str = 'normal'
    ) -> Dict[str, Any]:
        """Generate an instant quote for a job"""
        return self._request('POST', '/quotes/instant', json={
            'jobType': job_type,
            'squareFootage': square_footage,
            'location': {'zip': zip_code},
            'materialGrade': material_grade,
            'options': {
                'includeWarranty': include_warranty,
                'urgency': urgency
            }
        })
    
    def market_rates(self, zip_code: str, job_type: str) -> Dict[str, Any]:
        """Get market rates for a location and job type"""
        return self._request('GET', f'/pricing/market-rates?zip={zip_code}&jobType={job_type}')
    
    def competitive_analysis(
        self,
        job_type: str,
        zip_code: str,
        proposed_price: float
    ) -> Dict[str, Any]:
        """Analyze competitive pricing"""
        return self._request('POST', '/pricing/competitive-analysis', json={
            'jobType': job_type,
            'location': {'zip': zip_code},
            'proposedPrice': proposed_price
        })
    
    # ============================================
    # JOBS
    # ============================================
    
    def analyze_job(
        self,
        content_type: str,
        url: str,
        job_type: str,
        zip_code: str
    ) -> Dict[str, Any]:
        """Analyze a job from photo, video, or description"""
        return self._request('POST', '/jobs/analyze', json={
            'type': content_type,
            'url': url,
            'jobType': job_type,
            'location': {'zip': zip_code}
        })
    
    def generate_scope(
        self,
        description: str,
        job_type: str,
        zip_code: str
    ) -> Dict[str, Any]:
        """Generate detailed scope from description"""
        return self._request('POST', '/jobs/scope', json={
            'description': description,
            'jobType': job_type,
            'location': {'zip': zip_code}
        })
    
    # ============================================
    # CONTRACTORS
    # ============================================
    
    def match_contractors(
        self,
        job_type: str,
        zip_code: str,
        radius: int = 25,
        requirements: Optional[List[str]] = None,
        urgency: str = 'normal'
    ) -> Dict[str, Any]:
        """Find matching contractors for a job"""
        return self._request('POST', '/contractors/match', json={
            'jobType': job_type,
            'location': {'zip': zip_code, 'radius': radius},
            'requirements': requirements or ['licensed', 'insured'],
            'urgency': urgency
        })
    
    def contractor_availability(
        self,
        contractor_id: str,
        date: str
    ) -> Dict[str, Any]:
        """Check contractor availability"""
        return self._request('GET', f'/contractors/{contractor_id}/availability?date={date}')
    
    # ============================================
    # TERRITORY INTELLIGENCE
    # ============================================
    
    def demand_heatmap(self, territory_id: str) -> Dict[str, Any]:
        """Get demand heatmap for a territory"""
        return self._request('GET', f'/territories/{territory_id}/heatmap')
    
    def demand_forecast(self, territory_id: str, days: int = 30) -> Dict[str, Any]:
        """Get demand forecast for a territory"""
        return self._request('GET', f'/territories/{territory_id}/demand-forecast?days={days}')
    
    def optimize_route(
        self,
        stops: List[str],
        return_to_start: bool = True,
        avoid_tolls: bool = False
    ) -> Dict[str, Any]:
        """Optimize route between stops"""
        return self._request('POST', '/routes/optimize', json={
            'stops': [{'address': addr} for addr in stops],
            'returnToStart': return_to_start,
            'avoidTolls': avoid_tolls
        })
    
    # ============================================
    # MARKET INTELLIGENCE
    # ============================================
    
    def market_trends(self, region: str, period: str = '30d') -> Dict[str, Any]:
        """Get market trends for a region"""
        return self._request('GET', f'/market/trends?region={region}&period={period}')
    
    def pricing_analytics(self, job_type: str, region: str) -> Dict[str, Any]:
        """Get pricing analytics"""
        return self._request('GET', f'/market/pricing-analytics?jobType={job_type}&region={region}')


# ============================================
# EXAMPLE USAGE
# ============================================

def example_instant_quote():
    """Example: Generate an instant quote"""
    api = FairTradeWorkerAPI(API_KEY)
    
    quote = api.instant_quote(
        job_type='roof_replacement',
        square_footage=2500,
        zip_code='78701',
        material_grade='standard'
    )
    
    print("Instant Quote:")
    print(f"  Total: ${quote['quote']['totalCost']:,}")
    print(f"  Labor: ${quote['quote']['breakdown']['labor']:,}")
    print(f"  Materials: ${quote['quote']['breakdown']['materials']:,}")
    print(f"  Timeline: {quote['quote']['timeline']['estimatedDays']} days")
    print(f"  Confidence: {quote['quote']['confidence'] * 100:.1f}%")
    
    return quote


def example_find_contractors():
    """Example: Find matching contractors"""
    api = FairTradeWorkerAPI(API_KEY)
    
    matches = api.match_contractors(
        job_type='electrical_work',
        zip_code='78701',
        radius=25
    )
    
    print(f"\nFound {len(matches['matches'])} contractors:")
    for i, match in enumerate(matches['matches'], 1):
        contractor = match['contractor']
        print(f"\n  {i}. {contractor['name']}")
        print(f"     Rating: {contractor['rating']}/5 ({contractor['reviewCount']} reviews)")
        print(f"     Experience: {contractor['yearsExperience']} years")
        print(f"     Match Score: {match['matchScore'] * 100:.0f}%")
        print(f"     Distance: {match['distance']} miles")
    
    return matches


def example_optimize_route():
    """Example: Optimize route between job sites"""
    api = FairTradeWorkerAPI(API_KEY)
    
    route = api.optimize_route([
        '123 Main St, Austin, TX 78701',
        '456 Oak Ave, Austin, TX 78702',
        '789 Pine Rd, Austin, TX 78703',
        '321 Elm Blvd, Austin, TX 78704'
    ])
    
    print("\nOptimized Route:")
    print(f"  Total Distance: {route['route']['totalDistance']} miles")
    print(f"  Total Duration: {route['route']['totalDuration']} minutes")
    print(f"  Estimated Cost: ${route['route']['estimatedCost']}")
    print("  Order:")
    for i, stop in enumerate(route['route']['optimizedOrder'], 1):
        print(f"    {i}. {stop['address']}")
    
    return route


def example_batch_quotes():
    """Example: Process multiple quotes in batch"""
    api = FairTradeWorkerAPI(API_KEY)
    
    jobs = [
        {'job_type': 'roof_replacement', 'square_footage': 2000, 'zip_code': '78701'},
        {'job_type': 'plumbing_repair', 'square_footage': 500, 'zip_code': '78702'},
        {'job_type': 'electrical_work', 'square_footage': 1000, 'zip_code': '78703'},
    ]
    
    results = []
    for job in jobs:
        try:
            quote = api.instant_quote(**job)
            results.append({'success': True, 'quote': quote, 'job': job})
        except Exception as e:
            results.append({'success': False, 'error': str(e), 'job': job})
    
    successful = [r for r in results if r['success']]
    failed = [r for r in results if not r['success']]
    
    print(f"\nBatch Complete: {len(successful)} successful, {len(failed)} failed")
    return results


# ============================================
# WEBHOOK HANDLER (Flask)
# ============================================

from flask import Flask, request, jsonify

app = Flask(__name__)
WEBHOOK_SECRET = 'your_webhook_secret'


def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    """Verify webhook signature"""
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)


@app.route('/webhook', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-FTW-Signature', '')
    
    if not verify_webhook_signature(request.data, signature):
        return jsonify({'error': 'Invalid signature'}), 401
    
    event = request.json.get('event')
    data = request.json.get('data')
    
    if event == 'quote.generated':
        print(f"New quote generated: {data['quoteId']}")
    elif event == 'job.completed':
        print(f"Job completed: {data['jobId']}")
    elif event == 'contractor.matched':
        print(f"Contractor matched: {data['contractorId']}")
    else:
        print(f"Unknown event: {event}")
    
    return jsonify({'received': True})


# ============================================
# USAGE MONITORING
# ============================================

class UsageMonitor:
    """Monitor API usage and warn when approaching limits"""
    
    def __init__(self, api_key: str, warning_threshold: float = 0.8):
        self.api = FairTradeWorkerAPI(api_key)
        self.warning_threshold = warning_threshold
    
    def check_usage(self) -> Dict[str, Any]:
        """Check current API usage"""
        response = requests.get(
            f"{BASE_URL}/usage",
            headers={'Authorization': f'Bearer {self.api.api_key}'}
        )
        usage = response.json()
        
        percentage = usage['used'] / usage['limit']
        
        if percentage >= 0.9:
            print("⚠️ CRITICAL: 90% of API quota used!")
        elif percentage >= self.warning_threshold:
            print(f"⚠️ WARNING: {percentage * 100:.0f}% of API quota used")
        
        return usage


# ============================================
# RUN EXAMPLES
# ============================================

if __name__ == '__main__':
    print("=== FairTradeWorker Python Examples ===\n")
    
    try:
        # Run examples (will fail without valid API key)
        example_instant_quote()
        example_find_contractors()
        example_optimize_route()
    except Exception as e:
        print(f"\nExample failed (expected without API key): {e}")
        print("\nTo run examples:")
        print("  1. Set FTW_API_KEY environment variable")
        print("  2. Run: python examples.py")
