'use client';

import { Check, Zap, Building2, Rocket } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for testing and development',
    icon: Zap,
    features: [
      '100 API calls/month',
      '4 basic endpoints',
      'Standard response time',
      'Community support',
      'Basic documentation',
      '85% starting accuracy'
    ],
    cta: 'Start Free',
    ctaLink: 'https://app.fairtradeworker.com/signup?plan=free',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$97',
    period: '/month',
    description: 'For growing businesses ready to scale',
    icon: Rocket,
    features: [
      '10,000 API calls/month',
      'All 50+ endpoints',
      'Priority response time (<100ms)',
      'Email support',
      'Webhooks & callbacks',
      'Advanced analytics dashboard',
      'API key management',
      '95% starting accuracy'
    ],
    cta: 'Start Free Trial',
    ctaLink: 'https://app.fairtradeworker.com/signup?plan=professional',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: '$497',
    period: '/month',
    description: 'For large organizations with custom needs',
    icon: Building2,
    features: [
      'Unlimited API calls',
      'All endpoints + Capital Intelligence',
      'Dedicated infrastructure',
      'Priority phone support',
      'Custom integrations',
      'White-label options',
      'SLA guarantee (99.99%)',
      'Dedicated success manager',
      '99%+ accuracy'
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact?plan=enterprise',
    highlighted: false
  }
];

const individualApis = [
  { name: 'Job Scope API', price: '$49/mo', calls: '2,000 calls' },
  { name: 'Instant Quote API', price: '$79/mo', calls: '5,000 calls' },
  { name: 'Contractor Match API', price: '$69/mo', calls: '3,000 calls' },
  { name: 'Territory Heatmap API', price: '$99/mo', calls: '5,000 calls' },
  { name: 'Market Intelligence API', price: '$129/mo', calls: '10,000 calls' },
  { name: 'Route Optimization API', price: '$59/mo', calls: '2,000 calls' },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent{' '}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-xl text-gray-600">
            Start free, scale as you grow. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.highlighted 
                  ? 'ring-2 ring-accent shadow-xl scale-105' 
                  : 'border border-gray-200 shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  plan.highlighted ? 'bg-accent' : 'bg-gray-100'
                }`}>
                  <plan.icon className={`w-5 h-5 ${plan.highlighted ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              <p className="text-gray-600 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaLink}
                className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-accent text-white hover:bg-accent-light shadow-lg shadow-accent/20'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Individual APIs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Or Purchase Individual APIs
          </h3>
          <p className="text-gray-600 text-center mb-8">
            Only need specific functionality? Buy exactly what you need.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {individualApis.map((api) => (
              <div 
                key={api.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{api.name}</h4>
                  <p className="text-sm text-gray-500">{api.calls}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-accent">{api.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/pricing"
              className="text-accent font-medium hover:underline"
            >
              View all individual API pricing →
            </Link>
          </div>
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-50 text-secondary-700 rounded-full">
            <Check className="w-5 h-5" />
            <span className="font-medium">30-day money-back guarantee. No questions asked.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
