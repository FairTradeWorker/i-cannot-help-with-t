import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Clock, Hammer, House, Lightning, Phone, Wrench } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { WarrantyUpsell } from '@/components/WarrantyUpsell';
import { PaymentModal } from '@/components/PaymentModal';
import type { WarrantyQuote } from '@/lib/WarrantyEngine';

interface WarrantySectionProps {
  /** Job total to calculate warranty pricing. Defaults to $10,000 for demo purposes */
  jobTotal?: number;
}

export function WarrantySection({ jobTotal = 10000 }: WarrantySectionProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedWarrantyQuote, setSelectedWarrantyQuote] = useState<WarrantyQuote | null>(null);

  const handleAddWarranty = (quote: WarrantyQuote) => {
    setSelectedWarrantyQuote(quote);
  };

  const handleOpenFinancing = (amount: number, quote: WarrantyQuote) => {
    setSelectedWarrantyQuote(quote);
    setShowPaymentModal(true);
  };

  const warrantyTiers = [
    {
      name: 'Extended Warranty',
      price: 249,
      duration: '3 Years',
      description: 'Comprehensive coverage for peace of mind',
      features: [
        'Extended 3-year coverage',
        'Priority service response',
        'Annual inspection included',
        'Phone support',
        'Workmanship & materials',
      ],
      color: 'bg-primary',
      popular: true,
    },
    {
      name: 'Premium Warranty',
      price: 499,
      duration: '5 Years',
      description: 'Maximum protection for your investment',
      features: [
        'Everything in Extended',
        'Full 5-year coverage',
        '24/7 emergency support',
        'Bi-annual inspections',
        'Transferable warranty',
        'Dedicated warranty manager',
      ],
      color: 'bg-accent',
      popular: false,
    },
  ];

  const coveredServices = [
    {
      icon: House,
      name: 'Roofing',
      description: 'Leaks, shingle damage, structural issues',
    },
    {
      icon: Lightning,
      name: 'Electrical',
      description: 'Wiring, fixtures, circuit problems',
    },
    {
      icon: Wrench,
      name: 'Plumbing',
      description: 'Pipes, fixtures, drainage systems',
    },
    {
      icon: Hammer,
      name: 'General Repairs',
      description: 'Drywall, painting, carpentry work',
    },
  ];

  const handlePurchaseWarranty = (name: string, price: number) => {
    toast.success(`${name} selected`, {
      description: `$${price} - Coverage will begin upon job completion`,
    });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="p-4 rounded-2xl bg-primary/10">
            <Shield className="w-12 h-12 text-primary" weight="fill" />
          </div>
        </div>
        <h2 className="text-4xl font-bold">Warranty Protection</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Every job includes a basic 1-year warranty. Upgrade to extended coverage for complete peace of mind.
        </p>
      </motion.div>

      {/* Scaling Warranty Engine - Auto-calculates based on job total */}
      <WarrantyUpsell
        jobTotal={jobTotal}
        onAddWarranty={handleAddWarranty}
        onOpenFinancing={handleOpenFinancing}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warrantyTiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="h-full"
          >
            <Card
              className={`relative h-full ${
                tier.popular ? 'border-2 border-primary shadow-xl' : 'border-2'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1.5">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="space-y-4 pb-4">
                <div className={`w-14 h-14 rounded-xl ${tier.color} flex items-center justify-center`}>
                  <Shield className="w-8 h-8 text-white" weight="fill" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </div>
                <div className="pt-2">
                  {tier.price === 0 ? (
                    <>
                      <div className="text-4xl font-bold">Included</div>
                      <div className="text-sm text-muted-foreground mt-1">Free with every job</div>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl font-bold">${tier.price}</div>
                      <div className="text-sm text-muted-foreground mt-1">One-time payment</div>
                    </>
                  )}
                  <Badge variant="outline" className="mt-3">
                    <Clock className="w-3 h-3 mr-1" />
                    {tier.duration} Coverage
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Separator />
                <div className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" weight="fill" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full mt-6"
                  variant={tier.popular ? 'default' : tier.price === 0 ? 'outline' : 'secondary'}
                  onClick={() => handlePurchaseWarranty(tier.name, tier.price)}
                >
                  {tier.price === 0 ? 'Included' : 'Add to Cart'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hammer className="w-6 h-6 text-primary" weight="fill" />
            What's Covered
          </CardTitle>
          <CardDescription>
            Our warranties cover a wide range of home services and repairs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coveredServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.name} className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" weight="duotone" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{service.name}</h4>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">How Warranties Work</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Coverage Begins</h4>
                    <p className="text-sm text-muted-foreground">
                      Your warranty activates immediately upon job completion and inspection
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Issue Arises</h4>
                    <p className="text-sm text-muted-foreground">
                      If you experience any covered issues, contact our warranty team
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Quick Resolution</h4>
                    <p className="text-sm text-muted-foreground">
                      We dispatch a qualified contractor to fix the issue at no cost to you
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-primary/5 rounded-2xl p-6 border-2 border-primary/20">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" weight="fill" />
                Need Help?
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Our warranty team is available 24/7 for Extended and Premium warranty holders
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" weight="fill" />
                  <span className="font-semibold">1-800-WARRANTY</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightning className="w-4 h-4 text-primary" weight="fill" />
                  <span>warranty@servicehub.com</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                File a Claim
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card bg-muted/30">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">What's not covered?</h4>
              <p className="text-sm text-muted-foreground">
                Normal wear and tear, damage from misuse, and issues caused by acts of nature (unless you have Premium coverage) are not covered.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I transfer my warranty?</h4>
              <p className="text-sm text-muted-foreground">
                Premium warranties are fully transferable. Extended warranties can be transferred for a $50 fee.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How do I file a claim?</h4>
              <p className="text-sm text-muted-foreground">
                Call our warranty hotline or submit a claim through your dashboard. Response time depends on your warranty tier.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Are inspections required?</h4>
              <p className="text-sm text-muted-foreground">
                Extended and Premium warranties include free annual inspections to catch issues early and maintain coverage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-2 border-muted bg-muted/20">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              Warranty Terms & Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Important:</strong> Warranties are provided by the contractor and administered by ServiceHub. Coverage terms vary by service type and contractor. All warranties are subject to inspection and approval. Coverage does not include pre-existing conditions, improper use, unauthorized modifications, natural disasters (except Premium tier), normal wear and tear, or cosmetic issues. Extended and Premium warranties require annual or bi-annual inspections to maintain coverage. ServiceHub reserves the right to deny claims that do not meet warranty terms. Full terms and conditions are provided upon purchase. By purchasing a warranty, you agree to binding arbitration for dispute resolution.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal for Financing */}
      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        amount={selectedWarrantyQuote?.price || 0}
        jobTitle={selectedWarrantyQuote ? `${selectedWarrantyQuote.tier.name} Warranty` : 'Warranty'}
        onPaymentComplete={() => {
          setShowPaymentModal(false);
          toast.success('Warranty purchase complete!', {
            description: `Your ${selectedWarrantyQuote?.tier.name} warranty is now active.`,
          });
        }}
      />
    </div>
  );
}
