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
  Lightning,
  CreditCard,
  Bank,
  Wallet,
  QrCode,
  CheckCircle
} from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Stripe checkout configuration - consistent pricing across the app
const STRIPE_CONFIG = {
  professional: {
    priceId: 'price_professional_97_monthly',
    price: 97,
    name: 'Professional',
  },
  enterprise: {
    priceId: 'price_enterprise_497_monthly',
    price: 497,
    name: 'Enterprise',
  },
};

// Redirect to Stripe Checkout for payment
async function redirectToStripeCheckout(tier: 'professional' | 'enterprise') {
  const config = STRIPE_CONFIG[tier];
  
  // In production, this would call your backend to create a Stripe Checkout session
  const checkoutUrl = `https://checkout.stripe.com/c/pay/${config.priceId}`;
  
  toast.success(`Redirecting to Stripe Checkout for ${config.name} ($${config.price}/mo)...`);
  
  // Open Stripe Checkout in new tab
  setTimeout(() => {
    window.open(checkoutUrl, '_blank');
  }, 500);
}

// 20 Intelligence APIs - all connect to payment
const API_PRODUCTS = [
  {
    name: 'Fair Wage Calculator',
    icon: CurrencyDollar,
    description: 'Job type + location → suggested rate',
    tier: 'professional' as const,
    color: 'bg-primary',
    features: ['Location-based rates', 'Job type analysis', 'Market comparison']
  },
  {
    name: 'Job Safety Score',
    icon: Warning,
    description: 'Job description → risk score 0-100',
    tier: 'professional' as const,
    color: 'bg-secondary',
    features: ['Hazard detection', 'Safety recommendations', 'Risk scoring']
  },
  {
    name: 'Material Cost Estimator',
    icon: TrendUp,
    description: 'Job details → materials cost',
    tier: 'professional' as const,
    color: 'bg-primary',
    features: ['Material breakdown', 'Quantity estimates', 'Cost projections']
  },
  {
    name: 'Win Probability',
    icon: ChartLine,
    description: 'Your bid + job details → win chance 0-100',
    tier: 'professional' as const,
    popular: true,
    color: 'bg-secondary',
    features: ['Competitive analysis', 'Bid optimization', 'Win rate prediction']
  },
  {
    name: 'Lead Quality Score',
    icon: Users,
    description: 'Lead info → quality score 0-100',
    tier: 'professional' as const,
    color: 'bg-primary',
    features: ['Lead scoring', 'Conversion prediction', 'Priority ranking']
  },
  {
    name: 'Price Optimizer',
    icon: CurrencyDollar,
    description: 'Costs + market → optimal price',
    tier: 'professional' as const,
    color: 'bg-primary',
    features: ['Margin optimization', 'Market analysis', 'Price recommendations']
  },
  {
    name: 'Risk Assessment',
    icon: Warning,
    description: 'Job + customer → risk score 0-100',
    tier: 'enterprise' as const,
    color: 'bg-accent',
    features: ['Customer analysis', 'Job risk factors', 'Mitigation strategies']
  },
  {
    name: 'Competitor Pricing',
    icon: ChartLine,
    description: 'Job type + location → price range',
    tier: 'enterprise' as const,
    color: 'bg-accent',
    features: ['Market intelligence', 'Competitor analysis', 'Price benchmarks']
  },
  {
    name: 'Upsell Recommender',
    icon: TrendUp,
    description: 'Current job → 3 upsell ideas',
    tier: 'enterprise' as const,
    color: 'bg-accent',
    features: ['Revenue optimization', 'Cross-sell suggestions', 'Customer value']
  },
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 0,
    tier: 'free' as const,
    description: 'Perfect for getting started',
    apis: '1,000 calls/month',
    features: ['Basic endpoints only', 'Email support', 'Standard rate limits', '30-day trial']
  },
  {
    name: 'Professional',
    price: 97,
    tier: 'professional' as const,
    popular: true,
    description: 'For growing businesses',
    apis: '10,000 calls/month',
    features: ['All 20+ Intelligence APIs', 'Priority support', 'Webhooks included', 'Higher rate limits']
  },
  {
    name: 'Enterprise',
    price: 497,
    tier: 'enterprise' as const,
    description: 'For large organizations',
    apis: 'Unlimited calls',
    features: ['All Intelligence APIs', 'Dedicated support', 'Custom integrations', 'SLA guarantee']
  },
];

export function APIMarketplaceSection() {
  const [selectedAPI, setSelectedAPI] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleGetAPI = async (apiTier: 'professional' | 'enterprise') => {
    setCheckoutLoading(apiTier);
    try {
      await redirectToStripeCheckout(apiTier);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleSelectPlan = async (tier: 'free' | 'professional' | 'enterprise') => {
    if (tier === 'free') {
      toast.success('Free tier activated! Generate your API key in the Keys tab.');
      return;
    }
    
    setCheckoutLoading(tier);
    try {
      await redirectToStripeCheckout(tier);
    } finally {
      setCheckoutLoading(null);
    }
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
          20+ powerful APIs for home services intelligence. All APIs connect directly to Stripe for instant activation.
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
          <Badge variant="secondary" className="text-xs px-3 py-1">
            <CreditCard className="w-3 h-3 mr-1" />
            Stripe Payments
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
                      <CheckCircle className="w-4 h-4 text-primary" weight="fill" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={tier.popular ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(tier.tier)}
                    disabled={checkoutLoading === tier.tier}
                  >
                    {checkoutLoading === tier.tier ? (
                      'Processing...'
                    ) : tier.price === 0 ? (
                      'Get Started Free'
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Subscribe ${tier.price}/mo
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">Available Intelligence APIs</h3>
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
                    <Badge variant={api.tier === 'enterprise' ? 'secondary' : 'outline'}>
                      {api.tier === 'enterprise' ? 'Enterprise' : 'Professional'} tier
                    </Badge>
                    
                    <div className="space-y-1.5">
                      {api.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-primary shrink-0" weight="fill" />
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
                      onClick={() => handleGetAPI(api.tier)}
                      disabled={checkoutLoading === api.tier}
                    >
                      {checkoutLoading === api.tier ? (
                        'Processing...'
                      ) : (
                        <>
                          <CreditCard className="w-3 h-3 mr-2" />
                          Get API Access
                        </>
                      )}
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
          <CardTitle>All 20 Intelligence APIs Included</CardTitle>
          <CardDescription>
            Subscribe to Professional ($97/mo) or Enterprise ($497/mo) to access all APIs with Stripe checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {[
            'Fair Wage Calculator', 'Job Safety Score', 'Material Cost Estimator', 'Timeline Predictor',
            'Win Probability', 'Profit Margin', 'Lead Quality Score', 'Customer Lifetime Value',
            'Urgency Detector', 'Scope Complexity', 'Price Optimizer', 'Risk Assessment',
            'Seasonal Demand', 'Competitor Pricing', 'Upsell Recommender', 'Dispute Probability',
            'Worker Availability', 'Completion Confidence', 'Review Authenticity', 'Referral Potential'
          ].map((api) => (
            <div key={api} className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-primary shrink-0" weight="fill" />
              <span className="text-xs">{api}</span>
            </div>
          ))}
        </CardContent>
        <CardFooter className="gap-4">
          <Button 
            variant="default"
            onClick={() => handleSelectPlan('professional')}
            disabled={checkoutLoading === 'professional'}
          >
            {checkoutLoading === 'professional' ? 'Processing...' : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Professional $97/mo
              </>
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleSelectPlan('enterprise')}
            disabled={checkoutLoading === 'enterprise'}
          >
            {checkoutLoading === 'enterprise' ? 'Processing...' : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Enterprise $497/mo
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
