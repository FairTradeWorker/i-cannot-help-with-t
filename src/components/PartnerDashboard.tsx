import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Handshake,
  CurrencyDollar,
  TrendUp,
  Users,
  Briefcase,
  ChartLine,
  Bank,
  Percent,
} from '@phosphor-icons/react';

export function PartnerDashboard() {
  const stats = [
    {
      label: 'Partnership Revenue',
      value: '$248,500',
      icon: CurrencyDollar,
      trend: '+18.2%',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Active Partnerships',
      value: '24',
      icon: Handshake,
      trend: '+3',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Referral Commission',
      value: '$12,450',
      icon: Percent,
      trend: '+12.5%',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  const partnerships = [
    {
      name: 'ABC Home Improvement',
      type: 'Preferred Contractor',
      revenue: '$45,200',
      commission: '15%',
      status: 'active',
    },
    {
      name: 'XYZ Landscaping Co.',
      type: 'Premium Partner',
      revenue: '$32,100',
      commission: '20%',
      status: 'active',
    },
    {
      name: 'Elite Roofing Services',
      type: 'Standard Partner',
      revenue: '$28,900',
      commission: '10%',
      status: 'active',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Handshake className="w-6 h-6 text-primary" weight="duotone" />
          <h2 className="text-3xl font-bold">Partner Dashboard</h2>
        </div>
        <p className="text-muted-foreground">
          Manage partnerships and track commission earnings
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} weight="duotone" />
                    </div>
                    <Badge variant="secondary">{stat.trend}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Active Partnerships</h3>
            <Button>
              <Handshake className="w-5 h-5 mr-2" weight="duotone" />
              New Partnership
            </Button>
          </div>
          <Separator />

          <div className="space-y-3">
            {partnerships.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{partner.name}</h4>
                      <p className="text-sm text-muted-foreground">{partner.type}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-semibold">{partner.revenue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Commission</p>
                        <p className="font-semibold">{partner.commission}</p>
                      </div>
                      <Badge variant="secondary">{partner.status}</Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChartLine className="w-5 h-5 text-primary" weight="duotone" />
              <h3 className="text-xl font-bold">Commission Breakdown</h3>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Contractor Referrals</span>
                <span className="font-semibold">$8,200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Premium Partnerships</span>
                <span className="font-semibold">$3,150</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Standard Partnerships</span>
                <span className="font-semibold">$1,100</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Commission</span>
                <span className="text-xl font-bold text-accent">$12,450</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bank className="w-5 h-5 text-secondary" weight="duotone" />
              <h3 className="text-xl font-bold">Finance Options</h3>
            </div>
            <Separator />
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CurrencyDollar className="w-5 h-5 mr-2" weight="duotone" />
                Request Payout
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ChartLine className="w-5 h-5 mr-2" weight="duotone" />
                View Payment History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Percent className="w-5 h-5 mr-2" weight="duotone" />
                Commission Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
