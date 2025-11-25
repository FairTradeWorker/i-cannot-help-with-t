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

const CONTRACTOR_PLANS = [
  {
    name: 'Basic',
    price: 29,
    period: 'month',
    calls: '1,000',
    description: 'Perfect for independent contractors starting out',
    features: [
      { text: '1,000 API calls/month', included: true },
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
    price: 124.99,
    period: 'month',
    calls: '10,000',
    popular: true,
    description: 'Advanced intelligence for growing businesses',
    features: [
      { text: '10,000 API calls/month', included: true },
      { text: 'Everything in Basic', included: true },
      { text: 'Advanced forecasting (90-day)', included: true },
      { text: 'Real-time labor availability', included: true },
      { text: 'Hourly data refresh', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Custom data models', included: false },
      { text: 'Dedicated account manager', included: false },
    ],
  },
  {
    name: 'Business',
    price: 499,
    period: 'month',
    calls: '50,000',
    description: 'Complete solution for established businesses',
    features: [
      { text: '50,000 API calls/month', included: true },
      { text: 'Everything in Professional', included: true },
      { text: 'Custom data models', included: true },
      { text: 'Real-time streaming data', included: true },
      { text: 'Dedicated support team', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'White-glove onboarding', included: true },
      { text: '99.99% uptime SLA', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: null,
    period: 'custom',
    calls: 'Unlimited',
    description: 'Tailored solutions for large organizations',
    features: [
      { text: 'Unlimited API calls', included: true },
      { text: 'Everything in Business', included: true },
      { text: 'White-label options', included: true },
      { text: 'On-premise deployment', included: true },
      { text: 'Custom SLAs', included: true },
      { text: 'Direct database access', included: true },
      { text: 'Dedicated infrastructure', included: true },
      { text: '99.99% uptime SLA', included: true },
    ],
  },
];

const HOMEOWNER_PLANS = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Basic access to post jobs and hire contractors',
    features: [
      { text: 'Post unlimited jobs', included: true },
      { text: 'Browse contractors', included: true },
      { text: 'Basic messaging', included: true },
      { text: 'Standard response time', included: true },
      { text: 'Priority support', included: false },
      { text: 'Priority placement', included: false },
      { text: 'Advanced analytics', included: false },
    ],
  },
  {
    name: 'Premium',
    price: 19.99,
    period: 'month',
    popular: true,
    description: 'Get your jobs done faster with priority access',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Priority job placement', included: true },
      { text: 'Faster contractor responses', included: true },
      { text: 'Priority support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Unlimited photo uploads', included: true },
      { text: 'Project management tools', included: true },
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
  const [userType, setUserType] = useState<'contractor' | 'homeowner'>('contractor');

  const handleGetStarted = (planName: string) => {
    setSelectedPlan(planName);
    toast.success(`Starting ${planName} plan setup`, {
      description: 'You\'ll receive an API key and onboarding materials shortly.',
    });
  };
  
  const handleContactSales = () => {
    toast.success('Sales team will contact you shortly', {
      description: 'Our enterprise team will reach out within 24 hours.',
    });
  };

  const currentPlans = userType === 'contractor' ? CONTRACTOR_PLANS : HOMEOWNER_PLANS;

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex p-4 rounded-2xl bg-primary mb-4">
          <Brain className="w-12 h-12 text-white" weight="bold" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight">Intelligence API</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Enterprise-grade market intelligence for non-competing businesses. 
          Leverage our forecasting, pricing, and risk assessment APIs.
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
      
      <Tabs defaultValue="contractor" className="space-y-8" onValueChange={(v) => setUserType(v as 'contractor' | 'homeowner')}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="contractor">Contractors</TabsTrigger>
          <TabsTrigger value="homeowner">Homeowners</TabsTrigger>
        </TabsList>

        <TabsContent value="contractor" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {CONTRACTOR_PLANS.map((plan, index) => (
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
                      <Badge className="bg-primary text-white px-4 py-1">
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
                      {plan.price !== null ? (
                        <>
                          <div className="text-4xl font-bold">
                            ${plan.price}
                          </div>
                          <div className="text-sm text-muted-foreground">per {plan.period}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl font-bold">Custom</div>
                          <div className="text-sm text-muted-foreground">Contact sales</div>
                        </>
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
                      onClick={() => plan.price !== null ? handleGetStarted(plan.name) : handleContactSales()}
                    >
                      {plan.price !== null ? 'Get Started' : 'Contact Sales'}
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
        
        <TabsContent value="homeowner" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {HOMEOWNER_PLANS.map((plan, index) => (
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
                      <Badge className="bg-primary text-white px-4 py-1">
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
                      {plan.price > 0 ? (
                        <>
                          <div className="text-4xl font-bold">
                            ${plan.price}
                          </div>
                          <div className="text-sm text-muted-foreground">per {plan.period}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl font-bold">Free</div>
                          <div className="text-sm text-muted-foreground">{plan.period}</div>
                        </>
                      )}
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
                      {plan.price > 0 ? 'Get Started' : 'Sign Up Free'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-muted/20 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" />
            API Endpoints Available
          </CardTitle>
          <CardDescription>
            Access powerful intelligence endpoints across all paid plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {API_ENDPOINTS.slice(0, 6).map((endpoint) => {
              const Icon = endpoint.icon;
              return (
                <div key={endpoint.name} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                  <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{endpoint.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {endpoint.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
