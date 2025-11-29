/**
 * Enhanced Analytics Dashboard Component
 * 
 * Comprehensive analytics dashboard with interactive charts,
 * filters, date ranges, and export functionality.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Briefcase,
  CurrencyDollar,
  TrendUp,
  TrendDown,
  ChartBar,
  MapPin,
  Download,
  Printer,
  CalendarBlank,
  Funnel,
  ArrowRight,
} from '@phosphor-icons/react';
import type { Analytics } from '@/lib/types';

// ============================================================================
// Types
// ============================================================================

interface AnalyticsDashboardEnhancedProps {
  analytics: Analytics;
}

type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';
type ViewType = 'overview' | 'jobs' | 'contractors' | 'territories' | 'revenue';

// ============================================================================
// Mock Data for Charts
// ============================================================================

const revenueData = [
  { month: 'Jan', revenue: 125000, jobs: 180, contractors: 45 },
  { month: 'Feb', revenue: 148000, jobs: 210, contractors: 52 },
  { month: 'Mar', revenue: 165000, jobs: 245, contractors: 58 },
  { month: 'Apr', revenue: 178000, jobs: 260, contractors: 62 },
  { month: 'May', revenue: 195000, jobs: 285, contractors: 68 },
  { month: 'Jun', revenue: 215000, jobs: 310, contractors: 75 },
  { month: 'Jul', revenue: 232000, jobs: 335, contractors: 82 },
  { month: 'Aug', revenue: 248000, jobs: 355, contractors: 88 },
  { month: 'Sep', revenue: 262000, jobs: 375, contractors: 92 },
  { month: 'Oct', revenue: 285000, jobs: 398, contractors: 98 },
  { month: 'Nov', revenue: 312000, jobs: 425, contractors: 105 },
  { month: 'Dec', revenue: 342000, jobs: 455, contractors: 112 },
];

const jobsByCategory = [
  { name: 'Plumbing', value: 2450, color: '#0ea5e9' },
  { name: 'Electrical', value: 1890, color: '#8b5cf6' },
  { name: 'HVAC', value: 1650, color: '#22c55e' },
  { name: 'Roofing', value: 1420, color: '#f59e0b' },
  { name: 'Painting', value: 1280, color: '#ef4444' },
  { name: 'Other', value: 2810, color: '#6b7280' },
];

const userGrowthData = [
  { date: 'Week 1', homeowners: 150, contractors: 45, operators: 5 },
  { date: 'Week 2', homeowners: 280, contractors: 82, operators: 8 },
  { date: 'Week 3', homeowners: 420, contractors: 125, operators: 12 },
  { date: 'Week 4', homeowners: 580, contractors: 168, operators: 18 },
  { date: 'Week 5', homeowners: 750, contractors: 215, operators: 24 },
  { date: 'Week 6', homeowners: 920, contractors: 265, operators: 32 },
  { date: 'Week 7', homeowners: 1150, contractors: 320, operators: 40 },
  { date: 'Week 8', homeowners: 1380, contractors: 380, operators: 48 },
];

const territoriesData = [
  { state: 'Texas', claimed: 85, available: 120, revenue: 450000 },
  { state: 'California', claimed: 72, available: 180, revenue: 620000 },
  { state: 'Florida', claimed: 65, available: 95, revenue: 380000 },
  { state: 'New York', claimed: 58, available: 85, revenue: 520000 },
  { state: 'Arizona', claimed: 42, available: 65, revenue: 280000 },
];

// ============================================================================
// Component
// ============================================================================

export function AnalyticsDashboardEnhanced({ analytics }: AnalyticsDashboardEnhancedProps) {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [viewType, setViewType] = useState<ViewType>('overview');

  // Calculate trend percentages
  const trends = useMemo(() => ({
    users: { value: 12.5, up: true },
    contractors: { value: 8.3, up: true },
    jobs: { value: 15.7, up: true },
    revenue: { value: 23.4, up: true },
  }), []);

  const stats = [
    {
      label: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: trends.users,
    },
    {
      label: 'Active Contractors',
      value: analytics.totalContractors.toLocaleString(),
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      trend: trends.contractors,
    },
    {
      label: 'Total Jobs',
      value: analytics.totalJobs.toLocaleString(),
      icon: Briefcase,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: trends.jobs,
    },
    {
      label: 'Total Revenue',
      value: `$${(analytics.totalRevenue / 1000000).toFixed(2)}M`,
      icon: CurrencyDollar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: trends.revenue,
    },
  ];

  const handleExport = (format: 'csv' | 'pdf') => {
    // In production, this would generate and download the file
    alert(`Exporting analytics as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[140px]">
              <CalendarBlank className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Printer className="w-4 h-4 mr-2" />
            PDF
          </Button>
          
          <Badge variant="secondary" className="text-sm px-4 py-2">
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend.up ? TrendUp : TrendDown;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
                <Card className="glass-card border-0 bg-transparent">
                  <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} weight="duotone" />
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendIcon
                          className={`w-4 h-4 ${
                            stat.trend.up ? 'text-accent' : 'text-destructive'
                          }`}
                          weight="bold"
                        />
                        <span
                          className={`text-sm font-medium ${
                            stat.trend.up ? 'text-accent' : 'text-destructive'
                          }`}
                        >
                          {stat.trend.up ? '+' : '-'}{stat.trend.value}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts Area */}
      <Tabs value={viewType} onValueChange={(v) => setViewType(v as ViewType)}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
          <TabsTrigger value="territories">Territories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card className="glass-card border-0 bg-transparent">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CurrencyDollar className="w-5 h-5 text-primary" weight="duotone" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} 
                      tick={{ fontSize: 12 }} 
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.9)', 
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Jobs by Category */}
            <Card className="glass-card border-0 bg-transparent">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="w-5 h-5 text-secondary" weight="duotone" />
                  Jobs by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={jobsByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {jobsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [value.toLocaleString(), 'Jobs']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.9)', 
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* User Growth */}
          <Card className="glass-card border-0 bg-transparent">
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" weight="duotone" />
                User Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="homeowners" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2 }}
                    name="Homeowners"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="contractors" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', strokeWidth: 2 }}
                    name="Contractors"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="operators" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                    name="Operators"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="glass-card border-0 bg-transparent">
              <CardHeader>
              <CardTitle>Monthly Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis 
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} 
                    tick={{ fontSize: 12 }} 
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-0 bg-transparent">
                <CardHeader>
                <CardTitle>Jobs Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.9)', 
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="jobs"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorJobs)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 bg-transparent">
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jobsByCategory} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.9)', 
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {jobsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contractors" className="space-y-6">
          <Card className="glass-card border-0 bg-transparent">
              <CardHeader>
              <CardTitle>Contractor Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorContractors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="contractors"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorContractors)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="territories" className="space-y-6">
          <Card className="glass-card border-0 bg-transparent">
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" weight="duotone" />
                Territory Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">State</th>
                      <th className="text-center p-4 font-semibold">Claimed</th>
                      <th className="text-center p-4 font-semibold">Available</th>
                      <th className="text-right p-4 font-semibold">Revenue</th>
                      <th className="text-right p-4 font-semibold">Claim Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {territoriesData.map((territory) => {
                      const claimRate = Math.round(
                        (territory.claimed / (territory.claimed + territory.available)) * 100
                      );
                      return (
                        <tr key={territory.state} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{territory.state}</td>
                          <td className="p-4 text-center">
                            <Badge variant="secondary">{territory.claimed}</Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline">{territory.available}</Badge>
                          </td>
                          <td className="p-4 text-right font-semibold">
                            ${territory.revenue.toLocaleString()}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${claimRate}%` }}
                                />
                              </div>
                              <span className="text-sm">{claimRate}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6 border-0 bg-transparent">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-3xl font-bold">
              {analytics.totalJobs > 0 ? ((analytics.completedJobs / analytics.totalJobs) * 100).toFixed(1) : '0.0'}%
            </p>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all"
                style={{ width: `${analytics.totalJobs > 0 ? (analytics.completedJobs / analytics.totalJobs) * 100 : 0}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 border-0 bg-transparent">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Job Value</p>
              <p className="text-3xl font-bold">
                ${analytics.averageJobValue.toLocaleString()}
              </p>
              <p className="text-sm text-accent">+18% from last month</p>
            </div>
          </Card>

        <Card className="glass-card p-6 border-0 bg-transparent">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">AI Accuracy</p>
            <p className="text-3xl font-bold">
              {(analytics.platformAccuracy * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Self-learning: {analytics.learningMetrics.totalPredictions.toLocaleString()} predictions
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsDashboardEnhanced;
