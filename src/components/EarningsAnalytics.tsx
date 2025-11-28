// Earnings Analytics Dashboard - Financial insights for contractors
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollar,
  TrendUp,
  TrendDown,
  Calendar,
  Briefcase,
  ChartLine,
  ChartBar,
  Wallet,
  ArrowRight,
  CaretDown,
  Download,
  Clock,
  CheckCircle,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EarningsData {
  period: string;
  revenue: number;
  jobs: number;
  avgJobValue: number;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'payout';
  description: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'processing';
  jobTitle?: string;
}

// Sample data
const monthlyEarnings: EarningsData[] = [
  { period: 'Jan', revenue: 12500, jobs: 8, avgJobValue: 1562 },
  { period: 'Feb', revenue: 15200, jobs: 10, avgJobValue: 1520 },
  { period: 'Mar', revenue: 18900, jobs: 12, avgJobValue: 1575 },
  { period: 'Apr', revenue: 14300, jobs: 9, avgJobValue: 1589 },
  { period: 'May', revenue: 21500, jobs: 14, avgJobValue: 1536 },
  { period: 'Jun', revenue: 24800, jobs: 16, avgJobValue: 1550 },
  { period: 'Jul', revenue: 22100, jobs: 13, avgJobValue: 1700 },
  { period: 'Aug', revenue: 28400, jobs: 18, avgJobValue: 1578 },
  { period: 'Sep', revenue: 25600, jobs: 15, avgJobValue: 1707 },
  { period: 'Oct', revenue: 30200, jobs: 19, avgJobValue: 1589 },
  { period: 'Nov', revenue: 27800, jobs: 17, avgJobValue: 1635 },
  { period: 'Dec', revenue: 32500, jobs: 20, avgJobValue: 1625 },
];

const recentTransactions: Transaction[] = [
  {
    id: 't1',
    type: 'income',
    description: 'Milestone payment received',
    amount: 3500,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'completed',
    jobTitle: 'Kitchen Remodel - Smith Residence',
  },
  {
    id: 't2',
    type: 'payout',
    description: 'Weekly payout to bank',
    amount: 8500,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
  {
    id: 't3',
    type: 'income',
    description: 'Project completion payment',
    amount: 5200,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'completed',
    jobTitle: 'Roof Repair - Johnson Home',
  },
  {
    id: 't4',
    type: 'income',
    description: 'Milestone payment pending',
    amount: 2800,
    date: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: 'pending',
    jobTitle: 'HVAC Installation - Office Building',
  },
  {
    id: 't5',
    type: 'payout',
    description: 'Payout processing',
    amount: 4200,
    date: new Date(),
    status: 'processing',
  },
];

const earningsByCategory = [
  { category: 'Roofing', amount: 45200, percentage: 35 },
  { category: 'HVAC', amount: 32100, percentage: 25 },
  { category: 'Plumbing', amount: 25800, percentage: 20 },
  { category: 'Electrical', amount: 15500, percentage: 12 },
  { category: 'General', amount: 10400, percentage: 8 },
];

interface EarningsAnalyticsProps {
  userId?: string;
}

export function EarningsAnalytics({ userId }: EarningsAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('year');
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate totals
  const totalRevenue = monthlyEarnings.reduce((sum, m) => sum + m.revenue, 0);
  const totalJobs = monthlyEarnings.reduce((sum, m) => sum + m.jobs, 0);
  const avgJobValue = totalRevenue / totalJobs;
  
  // Calculate current month vs previous
  const currentMonth = monthlyEarnings[monthlyEarnings.length - 1];
  const previousMonth = monthlyEarnings[monthlyEarnings.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;

  // Available balance
  const availableBalance = 12450;
  const pendingBalance = 2800;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return <TrendUp className="w-4 h-4 text-green-500" />;
      case 'payout':
        return <Wallet className="w-4 h-4 text-blue-500" />;
      case 'expense':
        return <TrendDown className="w-4 h-4 text-red-500" />;
    }
  };

  // Simple bar chart renderer
  const maxRevenue = Math.max(...monthlyEarnings.map(e => e.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Earnings Analytics</h1>
          <p className="text-muted-foreground">Track your income and financial performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Balance Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm opacity-90">Available Balance</span>
            </div>
            <p className="text-3xl font-bold">${availableBalance.toLocaleString()}</p>
            <Button variant="secondary" size="sm" className="mt-4">
              Withdraw Funds
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Pending</span>
            </div>
            <p className="text-3xl font-bold">${pendingBalance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Processing payouts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <ChartLine className="w-5 h-5" />
              <span className="text-sm">This Month</span>
            </div>
            <p className="text-3xl font-bold">${currentMonth.revenue.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1">
              {revenueGrowth >= 0 ? (
                <TrendUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Briefcase className="w-5 h-5" />
              <span className="text-sm">Avg Job Value</span>
            </div>
            <p className="text-3xl font-bold">${Math.round(avgJobValue).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{totalJobs} jobs completed</p>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Revenue Chart */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="w-5 h-5" />
                  Revenue Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-2">
                  {monthlyEarnings.map((data, index) => (
                    <div key={data.period} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.revenue / maxRevenue) * 200}px` }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        className="w-full bg-primary rounded-t-sm hover:bg-primary/80 cursor-pointer transition-colors relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${data.revenue.toLocaleString()}
                        </div>
                      </motion.div>
                      <span className="text-xs text-muted-foreground mt-2">{data.period}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">Total Revenue (YTD)</h4>
                  <p className="text-4xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
                  <p className="text-sm text-muted-foreground mt-2">{totalJobs} jobs completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">Best Month</h4>
                  <p className="text-4xl font-bold text-accent">
                    {formatCurrency(Math.max(...monthlyEarnings.map(m => m.revenue)))}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {monthlyEarnings.find(m => m.revenue === Math.max(...monthlyEarnings.map(e => e.revenue)))?.period}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">Monthly Average</h4>
                  <p className="text-4xl font-bold text-secondary">
                    {formatCurrency(totalRevenue / 12)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">per month</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' :
                          transaction.type === 'payout' ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          {transaction.jobTitle && (
                            <p className="text-sm text-muted-foreground">{transaction.jobTitle}</p>
                          )}
                          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          transaction.type === 'income' ? 'text-green-600' :
                          transaction.type === 'payout' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </p>
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' : 'outline'
                        }>
                          {transaction.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {transaction.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsByCategory.map((cat, index) => (
                    <motion.div
                      key={cat.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{cat.category}</span>
                        <span className="text-sm text-muted-foreground">{formatCurrency(cat.amount)}</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percentage}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{cat.percentage}% of total</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jobs Completed by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyEarnings.slice(-6).map((data, index) => (
                    <motion.div
                      key={data.period}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{data.period} 2024</p>
                          <p className="text-sm text-muted-foreground">{data.jobs} jobs</p>
                        </div>
                      </div>
                      <p className="font-bold">${data.revenue.toLocaleString()}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
