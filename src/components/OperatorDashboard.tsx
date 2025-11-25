import { motion } from 'framer-motion';
import {
  MapTrifold,
  CurrencyDollar,
  TrendUp,
  Users,
  Briefcase,
  ChartLine,
  Package,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { Territory, OperatorProfile } from '@/lib/types';

interface OperatorDashboardProps {
  operatorProfile: OperatorProfile;
  territories: Territory[];
}

export function OperatorDashboard({ operatorProfile, territories }: OperatorDashboardProps) {
  const totalMonthlyVolume = territories.reduce((sum, t) => sum + (t.stats.monthlyJobVolume || 0), 0);
  const totalMonthlyRevenue = territories.reduce((sum, t) => sum + (t.stats.monthlyRevenue || 0), 0);
  const operatorMonthlyEarnings = totalMonthlyRevenue * 0.08;
  const annualProjection = operatorMonthlyEarnings * 12;
  const roi = operatorProfile.totalInvestment > 0 
    ? ((operatorProfile.totalEarnings / operatorProfile.totalInvestment) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.177, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <MapTrifold className="w-7 h-7 text-white" weight="fill" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Operator Dashboard</h2>
            <p className="text-muted-foreground">Your territory performance and earnings</p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.177, delay: 0.044, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="glass-card p-6 glass-hover cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CurrencyDollar className="w-6 h-6 text-primary" weight="fill" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                <p className="text-2xl font-bold">${operatorMonthlyEarnings.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendUp className="w-4 h-4 text-green-600" weight="bold" />
              <span className="text-green-600 font-semibold">8% of all jobs</span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.177, delay: 0.088, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="glass-card p-6 glass-hover cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <ChartLine className="w-6 h-6 text-accent" weight="fill" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Projection</p>
                <p className="text-2xl font-bold">${annualProjection.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Based on current volume</span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.177, delay: 0.133, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="glass-card p-6 glass-hover cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <TrendUp className="w-6 h-6 text-secondary" weight="fill" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total ROI</p>
                <p className="text-2xl font-bold">{roi}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                ${operatorProfile.totalEarnings.toLocaleString()} earned
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.177, delay: 0.177, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="glass-card p-6 glass-hover cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <MapTrifold className="w-6 h-6 text-warning" weight="fill" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Territories Owned</p>
                <p className="text-2xl font-bold">{territories.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                ${operatorProfile.totalInvestment.toLocaleString()} invested
              </span>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.177, delay: 0.222, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Your Territories</h3>
          <div className="space-y-4">
            {territories.map((territory, index) => (
              <motion.div
                key={territory.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.133, delay: index * 0.044, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card className="p-6 glass-hover cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold mb-1">{territory.name}</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {territory.zipCodes.slice(0, 5).map((zip) => (
                          <Badge key={zip} variant="outline">{zip}</Badge>
                        ))}
                        {territory.zipCodes.length > 5 && (
                          <Badge variant="outline">+{territory.zipCodes.length - 5} more</Badge>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                      8% Revenue Share
                    </Badge>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">Monthly Jobs</span>
                      </div>
                      <p className="text-lg font-bold">{territory.stats.monthlyJobVolume}</p>
                      <p className="text-xs text-muted-foreground">
                        {territory.stats.totalJobs} total
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <CurrencyDollar className="w-4 h-4" />
                        <span className="text-sm">Monthly Volume</span>
                      </div>
                      <p className="text-lg font-bold">
                        ${territory.stats.monthlyRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 font-semibold">
                        ${territory.stats.operatorEarnings.toLocaleString()} to you
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Contractors</span>
                      </div>
                      <p className="text-lg font-bold">{territory.stats.activeContractors}</p>
                      <p className="text-xs text-muted-foreground">
                        {territory.generalContractors.length} GCs, {territory.subcontractors.length} Subs
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <TrendUp className="w-4 h-4" />
                        <span className="text-sm">Avg Rating</span>
                      </div>
                      <p className="text-lg font-bold">{territory.stats.averageRating.toFixed(1)}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.round(territory.stats.averageRating / 20)
                                ? 'bg-accent'
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Monthly Performance</span>
                      <span className="text-sm text-muted-foreground">
                        {((territory.stats.monthlyJobVolume / 100) * 100).toFixed(0)}% of target
                      </span>
                    </div>
                    <Progress 
                      value={(territory.stats.monthlyJobVolume / 100) * 100} 
                      className="h-2"
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.177, delay: 0.266, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">How the 3-Tier System Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                <MapTrifold className="w-7 h-7 text-white" weight="fill" />
              </div>
              <h4 className="font-bold text-lg">Operator (You)</h4>
              <p className="text-sm text-muted-foreground">
                Owns zip codes, recruits contractors, earns 8% of every job. No physical work required.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" weight="fill" />
                  <span>Approve contractors</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" weight="fill" />
                  <span>Earn 8% passive income</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" weight="fill" />
                  <span>Can sell territory later</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-3">
                <Briefcase className="w-7 h-7 text-white" weight="fill" />
              </div>
              <h4 className="font-bold text-lg">General Contractor</h4>
              <p className="text-sm text-muted-foreground">
                Takes big multi-trade jobs, hires specialists, manages projects. Keeps 100% of their earnings.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" weight="fill" />
                  <span>Manage large projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" weight="fill" />
                  <span>Hire subcontractors</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" weight="fill" />
                  <span>Pay $0 platform fees</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-warning flex items-center justify-center mb-3">
                <Users className="w-7 h-7 text-white" weight="fill" />
              </div>
              <h4 className="font-bold text-lg">Subcontractor</h4>
              <p className="text-sm text-muted-foreground">
                Specialists (plumbers, electricians, roofers). Take direct jobs or work for GCs. Keep 100%.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                  <span>Direct homeowner jobs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                  <span>Get hired by GCs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                  <span>Pay $0 platform fees</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
