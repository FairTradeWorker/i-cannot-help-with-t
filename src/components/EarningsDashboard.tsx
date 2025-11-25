import { useState } from 'react';
import { CurrencyDollar, ArrowCircleDown, Clock, CheckCircle, Lightbulb } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { dataStore } from '@/lib/store';
import type { Earnings, User, Payout } from '@/lib/types';

interface EarningsDashboardProps {
  earnings: Earnings | null;
  user: User;
  onUpdate: () => void;
}

export function EarningsDashboard({ earnings, user, onUpdate }: EarningsDashboardProps) {
  const [requestingPayout, setRequestingPayout] = useState(false);

  if (!earnings) {
    return (
      <Card className="p-8 text-center">
        <CurrencyDollar className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
        <h4 className="text-lg font-semibold mb-2">No Earnings Yet</h4>
        <p className="text-muted-foreground">Complete jobs to start earning</p>
      </Card>
    );
  }

  const handleRequestPayout = async (method: 'instant' | 'standard') => {
    if (earnings.availableBalance <= 0) {
      toast.error('No available balance to cash out');
      return;
    }

    setRequestingPayout(true);
    try {
      const fee = method === 'instant' ? earnings.availableBalance * 0.015 : 0;
      const amount = earnings.availableBalance - fee;

      const payout: Payout = {
        id: 'payout-' + Date.now(),
        amount,
        method,
        fee,
        status: 'processing',
        requestedAt: new Date()
      };

      const updatedEarnings = {
        ...earnings,
        availableBalance: 0,
        payouts: [...earnings.payouts, payout]
      };

      await dataStore.updateEarnings(updatedEarnings);
      
      toast.success(`Payout of $${amount.toLocaleString()} ${method === 'instant' ? 'will arrive in 24 hours' : 'will arrive in 3 business days'}`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to request payout');
    } finally {
      setRequestingPayout(false);
    }
  };

  const pendingJobs = earnings.jobs.filter(j => j.status === 'pending');
  const availableJobs = earnings.jobs.filter(j => j.status === 'available');
  const paidOutJobs = earnings.jobs.filter(j => j.status === 'paid_out');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-primary/10 border-2 border-primary/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <CurrencyDollar className="w-4 h-4" weight="bold" />
            <span>Total Earnings</span>
          </div>
          <p className="text-4xl font-bold text-primary font-mono">
            ${earnings.totalEarnings.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 bg-accent/10 border-2 border-accent/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <CheckCircle className="w-4 h-4" weight="bold" />
            <span>Available Balance</span>
          </div>
          <p className="text-4xl font-bold text-accent font-mono">
            ${earnings.availableBalance.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4" weight="bold" />
            <span>Pending</span>
          </div>
          <p className="text-4xl font-bold text-muted-foreground font-mono">
            ${earnings.pendingBalance.toLocaleString()}
          </p>
        </Card>
      </div>

      {earnings.availableBalance > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cash Out Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold mb-1">Instant Payout</h4>
                  <p className="text-sm text-muted-foreground">Receive funds in 24 hours</p>
                </div>
                <Badge variant="secondary">1.5% fee</Badge>
              </div>
              <Separator className="my-3" />
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-mono">${earnings.availableBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee (1.5%)</span>
                  <span className="font-mono text-destructive">-${(earnings.availableBalance * 0.015).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>You receive</span>
                  <span className="font-mono">${(earnings.availableBalance - earnings.availableBalance * 0.015).toLocaleString()}</span>
                </div>
              </div>
              <Button 
                onClick={() => handleRequestPayout('instant')}
                disabled={requestingPayout}
                className="w-full"
              >
                <ArrowCircleDown className="w-4 h-4 mr-2" weight="fill" />
                Cash Out Now
              </Button>
            </Card>

            <Card className="p-4 hover:border-accent/50 transition-colors cursor-pointer bg-accent/5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold mb-1">Standard Payout</h4>
                  <p className="text-sm text-muted-foreground">Receive funds in 3 business days</p>
                </div>
                <Badge className="bg-accent text-accent-foreground">Free</Badge>
              </div>
              <Separator className="my-3" />
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-mono">${earnings.availableBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-mono text-accent">$0</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>You receive</span>
                  <span className="font-mono">${earnings.availableBalance.toLocaleString()}</span>
                </div>
              </div>
              <Button 
                onClick={() => handleRequestPayout('standard')}
                disabled={requestingPayout}
                variant="outline"
                className="w-full"
              >
                <ArrowCircleDown className="w-4 h-4 mr-2" weight="fill" />
                Schedule Payout
              </Button>
            </Card>
          </div>

          <Alert>
            <Lightbulb className="w-4 h-4" weight="fill" />
            <AlertDescription>
              <span className="font-semibold">Pro Tip:</span> Wait for the free standard payout to save on fees. Platform sets aside 25-30% for quarterly taxes automatically.
            </AlertDescription>
          </Alert>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Earnings History</h3>
        
        {earnings.jobs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No earnings history yet</p>
        ) : (
          <div className="space-y-3">
            {earnings.jobs.map(job => (
              <div key={job.jobId} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{job.jobTitle}</h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{new Date(job.completedAt).toLocaleDateString()}</span>
                    <Badge variant={
                      job.status === 'paid_out' ? 'default' :
                      job.status === 'available' ? 'secondary' :
                      'outline'
                    }>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold font-mono">${job.netAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    Fee: ${job.platformFee.toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {earnings.payouts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payout History</h3>
          
          <div className="space-y-3">
            {earnings.payouts.map(payout => (
              <div key={payout.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={payout.method === 'instant' ? 'default' : 'secondary'}>
                      {payout.method} payout
                    </Badge>
                    <Badge variant={
                      payout.status === 'completed' ? 'default' :
                      payout.status === 'processing' ? 'secondary' :
                      payout.status === 'failed' ? 'destructive' :
                      'outline'
                    }>
                      {payout.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Requested {new Date(payout.requestedAt).toLocaleDateString()}
                    {payout.completedAt && ` • Completed ${new Date(payout.completedAt).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold font-mono">${payout.amount.toLocaleString()}</p>
                  {payout.fee > 0 && (
                    <p className="text-sm text-muted-foreground">Fee: ${payout.fee.toFixed(2)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
