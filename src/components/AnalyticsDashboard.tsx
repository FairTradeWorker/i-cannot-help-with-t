import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Briefcase,
  CurrencyDollar,
  TrendUp,
  TrendDown,
  ChartBar,
  MapPin,
  Star,
} from '@phosphor-icons/react';
import type { Analytics } from '@/lib/types';

interface AnalyticsDashboardProps {
  analytics: Analytics;
}

export function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  const stats = [
    {
      label: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      label: 'Active Contractors',
      value: analytics.totalContractors.toLocaleString(),
      icon: Star,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      trend: '+8.3%',
      trendUp: true,
    },
    {
      label: 'Total Jobs',
      value: analytics.totalJobs.toLocaleString(),
      icon: Briefcase,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: '+15.7%',
      trendUp: true,
    },
    {
      label: 'Total Revenue',
      value: `$${(analytics.totalRevenue / 1000000).toFixed(2)}M`,
      icon: CurrencyDollar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+23.4%',
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          Last updated: {new Date().toLocaleDateString()}
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? TrendUp : TrendDown;

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
                    <div className="flex items-center gap-1">
                      <TrendIcon
                        className={`w-4 h-4 ${
                          stat.trendUp ? 'text-accent' : 'text-destructive'
                        }`}
                        weight="bold"
                      />
                      <span
                        className={`text-sm font-medium ${
                          stat.trendUp ? 'text-accent' : 'text-destructive'
                        }`}
                      >
                        {stat.trend}
                      </span>
                    </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" weight="duotone" />
                <h3 className="text-xl font-bold">Top States by Jobs</h3>
              </div>

              <div className="space-y-3">
                {analytics.topStates.map((state, index) => (
                  <div key={state.state} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{state.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(state.jobs / analytics.topStates[0].jobs) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-16 text-right">
                        {state.jobs.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ChartBar className="w-5 h-5 text-secondary" weight="duotone" />
                <h3 className="text-xl font-bold">Top Services</h3>
              </div>

              <div className="space-y-3">
                {analytics.topServices.map((service, index) => (
                  <div key={service.service} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{service.service}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full"
                          style={{
                            width: `${(service.count / analytics.topServices[0].count) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-16 text-right">
                        {service.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CurrencyDollar className="w-5 h-5 text-accent" weight="duotone" />
              <h3 className="text-xl font-bold">Revenue by Month</h3>
            </div>

            <div className="space-y-2">
              {analytics.revenueByMonth.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="font-medium w-24">{month.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-accent h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (month.revenue / Math.max(...analytics.revenueByMonth.map((m) => m.revenue))) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold w-24 text-right">
                    ${(month.revenue / 1000).toFixed(1)}K
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-3xl font-bold">
              {((analytics.completedJobs / analytics.totalJobs) * 100).toFixed(1)}%
            </p>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full"
                style={{ width: `${(analytics.completedJobs / analytics.totalJobs) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average Job Value</p>
            <p className="text-3xl font-bold">
              ${analytics.averageJobValue.toLocaleString()}
            </p>
            <p className="text-sm text-accent">+18% from last month</p>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Homeowner to Contractor Ratio</p>
            <p className="text-3xl font-bold">
              {(analytics.totalHomeowners / analytics.totalContractors).toFixed(1)}:1
            </p>
            <p className="text-sm text-muted-foreground">
              {analytics.totalHomeowners.toLocaleString()} homeowners
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
