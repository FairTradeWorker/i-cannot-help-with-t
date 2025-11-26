import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  CreditCard,
  Money,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Bank,
  ChartLine,
  ShieldCheck,
  Lock,
  Lightning,
  CurrencyDollar,
  Receipt,
  Wallet,
  ArrowRight,
  Info,
  Shield,
  MapPin,
  User,
  Phone,
  House,
  Question,
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface PaymentScreenProps {
  jobId?: string;
  amount?: number;
  jobTitle?: string;
  onPaymentComplete?: () => void;
}

export function PaymentScreen({ 
  jobId = 'demo-job-123', 
  amount = 8500, 
  jobTitle = 'Roof Repair and Replacement',
  onPaymentComplete 
}: PaymentScreenProps) {
  const [selectedOption, setSelectedOption] = useState<'full' | '3month' | '12month'>('full');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank' | 'wallet'>('card');
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedWarranty, setSelectedWarranty] = useState<'basic' | 'extended' | 'premium'>('basic');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const platformFee = 20;
  const warrantyPrices = { basic: 75, extended: 299, premium: 499 };
  const warrantyPrice = warrantyPrices[selectedWarranty];
  const totalAmount = amount + warrantyPrice + platformFee;

  const financeOptions = [
    {
      id: 'full' as const,
      name: 'Full Payment',
      icon: Money,
      description: 'Pay the total amount today',
      amount: amount,
      savings: 0,
      highlight: 'Best Value',
    },
    {
      id: '3month' as const,
      name: '3 Month Installments',
      icon: Calendar,
      description: 'Split into 3 monthly payments',
      amount: (amount + (amount * 0.02)) / 3,
      totalAmount: amount + (amount * 0.02),
      fee: amount * 0.02,
      highlight: '2% Processing Fee',
    },
    {
      id: '12month' as const,
      name: '12 Month Financing',
      icon: Bank,
      description: '0% APR for qualified customers',
      amount: amount / 12,
      apr: 0,
      highlight: '0% APR',
    },
  ];

  const paymentMethods = [
    {
      id: 'card' as const,
      name: 'Credit / Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex, Discover',
    },
    {
      id: 'bank' as const,
      name: 'Bank Transfer',
      icon: Bank,
      description: 'ACH Direct Transfer',
    },
    {
      id: 'wallet' as const,
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Apple Pay, Google Pay',
    },
  ];

  const selectedFinanceOption = financeOptions.find(o => o.id === selectedOption)!;

  const handlePayment = async () => {
    if (selectedMethod === 'card' && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      toast.error('Please fill in all card details');
      return;
    }

    if (!agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      toast.success('Payment processed successfully!');
      onPaymentComplete?.();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold">Complete Payment</h2>
          <p className="text-muted-foreground mt-1">{jobTitle}</p>
        </div>
        <Badge variant="secondary" className="text-2xl px-6 py-3">
          ${amount.toLocaleString()}
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightning className="w-6 h-6 text-primary" weight="fill" />
              Payment Plan
            </h3>
            <Separator className="mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {financeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedOption === option.id;

                return (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
                  >
                    <Card
                      className={`p-5 cursor-pointer transition-all duration-110 ${
                        isSelected
                          ? 'ring-2 ring-primary bg-primary/5 shadow-lg'
                          : 'hover:shadow-md border-2'
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                            <Icon className="w-6 h-6" weight="duotone" />
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                            >
                              <CheckCircle className="w-5 h-5 text-white" weight="fill" />
                            </motion.div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold mb-1">{option.name}</h4>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-2xl font-bold">
                            ${option.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                          {option.id !== 'full' && (
                            <p className="text-xs text-muted-foreground">per payment</p>
                          )}
                        </div>

                        {option.highlight && (
                          <Badge variant={isSelected ? 'default' : 'secondary'} className="w-full justify-center">
                            {option.highlight}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary" weight="fill" />
              Payment Method
            </h3>
            <Separator className="mb-4" />

            <Tabs value={selectedMethod} onValueChange={(v) => setSelectedMethod(v as any)} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <TabsTrigger key={method.id} value={method.id} className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="hidden md:inline">{method.name.split(' ')[0]}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="card" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                        setCardNumber(formatted);
                      }}
                      className="pl-10 h-12 text-lg font-mono"
                      maxLength={19}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Expiry Date</Label>
                    <Input
                      id="card-expiry"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setCardExpiry(value);
                      }}
                      className="h-12 font-mono"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input
                      id="card-cvv"
                      placeholder="123"
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="h-12 font-mono"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" weight="fill" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold">Your payment is secure</p>
                    <p className="text-xs text-blue-700 mt-1">256-bit SSL encryption • PCI DSS compliant</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4 mt-6">
                <div className="text-center py-8">
                  <Bank className="w-16 h-16 mx-auto mb-4 text-muted-foreground" weight="duotone" />
                  <h4 className="font-semibold mb-2">Bank Transfer Instructions</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete payment via ACH transfer to the account below
                  </p>
                  <Card className="p-4 text-left">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Name:</span>
                        <span className="font-semibold">FairTradeWorker Escrow</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Routing Number:</span>
                        <span className="font-mono font-semibold">021000021</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Number:</span>
                        <span className="font-mono font-semibold">****7890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reference:</span>
                        <span className="font-mono font-semibold">{jobId}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4 mt-6">
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" weight="duotone" />
                  <h4 className="font-semibold mb-2">Digital Wallet Payment</h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choose your preferred digital wallet to complete payment
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-16 text-base" onClick={() => toast.info('Apple Pay integration coming soon')}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-8" />
                    </Button>
                    <Button variant="outline" className="h-16 text-base" onClick={() => toast.info('Google Pay integration coming soon')}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-8" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <House className="w-6 h-6 text-primary" weight="fill" />
              Job Details
            </h3>
            <Separator className="mb-4" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" weight="duotone" />
                <div>
                  <p className="text-xs text-muted-foreground">Service Address</p>
                  <p className="font-semibold">123 Main St, Austin, TX 78701</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" weight="duotone" />
                <div>
                  <p className="text-xs text-muted-foreground">Contractor</p>
                  <p className="font-semibold">Elite Roofing Solutions</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                    Verified
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" weight="duotone" />
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Start</p>
                  <p className="font-semibold">Within 3-5 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" weight="duotone" />
                <div>
                  <p className="text-xs text-muted-foreground">Project Duration</p>
                  <p className="font-semibold">3-4 days</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" weight="fill" />
              Warranty Protection
            </h3>
            <Separator className="mb-4" />

            <div className="space-y-3">
              <div
                onClick={() => setSelectedWarranty('basic')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedWarranty === 'basic'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Basic Warranty</h4>
                  <Badge variant={selectedWarranty === 'basic' ? 'default' : 'outline'}>Included</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">1-year workmanship guarantee</p>
                <div className="text-sm font-bold">$75</div>
              </div>

              <div
                onClick={() => setSelectedWarranty('extended')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedWarranty === 'extended'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Extended Warranty</h4>
                  <Badge variant={selectedWarranty === 'extended' ? 'default' : 'outline'}>Popular</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">3-year coverage with priority service</p>
                <div className="text-sm font-bold">$299</div>
              </div>

              <div
                onClick={() => setSelectedWarranty('premium')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedWarranty === 'premium'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Premium Warranty</h4>
                  <Badge variant={selectedWarranty === 'premium' ? 'default' : 'outline'}>Best Value</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">5-year full coverage with 24/7 support</p>
                <div className="text-sm font-bold">$499</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Receipt className="w-6 h-6 text-primary" weight="fill" />
              Payment Summary
            </h3>
            <Separator className="mb-4" />

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Job Details</p>
                <p className="font-semibold">{jobTitle}</p>
                <p className="text-xs text-muted-foreground">Job ID: {jobId}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Job Amount</span>
                  <span className="font-semibold">${amount.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Platform Fee</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">One-time platform fee that supports FairTradeWorker operations</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-semibold text-accent">
                    +${platformFee.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedWarranty === 'basic' ? 'Basic' : selectedWarranty === 'extended' ? 'Extended' : 'Premium'} Warranty
                  </span>
                  <span className="text-sm font-semibold text-accent">
                    ${warrantyPrice.toLocaleString()}
                  </span>
                </div>

                {selectedOption !== 'full' && selectedFinanceOption.fee && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Processing Fee</span>
                    <span className="text-sm font-semibold text-accent">
                      +${selectedFinanceOption.fee.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Total Due Today</span>
                  <span className="font-bold text-primary">
                    ${(selectedFinanceOption.totalAmount ? selectedFinanceOption.totalAmount : totalAmount).toLocaleString()}
                  </span>
                </div>

                {selectedOption !== 'full' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">First Payment</span>
                    <span className="text-sm font-semibold">
                      ${selectedFinanceOption.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>Funds held in escrow until job completion</p>
                </div>
                
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2 text-xs">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" weight="fill" />
                    Platform Fee Breakdown
                  </h4>
                  <p className="text-muted-foreground">
                    A one-time ${operatorFee} platform fee per job helps maintain FairTradeWorker infrastructure, secure payments, and support services. Territory operators separately pay $45/month for exclusive lead rights in their area.
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                    <span className="font-medium">Your Platform Fee:</span>
                    <span className="font-bold text-primary">${platformFee} one-time</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment to Contractor</span>
                    <span className="font-semibold">${amount.toLocaleString()}</span>
                  </div>
                  <div className="text-muted-foreground text-[10px] leading-tight">
                    Contractor receives 100% of job payment. No platform fees deducted.
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-muted-foreground leading-tight cursor-pointer"
                >
                  I agree to the{' '}
                  <span className="text-primary underline">Terms of Service</span> and{' '}
                  <span className="text-primary underline">Escrow Agreement</span>
                </label>
              </div>

              <Button 
                onClick={handlePayment} 
                disabled={processing || !agreeToTerms} 
                size="lg" 
                className="w-full h-14 text-base"
              >
                {processing ? (
                  <>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" weight="fill" />
                    Complete Secure Payment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" weight="fill" />
                <span>Secured by Stripe</span>
                <span>•</span>
                <span>PCI Compliant</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Question className="w-5 h-5 text-primary" weight="fill" />
          Frequently Asked Questions
        </h3>
        <Separator className="mb-4" />
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">When will work begin?</h4>
            <p className="text-sm text-muted-foreground">Work typically begins within 3-5 business days of payment confirmation. Your contractor will contact you within 24 hours to schedule.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-2">What is the escrow process?</h4>
            <p className="text-sm text-muted-foreground">Funds are held securely in escrow until the job is completed and you approve the work. This protects both homeowners and contractors.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-2">Can I get a refund?</h4>
            <p className="text-sm text-muted-foreground">Full refunds are available if work hasn't started. After work begins, our dispute resolution team handles any issues fairly for both parties.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-2">What are the financing terms?</h4>
            <p className="text-sm text-muted-foreground">We offer 0% APR financing for 12 months to qualified customers. 3-month payment plans have a 2% processing fee.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-2">What does the platform fee cover?</h4>
            <p className="text-sm text-muted-foreground">The one-time platform fee covers secure payment processing, escrow services, customer support, and platform maintenance.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
