'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative bg-accent rounded-3xl overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Start your 14-day free trial today</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
              Ready to Build Smarter Applications?
            </h2>

            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join 500+ companies using FairTradeWorker APIs to power their home service platforms. 
              Start free, scale as you grow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://app.fairtradeworker.com/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-white text-accent rounded-xl hover:bg-gray-100 transition-all shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-white/10 text-white rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all"
              >
                Talk to Sales
              </Link>
            </div>

            <p className="mt-8 text-white/60 text-sm">
              No credit card required • 30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
