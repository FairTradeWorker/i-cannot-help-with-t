import { useState } from 'react';
import { CurrencyDollar, TrendUp, Target, Lightbulb } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { suggestOptimalPricing, type JobScope, type PricingSuggestion } from '@/lib/ai-service';

interface PricingSuggesterProps {
  jobScope: JobScope;
}

export function PricingSuggester({ jobScope }: PricingSuggesterProps) {
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<PricingSuggestion | null>(null);
  const [error, setError] = useState<string>('');
  
  const [marketData, setMarketData] = useState({
    avgRate: 75,
    competitorMin: jobScope.estimatedCost.min * 0.9,
    competitorMax: jobScope.estimatedCost.max * 1.1,
    demandScore: 75
  });
  
  const [contractorProfile, setContractorProfile] = useState({
    rating: 85,
    completedJobs: 50
  });

  const handleGetPricing = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await suggestOptimalPricing(jobScope, marketData, contractorProfile);
      setPricing(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate pricing suggestion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" weight="fill" />
          Market & Contractor Data
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="avgRate">Average Hourly Rate ($)</Label>
              <Input
                id="avgRate"
                type="number"
                value={marketData.avgRate}
                onChange={(e) => setMarketData({ ...marketData, avgRate: parseFloat(e.target.value) })}
                className="font-mono"
              />
            </div>
            
            <div>
              <Label htmlFor="competitorMin">Competitor Min Price ($)</Label>
              <Input
                id="competitorMin"
                type="number"
                value={marketData.competitorMin}
                onChange={(e) => setMarketData({ ...marketData, competitorMin: parseFloat(e.target.value) })}
                className="font-mono"
              />
            </div>
            
            <div>
              <Label htmlFor="competitorMax">Competitor Max Price ($)</Label>
              <Input
                id="competitorMax"
                type="number"
                value={marketData.competitorMax}
                onChange={(e) => setMarketData({ ...marketData, competitorMax: parseFloat(e.target.value) })}
                className="font-mono"
              />
            </div>
            
            <div>
              <Label htmlFor="demandScore">Market Demand (0-100)</Label>
              <Input
                id="demandScore"
                type="number"
                min="0"
                max="100"
                value={marketData.demandScore}
                onChange={(e) => setMarketData({ ...marketData, demandScore: parseFloat(e.target.value) })}
                className="font-mono"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rating">Contractor Rating (0-100)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="100"
                value={contractorProfile.rating}
                onChange={(e) => setContractorProfile({ ...contractorProfile, rating: parseFloat(e.target.value) })}
                className="font-mono"
              />
            </div>
            
            <div>
              <Label htmlFor="completedJobs">Completed Jobs</Label>
              <Input
                id="completedJobs"
                type="number"
                min="0"
                value={contractorProfile.completedJobs}
                onChange={(e) => setContractorProfile({ ...contractorProfile, completedJobs: parseInt(e.target.value) })}
                className="font-mono"
              />
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleGetPricing}
          disabled={loading}
          className="w-full mt-6"
          size="lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Calculating Optimal Price...
            </>
          ) : (
            <>
              <TrendUp className="w-5 h-5 mr-2" weight="bold" />
              Get AI Pricing Suggestion
            </>
          )}
        </Button>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {pricing && (
        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <CurrencyDollar className="w-8 h-8 text-primary" weight="fill" />
                Suggested Price
              </h3>
              <p className="text-5xl font-bold text-primary font-mono mb-4">
                ${pricing.suggestedPrice.toLocaleString()}
              </p>
            </div>
            <div className="text-right ml-6">
              <p className="text-sm text-muted-foreground mb-1">Win Probability</p>
              <div className="text-3xl font-bold text-accent">{pricing.winProbability}%</div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" weight="fill" />
              Pricing Strategy
            </h4>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Reasoning</p>
                <p className="text-foreground">{pricing.reasoning}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Competitive Advantage</p>
                <p className="text-foreground">{pricing.competitiveAdvantage}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3">Price Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Materials</p>
                <p className="text-xl font-bold font-mono">${pricing.priceBreakdown.materials.toLocaleString()}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Labor</p>
                <p className="text-xl font-bold font-mono">${pricing.priceBreakdown.labor.toLocaleString()}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Overhead</p>
                <p className="text-xl font-bold font-mono">${pricing.priceBreakdown.overhead.toLocaleString()}</p>
              </div>
              <div className="bg-accent/10 rounded-lg p-4 border-2 border-accent/30">
                <p className="text-sm text-muted-foreground mb-1">Profit</p>
                <p className="text-xl font-bold font-mono text-accent">${pricing.priceBreakdown.profit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h4 className="text-lg font-bold mb-3">Alternative Pricing Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 border-2 border-transparent hover:border-primary/30 transition-colors cursor-pointer">
                <Badge variant="outline" className="mb-2">Aggressive</Badge>
                <p className="text-2xl font-bold font-mono">${pricing.alternativePrices.aggressive.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Win-focused, lower margin</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary">
                <Badge className="mb-2">Balanced (Recommended)</Badge>
                <p className="text-2xl font-bold font-mono text-primary">${pricing.alternativePrices.balanced.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Optimal win rate & profit</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border-2 border-transparent hover:border-accent/30 transition-colors cursor-pointer">
                <Badge variant="outline" className="mb-2">Premium</Badge>
                <p className="text-2xl font-bold font-mono">${pricing.alternativePrices.premium.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Profit-focused, higher margin</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
