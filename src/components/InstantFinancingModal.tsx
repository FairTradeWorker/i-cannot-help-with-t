import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Bank,
  CheckCircle,
  Shield,
  Lightning,
  Lock,
  CurrencyDollar,
  Calendar,
  Percent,
  Warning,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { FinancingApplication } from '@/lib/types';
import { calculateMonthlyPayment, calculateReferralCredit, generateFinancingApplicationId } from '@/lib/utils';

interface InstantFinancingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  jobTotal: number;
  homeownerId: string;
  contractorId?: string;
  onFinancingApproved?: (application: FinancingApplication) => void;
  onFinancingDeclined?: () => void;
}

type FinancingStep = 'overview' | 'iframe' | 'processing' | 'approved' | 'declined';

interface WarrantyOption {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

const warrantyOptions: WarrantyOption[] = [
  {
    id: 'extended-3yr',
    name: 'Extended Warranty',
    price: 249,
    duration: '3 Years',
    description: 'Comprehensive coverage with priority service',
  },
  {
    id: 'premium-5yr',
    name: 'Premium Warranty',
    price: 499,
    duration: '5 Years',
    description: 'Maximum protection with 24/7 support',
  },
];

export function InstantFinancingModal({
  open,
  onOpenChange,
  jobId,
  jobTitle,
  jobTotal,
  homeownerId,
  contractorId,
  onFinancingApproved,
  onFinancingDeclined,
}: InstantFinancingModalProps) {
  const [step, setStep] = useState<FinancingStep>('overview');
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyOption | null>(null);
  const [bundleWarranty, setBundleWarranty] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [application, setApplication] = useState<FinancingApplication | null>(null);

  const defaultWarranty = warrantyOptions[0];
  const effectiveWarranty = bundleWarranty ? (selectedWarranty || defaultWarranty) : null;
  const totalWithWarranty = jobTotal + (effectiveWarranty?.price || 0);
  const monthlyPayment = calculateMonthlyPayment(totalWithWarranty);
  const referralCredit = calculateReferralCredit(jobTotal);

  useEffect(() => {
    if (open) {
      setStep('overview');
      setApplication(null);
      setProcessing(false);
    }
  }, [open]);

  const handleStartFinancing = () => {
    setStep('iframe');
  };

  const handleHearthMessage = useCallback((event: MessageEvent) => {
    if (event.origin !== 'https://app.gethearth.com') return;

    const { type, data } = event.data || {};

    if (type === 'HEARTH_APPLICATION_APPROVED') {
      setStep('processing');
      setProcessing(true);

      const newApplication: FinancingApplication = {
        id: generateFinancingApplicationId(),
        jobId,
        homeownerId,
        contractorId,
        amount: totalWithWarranty,
        monthlyPayment,
        term: 60,
        apr: 9.99,
        status: 'approved',
        hearthApplicationId: data?.applicationId || `hearth_${Date.now()}`,
        warrantyBundled: !!effectiveWarranty,
        warrantyAmount: effectiveWarranty?.price,
        referralCredit,
        createdAt: new Date(),
        approvedAt: new Date(),
      };

      setTimeout(() => {
        setApplication(newApplication);
        setStep('approved');
        setProcessing(false);
        
        toast.success('Financing Approved!', {
          description: `Your ${jobTitle} project is now financed at $${monthlyPayment}/mo`,
        });

        onFinancingApproved?.(newApplication);
      }, 2000);
    } else if (type === 'HEARTH_APPLICATION_DECLINED') {
      setStep('declined');
      setProcessing(false);
      onFinancingDeclined?.();
    } else if (type === 'HEARTH_IFRAME_CLOSED') {
      if (step === 'iframe') {
        setStep('overview');
      }
    }
  }, [jobId, homeownerId, contractorId, totalWithWarranty, monthlyPayment, effectiveWarranty, referralCredit, jobTitle, step, onFinancingApproved, onFinancingDeclined]);

  useEffect(() => {
    window.addEventListener('message', handleHearthMessage);
    return () => window.removeEventListener('message', handleHearthMessage);
  }, [handleHearthMessage]);

  const hearthIframeUrl = `https://app.gethearth.com/financing?` + new URLSearchParams({
    partner_id: 'servicehub_demo',
    job_id: jobId,
    amount: totalWithWarranty.toString(),
    job_title: jobTitle,
    warranty_included: bundleWarranty ? 'true' : 'false',
  }).toString();

  const handleSimulateApproval = () => {
    handleHearthMessage({
      origin: 'https://app.gethearth.com',
      data: {
        type: 'HEARTH_APPLICATION_APPROVED',
        data: { applicationId: `hearth_sim_${Date.now()}` },
      },
    } as MessageEvent);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Bank className="w-6 h-6 text-primary" weight="fill" />
            Instant Financing
          </DialogTitle>
          <DialogDescription>
            Finance your {jobTitle} project with easy monthly payments
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <Card className="glass-card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Project Total</h3>
                    <p className="text-sm text-muted-foreground">
                      {jobTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold font-mono text-primary">
                      ${jobTotal.toLocaleString()}
                    </div>
                  </div>
                </div>

                {bundleWarranty && effectiveWarranty && (
                  <div className="flex items-center justify-between py-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-accent" weight="fill" />
                      <span className="text-sm">{effectiveWarranty.name} ({effectiveWarranty.duration})</span>
                    </div>
                    <span className="font-mono text-sm">+${effectiveWarranty.price}</span>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Financing Total</span>
                  <span className="text-2xl font-bold font-mono">
                    ${totalWithWarranty.toLocaleString()}
                  </span>
                </div>
              </Card>

              <Card className="p-4 bg-muted/30">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="bundle-warranty"
                    checked={bundleWarranty}
                    onCheckedChange={(checked) => setBundleWarranty(!!checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="bundle-warranty" className="font-semibold cursor-pointer">
                      Bundle Warranty Protection
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add extended warranty coverage to your financing for complete peace of mind. 
                      Only ${effectiveWarranty?.price || defaultWarranty.price} more total.
                    </p>
                  </div>
                </div>

                {bundleWarranty && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {warrantyOptions.map((warranty) => (
                      <Card
                        key={warranty.id}
                        className={`p-3 cursor-pointer transition-all ${
                          (selectedWarranty?.id || defaultWarranty.id) === warranty.id
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedWarranty(warranty)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-sm">{warranty.name}</p>
                            <p className="text-xs text-muted-foreground">{warranty.duration}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            ${warranty.price}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Monthly Payment</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold font-mono">
                        ${monthlyPayment}
                      </span>
                      <span className="text-blue-200">/mo</span>
                    </div>
                    <p className="text-blue-200 text-sm mt-1">
                      60 months • 9.99% APR
                    </p>
                  </div>
                  <div className="text-right">
                    <Lightning className="w-12 h-12 text-blue-200 mb-2" weight="fill" />
                    <p className="text-sm text-blue-100">0% APR options available</p>
                  </div>
                </div>
              </Card>

              {referralCredit > 0 && (
                <Card className="p-4 border-accent/30 bg-accent/5">
                  <div className="flex items-center gap-3">
                    <CurrencyDollar className="w-8 h-8 text-accent" weight="fill" />
                    <div>
                      <p className="font-semibold text-accent">
                        ${referralCredit} Referral Credit
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Your contractor earns a credit when financing is approved
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" weight="duotone" />
                  <p className="text-xs text-muted-foreground">Flexible Terms</p>
                  <p className="font-semibold text-sm">12-84 months</p>
                </div>
                <div className="p-3">
                  <Percent className="w-6 h-6 mx-auto mb-2 text-primary" weight="duotone" />
                  <p className="text-xs text-muted-foreground">Rates From</p>
                  <p className="font-semibold text-sm">0% APR</p>
                </div>
                <div className="p-3">
                  <Lock className="w-6 h-6 mx-auto mb-2 text-primary" weight="duotone" />
                  <p className="text-xs text-muted-foreground">No Prepayment</p>
                  <p className="font-semibold text-sm">Penalties</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  size="lg"
                  onClick={handleStartFinancing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  <Bank className="w-5 h-5 mr-2" weight="fill" />
                  Continue to Financing
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'iframe' && (
            <motion.div
              key="iframe"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="p-4 bg-muted/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Secure connection to Hearth Financing</span>
                </div>
              </Card>

              <div className="relative bg-muted rounded-lg overflow-hidden" style={{ minHeight: '500px' }}>
                <iframe
                  src={hearthIframeUrl}
                  title="Hearth Financing Application"
                  className="w-full h-full absolute inset-0"
                  style={{ minHeight: '500px', border: 'none' }}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
                
                <div className="absolute inset-0 flex items-center justify-center bg-muted/90">
                  <Card className="p-8 text-center max-w-md">
                    <Bank className="w-16 h-16 mx-auto mb-4 text-primary" weight="duotone" />
                    <h3 className="text-xl font-bold mb-2">Hearth Financing Demo</h3>
                    <p className="text-muted-foreground mb-6">
                      In production, the Hearth financing application would appear here.
                      For demo purposes, click below to simulate approval.
                    </p>
                    <div className="space-y-3">
                      <Button
                        onClick={handleSimulateApproval}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" weight="fill" />
                        Simulate Approval
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setStep('overview')}
                        className="w-full"
                      >
                        Back to Overview
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-6"
              />
              <h3 className="text-xl font-bold mb-2">Processing Application</h3>
              <p className="text-muted-foreground">
                Finalizing your financing and booking your contractor...
              </p>
            </motion.div>
          )}

          {step === 'approved' && application && (
            <motion.div
              key="approved"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-12 h-12 text-white" weight="fill" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Financing Approved!</h3>
                <p className="text-muted-foreground">
                  Your project is now financed and your contractor has been booked
                </p>
              </div>

              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                    <p className="text-3xl font-bold font-mono">${application.monthlyPayment}/mo</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Financed</p>
                    <p className="text-3xl font-bold font-mono">${application.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Term</p>
                    <p className="text-lg font-semibold">{application.term} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">APR</p>
                    <p className="text-lg font-semibold">{application.apr}%</p>
                  </div>
                </div>
              </Card>

              {application.warrantyBundled && (
                <Card className="p-4 border-accent/30 bg-accent/5">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-accent" weight="fill" />
                    <div>
                      <p className="font-semibold">Warranty Included</p>
                      <p className="text-sm text-muted-foreground">
                        {effectiveWarranty?.name} - {effectiveWarranty?.duration} protection
                      </p>
                    </div>
                    <Badge className="ml-auto">${application.warrantyAmount}</Badge>
                  </div>
                </Card>
              )}

              {application.referralCredit && application.referralCredit > 0 && (
                <Card className="p-4 border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-3">
                    <CurrencyDollar className="w-8 h-8 text-primary" weight="fill" />
                    <div>
                      <p className="font-semibold">Contractor Credit Applied</p>
                      <p className="text-sm text-muted-foreground">
                        ${application.referralCredit} has been credited to your contractor&apos;s account
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <div className="space-y-3 pt-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => onOpenChange(false)}
                >
                  <CheckCircle className="w-5 h-5 mr-2" weight="fill" />
                  Done
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'declined' && (
            <motion.div
              key="declined"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <Warning className="w-12 h-12 text-destructive" weight="fill" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Application Not Approved</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Unfortunately, your financing application was not approved at this time.
                  You can still proceed with other payment options.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setStep('overview')}>
                  Try Again
                </Button>
                <Button onClick={() => onOpenChange(false)}>
                  View Other Options
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

interface FinanceButtonProps {
  jobTotal: number;
  onClick: () => void;
  className?: string;
}

export function FinanceAndBookButton({ jobTotal, onClick, className = '' }: FinanceButtonProps) {
  const monthlyPayment = calculateMonthlyPayment(jobTotal);

  return (
    <Button
      size="lg"
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 ${className}`}
    >
      <Bank className="w-5 h-5 mr-2" weight="fill" />
      FINANCE & BOOK – From ${monthlyPayment}/mo
    </Button>
  );
}
