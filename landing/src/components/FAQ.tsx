'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How does the self-learning AI work?',
    answer: 'Every API call contributes to our machine learning models. When you request a quote, match a contractor, or analyze a job, our system records the prediction and later compares it to the actual outcome. This feedback loop allows our accuracy to improve from ~85% to 99%+ over time. The more the system is used, the smarter it becomes—creating a compounding advantage for all users.'
  },
  {
    question: 'What does "Fair Trade" mean in FairTradeWorker?',
    answer: 'Unlike traditional home service platforms that charge workers 15-30% fees, FairTradeWorker operates on a Fair Trade model where workers pay ZERO fees. Homeowners pay upfront, 8% goes to territory operators who fund the platform, and 92% goes directly to workers. This attracts the best talent while creating sustainable economics for everyone involved.'
  },
  {
    question: 'How quickly can I integrate the APIs?',
    answer: 'Most developers are making their first API call within 10 minutes. We provide comprehensive SDKs for JavaScript, Python, Ruby, and more. Our documentation includes interactive examples, and our sandbox environment lets you test everything before going live. For complex integrations, our Professional and Enterprise plans include dedicated support.'
  },
  {
    question: 'What happens if I exceed my monthly API limit?',
    answer: 'We\'ll notify you at 80% and 90% of your limit. If you exceed your limit, API calls will return a 429 status code. You can upgrade your plan at any time to increase your limits instantly. Enterprise customers have unlimited API calls and never worry about limits.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We\'re SOC 2 Type II compliant with end-to-end encryption for all data in transit and at rest. We\'re GDPR and CCPA compliant, and we never sell or share your data. Our infrastructure is hosted on enterprise-grade cloud providers with automatic failover and 99.99% uptime SLA for Enterprise customers.'
  },
  {
    question: 'Can I use the API for my own app or platform?',
    answer: 'Yes! Many of our customers white-label our APIs to power their own applications. Our Professional plan includes all the tools you need, and Enterprise customers get dedicated infrastructure and custom branding options. We\'re happy to discuss partnership opportunities for larger integrations.'
  },
  {
    question: 'What industries does FairTradeWorker support?',
    answer: 'While our core focus is home services (roofing, plumbing, HVAC, electrical, painting, etc.), our APIs are versatile. We support any trade-based service including construction, landscaping, pool services, and more. Our Capital Intelligence APIs are specifically designed for PE firms, real estate platforms, and insurance companies analyzing the home services market.'
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes! Our Free tier gives you 100 API calls per month forever—no credit card required. Professional plan customers also get a 14-day free trial with full access to all features. If you\'re not satisfied, we offer a 30-day money-back guarantee on all paid plans.'
  },
  {
    question: 'How accurate are the predictions?',
    answer: 'Accuracy varies by endpoint and usage. New endpoints start at approximately 82-85% accuracy. As more data flows through the system, accuracy improves. Our most-used endpoints like Instant Quote and Contractor Match are now above 97% accurate. Enterprise customers can see real-time accuracy metrics in their dashboard.'
  },
  {
    question: 'What support options are available?',
    answer: 'Free tier customers have access to our community forum and documentation. Professional customers get email support with 24-hour response times. Enterprise customers receive priority phone support, a dedicated success manager, and custom SLAs. We also offer implementation assistance and technical consulting for large integrations.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about FairTradeWorker APIs.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a 
            href="/contact"
            className="inline-flex items-center text-accent font-medium hover:underline"
          >
            Contact our team →
          </a>
        </div>
      </div>
    </section>
  );
}
