import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, Clock, Star, Lightning, Crown } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  getWarrantyRecommendation,
  getPlatinumQuote,
  formatWarrantyPrice,
  COMMISSION_RATE,
  type WarrantyQuote,
} from '@/lib/WarrantyEngine';

interface WarrantyUpsellProps {
  /** Job total amount to calculate warranty pricing */
  jobTotal: number;
  /** Callback when warranty is added */
  onAddWarranty?: (quote: WarrantyQuote) => void;
  /** Callback to open financing modal */
  onOpenFinancing?: (amount: number, warrantyQuote: WarrantyQuote) => void;
  /** Show compact version (just the big green button) */
  compact?: boolean;
}

export function WarrantyUpsell({
  jobTotal,
  onAddWarranty,
  onOpenFinancing,
  compact = false,
}: WarrantyUpsellProps) {
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [showAllTiers, setShowAllTiers] = useState(false);

  const recommendation = useMemo(
    () => getWarrantyRecommendation(jobTotal),
    [jobTotal]
  );

  const platinumQuote = useMemo(() => getPlatinumQuote(jobTotal), [jobTotal]);

  const selectedQuote = useMemo(() => {
    if (!selectedTierId) return null;
    return recommendation.allQuotes.find((q) => q.tier.id === selectedTierId);
  }, [selectedTierId, recommendation.allQuotes]);

  const handleAddWarranty = (quote: WarrantyQuote) => {
    setSelectedTierId(quote.tier.id);
    onAddWarranty?.(quote);
    toast.success(`${quote.tier.name} Added!`, {
      description: `${formatWarrantyPrice(quote.price)} warranty protection added to your job.`,
    });
  };

  const handleFinancing = (quote: WarrantyQuote) => {
    if (onOpenFinancing) {
      onOpenFinancing(quote.price, quote);
    } else {
      toast.info('Financing Available', {
        description: `Finance your ${quote.tier.name} warranty for just ${formatWarrantyPrice(quote.monthlyPayment)}/month.`,
      });
    }
  };

  // Compact version - just the big green upsell button
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Button
          size="lg"
          className="w-full h-16 text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 border-2 border-green-500"
          onClick={() => handleAddWarranty(platinumQuote)}
        >
          <Shield className="w-6 h-6 mr-2" weight="fill" />
          Add 25-Year Platinum (+{formatWarrantyPrice(platinumQuote.price)})
          <Crown className="w-5 h-5 ml-2" weight="fill" />
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Or finance for just {formatWarrantyPrice(platinumQuote.monthlyPayment)}/month
        </p>
      </motion.div>
    );
  }

  const getTierIcon = (years: number) => {
    if (years === 25) return Crown;
    if (years === 20) return Star;
    if (years === 15) return Lightning;
    return Shield;
  };

  const getTierColor = (years: number) => {
    if (years === 25) return 'from-yellow-500 to-amber-600';
    if (years === 20) return 'from-purple-500 to-violet-600';
    if (years === 15) return 'from-blue-500 to-indigo-600';
    return 'from-green-500 to-emerald-600';
  };

  return (
    <div className="space-y-6">
      {/* Big Green Upsell Button - Always Visible */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="border-2 border-green-500/50 bg-gradient-to-r from-green-500/10 to-emerald-500/10 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30">
                  <Crown className="w-10 h-10 text-white" weight="fill" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h3 className="text-xl font-bold">Protect Your Investment</h3>
                  <Badge className="bg-amber-500 text-white">BEST VALUE</Badge>
                </div>
                <p className="text-muted-foreground">
                  {recommendation.reason}
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 border-2 border-green-500 whitespace-nowrap"
                  onClick={() => handleAddWarranty(platinumQuote)}
                >
                  <Shield className="w-5 h-5 mr-2" weight="fill" />
                  Add 25-Year Platinum (+{formatWarrantyPrice(platinumQuote.price)})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm"
                  onClick={() => handleFinancing(platinumQuote)}
                >
                  Finance for {formatWarrantyPrice(platinumQuote.monthlyPayment)}/mo
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-green-500/20">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" weight="fill" />
                  Zero deductible
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" weight="fill" />
                  Full replacement guarantee
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" weight="fill" />
                  24/7 concierge service
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" weight="fill" />
                  Acts of nature covered
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Toggle to show all tiers */}
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllTiers(!showAllTiers)}
          className="text-muted-foreground hover:text-foreground"
        >
          {showAllTiers ? 'Hide other options' : 'Compare all warranty options'}
          <motion.span
            animate={{ rotate: showAllTiers ? 180 : 0 }}
            className="ml-2"
          >
            ▼
          </motion.span>
        </Button>
      </div>

      {/* All Warranty Tiers */}
      <AnimatePresence>
        {showAllTiers && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendation.allQuotes.map((quote, index) => {
                const Icon = getTierIcon(quote.tier.years);
                const colorGradient = getTierColor(quote.tier.years);
                const isSelected = selectedTierId === quote.tier.id;
                const isRecommended = quote.tier.recommended;

                return (
                  <motion.div
                    key={quote.tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card
                      className={`relative h-full transition-all duration-200 ${
                        isSelected
                          ? 'ring-2 ring-primary shadow-xl'
                          : isRecommended
                          ? 'border-2 border-primary/50 shadow-lg'
                          : 'hover:shadow-md'
                      }`}
                    >
                      {isRecommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-white px-3">
                            Recommended
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="space-y-3 pb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorGradient} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" weight="fill" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{quote.tier.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {quote.tier.years} Years Coverage
                          </CardDescription>
                        </div>
                        <div className="pt-2">
                          <div className="text-3xl font-bold">
                            {formatWarrantyPrice(quote.price)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            One-time payment
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            or {formatWarrantyPrice(quote.monthlyPayment)}/mo
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <Separator />
                        <div className="space-y-2">
                          {quote.tier.features.slice(0, 4).map((feature, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle
                                className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
                                weight="fill"
                              />
                              <span className="text-xs">{feature}</span>
                            </div>
                          ))}
                          {quote.tier.features.length > 4 && (
                            <p className="text-xs text-muted-foreground pl-6">
                              +{quote.tier.features.length - 4} more features
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                          <Button
                            variant={isSelected ? 'secondary' : isRecommended ? 'default' : 'outline'}
                            size="sm"
                            className="w-full"
                            onClick={() => handleAddWarranty(quote)}
                            disabled={isSelected}
                          >
                            {isSelected ? 'Selected' : 'Add Warranty'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => handleFinancing(quote)}
                          >
                            Finance this option
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Commission info - for internal use */}
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    <strong>Your earnings:</strong> {Math.round(COMMISSION_RATE * 100)}% of warranty sale
                  </div>
                  {selectedQuote && (
                    <div className="font-semibold text-green-600">
                      You earn: {formatWarrantyPrice(selectedQuote.commission)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected warranty summary */}
      {selectedQuote && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-primary" weight="fill" />
                  <div>
                    <p className="font-semibold">{selectedQuote.tier.name} Selected</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedQuote.tier.years} years of protection
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatWarrantyPrice(selectedQuote.price)}</p>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs"
                    onClick={() => setSelectedTierId(null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
