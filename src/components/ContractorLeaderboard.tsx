import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  Medal,
  Crown,
  Star,
  TrendUp,
  TrendDown,
  Users,
  Briefcase,
  CurrencyDollar,
  MapPin,
  ShieldCheck,
  Lightning,
  Flame,
  Target,
  MagnifyingGlass,
  CaretDown,
  ThumbsUp,
  Clock,
  ChatCircle,
  Broom,
} from '@phosphor-icons/react';

interface LeaderboardContractor {
  id: string;
  name: string;
  company: string;
  avatar: string;
  state: string;
  rank: number;
  previousRank: number;
  metrics: {
    completedJobs: number;
    totalEarnings: number;
    avgRating: number;
    responseTime: string;
    repeatClients: number;
    onTimeRate: number;
  };
  badges: string[];
  specialties: string[];
  verified: boolean;
}

const sampleLeaderboard: LeaderboardContractor[] = [
  {
    id: 'C1',
    name: 'Michael Torres',
    company: 'Torres Roofing Solutions',
    avatar: 'MT',
    state: 'TX',
    rank: 1,
    previousRank: 1,
    metrics: { completedJobs: 234, totalEarnings: 456000, avgRating: 4.98, responseTime: '15 min', repeatClients: 67, onTimeRate: 99 },
    badges: ['Elite Contractor', 'Top Earner', 'Speed Demon'],
    specialties: ['Roofing', 'Gutters', 'Siding'],
    verified: true,
  },
  {
    id: 'C2',
    name: 'Sarah Chen',
    company: 'Chen Electric Co',
    avatar: 'SC',
    state: 'OH',
    rank: 2,
    previousRank: 4,
    metrics: { completedJobs: 189, totalEarnings: 387000, avgRating: 4.95, responseTime: '22 min', repeatClients: 52, onTimeRate: 97 },
    badges: ['Rising Star', 'Customer Favorite'],
    specialties: ['Electrical', 'Smart Home', 'EV Chargers'],
    verified: true,
  },
  {
    id: 'C3',
    name: 'James Wilson',
    company: 'Wilson Plumbing',
    avatar: 'JW',
    state: 'AZ',
    rank: 3,
    previousRank: 2,
    metrics: { completedJobs: 201, totalEarnings: 345000, avgRating: 4.92, responseTime: '18 min', repeatClients: 48, onTimeRate: 95 },
    badges: ['Veteran Pro', 'Quick Responder'],
    specialties: ['Plumbing', 'Water Heaters', 'Drains'],
    verified: true,
  },
  {
    id: 'C4',
    name: 'Maria Rodriguez',
    company: 'R&R HVAC Services',
    avatar: 'MR',
    state: 'GA',
    rank: 4,
    previousRank: 5,
    metrics: { completedJobs: 156, totalEarnings: 298000, avgRating: 4.89, responseTime: '25 min', repeatClients: 41, onTimeRate: 94 },
    badges: ['HVAC Specialist'],
    specialties: ['HVAC', 'Duct Work', 'Thermostats'],
    verified: true,
  },
  {
    id: 'C5',
    name: 'David Kim',
    company: 'Kim Home Renovations',
    avatar: 'DK',
    state: 'TX',
    rank: 5,
    previousRank: 3,
    metrics: { completedJobs: 178, totalEarnings: 312000, avgRating: 4.87, responseTime: '30 min', repeatClients: 38, onTimeRate: 92 },
    badges: ['Quality Master'],
    specialties: ['Kitchen Remodel', 'Bathroom', 'Flooring'],
    verified: true,
  },
];

const categories = [
  { id: 'overall', label: 'Overall', icon: Trophy },
  { id: 'earnings', label: 'Top Earners', icon: CurrencyDollar },
  { id: 'jobs', label: 'Most Jobs', icon: Briefcase },
  { id: 'rating', label: 'Highest Rated', icon: Star },
  { id: 'speed', label: 'Fastest Response', icon: Lightning },
];

export function ContractorLeaderboard() {
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly' | 'alltime'>('monthly');
  const [searchQuery, setSearchQuery] = useState('');

  const getRankChange = (current: number, previous: number) => {
    const diff = previous - current;
    if (diff > 0) return { direction: 'up', value: diff };
    if (diff < 0) return { direction: 'down', value: Math.abs(diff) };
    return { direction: 'same', value: 0 };
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-100' };
    if (rank === 2) return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-100' };
    if (rank === 3) return { icon: Medal, color: 'text-orange-500', bg: 'bg-orange-100' };
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" weight="fill" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contractor Leaderboard</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Recognizing the top-performing contractors across the FairTradeWorker network
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="flex justify-center items-end gap-4 mb-12">
          {/* Second Place */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-gray-300">
              <span className="text-2xl font-bold text-gray-700">{sampleLeaderboard[1].avatar}</span>
            </div>
            <div className="bg-gray-100 rounded-t-xl pt-4 pb-6 px-6 w-40">
              <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" weight="fill" />
              <p className="font-semibold text-gray-900 text-sm">{sampleLeaderboard[1].name}</p>
              <p className="text-xs text-gray-500">${(sampleLeaderboard[1].metrics.totalEarnings / 1000).toFixed(0)}K earned</p>
              <div className="mt-2 text-2xl font-bold text-gray-400">#2</div>
            </div>
          </div>

          {/* First Place */}
          <div className="text-center -mt-8">
            <div className="relative">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-yellow-400">
                <span className="text-3xl font-bold text-yellow-700">{sampleLeaderboard[0].avatar}</span>
              </div>
              <Crown className="w-8 h-8 text-yellow-500 absolute -top-2 left-1/2 -translate-x-1/2" weight="fill" />
            </div>
            <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-t-xl pt-4 pb-8 px-8 w-48 border-2 border-yellow-200">
              <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2" weight="fill" />
              <p className="font-bold text-gray-900">{sampleLeaderboard[0].name}</p>
              <p className="text-sm text-gray-500">${(sampleLeaderboard[0].metrics.totalEarnings / 1000).toFixed(0)}K earned</p>
              <div className="mt-2 text-3xl font-bold text-yellow-600">#1</div>
            </div>
          </div>

          {/* Third Place */}
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-orange-300">
              <span className="text-2xl font-bold text-orange-700">{sampleLeaderboard[2].avatar}</span>
            </div>
            <div className="bg-orange-50 rounded-t-xl pt-4 pb-6 px-6 w-40">
              <Medal className="w-8 h-8 text-orange-400 mx-auto mb-2" weight="fill" />
              <p className="font-semibold text-gray-900 text-sm">{sampleLeaderboard[2].name}</p>
              <p className="text-xs text-gray-500">${(sampleLeaderboard[2].metrics.totalEarnings / 1000).toFixed(0)}K earned</p>
              <div className="mt-2 text-2xl font-bold text-orange-400">#3</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>
              <div className="flex-1" />
              <div className="flex gap-2">
                {(['weekly', 'monthly', 'yearly', 'alltime'] as const).map((tf) => (
                  <Button
                    key={tf}
                    variant={timeframe === tf ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf === 'alltime' ? 'All Time' : tf.charAt(0).toUpperCase() + tf.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search contractors..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Full Rankings</CardTitle>
            <CardDescription>Top contractors based on {selectedCategory} performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleLeaderboard.map((contractor) => {
                const rankChange = getRankChange(contractor.rank, contractor.previousRank);
                const rankBadge = getRankBadge(contractor.rank);

                return (
                  <div
                    key={contractor.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {/* Rank */}
                    <div className="w-16 text-center">
                      {rankBadge ? (
                        <div className={`w-12 h-12 ${rankBadge.bg} rounded-full flex items-center justify-center mx-auto`}>
                          <rankBadge.icon className={`w-6 h-6 ${rankBadge.color}`} weight="fill" />
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">#{contractor.rank}</span>
                      )}
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {rankChange.direction === 'up' && (
                          <>
                            <TrendUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600">+{rankChange.value}</span>
                          </>
                        )}
                        {rankChange.direction === 'down' && (
                          <>
                            <TrendDown className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-600">-{rankChange.value}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Avatar & Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-700">
                        {contractor.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{contractor.name}</span>
                          {contractor.verified && (
                            <ShieldCheck className="w-5 h-5 text-blue-600" weight="fill" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {contractor.state}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{contractor.company}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {contractor.badges.map((badge) => (
                            <Badge key={badge} variant="secondary" className="text-xs">
                              {badge === 'Elite Contractor' && <Flame className="w-3 h-3 mr-1 text-orange-500" />}
                              {badge === 'Rising Star' && <TrendUp className="w-3 h-3 mr-1 text-green-500" />}
                              {badge === 'Top Earner' && <CurrencyDollar className="w-3 h-3 mr-1 text-emerald-500" />}
                              {badge === 'Speed Demon' && <Lightning className="w-3 h-3 mr-1 text-yellow-500" />}
                              {badge === 'Customer Favorite' && <ThumbsUp className="w-3 h-3 mr-1 text-blue-500" />}
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{contractor.metrics.completedJobs}</p>
                        <p className="text-xs text-gray-500">Jobs</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">${(contractor.metrics.totalEarnings / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500">Earned</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" weight="fill" />
                          {contractor.metrics.avgRating}
                        </p>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{contractor.metrics.onTimeRate}%</p>
                        <p className="text-xs text-gray-500">On-Time</p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Achievement Badges Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Achievement Badges</CardTitle>
            <CardDescription>Earn badges by excelling in different areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {[
                { name: 'Elite Contractor', desc: 'Top 1% overall performance', icon: Flame, color: 'text-orange-500' },
                { name: 'Rising Star', desc: 'Fastest rank improvement', icon: TrendUp, color: 'text-green-500' },
                { name: 'Top Earner', desc: 'Highest monthly earnings', icon: CurrencyDollar, color: 'text-emerald-500' },
                { name: 'Speed Demon', desc: 'Under 15 min avg response', icon: Lightning, color: 'text-yellow-500' },
                { name: 'Customer Favorite', desc: '50+ repeat clients', icon: ThumbsUp, color: 'text-blue-500' },
              ].map((badge) => (
                <div key={badge.name} className="text-center p-4 bg-gray-50 rounded-xl">
                  <badge.icon className={`w-8 h-8 ${badge.color} mx-auto mb-2`} weight="fill" />
                  <p className="font-medium text-gray-900 text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ContractorLeaderboard;
