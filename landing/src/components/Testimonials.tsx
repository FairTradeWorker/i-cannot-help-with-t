'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Mike Rodriguez',
    role: 'Owner, Rodriguez Roofing',
    company: 'Rodriguez Roofing LLC',
    location: 'Austin, TX',
    image: '/testimonials/mike.jpg',
    rating: 5,
    quote: "FairTradeWorker's API transformed our quoting process. What used to take 2 hours now takes 30 seconds. The accuracy is incredible—our quotes are within 3% of actual costs. We've increased our close rate by 40% since switching.",
    metrics: {
      label: 'Quote Accuracy',
      value: '97%'
    }
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'HomeServe Pro',
    location: 'San Francisco, CA',
    image: '/testimonials/sarah.jpg',
    rating: 5,
    quote: "We integrated 12 of their APIs into our platform in just one week. The documentation is excellent, the SDKs are well-maintained, and the support team actually understands technical issues. Best API experience we've had.",
    metrics: {
      label: 'Integration Time',
      value: '1 week'
    }
  },
  {
    name: 'James Thompson',
    role: 'VP Operations',
    company: 'National Home Services',
    location: 'Chicago, IL',
    image: '/testimonials/james.jpg',
    rating: 5,
    quote: "The contractor matching API is a game-changer. We reduced our average time-to-assign from 4 hours to 8 minutes. Customer satisfaction went through the roof because jobs get started faster.",
    metrics: {
      label: 'Time to Assign',
      value: '8 min'
    }
  },
  {
    name: 'Emily Patel',
    role: 'Founder',
    company: 'QuickFix App',
    location: 'Miami, FL',
    image: '/testimonials/emily.jpg',
    rating: 5,
    quote: "As a startup, we couldn't afford to build this intelligence in-house. FairTradeWorker gave us enterprise-level AI at a fraction of the cost. Our app now competes with companies 10x our size.",
    metrics: {
      label: 'Cost Savings',
      value: '85%'
    }
  },
  {
    name: 'David Kim',
    role: 'Director of Analytics',
    company: 'BlueSky Capital',
    location: 'New York, NY',
    image: '/testimonials/david.jpg',
    rating: 5,
    quote: "The Capital Intelligence APIs give us insights we couldn't find anywhere else. We've used their market data to identify 3 acquisition targets and value home service companies with unprecedented accuracy.",
    metrics: {
      label: 'Deals Sourced',
      value: '3'
    }
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by{' '}
            <span className="gradient-text">Industry Leaders</span>
          </h2>
          <p className="text-xl text-gray-600">
            See why contractors, developers, and enterprises choose FairTradeWorker.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className={`bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:border-primary-200 transition-all ${
                index === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-primary-100 mb-4" />

              {/* Quote text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Author info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm text-gray-400">{testimonial.company}</p>
                  </div>
                </div>

                {/* Metric */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent">{testimonial.metrics.value}</div>
                  <div className="text-xs text-gray-500">{testimonial.metrics.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-16 bg-accent rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-1">500+</div>
              <div className="text-white/70">Active Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">2M+</div>
              <div className="text-white/70">API Calls/Month</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">99.2%</div>
              <div className="text-white/70">Avg. Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">4.9/5</div>
              <div className="text-white/70">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
