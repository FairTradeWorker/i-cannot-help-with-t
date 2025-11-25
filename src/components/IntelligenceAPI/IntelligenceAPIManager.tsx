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
            Access 50+ AI-powered endpoints for home services intelligence
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2">
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
          <TabsTrigger value="usage">
            <TrendUp className="w-4 h-4 mr-2" />
            Usage
          </TabsTrigger>
          <TabsTrigger value="docs">
            <Code className="w-4 h-4 mr-2" />
            Documentation
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

        <TabsContent value="docs" className="space-y-6 mt-6">
          <APIDocumentation />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6 mt-6">
          <PricingPlans />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function APIDocumentation() {
  const endpoints = [
    { name: 'Job Scope', path: '/api/intelligence/job-scope', method: 'POST', description: 'Analyze job requirements from video, image, or description' },
    { name: 'Instant Quote', path: '/api/intelligence/instant-quote', method: 'POST', description: 'Generate instant pricing quote for home services' },
    { name: 'Pricing Oracle', path: '/api/intelligence/pricing-oracle', method: 'POST', description: 'Get optimal pricing recommendations' },
    { name: 'Contractor Match', path: '/api/intelligence/contractor-match', method: 'POST', description: 'Find best contractors for specific jobs' },
    { name: 'Demand Heatmap', path: '/api/intelligence/demand-heatmap', method: 'GET', description: 'Visualize service demand by region' },
    { name: 'Storm Alert', path: '/api/intelligence/storm-alert', method: 'GET', description: 'Get weather-related demand predictions' },
    { name: 'Material Price', path: '/api/intelligence/material-price', method: 'GET', description: 'Current and predicted material costs' },
    { name: 'Permit Prediction', path: '/api/intelligence/permit-prediction', method: 'POST', description: 'Predict permit requirements and timing' },
    { name: 'Scope Creep Risk', path: '/api/intelligence/scope-creep-risk', method: 'POST', description: 'Analyze risk of project scope expansion' },
    { name: 'Contractor Performance', path: '/api/intelligence/contractor-performance', method: 'GET', description: 'Detailed contractor metrics and predictions' },
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm">Available Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {endpoints.map((endpoint) => (
                <Button
                  key={endpoint.path}
                  variant={selectedEndpoint.path === endpoint.path ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedEndpoint(endpoint)}
                >
                  <span className="font-mono text-xs truncate">{endpoint.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2 space-y-4">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Badge variant="outline">{selectedEndpoint.method}</Badge>
              <code className="text-sm font-mono">{selectedEndpoint.path}</code>
            </div>
            <CardDescription>{selectedEndpoint.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Authentication</h4>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X ${selectedEndpoint.method} \\
  ${selectedEndpoint.path} \\
  -H "X-API-Key: sk_live_your_key_here" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Request</h4>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "description": "Need roof repair after storm damage",
  "location": {
    "zipCode": "90210",
    "state": "CA"
  }
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Response</h4>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "jobTitle": "Roof Storm Damage Repair",
    "estimatedCost": {
      "min": 3500,
      "max": 5000
    },
    "confidenceScore": 92
  },
  "metadata": {
    "learningContext": {
      "totalPredictions": 15420,
      "currentAccuracy": 0.948
    }
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
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
