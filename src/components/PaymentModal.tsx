import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard,
  Money,
  Calendar,
  CheckCircle,
  Bank,
  Lightning,
  Lock,
  Wallet,
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId?: string;
  amount: number;
  jobTitle: string;
  onPaymentComplete?: () => void;
}

type FinanceOption = 'full_payment' | 'installments' | 'financing';

export function PaymentModal({ 
  open, 
  onOpenChange, 
  jobId = 'job-123', 
  amount,
  jobTitle,
  onPaymentComplete 
}: PaymentModalProps) {
  const [selectedOption, setSelectedOption] = useState<FinanceOption>('full_payment');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'options' | 'details'>('options');

  const financeOptions = [
    {
      id: 'full_payment' as FinanceOption,
      name: 'Pay in Full',
      icon: Lightning,
      description: 'Pay the total amount now',
      amount: amount,
      savings: Math.round(amount * 0.05),
      badge: 'Save 5%',
      color: 'from-primary to-secondary',
    },
    {
      id: 'installments' as FinanceOption,
      name: '3 Installments',
      icon: Calendar,
      description: 'Split into 3 monthly payments',
      amount: Math.round(amount / 3),
      fee: Math.round(amount * 0.02),
      badge: '2% fee',
      color: 'from-secondary to-accent',
    },
    {
      id: 'financing' as FinanceOption,
      name: '12-Month Plan',
      icon: Bank,
      description: '0% APR for qualified customers',
      amount: Math.round(amount / 12),
      apr: 0,
      badge: '0% APR',
      color: 'from-accent to-primary',
    },
  ];

  const selectedPlan = financeOptions.find(opt => opt.id === selectedOption);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast.success('Payment processed successfully!', {
        description: 'Your job has been posted and contractors will be notified.',
      });
      onPaymentComplete?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Job Posting</DialogTitle>
          <DialogDescription>
            Choose a payment option for: {jobTitle}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'options' && (
            <motion.div
              key="options"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <Card className="glass-card p-6 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Total Amount</h3>
                    <p className="text-sm text-muted-foreground mt-1">Estimated job cost</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold font-mono">${amount.toLocaleString()}</div>
                  </div>
                </div>
              </Card>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Payment Method</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {financeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedOption === option.id;

                    return (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'ring-2 ring-primary shadow-xl shadow-primary/20' 
                              : 'hover:shadow-lg'
                          }`}
                          onClick={() => setSelectedOption(option.id)}
                        >
                          <CardContent className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className={`p-3 rounded-xl bg-gradient-to-br ${option.color}`}>
                                <Icon className="w-8 h-8 text-white" weight="bold" />
                              </div>
                              {option.badge && (
                                <Badge 
                                  variant={option.savings ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {option.badge}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="text-lg font-bold">{option.name}</h4>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>

                            <div className="pt-4 border-t border-border/50">
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold font-mono">
                                  ${option.amount.toLocaleString()}
                                </span>
                                {option.id !== 'full_payment' && (
                                  <span className="text-sm text-muted-foreground">/month</span>
                                )}
                              </div>
                              {option.savings && (
                                <p className="text-xs text-accent mt-1">
                                  Save ${option.savings.toLocaleString()}
                                </p>
                              )}
                              {option.fee && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  +${option.fee.toLocaleString()} processing fee
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => setStep('details')}
                  className="px-8"
                >
                  Continue
                  <CheckCircle className="w-4 h-4 ml-2" weight="fill" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedPlan && <selectedPlan.icon className="w-6 h-6 text-primary" weight="bold" />}
                    <div>
                      <h4 className="font-semibold">{selectedPlan?.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedPlan?.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setStep('options')}
                  >
                    Change
                  </Button>
                </div>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Payment Details
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                      <Input 
                        id="card-number" 
                        placeholder="1234 5678 9012 3456" 
                        className="pl-10"
                      />
                      <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" maxLength={3} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing-zip">Billing ZIP Code</Label>
                    <Input id="billing-zip" placeholder="12345" />
                  </div>
                </div>
              </div>

              <Card className="bg-muted/50 border-border/50 p-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Job Cost</span>
                    <span className="font-mono">${amount.toLocaleString()}</span>
                  </div>
                  {selectedPlan?.fee && (
                    <div className="flex justify-between text-sm">
                      <span>Processing Fee</span>
                      <span className="font-mono">+${selectedPlan.fee.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedPlan?.savings && (
                    <div className="flex justify-between text-sm text-accent">
                      <span>Discount</span>
                      <span className="font-mono">-${selectedPlan.savings.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>
                      {selectedOption === 'full_payment' ? 'Total Due' : 'First Payment'}
                    </span>
                    <span className="font-mono">
                      ${(selectedPlan?.amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <Lock className="w-4 h-4" />
                <span>Your payment information is encrypted and secure. We never store your card details.</span>
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('options')}
                >
                  Back
                </Button>
                <Button 
                  onClick={handlePayment}
                  disabled={processing}
                  className="px-8"
                >
                  {processing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" weight="fill" />
                      Pay ${(selectedPlan?.amount || 0).toLocaleString()}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
