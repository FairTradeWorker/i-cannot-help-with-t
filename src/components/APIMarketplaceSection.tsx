import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendUp, 
  CurrencyDollar, 
  Users, 
  Warning,
  MapPin,
  ChartLine,
  ArrowRight,
  Check,
  Lock,
  Lightning
} from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const API_PRODUCTS = [
  {
    name: 'Demand Forecasting',
    icon: TrendUp,
    description: 'Predict future demand for trades by geography',
    price: 149,
    period: 'month',
    calls: '1,000',
    color: 'bg-primary',
    features: ['30-day predictions', 'Zipcode-level data', 'Trade-specific forecasts', '1,000 API calls/month']
  },
  {
    name: 'Market Pricing',
    icon: CurrencyDollar,
    description: 'Real-time market pricing intelligence',
    price: 29,
    period: 'month',
    calls: '2,000',
    color: 'bg-secondary',
    popular: true,
    features: ['Real-time pricing', 'Bid optimization', 'Win probability', '2,000 API calls/month']
  },
  {
    name: 'Labor Availability',
    icon: Users,
    description: 'Track contractor supply and capacity',
    price: 129,
    period: 'month',
    calls: '1,500',
    color: 'bg-primary',
    features: ['Contractor availability', 'Utilization rates', 'Supply/demand ratio', '1,500 API calls/month']
  },
  {
    name: 'Risk Assessment',
    icon: Warning,
    description: 'Predict job completion and potential issues',
    price: 49,
    period: 'month',
    calls: '1,000',
    color: 'bg-primary',
    features: ['Completion probability', 'Dispute prediction', 'Risk scoring', '1,000 API calls/month']
  },
  {
    name: 'Territory Valuation',
    icon: MapPin,
    description: 'Comprehensive territory ROI analysis',
    price: 79,
    period: 'month',
    calls: '500',
    color: 'bg-primary',
    features: ['Fair market value', 'ROI projections', '5-year forecasts', '500 API calls/month']
  },
  {
    name: 'Market Trends',
    icon: ChartLine,
    description: 'Market trends across demand and pricing',
    price: 39,
    period: 'month',
    calls: '2,000',
    color: 'bg-secondary',
    features: ['Trend analysis', 'Market insights', 'Growth predictions', '2,000 API calls/month']
  },
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 59,
    description: 'Perfect for getting started',
    apis: 'Choose 3 APIs',
    features: ['Up to 3 API endpoints', 'Email support', 'Monthly billing', '30-day trial']
  },
  {
    name: 'Professional',
    price: 259,
    popular: true,
    description: 'For growing businesses',
    apis: 'All APIs included',
    features: ['All 6 API endpoints', 'Priority support', 'Advanced features', 'Custom limits']
  },
  {
    name: 'Enterprise',
    price: 859,
    description: 'For large organizations',
    apis: 'Unlimited access',
    features: ['Unlimited API calls', 'Dedicated support', 'Custom SLA', 'White-glove onboarding']
  },
];

export function APIMarketplaceSection() {
  const [selectedAPI, setSelectedAPI] = useState<string | null>(null);

  const handleGetAPI = (apiName: string, price: number) => {
    toast.success(`Starting ${apiName} subscription`, {
      description: `$${price}/month - You'll receive API credentials shortly.`,
    });
  };

  const handleSelectPlan = (planName: string, price: number) => {
    toast.success(`Selected ${planName} plan`, {
      description: `$${price}/month - Contact our team for API keys and setup.`,
    });
  };

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-4xl font-bold tracking-tight">Intelligence APIs</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Powerful APIs for market intelligence, pricing, and forecasting. Perfect for real estate platforms, insurance companies, and financial firms.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Badge variant="secondary" className="text-xs px-3 py-1">
            <Lightning className="w-3 h-3 mr-1" />
            Fast response
          </Badge>
          <Badge variant="secondary" className="text-xs px-3 py-1">
            <Lock className="w-3 h-3 mr-1" />
            Secure
          </Badge>
        </div>
      </motion.div>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">Pricing Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PRICING_TIERS.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative h-full ${
                tier.popular ? 'border-primary shadow-lg scale-105' : ''
              }`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription className="text-sm">{tier.description}</CardDescription>
                  <div className="pt-4">
                    <div className="text-4xl font-bold">${tier.price}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                    <div className="text-sm font-medium text-primary mt-2">{tier.apis}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" weight="bold" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={tier.popular ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(tier.name, tier.price)}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">Available APIs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {API_PRODUCTS.map((api, index) => {
            const Icon = api.icon;
            return (
              <motion.div
                key={api.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setSelectedAPI(api.name)}
                onHoverEnd={() => setSelectedAPI(null)}
              >
                <Card className={`relative h-full transition-all duration-200 ${
                  selectedAPI === api.name ? 'shadow-xl scale-105' : ''
                } ${api.popular ? 'border-primary' : ''}`}>
                  {api.popular && (
                    <div className="absolute -top-3 -right-3">
                      <Badge className="bg-accent text-white">Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-xl ${api.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" weight="bold" />
                    </div>
                    <CardTitle className="text-lg">{api.name}</CardTitle>
                    <CardDescription className="text-sm min-h-[40px]">
                      {api.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${api.price}</span>
                      <span className="text-sm text-muted-foreground">/{api.period}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      {api.calls} API calls included
                    </div>
                    
                    <div className="space-y-1.5">
                      {api.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <Check className="w-3 h-3 text-primary shrink-0" weight="bold" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      size="sm"
                      variant={api.popular ? 'default' : 'outline'}
                      onClick={() => handleGetAPI(api.name, api.price)}
                    >
                      Get API Access
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle>Enterprise Custom Solutions</CardTitle>
          <CardDescription>
            Need higher limits, custom integrations, or white-label options? Contact us for enterprise pricing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            Contact Sales Team
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
