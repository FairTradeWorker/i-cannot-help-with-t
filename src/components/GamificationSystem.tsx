import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Star,
  Lightning,
  Target,
  Gift,
  Crown,
  Fire,
  Medal,
  Sparkle,
  TrendUp,
  CheckCircle,
  Lock,
} from '@phosphor-icons/react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'lightning' | 'target' | 'gift' | 'crown' | 'fire' | 'medal';
  category: 'jobs' | 'earnings' | 'reviews' | 'streak' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  progress: number;
  maxProgress: number;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  perks: string[];
}

interface GamificationStats {
  totalXP: number;
  currentLevel: Level;
  nextLevel: Level;
  streakDays: number;
  achievements: Achievement[];
  recentActivity: { action: string; xp: number; timestamp: Date }[];
}

const ICON_MAP = {
  trophy: Trophy,
  star: Star,
  lightning: Lightning,
  target: Target,
  gift: Gift,
  crown: Crown,
  fire: Fire,
  medal: Medal,
};

const TIER_COLORS = {
  bronze: 'bg-amber-600',
  silver: 'bg-gray-400',
  gold: 'bg-yellow-400',
  platinum: 'bg-blue-300',
  diamond: 'bg-cyan-300',
};

const LEVELS: Level[] = [
  { level: 1, title: 'Newcomer', minXP: 0, maxXP: 100, perks: ['Basic profile'] },
  { level: 2, title: 'Apprentice', minXP: 100, maxXP: 300, perks: ['Priority support'] },
  { level: 3, title: 'Journeyman', minXP: 300, maxXP: 600, perks: ['Featured listing'] },
  { level: 4, title: 'Expert', minXP: 600, maxXP: 1000, perks: ['2% fee discount'] },
  { level: 5, title: 'Master', minXP: 1000, maxXP: 1500, perks: ['Verified badge'] },
  { level: 6, title: 'Elite', minXP: 1500, maxXP: 2200, perks: ['Priority leads'] },
  { level: 7, title: 'Champion', minXP: 2200, maxXP: 3000, perks: ['Custom profile URL'] },
  { level: 8, title: 'Legend', minXP: 3000, maxXP: 4000, perks: ['VIP events access'] },
  { level: 9, title: 'Titan', minXP: 4000, maxXP: 5500, perks: ['Exclusive API access'] },
  { level: 10, title: 'Grandmaster', minXP: 5500, maxXP: Infinity, perks: ['All perks unlocked'] },
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'First Job Complete',
    description: 'Complete your first job on the platform',
    icon: 'trophy',
    category: 'jobs',
    tier: 'bronze',
    progress: 1,
    maxProgress: 1,
    xpReward: 50,
    unlocked: true,
    unlockedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Rising Star',
    description: 'Receive 5 five-star reviews',
    icon: 'star',
    category: 'reviews',
    tier: 'silver',
    progress: 3,
    maxProgress: 5,
    xpReward: 100,
    unlocked: false,
  },
  {
    id: '3',
    title: 'Speed Demon',
    description: 'Complete 3 urgent jobs within 24 hours',
    icon: 'lightning',
    category: 'jobs',
    tier: 'gold',
    progress: 2,
    maxProgress: 3,
    xpReward: 150,
    unlocked: false,
  },
  {
    id: '4',
    title: '7-Day Streak',
    description: 'Log in for 7 consecutive days',
    icon: 'fire',
    category: 'streak',
    tier: 'bronze',
    progress: 5,
    maxProgress: 7,
    xpReward: 75,
    unlocked: false,
  },
  {
    id: '5',
    title: 'Money Maker',
    description: 'Earn $10,000 on the platform',
    icon: 'crown',
    category: 'earnings',
    tier: 'platinum',
    progress: 7500,
    maxProgress: 10000,
    xpReward: 300,
    unlocked: false,
  },
  {
    id: '6',
    title: 'Sharpshooter',
    description: 'Hit your estimate within 5% accuracy 10 times',
    icon: 'target',
    category: 'jobs',
    tier: 'gold',
    progress: 6,
    maxProgress: 10,
    xpReward: 200,
    unlocked: false,
  },
  {
    id: '7',
    title: 'Community Helper',
    description: 'Refer 5 new users to the platform',
    icon: 'gift',
    category: 'special',
    tier: 'silver',
    progress: 2,
    maxProgress: 5,
    xpReward: 125,
    unlocked: false,
  },
  {
    id: '8',
    title: 'Centurion',
    description: 'Complete 100 jobs',
    icon: 'medal',
    category: 'jobs',
    tier: 'diamond',
    progress: 45,
    maxProgress: 100,
    xpReward: 500,
    unlocked: false,
  },
];

export function GamificationSystem() {
  const [stats, setStats] = useState<GamificationStats>({
    totalXP: 725,
    currentLevel: LEVELS[3],
    nextLevel: LEVELS[4],
    streakDays: 5,
    achievements: MOCK_ACHIEVEMENTS,
    recentActivity: [
      { action: 'Completed job', xp: 50, timestamp: new Date() },
      { action: '5-star review received', xp: 25, timestamp: new Date(Date.now() - 86400000) },
      { action: 'Daily login bonus', xp: 10, timestamp: new Date(Date.now() - 172800000) },
    ],
  });

  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const xpProgress = ((stats.totalXP - stats.currentLevel.minXP) / (stats.nextLevel.minXP - stats.currentLevel.minXP)) * 100;

  const filteredAchievements = selectedCategory === 'all'
    ? stats.achievements
    : stats.achievements.filter(a => a.category === selectedCategory);

  const addXP = useCallback((amount: number) => {
    setEarnedXP(amount);
    setShowXPAnimation(true);
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        totalXP: prev.totalXP + amount,
      }));
      setShowXPAnimation(false);
    }, 1500);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Level */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Progress</h2>
          <p className="text-muted-foreground">Level up and earn rewards</p>
        </div>
        <div className="flex items-center gap-2">
          <Fire className="w-5 h-5 text-orange-500" weight="fill" />
          <span className="font-bold">{stats.streakDays} day streak</span>
        </div>
      </div>

      {/* XP Animation Overlay */}
      <AnimatePresence>
        {showXPAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-2xl font-bold shadow-2xl">
              +{earnedXP} XP
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Progress Card */}
      <div className="glass-card">
        <Card className="p-6 border-0 bg-transparent">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{stats.currentLevel.level}</span>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1"
              >
                <Crown className="w-4 h-4 text-yellow-900" weight="fill" />
              </motion.div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold">{stats.currentLevel.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Next: {stats.nextLevel.title}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{stats.totalXP.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
              </div>

              <div className="space-y-1">
                <Progress value={xpProgress} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{stats.totalXP - stats.currentLevel.minXP} XP</span>
                  <span>{stats.nextLevel.minXP - stats.currentLevel.minXP} XP needed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Perks */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Your Perks</p>
            <div className="flex flex-wrap gap-2">
              {LEVELS.slice(0, stats.currentLevel.level).flatMap(l => l.perks).map((perk, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" weight="fill" />
                  {perk}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card">
          <Card className="p-4 text-center border-0 bg-transparent">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" weight="fill" />
            <p className="text-2xl font-bold">
              {stats.achievements.filter(a => a.unlocked).length}
            </p>
            <p className="text-xs text-muted-foreground">Achievements</p>
          </Card>
        </div>
        <div className="glass-card">
          <Card className="p-4 text-center border-0 bg-transparent">
            <Fire className="w-8 h-8 mx-auto mb-2 text-orange-500" weight="fill" />
            <p className="text-2xl font-bold">{stats.streakDays}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>
        </div>
        <div className="glass-card">
          <Card className="p-4 text-center border-0 bg-transparent">
            <TrendUp className="w-8 h-8 mx-auto mb-2 text-green-500" weight="fill" />
            <p className="text-2xl font-bold">+{stats.recentActivity.reduce((sum, a) => sum + a.xp, 0)}</p>
            <p className="text-xs text-muted-foreground">Recent XP</p>
          </Card>
        </div>
        <div className="glass-card">
          <Card className="p-4 text-center border-0 bg-transparent">
            <Sparkle className="w-8 h-8 mx-auto mb-2 text-purple-500" weight="fill" />
            <p className="text-2xl font-bold">{stats.nextLevel.minXP - stats.totalXP}</p>
            <p className="text-xs text-muted-foreground">XP to Next Level</p>
          </Card>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Achievements</h3>
          <div className="flex gap-2">
            {['all', 'jobs', 'earnings', 'reviews', 'streak', 'special'].map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map(achievement => {
            const IconComponent = ICON_MAP[achievement.icon];
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="glass-card">
                  <Card className={`p-4 border-0 bg-transparent ${!achievement.unlocked ? 'opacity-75' : ''}`}>
                    <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-xl ${TIER_COLORS[achievement.tier]} ${!achievement.unlocked ? 'grayscale' : ''}`}>
                      {achievement.unlocked ? (
                        <IconComponent className="w-6 h-6 text-white" weight="fill" />
                      ) : (
                        <Lock className="w-6 h-6 text-white" weight="fill" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {achievement.tier}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      {!achievement.unlocked && (
                        <div className="space-y-1">
                          <Progress
                            value={(achievement.progress / achievement.maxProgress) * 100}
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground">
                            {achievement.progress}/{achievement.maxProgress}
                          </p>
                        </div>
                      )}
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" weight="fill" />
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      +{achievement.xpReward} XP
                    </Badge>
                  </div>
                </Card>
              </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card">
        <Card className="p-4 border-0 bg-transparent">
          <h3 className="font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {stats.recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkle className="w-4 h-4 text-primary" weight="fill" />
                </div>
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                +{activity.xp} XP
              </Badge>
            </div>
          ))}
        </div>
        </Card>
      </div>

      {/* Demo Button */}
      <Button onClick={() => addXP(50)} className="w-full">
        <Sparkle className="w-4 h-4 mr-2" />
        Simulate Earning 50 XP
      </Button>
    </div>
  );
}
