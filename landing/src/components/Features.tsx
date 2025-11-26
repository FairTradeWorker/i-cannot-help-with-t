'use client';

import { 
  Zap, 
  Brain, 
  Users, 
  MapPin, 
  DollarSign, 
  BarChart3,
  Shield,
  Clock,
  Layers,
  Target,
  TrendingUp,
  FileText
} from 'lucide-react';

const apiCategories = [
  {
    title: 'Job Intelligence',
    description: 'AI-powered job analysis and scope generation',
    icon: Brain,
    color: 'bg-blue-500',
    apis: [
      'Job Scope Generation',
      'Photo Analysis',
      'Video Assessment',
      'Material Estimation',
      'Timeline Prediction',
      'Risk Assessment',
      'Permit Requirements',
      'Code Compliance Check'
    ]
  },
  {
    title: 'Pricing & Quotes',
    description: 'Dynamic pricing that learns from market data',
    icon: DollarSign,
    color: 'bg-green-500',
    apis: [
      'Instant Quote',
      'Market Rate Analysis',
      'Competitive Pricing',
      'Profit Optimization',
      'Material Cost Tracking',
      'Labor Rate Calculation',
      'Seasonal Adjustments',
      'Warranty Pricing'
    ]
  },
  {
    title: 'Contractor Matching',
    description: 'Find the perfect contractor for every job',
    icon: Users,
    color: 'bg-purple-500',
    apis: [
      'Contractor Match',
      'Skill Assessment',
      'Availability Check',
      'Performance Scoring',
      'Review Analysis',
      'Certification Verify',
      'Insurance Validation',
      'Background Check Status'
    ]
  },
  {
    title: 'Territory & Routing',
    description: 'Optimize coverage and travel efficiency',
    icon: MapPin,
    color: 'bg-orange-500',
    apis: [
      'Territory Heatmap',
      'Route Optimization',
      'Demand Forecasting',
      'Coverage Analysis',
      'Travel Time Estimation',
      'Service Area Planning',
      'Competition Mapping',
      'Growth Opportunity'
    ]
  },
  {
    title: 'Market Intelligence',
    description: 'Data-driven insights for strategic decisions',
    icon: BarChart3,
    color: 'bg-pink-500',
    apis: [
      'Market Trends',
      'Pricing Analytics',
      'Demand Prediction',
      'Competitor Analysis',
      'Customer Insights',
      'Seasonal Patterns',
      'Growth Metrics',
      'ROI Forecasting'
    ]
  },
  {
    title: 'Capital Intelligence',
    description: 'Enterprise APIs for PE firms and investors',
    icon: TrendingUp,
    color: 'bg-indigo-500',
    apis: [
      'Portfolio Valuation',
      'Acquisition Targets',
      'Market Opportunity',
      'Revenue Prediction',
      'Risk Assessment',
      'Synergy Analysis',
      'Due Diligence Data',
      'Exit Strategy Modeling'
    ]
  }
];

const features = [
  {
    icon: Brain,
    title: 'Self-Learning AI',
    description: 'Every API call improves accuracy. Start at 85%, grow to 99%+ with compounding intelligence.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Average response time under 200ms. Real-time predictions for instant decision making.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 Type II compliant. End-to-end encryption. GDPR and CCPA ready.'
  },
  {
    icon: Clock,
    title: '99.9% Uptime',
    description: 'Distributed infrastructure with automatic failover. Always available when you need it.'
  },
  {
    icon: Layers,
    title: 'Easy Integration',
    description: 'RESTful APIs with SDKs for JavaScript, Python, and more. Up and running in minutes.'
  },
  {
    icon: Target,
    title: 'Fair Trade Model',
    description: 'Workers pay zero fees. Fair compensation for contractors. Sustainable business model.'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            50+ APIs That Get{' '}
            <span className="gradient-text">Smarter Every Day</span>
          </h2>
          <p className="text-xl text-gray-600">
            Our self-learning Intelligence APIs analyze patterns, learn from outcomes, 
            and continuously improve their predictions.
          </p>
        </div>

        {/* API Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {apiCategories.map((category) => (
            <div 
              key={category.title}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all group"
            >
              <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.apis.map((api) => (
                  <li key={api} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {api}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Why Developers Choose FairTradeWorker
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning loop visualization */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            The Learning Loop: Our Competitive Moat
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">API Call</span>
            </div>
            <div className="text-3xl text-gray-300">→</div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-2">
                <Brain className="w-8 h-8 text-secondary-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">AI Learns</span>
            </div>
            <div className="text-3xl text-gray-300">→</div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Accuracy ↑</span>
            </div>
            <div className="text-3xl text-gray-300">→</div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Better Results</span>
            </div>
          </div>
          <p className="mt-8 text-gray-600 max-w-2xl mx-auto">
            Every prediction starts at 82% accuracy and improves to 99%+ over time. 
            This creates a compounding advantage that competitors cannot replicate.
          </p>
        </div>
      </div>
    </section>
  );
}
