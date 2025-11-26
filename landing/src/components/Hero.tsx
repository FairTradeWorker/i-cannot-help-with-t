'use client';

import { ArrowRight, Play, Sparkles, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Now with 50+ Self-Learning APIs</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 animate-slide-up">
            AI APIs That{' '}
            <span className="gradient-text">Learn.</span>
            <br />
            Built for{' '}
            <span className="text-accent">Fair Trade.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Intelligence APIs that get smarter with every call. Job analysis, pricing optimization, 
            contractor matching, and market intelligence—all starting at{' '}
            <span className="font-bold text-accent">$97/month</span>.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary-600" />
              <span className="text-gray-600"><strong className="text-gray-900">99%</strong> Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary-600" />
              <span className="text-gray-600"><strong className="text-gray-900">50+</strong> API Endpoints</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary-600" />
              <span className="text-gray-600"><strong className="text-gray-900">Zero</strong> Worker Fees</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="https://app.fairtradeworker.com/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-accent text-white rounded-xl hover:bg-accent-light transition-all shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-white text-gray-900 rounded-xl border-2 border-gray-200 hover:border-accent hover:text-accent transition-all"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-12 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm text-gray-500 mb-6">Trusted by contractors and home service businesses nationwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              <div className="text-2xl font-bold text-gray-400">RoofPro</div>
              <div className="text-2xl font-bold text-gray-400">PlumbMaster</div>
              <div className="text-2xl font-bold text-gray-400">ElectraTech</div>
              <div className="text-2xl font-bold text-gray-400">HVAC Plus</div>
              <div className="text-2xl font-bold text-gray-400">PaintCrew</div>
            </div>
          </div>
        </div>

        {/* Product screenshot/demo */}
        <div className="mt-16 relative animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-gray-400">api.fairtradeworker.com</span>
              </div>
              <div className="p-6 font-mono text-sm">
                <pre className="text-green-400">
{`// Instant quote in 2 seconds
const quote = await fetch('https://api.fairtradeworker.com/v1/instant-quote', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jobType: 'roof_replacement',
    squareFootage: 2500,
    location: { zip: '90210' }
  })
});

// Response
{
  "quote": {
    "estimatedCost": "$12,450",
    "laborCost": "$7,200",
    "materialCost": "$5,250",
    "timeline": "3-4 days",
    "confidence": 0.94,
    "accuracy": "98.7%"  // Gets smarter with each call!
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
