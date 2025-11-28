import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapTrifold,
  TrendUp,
  TrendDown,
  Users,
  Briefcase,
  CurrencyDollar,
  Lightning,
  ChartLine,
  ChartBar,
  ChartPie,
  Calendar,
  ArrowRight,
  Eye,
  Target,
  Medal,
  Flame,
  Star,
} from '@phosphor-icons/react';

interface TerritoryMetric {
  id: string;
  zipCode: string;
  city: string;
  state: string;
  metrics: {
    activeJobs: number;
    completedJobs: number;
    activeContractors: number;
    avgJobValue: number;
    monthlyRevenue: number;
    conversionRate: number;
    growthRate: number;
  };
  ranking: number;
  trend: 'up' | 'down' | 'stable';
}

const sampleTerritories: TerritoryMetric[] = [
  {
    id: 'T1',
    zipCode: '75001',
    city: 'Dallas',
    state: 'TX',
    metrics: { activeJobs: 45, completedJobs: 234, activeContractors: 28, avgJobValue: 8500, monthlyRevenue: 125000, conversionRate: 78, growthRate: 12 },
    ranking: 1,
    trend: 'up',
  },
  {
    id: 'T2',
    zipCode: '85001',
    city: 'Phoenix',
    state: 'AZ',
    metrics: { activeJobs: 38, completedJobs: 189, activeContractors: 22, avgJobValue: 7200, monthlyRevenue: 98000, conversionRate: 72, growthRate: 8 },
    ranking: 2,
    trend: 'up',
  },
  {
    id: 'T3',
    zipCode: '43001',
    city: 'Columbus',
    state: 'OH',
    metrics: { activeJobs: 32, completedJobs: 156, activeContractors: 18, avgJobValue: 6800, monthlyRevenue: 76000, conversionRate: 68, growthRate: -2 },
    ranking: 3,
    trend: 'down',
  },
];

export function TerritoryAnalytics() {
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryMetric | null>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const overallStats = {
    totalTerritories: 1662,
    activeTerritories: 279,
    totalJobs: 2847,
    totalRevenue: 4250000,
    avgConversion: 71,
    topGrowth: 'TX',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ChartLine className="w-6 h-6 text-blue-600" weight="fill" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Territory Analytics</h1>
              <p className="text-gray-500">Performance insights across all territories</p>
            </div>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(tf)}
              >
                {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : tf === '90d' ? '90 Days' : '1 Year'}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MapTrifold className="w-8 h-8 text-blue-600" weight="fill" />
                <div>
                  <p className="text-2xl font-bold">{overallStats.totalTerritories.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Territories</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Lightning className="w-8 h-8 text-green-600" weight="fill" />
                <div>
                  <p className="text-2xl font-bold">{overallStats.activeTerritories}</p>
                  <p className="text-sm text-gray-500">Active Territories</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-purple-600" weight="fill" />
                <div>
                  <p className="text-2xl font-bold">{overallStats.totalJobs.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CurrencyDollar className="w-8 h-8 text-emerald-600" weight="fill" />
                <div>
                  <p className="text-2xl font-bold">${(overallStats.totalRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-orange-600" weight="fill" />
                <div>
                  <p className="text-2xl font-bold">{overallStats.avgConversion}%</p>
                  <p className="text-sm text-gray-500">Avg Conversion</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-red-600" weight="fill" />
                <div>
                  <p className="text-2xl font-bold">{overallStats.topGrowth}</p>
                  <p className="text-sm text-gray-500">Top Growth State</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Top Territories */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Medal className="w-5 h-5 text-yellow-600" weight="fill" />
                      Top Performing Territories
                    </CardTitle>
                    <CardDescription>Ranked by monthly revenue</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleTerritories.map((territory, index) => (
                    <div
                      key={territory.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setSelectedTerritory(territory)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-200 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        #{territory.ranking}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{territory.city}, {territory.state}</span>
                          <Badge variant="outline">{territory.zipCode}</Badge>
                          {territory.trend === 'up' ? (
                            <Badge className="bg-green-100 text-green-800">
                              <TrendUp className="w-3 h-3 mr-1" />
                              +{territory.metrics.growthRate}%
                            </Badge>
                          ) : territory.trend === 'down' ? (
                            <Badge className="bg-red-100 text-red-800">
                              <TrendDown className="w-3 h-3 mr-1" />
                              {territory.metrics.growthRate}%
                            </Badge>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span><Briefcase className="w-4 h-4 inline mr-1" />{territory.metrics.activeJobs} active jobs</span>
                          <span><Users className="w-4 h-4 inline mr-1" />{territory.metrics.activeContractors} contractors</span>
                          <span><Target className="w-4 h-4 inline mr-1" />{territory.metrics.conversionRate}% conversion</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${(territory.metrics.monthlyRevenue / 1000).toFixed(0)}K</p>
                        <p className="text-sm text-gray-500">monthly revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Chart Placeholder */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="w-5 h-5 text-blue-600" />
                  Revenue by State
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <ChartBar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Revenue visualization</p>
                    <p className="text-sm text-gray-400">Data updates in real-time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="default">
                  <Eye className="w-4 h-4 mr-2" />
                  View All Territories
                </Button>
                <Button className="w-full" variant="outline">
                  <ChartPie className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Review
                </Button>
              </CardContent>
            </Card>

            {/* State Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChartPie className="w-5 h-5 text-purple-600" />
                  State Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { state: 'Texas', count: 92, pct: 33 },
                    { state: 'Ohio', count: 66, pct: 24 },
                    { state: 'Arizona', count: 46, pct: 16 },
                    { state: 'Georgia', count: 38, pct: 14 },
                    { state: 'Others', count: 37, pct: 13 },
                  ].map((item) => (
                    <div key={item.state}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.state}</span>
                        <span className="text-sm text-gray-500">{item.count} territories</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'New territory claimed', location: 'Houston, TX', time: '2h ago', type: 'claim' },
                    { action: 'Job completed', location: 'Phoenix, AZ', time: '4h ago', type: 'job' },
                    { action: 'Contractor joined', location: 'Columbus, OH', time: '6h ago', type: 'user' },
                    { action: 'Payment received', location: 'Dallas, TX', time: '8h ago', type: 'payment' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'claim' ? 'bg-blue-100' :
                        activity.type === 'job' ? 'bg-green-100' :
                        activity.type === 'user' ? 'bg-purple-100' :
                        'bg-emerald-100'
                      }`}>
                        {activity.type === 'claim' ? <MapTrifold className="w-4 h-4 text-blue-600" /> :
                         activity.type === 'job' ? <Briefcase className="w-4 h-4 text-green-600" /> :
                         activity.type === 'user' ? <Users className="w-4 h-4 text-purple-600" /> :
                         <CurrencyDollar className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.location} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Alert */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Star className="w-6 h-6 text-yellow-600 flex-shrink-0" weight="fill" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Opportunity Alert</h4>
                    <p className="text-sm text-yellow-700">
                      5 territories in Georgia have high demand but low contractor coverage. Consider expansion.
                    </p>
                    <Button size="sm" variant="outline" className="mt-3 text-yellow-700 border-yellow-300 hover:bg-yellow-100">
                      View Opportunities
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TerritoryAnalytics;
