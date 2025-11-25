import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Lightning, 
  Shield, 
  ChartLine, 
  Brain, 
  TrendUp,
  CreditCard,
  Check,
  X,
  ArrowRight,
  Globe,
  Lock,
  ChartBar,
  MapPin,
  Users,
  CurrencyDollar,
  Warning
} from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const INTELLIGENCE_PLANS = [
  {
    name: 'Starter',
    price: 5000,
    period: 'month',
    calls: '10,000',
    description: 'Perfect for getting started with market intelligence',
    features: [
      { text: '10,000 API calls/month', included: true },
      { text: 'Basic demand forecasting', included: true },
      { text: 'Market pricing data', included: true },
      { text: '24-hour data refresh', included: true },
      { text: 'Email support', included: true },
      { text: 'Advanced forecasting', included: false },
      { text: 'Real-time streaming data', included: false },
      { text: 'Dedicated support', included: false },
    ],
  },
  {
    name: 'Professional',
    price: 25000,
    period: 'month',
    calls: '100,000',
    popular: true,
    description: 'Advanced intelligence for growing businesses',
    features: [
      { text: '100,000 API calls/month', included: true },
      { text: 'Everything in Starter', included: true },
      { text: 'Advanced forecasting (90-day)', included: true },
      { text: 'Real-time labor availability', included: true },
      { text: 'Hourly data refresh', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Custom data models', included: false },
      { text: 'Dedicated account manager', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: 100000,
    period: 'month',
    calls: 'Unlimited',
    description: 'Complete intelligence solution for large organizations',
    features: [
      { text: 'Unlimited API calls', included: true },
      { text: 'Everything in Professional', included: true },
      { text: 'Custom data models', included: true },
      { text: 'Real-time streaming data', included: true },
      { text: 'Dedicated support team', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'White-glove onboarding', included: true },
      { text: '99.99% uptime SLA', included: true },
    ],
  },
  {
    name: 'Custom',
    price: null,
    period: 'quote',
    calls: 'Custom',
    description: 'Tailored solutions for unique requirements',
    features: [
      { text: 'Everything in Enterprise', included: true },
      { text: 'White-label options', included: true },
      { text: 'On-premise deployment', included: true },
      { text: 'Custom SLAs', included: true },
      { text: 'Direct database access', included: true },
      { text: 'Custom analytics', included: true },
      { text: 'Dedicated infrastructure', included: true },
      { text: 'Priority feature development', included: true },
    ],
  },
];

const API_ENDPOINTS = [
  {
    name: 'Demand Forecasting',
    method: 'GET',
    path: '/api/intelligence/demand/forecast',
    icon: TrendUp,
    description: 'Predict future demand for trades by geography with 88-94% accuracy',
    example: {
      request: `{
  "geography": { "type": "zipcode", "value": "78701" },
  "trades": ["roofing", "plumbing"],
  "timeframe": { "period": 30, "unit": "days" }
}`,
      response: `{
  "forecast": {
    "predictions": [{
      "date": "2025-02-01",
      "predictedJobs": 58,
      "confidence": 0.89
    }]
  }
}`
    }
  },
  {
    name: 'Market Pricing',
    method: 'GET',
    path: '/api/intelligence/pricing/market',
    icon: CurrencyDollar,
    description: 'Real-time market pricing intelligence with optimal bid recommendations',
    example: {
      request: `{
  "trade": "roofing",
  "geography": { "type": "zipcode", "value": "78701" },
  "jobComplexity": "medium"
}`,
      response: `{
  "pricing": {
    "avg": 9250,
    "median": 8700
  },
  "recommendations": {
    "optimalPricing": 9750,
    "winProbability": 0.83
  }
}`
    }
  },
  {
    name: 'Labor Availability',
    method: 'GET',
    path: '/api/intelligence/labor/availability',
    icon: Users,
    description: 'Track contractor supply, utilization, and capacity by geography',
    example: {
      request: `{
  "geography": { "type": "zipcode", "value": "78701" },
  "trades": ["all"]
}`,
      response: `{
  "laborSupply": {
    "totalContractors": 42,
    "utilizationRate": 0.76
  },
  "demandVsSupply": { "ratio": 2.4 }
}`
    }
  },
  {
    name: 'Risk Assessment',
    method: 'POST',
    path: '/api/intelligence/risk/assess',
    icon: Warning,
    description: 'Predict job completion probability and potential issues',
    example: {
      request: `{
  "jobDetails": {
    "trade": "roofing",
    "estimatedValue": 12500
  },
  "contractorId": "gc-xyz789"
}`,
      response: `{
  "overallRisk": "Medium",
  "predictions": {
    "completionProbability": 0.87,
    "disputeProbability": 0.08
  }
}`
    }
  },
  {
    name: 'Territory Valuation',
    method: 'GET',
    path: '/api/intelligence/territory/valuation',
    icon: MapPin,
    description: 'Comprehensive territory ROI analysis and valuation',
    example: {
      request: `{
  "zipCode": "78701",
  "analysisDepth": "comprehensive"
}`,
      response: `{
  "valuation": { "fairMarketValue": 28500 },
  "roiProjections": {
    "year1": { "roi": 0.94 },
    "year5": { "roi": 7.41 }
  }
}`
    }
  },
  {
    name: 'Market Trends',
    method: 'GET',
    path: '/api/intelligence/trends',
    icon: ChartLine,
    description: 'Comprehensive market trends across demand, pricing, and competition',
    example: {
      request: `{
  "geography": { "type": "state", "value": "TX" },
  "timeframe": "90d"
}`,
      response: `{
  "trends": {
    "demand": { "change": 0.18 },
    "pricing": { "change": 0.082 }
  },
  "insights": ["High growth market..."]
}`
    }
  },
];

export function IntelligenceAPIMarketplace() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);

  const handleGetStarted = (planName: string) => {
    setSelectedPlan(planName);
    toast.success(`Starting ${planName} plan setup`, {
      description: 'You\'ll receive an API key and onboarding materials shortly.',
    });
  };

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent mb-4">
          <Brain className="w-12 h-12 text-white" weight="bold" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight">Intelligence API</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Enterprise-grade market intelligence for non-competing businesses. 
          Leverage our AI-powered forecasting, pricing, and risk assessment APIs.
        </p>
        
        <div className="flex items-center justify-center gap-4 pt-4">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            99.9% Uptime SLA
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Lightning className="w-4 h-4 mr-2" />
            &lt;100ms Response Time
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Lock className="w-4 h-4 mr-2" />
            Enterprise Security
          </Badge>
        </div>
      </motion.div>

      <Tabs defaultValue="pricing" className="space-y-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
          <TabsTrigger value="docs">API Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {INTELLIGENCE_PLANS.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative h-full flex flex-col ${
                  plan.popular ? 'border-primary shadow-lg shadow-primary/20 scale-105' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm min-h-[40px]">
                      {plan.description}
                    </CardDescription>
                    <div className="pt-4">
                      {plan.price ? (
                        <>
                          <div className="text-4xl font-bold">
                            ${(plan.price / 1000).toFixed(0)}K
                          </div>
                          <div className="text-sm text-muted-foreground">per {plan.period}</div>
                        </>
                      ) : (
                        <div className="text-4xl font-bold">Custom</div>
                      )}
                      <div className="text-sm font-medium text-primary mt-2">
                        {plan.calls} API calls
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" weight="bold" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${
                          !feature.included ? 'text-muted-foreground' : ''
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handleGetStarted(plan.name)}
                    >
                      {plan.price ? 'Get Started' : 'Contact Sales'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                Perfect for Non-Competing Businesses
              </CardTitle>
              <CardDescription>
                Our Intelligence API is designed for businesses that complement rather than compete with our marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Private Equity Firms</h4>
                  <p className="text-sm text-muted-foreground">
                    Evaluate territory acquisitions, market sizing, and ROI projections
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Real Estate Platforms</h4>
                  <p className="text-sm text-muted-foreground">
                    Integrate repair cost estimates and contractor availability into listings
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Insurance Companies</h4>
                  <p className="text-sm text-muted-foreground">
                    Risk assessment, claim validation, and contractor matching
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>All API requests require authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">API Keys with IP Whitelisting</Label>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`curl -H "X-API-Key: sk_live_..." \\
     -H "Content-Type: application/json" \\
     https://api.servicehub.com/v1/intelligence/...`}</code>
                </pre>
              </div>
              
              <div className="space-y-2">
                <Label className="font-semibold">OAuth 2.0 for User-Level Access</Label>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`curl -H "Authorization: Bearer eyJhbG..." \\
     https://api.servicehub.com/v1/intelligence/...`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <h3 className="font-semibold text-lg">Available Endpoints</h3>
              <div className="space-y-2">
                {API_ENDPOINTS.map((endpoint, index) => {
                  const Icon = endpoint.icon;
                  return (
                    <Button
                      key={index}
                      variant={selectedEndpoint === index ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedEndpoint(index)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {endpoint.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        {(() => {
                          const Icon = API_ENDPOINTS[selectedEndpoint].icon;
                          return <Icon className="w-6 h-6 text-primary" />;
                        })()}
                        {API_ENDPOINTS[selectedEndpoint].name}
                      </CardTitle>
                      <CardDescription>
                        {API_ENDPOINTS[selectedEndpoint].description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {API_ENDPOINTS[selectedEndpoint].method}
                    </Badge>
                  </div>
                  <code className="text-xs text-muted-foreground block mt-2">
                    {API_ENDPOINTS[selectedEndpoint].path}
                  </code>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-semibold">Request Example</Label>
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{API_ENDPOINTS[selectedEndpoint].example.request}</code>
                    </pre>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-semibold">Response Example</Label>
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{API_ENDPOINTS[selectedEndpoint].example.response}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
