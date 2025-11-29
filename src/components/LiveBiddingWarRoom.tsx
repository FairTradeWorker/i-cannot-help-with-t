/**
 * AI-POWERED LIVE BIDDING WAR ROOM
 * 
 * The INSANE feature - A real-time competitive bidding arena where contractors
 * can compete for high-value jobs with live updates, AI-powered recommendations,
 * strategic insights, and gamified competition elements.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Gavel,
  Lightning,
  Trophy,
  Timer,
  Users,
  TrendUp,
  TrendDown,
  Target,
  Brain,
  ChartLineUp,
  Star,
  Shield,
  Fire,
  Crown,
  Eye,
  EyeSlash,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  WarningCircle,
  Clock,
  MapPin,
  CurrencyDollar,
  Sparkle,
  Hammer,
  House,
  Buildings,
  CaretRight,
  Play,
  Pause,
  X,
} from '@phosphor-icons/react';

interface LiveBid {
  id: string;
  contractorId: string;
  contractorName: string;
  contractorRating: number;
  contractorJobs: number;
  amount: number;
  timeline: number; // days
  warranty: number; // months
  timestamp: Date;
  isWinning: boolean;
  aiScore: number;
  isAnonymous: boolean;
}

interface LiveAuction {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  homeownerId: string;
  homeownerName: string;
  estimatedValue: { min: number; max: number };
  currentLowestBid: number | null;
  bids: LiveBid[];
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'live' | 'ending_soon' | 'ended';
  viewerCount: number;
  featured: boolean;
  requirements: string[];
  urgency: 'normal' | 'urgent' | 'emergency';
  aiInsights: {
    marketRate: number;
    competitionLevel: 'low' | 'medium' | 'high';
    winProbability: number;
    recommendedBid: number;
    trendingDirection: 'up' | 'down' | 'stable';
  };
}

interface UserBidStrategy {
  maxBid: number;
  autoBid: boolean;
  autoBidIncrement: number;
  timeline: number;
  warranty: number;
}

// Mock live auctions data
const MOCK_AUCTIONS: LiveAuction[] = [
  {
    id: 'auction-1',
    title: 'Complete Roof Replacement - 2,800 sq ft',
    description: 'Full tear-off and replacement of architectural shingles. Home is 15 years old.',
    category: 'Roofing',
    location: 'Austin, TX',
    homeownerId: 'ho-1',
    homeownerName: 'James W.',
    estimatedValue: { min: 12000, max: 18000 },
    currentLowestBid: 14500,
    bids: [],
    startTime: new Date(Date.now() - 1800000),
    endTime: new Date(Date.now() + 3600000),
    status: 'live',
    viewerCount: 23,
    featured: true,
    requirements: ['Licensed', 'Insured', '5+ years experience'],
    urgency: 'urgent',
    aiInsights: {
      marketRate: 15200,
      competitionLevel: 'high',
      winProbability: 0,
      recommendedBid: 13800,
      trendingDirection: 'down',
    },
  },
  {
    id: 'auction-2',
    title: 'HVAC System Upgrade - 4 Ton Unit',
    description: 'Replace existing 20-year-old central AC with high-efficiency system.',
    category: 'HVAC',
    location: 'Phoenix, AZ',
    homeownerId: 'ho-2',
    homeownerName: 'Maria G.',
    estimatedValue: { min: 8000, max: 12000 },
    currentLowestBid: 9200,
    bids: [],
    startTime: new Date(Date.now() - 900000),
    endTime: new Date(Date.now() + 300000), // Ending soon!
    status: 'ending_soon',
    viewerCount: 45,
    featured: true,
    requirements: ['EPA Certified', 'Licensed'],
    urgency: 'emergency',
    aiInsights: {
      marketRate: 9500,
      competitionLevel: 'medium',
      winProbability: 35,
      recommendedBid: 8800,
      trendingDirection: 'stable',
    },
  },
  {
    id: 'auction-3',
    title: 'Master Bathroom Remodel',
    description: 'Complete gut renovation including fixtures, tile, and custom vanity.',
    category: 'Remodeling',
    location: 'Denver, CO',
    homeownerId: 'ho-3',
    homeownerName: 'Robert K.',
    estimatedValue: { min: 18000, max: 28000 },
    currentLowestBid: null,
    bids: [],
    startTime: new Date(Date.now() + 1800000),
    endTime: new Date(Date.now() + 7200000),
    status: 'upcoming',
    viewerCount: 12,
    featured: false,
    requirements: ['Licensed', 'Portfolio Required'],
    urgency: 'normal',
    aiInsights: {
      marketRate: 22000,
      competitionLevel: 'low',
      winProbability: 60,
      recommendedBid: 21500,
      trendingDirection: 'up',
    },
  },
];

// Generate mock bids
const generateMockBids = (auctionId: string): LiveBid[] => {
  const contractors = [
    { id: 'c1', name: 'ProRoof Solutions', rating: 4.9, jobs: 234 },
    { id: 'c2', name: 'Elite Construction', rating: 4.7, jobs: 156 },
    { id: 'c3', name: 'Quality First Co.', rating: 4.8, jobs: 189 },
    { id: 'c4', name: 'Express Builders', rating: 4.6, jobs: 98 },
    { id: 'c5', name: 'Master Craft Inc.', rating: 4.9, jobs: 312 },
  ];

  return contractors.slice(0, Math.floor(Math.random() * 4) + 2).map((c, i) => ({
    id: `bid-${auctionId}-${i}`,
    contractorId: c.id,
    contractorName: c.name,
    contractorRating: c.rating,
    contractorJobs: c.jobs,
    amount: 12000 + Math.floor(Math.random() * 6000),
    timeline: 5 + Math.floor(Math.random() * 10),
    warranty: 12 + Math.floor(Math.random() * 24),
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    isWinning: i === 0,
    aiScore: 70 + Math.floor(Math.random() * 30),
    isAnonymous: Math.random() > 0.7,
  }));
};

const STATUS_CONFIG = {
  upcoming: { label: 'Starting Soon', color: 'bg-blue-100 text-blue-700', pulse: false },
  live: { label: 'LIVE', color: 'bg-green-100 text-green-700', pulse: true },
  ending_soon: { label: 'Ending Soon!', color: 'bg-red-100 text-red-700', pulse: true },
  ended: { label: 'Ended', color: 'bg-gray-100 text-gray-700', pulse: false },
};

const URGENCY_CONFIG = {
  normal: { label: 'Standard', color: 'bg-gray-100 text-gray-700' },
  urgent: { label: 'Urgent', color: 'bg-yellow-100 text-yellow-700' },
  emergency: { label: 'Emergency', color: 'bg-red-100 text-red-700' },
};

export function LiveBiddingWarRoom() {
  const [auctions, setAuctions] = useState<LiveAuction[]>(MOCK_AUCTIONS);
  const [selectedAuction, setSelectedAuction] = useState<LiveAuction | null>(null);
  const [myBid, setMyBid] = useState<UserBidStrategy>({
    maxBid: 0,
    autoBid: false,
    autoBidIncrement: 100,
    timeline: 7,
    warranty: 12,
  });
  const [bidAmount, setBidAmount] = useState('');
  const [showBidPanel, setShowBidPanel] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState<string[]>([]);
  const [isWatching, setIsWatching] = useState<Set<string>>(new Set());
  const tickerRef = useRef<HTMLDivElement>(null);

  // Simulate real-time bid updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions(prev =>
        prev.map(auction => {
          if (auction.status === 'live' || auction.status === 'ending_soon') {
            // Randomly add new bids
            if (Math.random() > 0.7) {
              const newBid: LiveBid = {
                id: `bid-${Date.now()}`,
                contractorId: `c-${Date.now()}`,
                contractorName: ['ABC Roofing', 'Premier Builders', 'TopNotch Co.', 'Swift Services'][
                  Math.floor(Math.random() * 4)
                ],
                contractorRating: 4.5 + Math.random() * 0.5,
                contractorJobs: 50 + Math.floor(Math.random() * 200),
                amount: (auction.currentLowestBid || auction.estimatedValue.min) - Math.floor(Math.random() * 500),
                timeline: 5 + Math.floor(Math.random() * 10),
                warranty: 12 + Math.floor(Math.random() * 24),
                timestamp: new Date(),
                isWinning: true,
                aiScore: 70 + Math.floor(Math.random() * 30),
                isAnonymous: Math.random() > 0.5,
              };

              // Update winning status for existing bids
              const updatedBids = auction.bids.map(b => ({ ...b, isWinning: false }));
              updatedBids.push(newBid);

              // Add to live updates ticker
              setLiveUpdates(prev => [
                `🔥 New bid on "${auction.title.substring(0, 30)}..." - $${newBid.amount.toLocaleString()}`,
                ...prev.slice(0, 9),
              ]);

              return {
                ...auction,
                bids: updatedBids.sort((a, b) => a.amount - b.amount),
                currentLowestBid: newBid.amount,
                viewerCount: auction.viewerCount + Math.floor(Math.random() * 3) - 1,
              };
            }
          }
          return auction;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Timer countdown
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimes: Record<string, number> = {};
      auctions.forEach(auction => {
        const remaining = auction.endTime.getTime() - Date.now();
        newTimes[auction.id] = Math.max(0, remaining);
      });
      setTimeRemaining(newTimes);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctions]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const placeBid = useCallback(() => {
    if (!selectedAuction || !bidAmount) return;

    const amount = parseFloat(bidAmount);
    const newBid: LiveBid = {
      id: `bid-${Date.now()}`,
      contractorId: 'my-contractor',
      contractorName: 'You',
      contractorRating: 4.8,
      contractorJobs: 127,
      amount,
      timeline: myBid.timeline,
      warranty: myBid.warranty,
      timestamp: new Date(),
      isWinning: !selectedAuction.currentLowestBid || amount < selectedAuction.currentLowestBid,
      aiScore: 85,
      isAnonymous: false,
    };

    setAuctions(prev =>
      prev.map(a => {
        if (a.id === selectedAuction.id) {
          const updatedBids = a.bids.map(b => ({
            ...b,
            isWinning: b.amount < amount,
          }));
          updatedBids.push(newBid);
          return {
            ...a,
            bids: updatedBids.sort((x, y) => x.amount - y.amount),
            currentLowestBid: Math.min(amount, a.currentLowestBid || Infinity),
          };
        }
        return a;
      })
    );

    setLiveUpdates(prev => [
      `✅ Your bid of $${amount.toLocaleString()} placed on "${selectedAuction.title.substring(0, 30)}..."`,
      ...prev.slice(0, 9),
    ]);

    setBidAmount('');
    setShowBidPanel(false);
  }, [selectedAuction, bidAmount, myBid]);

  const toggleWatch = (auctionId: string) => {
    setIsWatching(prev => {
      const newSet = new Set(prev);
      if (newSet.has(auctionId)) {
        newSet.delete(auctionId);
      } else {
        newSet.add(auctionId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Live Ticker */}
      {liveUpdates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-accent text-white rounded-xl p-3 overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full shrink-0">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold">LIVE</span>
            </div>
            <div ref={tickerRef} className="overflow-hidden whitespace-nowrap">
              <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="flex gap-8"
              >
                {liveUpdates.map((update, i) => (
                  <span key={i} className="text-sm">
                    {update}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Gavel className="w-8 h-8 text-white" weight="fill" />
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Live Bidding War Room
              <Badge className="bg-red-500 text-white animate-pulse">
                <Lightning className="w-3 h-3 mr-1" weight="fill" />
                LIVE
              </Badge>
            </h2>
            <p className="text-muted-foreground">
              Compete in real-time for high-value projects
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">
              {auctions.reduce((sum, a) => sum + a.viewerCount, 0)} contractors watching
            </span>
          </div>
          <Button variant="outline">
            <Trophy className="w-4 h-4 mr-2" />
            My Wins
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card">
          <Card className="p-4 border-0 bg-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Lightning className="w-5 h-5 text-green-600" weight="fill" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Live Auctions</p>
                <p className="text-xl font-bold">
                  {auctions.filter(a => a.status === 'live' || a.status === 'ending_soon').length}
                </p>
              </div>
            </div>
          </Card>
        </div>
        <div className="glass-card">
          <Card className="p-4 border-0 bg-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Fire className="w-5 h-5 text-yellow-600" weight="fill" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ending Soon</p>
                <p className="text-xl font-bold">
                  {auctions.filter(a => a.status === 'ending_soon').length}
                </p>
              </div>
            </div>
          </Card>
        </div>
        <div className="glass-card">
          <Card className="p-4 border-0 bg-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <CurrencyDollar className="w-5 h-5 text-blue-600" weight="fill" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="text-xl font-bold">
                  ${auctions.reduce((sum, a) => sum + a.estimatedValue.max, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
        <div className="glass-card">
          <Card className="p-4 border-0 bg-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Eye className="w-5 h-5 text-purple-600" weight="fill" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Watching</p>
                <p className="text-xl font-bold">{isWatching.size}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Auctions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {auctions.map(auction => {
          const statusConfig = STATUS_CONFIG[auction.status];
          const urgencyConfig = URGENCY_CONFIG[auction.urgency];
          const remaining = timeRemaining[auction.id] || 0;
          const isEnding = remaining < 300000; // Less than 5 minutes

          return (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.01 }}
              className={`${isEnding && auction.status !== 'ended' ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
            >
              <div className="glass-card">
                <Card className="overflow-hidden border-0 bg-transparent">
                  {/* Header */}
                  <div className="p-4 border-b bg-gradient-to-r from-muted/50 to-transparent">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`${statusConfig.color} ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
                        {statusConfig.label}
                      </Badge>
                      <Badge className={urgencyConfig.color}>{urgencyConfig.label}</Badge>
                      {auction.featured && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          <Star className="w-3 h-3 mr-1" weight="fill" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleWatch(auction.id)}
                      className={isWatching.has(auction.id) ? 'text-primary' : ''}
                    >
                      {isWatching.has(auction.id) ? (
                        <Eye className="w-5 h-5" weight="fill" />
                      ) : (
                        <EyeSlash className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  <h3 className="font-bold text-lg mt-2">{auction.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {auction.description}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {auction.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <House className="w-4 h-4" />
                      {auction.homeownerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {auction.viewerCount} watching
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  {/* Pricing Section */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Estimated Value</p>
                      <p className="text-lg font-bold">
                        ${auction.estimatedValue.min.toLocaleString()} - $
                        {auction.estimatedValue.max.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-3 border border-primary/20">
                      <p className="text-xs text-muted-foreground">Current Lowest Bid</p>
                      <p className="text-lg font-bold text-primary">
                        {auction.currentLowestBid
                          ? `$${auction.currentLowestBid.toLocaleString()}`
                          : 'No bids yet'}
                      </p>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-primary" />
                      <span className="text-sm font-semibold">AI Insights</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Win Probability</p>
                        <p className="font-bold text-green-600">
                          {auction.aiInsights.winProbability}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Recommended Bid</p>
                        <p className="font-bold">
                          ${auction.aiInsights.recommendedBid.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Competition</p>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${
                            auction.aiInsights.competitionLevel === 'high'
                              ? 'border-red-300 text-red-600'
                              : auction.aiInsights.competitionLevel === 'medium'
                              ? 'border-yellow-300 text-yellow-600'
                              : 'border-green-300 text-green-600'
                          }`}
                        >
                          {auction.aiInsights.competitionLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Timer className={`w-5 h-5 ${isEnding ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
                      <span className={`font-mono text-lg ${isEnding ? 'text-red-500 font-bold' : ''}`}>
                        {formatTime(remaining)}
                      </span>
                      <span className="text-sm text-muted-foreground">remaining</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">
                        {auction.bids.length} bids
                      </span>
                      {auction.aiInsights.trendingDirection === 'down' ? (
                        <TrendDown className="w-4 h-4 text-green-500" />
                      ) : auction.aiInsights.trendingDirection === 'up' ? (
                        <TrendUp className="w-4 h-4 text-red-500" />
                      ) : null}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setSelectedAuction(auction);
                        setShowBidPanel(true);
                      }}
                      disabled={auction.status === 'ended' || auction.status === 'upcoming'}
                    >
                      <Gavel className="w-4 h-4 mr-2" />
                      {auction.status === 'upcoming' ? 'Starting Soon' : 'Place Bid'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedAuction(auction)}
                    >
                      View Details
                      <CaretRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bid Panel Modal */}
      <AnimatePresence>
        {showBidPanel && selectedAuction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowBidPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">Place Your Bid</h3>
                  <p className="text-sm text-muted-foreground">{selectedAuction.title}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowBidPanel(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Current Status */}
              <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Lowest</p>
                    <p className="text-xl font-bold text-primary">
                      ${(selectedAuction.currentLowestBid || selectedAuction.estimatedValue.max).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">AI Recommended</p>
                    <p className="text-xl font-bold text-green-600">
                      ${selectedAuction.aiInsights.recommendedBid.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bid Amount */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Bid Amount</label>
                  <div className="relative">
                    <CurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="pl-10 text-xl font-bold"
                    />
                  </div>
                  {bidAmount && parseFloat(bidAmount) < selectedAuction.aiInsights.recommendedBid && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Below AI recommended - Higher chance of winning!
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Timeline (days): {myBid.timeline}
                  </label>
                  <Slider
                    value={[myBid.timeline]}
                    onValueChange={([v]) => setMyBid(prev => ({ ...prev, timeline: v }))}
                    min={3}
                    max={30}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Warranty (months): {myBid.warranty}
                  </label>
                  <Slider
                    value={[myBid.warranty]}
                    onValueChange={([v]) => setMyBid(prev => ({ ...prev, warranty: v }))}
                    min={6}
                    max={60}
                    step={6}
                  />
                </div>
              </div>

              {/* Auto-bid Option */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkle className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Auto-Bid (Premium)</span>
                  </div>
                  <Button
                    variant={myBid.autoBid ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMyBid(prev => ({ ...prev, autoBid: !prev.autoBid }))}
                  >
                    {myBid.autoBid ? 'Enabled' : 'Enable'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically outbid competitors up to your max bid
                </p>
                {myBid.autoBid && (
                  <div className="mt-3">
                    <label className="text-xs font-medium">Max Auto-Bid: ${myBid.maxBid}</label>
                    <Slider
                      value={[myBid.maxBid]}
                      onValueChange={([v]) => setMyBid(prev => ({ ...prev, maxBid: v }))}
                      min={1000}
                      max={50000}
                      step={500}
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowBidPanel(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                  onClick={placeBid}
                  disabled={!bidAmount || parseFloat(bidAmount) <= 0}
                >
                  <Gavel className="w-4 h-4 mr-2" />
                  Place Bid
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
