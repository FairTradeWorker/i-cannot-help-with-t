import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Code, TrendUp, Lightning, Lock, CheckCircle, Copy, Eye, EyeSlash } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { intelligenceDB } from '@/lib/intelligence-db';
import { toast } from 'sonner';
import { APIMarketplaceSection } from '@/components/APIMarketplaceSection';
import type { APIKey } from '@/types/intelligence-api';

interface IntelligenceAPIManagerProps {
  userId: string;
}

export function IntelligenceAPIManager({ userId }: IntelligenceAPIManagerProps) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyTier, setNewKeyTier] = useState<'free' | 'professional' | 'enterprise'>('free');
  const [loading, setLoading] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [usageMetrics, setUsageMetrics] = useState<any>(null);

  useEffect(() => {
    loadAPIKeys();
    loadUsageMetrics();
  }, [userId]);

  const loadAPIKeys = async () => {
    const allKeys = await window.spark.kv.get<APIKey[]>('intelligence-api-keys') || [];
    const userKeys = allKeys.filter(k => k.userId === userId);
    setApiKeys(userKeys);
  };

  const loadUsageMetrics = async () => {
    const metrics = await intelligenceDB.getUserUsageMetrics(userId);
    setUsageMetrics(metrics);
  };

  const generateNewKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    setLoading(true);
    try {
      const newKey = await intelligenceDB.generateAPIKey(userId, newKeyName, newKeyTier);
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName('');
      toast.success(`API key "${newKeyName}" generated successfully!`);
    } catch (error) {
      toast.error('Failed to generate API key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-muted text-muted-foreground';
      case 'professional': return 'bg-primary text-primary-foreground';
      case 'enterprise': return 'bg-gradient-to-r from-accent to-secondary text-white';
      default: return 'bg-muted';
    }
  };

  const getTierLimits = (tier: string) => {
    switch (tier) {
      case 'free': return '100 calls/month';
      case 'professional': return '10,000 calls/month';
      case 'enterprise': return 'Unlimited calls';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Intelligence API</h2>
          <p className="text-muted-foreground mt-1">
            Access 50+ endpoints for home services intelligence
          </p>
        </div>
        <Badge className="bg-primary text-white px-4 py-2">
          <Lightning className="w-4 h-4 mr-2" weight="fill" />
          Self-Learning Platform
        </Badge>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keys">
            <Key className="w-4 h-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="endpoints">
            <Code className="w-4 h-4 mr-2" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="usage">
            <TrendUp className="w-4 h-4 mr-2" />
            Usage
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <Lightning className="w-4 h-4 mr-2" />
            Pricing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6 mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generate New API Key</CardTitle>
              <CardDescription>
                Create a new API key to access our intelligence endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key-tier">Tier</Label>
                <Select value={newKeyTier} onValueChange={(value: any) => setNewKeyTier(value)}>
                  <SelectTrigger id="key-tier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free - 100 calls/month</SelectItem>
                    <SelectItem value="professional">Professional - 10K calls/month ($199/mo)</SelectItem>
                    <SelectItem value="enterprise">Enterprise - Unlimited ($1,299/mo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={generateNewKey} disabled={loading} className="w-full">
                <Key className="w-4 h-4 mr-2" />
                Generate API Key
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {apiKeys.map((key) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{key.name}</h3>
                          <Badge className={getTierColor(key.tier)}>
                            {key.tier.charAt(0).toUpperCase() + key.tier.slice(1)}
                          </Badge>
                          {key.status === 'active' && (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                              Active
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 font-mono text-sm bg-muted px-3 py-2 rounded">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                          <span className="flex-1">
                            {showKeys[key.id] ? key.key : key.key.substring(0, 20) + '••••••••••••'}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleKeyVisibility(key.id)}
                          >
                            {showKeys[key.id] ? (
                              <EyeSlash className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Usage</p>
                        <p className="font-semibold">
                          {key.callsUsed.toLocaleString()} / {key.callsLimit.toLocaleString()}
                        </p>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all"
                            style={{ width: `${(key.callsUsed / key.callsLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Resets</p>
                        <p className="font-semibold">
                          {new Date(key.resetDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Created</p>
                        <p className="font-semibold">
                          {new Date(key.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {apiKeys.length === 0 && (
            <Card className="glass-card">
              <CardContent className="py-12 text-center">
                <Key className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No API Keys Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first API key to start accessing our intelligence endpoints
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6 mt-6">
          <EndpointsDocumentation />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 mt-6">
          <div className="grid grid-cols-4 gap-4">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Total Calls</p>
                <p className="text-3xl font-bold">{usageMetrics?.totalCalls.toLocaleString() || 0}</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
                <p className="text-3xl font-bold">{usageMetrics?.avgResponseTime.toFixed(0) || 0}ms</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                <p className="text-3xl font-bold">
                  {((1 - (usageMetrics?.errorRate || 0)) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Endpoints Used</p>
                <p className="text-3xl font-bold">
                  {Object.keys(usageMetrics?.callsByEndpoint || {}).length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>API Usage by Endpoint</CardTitle>
              <CardDescription>Breakdown of your API calls across different endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(usageMetrics?.callsByEndpoint || {}).map(([endpoint, calls]: [string, any]) => (
                  <div key={endpoint} className="flex items-center justify-between">
                    <span className="font-mono text-sm">{endpoint}</span>
                    <Badge variant="secondary">{calls} calls</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6 mt-6">
          <APIMarketplaceSection />
          <PricingPlans />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PricingPlans() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      calls: 100,
      features: [
        '100 API calls/month',
        'Basic endpoints only',
        'Community support',
        'Standard rate limits'
      ]
    },
    {
      name: 'Professional',
      price: 199,
      calls: 10000,
      features: [
        '10,000 API calls/month',
        'All standard endpoints',
        'Email support',
        'Webhooks included',
        'Higher rate limits'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 1299,
      calls: null,
      features: [
        'Unlimited API calls',
        'Capital Intelligence APIs',
        'Priority support',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee'
      ]
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.name} className={`glass-card ${plan.popular ? 'border-2 border-primary' : ''}`}>
          <CardHeader>
            {plan.popular && (
              <Badge className="w-fit mb-2 bg-primary">Most Popular</Badge>
            )}
            <CardTitle>{plan.name}</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {plan.calls ? `${plan.calls.toLocaleString()} calls/month` : 'Unlimited calls'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" weight="fill" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
              {plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EndpointsDocumentation() {
  const nuclearAPIs = [
    {
      method: 'POST',
      endpoint: '/api/v1/hailstrike',
      description: 'Real-time hail event detection and demand surge prediction',
      tier: 'Professional',
      params: { zipCodes: 'string[]', radius: 'number', severity: 'enum' }
    },
    {
      method: 'POST',
      endpoint: '/api/v1/catastrophe-alpha',
      description: 'Pre-event catastrophe intelligence and deployment recommendations',
      tier: 'Professional',
      params: { region: 'string', eventType: 'enum', forecastDays: 'number' }
    },
    {
      method: 'POST',
      endpoint: '/api/v1/ghostbid',
      description: 'Competitive bid analysis and strategic pricing recommendations',
      tier: 'Professional',
      params: { jobId: 'string', targetPrice: 'number', materialsCost: 'number', laborHours: 'number' }
    },
    {
      method: 'GET',
      endpoint: '/api/v1/contractor-dna/:id',
      description: 'Deep behavioral analysis and performance prediction of contractors',
      tier: 'Professional',
      params: { id: 'path param' }
    },
    {
      method: 'POST',
      endpoint: '/api/v1/creep-oracle',
      description: 'Material price forecasting with buy/wait recommendations',
      tier: 'Professional',
      params: { materialCategory: 'string', region: 'string', forecastMonths: 'number' }
    },
    {
      method: 'GET',
      endpoint: '/api/v1/arbitrage-heat',
      description: 'Cross-market pricing arbitrage opportunities',
      tier: 'Enterprise',
      params: {}
    },
    {
      method: 'GET',
      endpoint: '/api/v1/permit-velocity',
      description: 'Jurisdiction-specific permit processing times and strategies',
      tier: 'Professional',
      params: { jurisdiction: 'query param' }
    },
    {
      method: 'GET',
      endpoint: '/api/v1/silent-rollup/:name',
      description: 'Acquisition target analysis for contractor consolidation plays',
      tier: 'Enterprise',
      params: { name: 'path param' }
    },
    {
      method: 'GET',
      endpoint: '/api/v1/weather-weapon',
      description: '7-day predictive demand and revenue intelligence',
      tier: 'Professional',
      params: { zipCode: 'query param' }
    },
    {
      method: 'GET',
      endpoint: '/api/v1/doomsday',
      description: 'Market collapse scenarios and survival strategies',
      tier: 'Enterprise',
      params: {}
    }
  ];

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Nuclear API Endpoints</CardTitle>
          <CardDescription>
            10 high-powered intelligence endpoints with learning feedback integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nuclearAPIs.map((api, index) => (
              <Card key={index} className="bg-muted/30 border-border/50">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant={api.method === 'GET' ? 'outline' : 'default'} className="font-mono">
                        {api.method}
                      </Badge>
                      <code className="text-sm font-mono text-foreground">{api.endpoint}</code>
                    </div>
                    <Badge className={api.tier === 'Enterprise' ? 'bg-gradient-to-r from-accent to-secondary' : 'bg-primary'}>
                      {api.tier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{api.description}</p>
                  {Object.keys(api.params).length > 0 && (
                    <div className="bg-background/50 rounded px-3 py-2 text-xs font-mono">
                      {Object.entries(api.params).map(([key, type]) => (
                        <div key={key} className="flex gap-2">
                          <span className="text-primary">{key}:</span>
                          <span className="text-muted-foreground">{type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightning className="w-4 h-4 text-accent" weight="fill" />
              Learning Feedback Integration
            </h4>
            <p className="text-sm text-muted-foreground">
              Every API call feeds the learning_feedback table automatically. The system tracks prediction accuracy, 
              adjusts confidence scores, and improves over time. All responses include learning context with 
              total predictions, current accuracy, and confidence metrics.
            </p>
          </div>

          <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" weight="fill" />
              Authentication & Billing
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              All endpoints require API key authentication and are metered via Stripe billing.
            </p>
            <code className="text-xs font-mono bg-background/50 px-2 py-1 rounded">
              Authorization: Bearer sk_professional_YourAPIKey
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
