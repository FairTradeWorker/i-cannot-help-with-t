import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Share,
  Copy,
  Users,
  CurrencyDollar,
  CheckCircle,
  Clock,
  Gift,
  QrCode,
} from '@phosphor-icons/react';
import type { Referral } from '@/lib/types';
import { toast } from 'sonner';

interface ReferralSystemProps {
  userId: string;
  referrals: Referral[];
}

export function ReferralSystem({ userId, referrals }: ReferralSystemProps) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const referralCode = `SH-${userId.slice(0, 8).toUpperCase()}`;
  const referralLink = `https://servicehub.app/join?ref=${referralCode}`;

  const totalEarnings = referrals
    .filter((r) => r.status === 'rewarded')
    .reduce((sum, r) => sum + r.reward, 0);

  const pendingEarnings = referrals
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + r.reward, 0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const handleSendInvite = async () => {
    if (!email.trim() || sending) return;

    setSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Invitation sent to ${email}!`);
      setEmail('');
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setSending(false);
    }
  };

  const stats = [
    {
      label: 'Total Referrals',
      value: referrals.length,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Earnings',
      value: `$${totalEarnings.toLocaleString()}`,
      icon: CurrencyDollar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Pending Rewards',
      value: `$${pendingEarnings.toLocaleString()}`,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-6 h-6 text-primary" weight="duotone" />
          <h2 className="text-3xl font-bold">Referral Program</h2>
        </div>
        <p className="text-muted-foreground">
          Earn rewards by inviting friends and contractors to ServiceHub
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} weight="duotone" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Your Referral Code</h3>
              <p className="text-sm text-muted-foreground">
                Share this code with friends to earn $50 for each successful referral
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input value={referralCode} readOnly className="font-mono text-lg" />
                </div>
                <Button onClick={handleCopyLink} variant="secondary">
                  <Copy className="w-5 h-5 mr-2" weight="duotone" />
                  Copy Code
                </Button>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <Input value={referralLink} readOnly className="text-sm" />
                </div>
                <Button onClick={handleCopyLink}>
                  <Share className="w-5 h-5 mr-2" weight="duotone" />
                  Copy Link
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Send Invitation by Email</h4>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={sending}
                />
                <Button onClick={handleSendInvite} disabled={!email.trim() || sending}>
                  {sending ? 'Sending...' : 'Send Invite'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Referral History</h3>
            <Separator />

            {referrals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" weight="duotone" />
                <p>No referrals yet</p>
                <p className="text-sm">Start inviting friends to earn rewards!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <motion.div
                    key={referral.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {referral.status === 'rewarded' ? (
                            <CheckCircle className="w-5 h-5 text-accent" weight="fill" />
                          ) : referral.status === 'completed' ? (
                            <Clock className="w-5 h-5 text-warning" weight="duotone" />
                          ) : (
                            <Clock className="w-5 h-5 text-muted-foreground" weight="duotone" />
                          )}
                          <div>
                            <p className="font-medium">
                              Referral #{referral.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(referral.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${referral.reward.toLocaleString()}
                          </p>
                          <Badge
                            variant={
                              referral.status === 'rewarded'
                                ? 'secondary'
                                : referral.status === 'completed'
                                ? 'outline'
                                : 'default'
                            }
                          >
                            {referral.status}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <Card className="glass-card p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="space-y-3">
          <h3 className="text-xl font-bold">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="w-8 h-8 flex items-center justify-center">1</Badge>
                <h4 className="font-semibold">Share Your Code</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Send your unique referral code or link to friends
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="w-8 h-8 flex items-center justify-center">2</Badge>
                <h4 className="font-semibold">They Sign Up</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Your friend creates an account using your code
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="w-8 h-8 flex items-center justify-center">3</Badge>
                <h4 className="font-semibold">Earn Rewards</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Get $50 when they complete their first job
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
