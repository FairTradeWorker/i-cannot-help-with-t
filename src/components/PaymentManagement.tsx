import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  Money,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Bank,
  ChartLine,
} from '@phosphor-icons/react';
import type { Payment, FinanceOption } from '@/lib/types';
import { toast } from 'sonner';

interface PaymentManagementProps {
  jobId?: string;
  amount?: number;
  onPaymentComplete?: () => void;
}

export function PaymentManagement({ 
  jobId = 'demo-job-123', 
  amount = 4500, 
  onPaymentComplete 
}: PaymentManagementProps) {
  const [selectedOption, setSelectedOption] = useState<FinanceOption>('full_payment');
  const [processing, setProcessing] = useState(false);

  const financeOptions = [
    {
      id: 'full_payment' as FinanceOption,
      name: 'Full Payment',
      icon: Money,
      description: 'Pay the total amount now',
      amount: amount,
      savings: 0,
    },
    {
      id: 'installments' as FinanceOption,
      name: '3 Installments',
      icon: Calendar,
      description: 'Split into 3 monthly payments',
      amount: amount / 3,
      savings: 0,
      fee: amount * 0.02,
    },
    {
      id: 'financing' as FinanceOption,
      name: '12-Month Financing',
      icon: Bank,
      description: '0% APR for qualified customers',
      amount: amount / 12,
      savings: 0,
      apr: 0,
    },
  ];

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast.success('Payment processed successfully!');
      onPaymentComplete?.();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Payment Options</h3>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              ${amount.toLocaleString()}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {financeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;

              return (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-6 h-6 text-primary" weight="duotone" />
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-primary" weight="fill" />
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold">{option.name}</h4>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-2xl font-bold">
                          ${option.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                        {option.id !== 'full_payment' && (
                          <p className="text-xs text-muted-foreground">per payment</p>
                        )}
                        {option.fee && (
                          <p className="text-xs text-warning">
                            +${option.fee.toLocaleString()} processing fee
                          </p>
                        )}
                        {option.apr !== undefined && (
                          <p className="text-xs text-accent font-medium">{option.apr}% APR</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected Payment Method</p>
              <p className="font-semibold">
                {financeOptions.find((o) => o.id === selectedOption)?.name}
              </p>
            </div>
            <Button onClick={handlePayment} disabled={processing} size="lg">
              {processing ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" weight="duotone" />
                  Complete Payment
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-accent" weight="fill" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-warning" weight="duotone" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-destructive" weight="fill" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" weight="duotone" />;
    }
  };

  return (
    <Card className="glass-card p-6">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Payment History</h3>
        <Separator />

        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Money className="w-12 h-12 mx-auto mb-2 opacity-50" weight="duotone" />
            <p>No payments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(payment.status)}
                      <div>
                        <p className="font-medium">
                          ${payment.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                        {payment.installmentPlan && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">
                              Installment {payment.installmentPlan.paidInstallments} of{' '}
                              {payment.installmentPlan.totalInstallments}
                            </p>
                            <Progress
                              value={
                                (payment.installmentPlan.paidInstallments /
                                  payment.installmentPlan.totalInstallments) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={
                        payment.status === 'completed'
                          ? 'secondary'
                          : payment.status === 'failed'
                          ? 'destructive'
                          : 'outline'
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
