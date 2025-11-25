import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { 
  Key, 
  Lightning, 
  Copy, 
  Eye, 
  EyeSlash,
  CheckCircle,
  ShoppingCart,
  Phone
} from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface APIKey {
  id: string;
  name: string;
  key: string;
  tier: string;
  status: 'active' | 'inactive';
  callsUsed: number;
  callsLimit: number;
  createdAt: Date;
  resetDate: Date;
}

interface APIPageProps {
  userId: string;
}

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 19.99,
    calls: 1000,
    features: ['1,000 API calls/month', 'Basic endpoints', 'Email support', '99.9% uptime SLA']
  },
  {
    name: 'Professional',
    price: 44.99,
    calls: 10000,
    popular: true,
    features: ['10,000 API calls/month', 'All endpoints', 'Priority support', 'Advanced analytics', 'Webhooks']
  },
  {
    name: 'Enterprise',
    price: 79.99,
    calls: 100000,
    features: ['100,000 API calls/month', 'All endpoints + Beta', 'Dedicated support', 'Custom integrations', 'White-glove onboarding']
  }
];

export function APIPage({ userId }: APIPageProps) {
  const [apiKeys, setApiKeys] = useKV<APIKey[]>('api-keys', []);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<typeof PRICING_TIERS[0] | null>(null);

  const handlePurchase = (tier: typeof PRICING_TIERS[0]) => {
    setSelectedTier(tier);
    setPurchaseDialogOpen(true);
  };

  const completePurchase = () => {
    if (!selectedTier) return;

    const newKey: APIKey = {
      id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      name: `${selectedTier.name} Key`,
      key: `sk_${selectedTier.name.toLowerCase()}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      tier: selectedTier.name,
      status: 'active',
      callsUsed: 0,
      callsLimit: selectedTier.calls,
      createdAt: new Date(),
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    setApiKeys((current) => [...(current || []), newKey]);
    setPurchaseDialogOpen(false);
    toast.success('API Key Generated!', {
      description: `Your ${selectedTier.name} plan is now active.`
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight uppercase">Intelligence API</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Professional-grade APIs built for the trades. 45 years of experience, now in your hands.
          </p>
        </div>
        <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-bold uppercase">
          <Lightning className="w-4 h-4 mr-2" weight="fill" />
          Battle-Tested
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICING_TIERS.map((tier) => (
          <Card
            key={tier.name}
            className={`relative border-2 transition-all duration-200 ${
              tier.popular
                ? 'border-primary shadow-lg shadow-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1 font-bold uppercase shadow-md">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="space-y-4">
              <div>
                <CardTitle className="text-2xl font-bold uppercase">{tier.name}</CardTitle>
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold tracking-tight">${tier.price}</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 font-semibold">
                    {tier.calls.toLocaleString()} API calls included
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" weight="fill" />
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handlePurchase(tier)}
                className={`w-full font-bold uppercase tracking-wider ${
                  tier.popular
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'bg-white dark:bg-[#0a0a0a] text-black dark:text-white border-2 border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-900'
                } transition-all duration-200 active:scale-95 shadow-md`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" weight="bold" />
                Purchase Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black">
        <CardHeader>
          <CardTitle className="text-3xl font-bold uppercase">Enterprise Custom Solutions</CardTitle>
          <CardDescription className="text-gray-300 dark:text-gray-700 text-lg">
            Need 2M+ calls per month? White-label options? Custom SLA guarantees? We've got you covered.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-white dark:bg-black text-black dark:text-white border-2 border-white dark:border-black hover:bg-gray-100 dark:hover:bg-gray-900 font-bold uppercase tracking-wider transition-all duration-200 active:scale-95">
            <Phone className="w-5 h-5 mr-2" weight="bold" />
            Call Us
          </Button>
        </CardContent>
      </Card>

      {apiKeys && apiKeys.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold uppercase">Your API Keys</h2>
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <Card key={key.id} className="border-2 border-border">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Key className="w-6 h-6" weight="bold" />
                        <div>
                          <h3 className="font-bold text-lg">{key.name}</h3>
                          <Badge className="mt-1 bg-success text-success-foreground font-bold">
                            {key.tier}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-success text-success font-bold">
                        <CheckCircle className="w-4 h-4 mr-2" weight="fill" />
                        Active
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 bg-muted p-4 rounded-md font-mono text-sm border-2 border-border">
                      <span className="flex-1 break-all">
                        {showKeys[key.id] ? key.key : `${key.key.substring(0, 20)}${'•'.repeat(20)}`}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="shrink-0"
                      >
                        {showKeys[key.id] ? (
                          <EyeSlash className="w-5 h-5" weight="bold" />
                        ) : (
                          <Eye className="w-5 h-5" weight="bold" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(key.key)}
                        className="shrink-0"
                      >
                        <Copy className="w-5 h-5" weight="bold" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Usage</p>
                        <p className="font-bold text-lg">
                          {key.callsUsed.toLocaleString()} / {key.callsLimit.toLocaleString()}
                        </p>
                        <div className="w-full bg-muted rounded-full h-2 mt-2 border border-border">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-200"
                            style={{ width: `${Math.min((key.callsUsed / key.callsLimit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Resets</p>
                        <p className="font-bold text-lg">
                          {new Date(key.resetDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Created</p>
                        <p className="font-bold text-lg">
                          {new Date(key.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="border-2 border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase">Confirm Purchase</DialogTitle>
            <DialogDescription className="text-base">
              You're about to purchase the {selectedTier?.name} plan for ${selectedTier?.price}/month
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-md border-2 border-border space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Plan:</span>
                <span className="uppercase">{selectedTier?.name}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>API Calls:</span>
                <span>{selectedTier?.calls.toLocaleString()}/month</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t-2 border-border pt-2 mt-2">
                <span>Total:</span>
                <span>${selectedTier?.price}/month</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your API key will be generated immediately after purchase. Billing occurs monthly.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setPurchaseDialogOpen(false)}
              className="border-2 border-border font-bold uppercase"
            >
              Cancel
            </Button>
            <Button
              onClick={completePurchase}
              className="bg-success hover:bg-success/90 text-success-foreground font-bold uppercase tracking-wider active:scale-95 transition-all duration-200"
            >
              <CheckCircle className="w-4 h-4 mr-2" weight="fill" />
              Complete Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
