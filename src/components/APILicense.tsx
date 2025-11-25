import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Key, CreditCard, CheckCircle, Lightning, Shield, Globe, ArrowRight } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface APILicenseProps {
  activeView?: string | null;
}

const API_PLANS = [
  {
    name: 'Starter',
    price: 99,
    requests: '10,000',
    features: [
      'Job estimation API',
      'Territory data access',
      'Basic analytics',
      'Email support',
      '99.5% uptime SLA',
    ],
  },
  {
    name: 'Professional',
    price: 299,
    requests: '100,000',
    popular: true,
    features: [
      'Everything in Starter',
      'Contractor matching API',
      'Real-time webhooks',
      'Priority support',
      'Custom rate limits',
      '99.9% uptime SLA',
    ],
  },
  {
    name: 'Enterprise',
    price: 999,
    requests: 'Unlimited',
    features: [
      'Everything in Professional',
      'Dedicated infrastructure',
      'White-label options',
      'SLA guarantees',
      'Dedicated account manager',
      '99.99% uptime SLA',
    ],
  },
];

const API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/v1/jobs/estimate',
    description: 'Generate cost estimate from job description or video',
  },
  {
    method: 'GET',
    path: '/api/v1/territories/{zip}',
    description: 'Get territory data and availability for zip code',
  },
  {
    method: 'GET',
    path: '/api/v1/contractors/search',
    description: 'Search contractors by location, skills, and availability',
  },
  {
    method: 'POST',
    path: '/api/v1/jobs',
    description: 'Create a new job posting',
  },
  {
    method: 'GET',
    path: '/api/v1/analytics',
    description: 'Access platform analytics and insights',
  },
];

export function APILicense({ activeView }: APILicenseProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent">
          <Code className="w-8 h-8 text-white" weight="bold" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">API Licenses</h1>
          <p className="text-muted-foreground text-lg">Integrate ServiceHub into your applications</p>
        </div>
      </motion.div>

      <Tabs defaultValue={activeView === 'api_pricing' ? 'pricing' : activeView === 'api_access' ? 'access' : 'docs'} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="docs">
            <Code className="w-4 h-4 mr-2" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <CreditCard className="w-4 h-4 mr-2" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="access">
            <Key className="w-4 h-4 mr-2" />
            Get Access
          </TabsTrigger>
        </TabsList>

        <TabsContent value="docs" className="space-y-6 mt-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">API Documentation</h2>
            <p className="text-muted-foreground mb-6">
              The ServiceHub API provides programmatic access to our job estimation, contractor matching, 
              and territory management systems. All endpoints use REST principles and return JSON responses.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Base URL</h3>
                <code className="block bg-muted p-3 rounded text-sm">
                  https://api.servicehub.com/v1
                </code>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Authentication</h3>
                <p className="text-muted-foreground mb-2">
                  All API requests require authentication via API key in the Authorization header:
                </p>
                <code className="block bg-muted p-3 rounded text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Available Endpoints</h3>
                <div className="space-y-3">
                  {API_ENDPOINTS.map((endpoint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card"
                    >
                      <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'} className="mt-0.5">
                        {endpoint.method}
                      </Badge>
                      <div className="flex-1">
                        <code className="text-sm font-mono">{endpoint.path}</code>
                        <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-3">Rate Limits</h3>
                <p className="text-muted-foreground">
                  Rate limits vary by plan tier. All responses include rate limit headers:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li><code>X-RateLimit-Limit</code>: Maximum requests per hour</li>
                  <li><code>X-RateLimit-Remaining</code>: Remaining requests in current window</li>
                  <li><code>X-RateLimit-Reset</code>: Time when the rate limit resets</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6 mt-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-muted-foreground">Scale as you grow with flexible API access</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {API_PLANS.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {plan.requests} requests/month
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" weight="fill" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6 bg-muted/30">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lightning className="w-6 h-6 text-primary" weight="fill" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Need a custom solution?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact our sales team for custom enterprise plans with dedicated infrastructure, 
                  white-label options, and volume discounts.
                </p>
                <Button variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6 mt-6">
          <Card className="p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-white" weight="bold" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Get API Access</h2>
              <p className="text-muted-foreground">
                Fill out the form below to request API credentials
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@company.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Your Company Inc." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="useCase">Use Case</Label>
                <textarea 
                  id="useCase"
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Tell us about your integration plans..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Preferred Plan</Label>
                <select
                  id="plan"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedPlan || ''}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="">Select a plan</option>
                  <option value="Starter">Starter - $99/mo</option>
                  <option value="Professional">Professional - $299/mo</option>
                  <option value="Enterprise">Enterprise - $999/mo</option>
                </select>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Request API Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Enterprise Security</p>
                </div>
                <div>
                  <Lightning className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Fast Response Times</p>
                </div>
                <div>
                  <Globe className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Global CDN</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
