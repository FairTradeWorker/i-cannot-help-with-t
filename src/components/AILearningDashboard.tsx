import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  TrendUp,
  TrendDown,
  CheckCircle,
  Warning,
  ChartLine,
  Star,
  Target,
  Lightning,
  Calendar,
  Sparkle,
  Robot,
} from '@phosphor-icons/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { learningDB, type LearningFeedback } from '@/lib/learning-db';

interface AILearningDashboardProps {
  contractorId?: string;
}

export function AILearningDashboard({ contractorId }: AILearningDashboardProps) {
  const [feedback, setFeedback] = useState<LearningFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'scope' | 'pricing'>('scope');
  const [showConfetti, setShowConfetti] = useState(false);
  const hasCelebratedRef = useRef(false);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const allFeedback = await learningDB.getAll();
      setFeedback(allFeedback);
      
      // FIXED: Check if accuracy crossed 90% for the first time
      const scopeFeedback = allFeedback.filter((f): f is LearningFeedback => f.predictionType === "scope");
      if (scopeFeedback.length > 0 && !hasCelebratedRef.current) {
        const recent = scopeFeedback.slice(-30);
        const avgAccuracy = recent.reduce((sum, f) => sum + (f.performanceMetrics.accuracy || 0), 0) / recent.length;
        if (avgAccuracy >= 0.9) {
          setShowConfetti(true);
          hasCelebratedRef.current = true;
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (type: "scope" | "pricing") => {
    // FIXED: Use type guard for filtering
    const typeFeedback = feedback.filter((f): f is LearningFeedback => f.predictionType === type);
    const recent = typeFeedback.slice(-30);
    
    if (recent.length === 0) {
      return {
        accuracy: 85,
        trend: 0,
        total: 0,
        weekOverWeek: 0,
      };
    }

    const avgAccuracy = recent.reduce((sum, f) => sum + (f.performanceMetrics.accuracy || 0), 0) / recent.length;
    
    const lastWeek = recent.slice(-7);
    const previousWeek = recent.slice(-14, -7);
    
    const lastWeekAccuracy = lastWeek.length > 0
      ? lastWeek.reduce((sum, f) => sum + (f.performanceMetrics.accuracy || 0), 0) / lastWeek.length
      : 0;
    
    const previousWeekAccuracy = previousWeek.length > 0
      ? previousWeek.reduce((sum, f) => sum + (f.performanceMetrics.accuracy || 0), 0) / previousWeek.length
      : 0;
    
    const weekOverWeek = previousWeekAccuracy > 0
      ? ((lastWeekAccuracy - previousWeekAccuracy) / previousWeekAccuracy) * 100
      : 0;

    return {
      accuracy: avgAccuracy * 100,
      trend: weekOverWeek,
      total: typeFeedback.length,
      weekOverWeek,
    };
  };

  const scopeMetrics = calculateMetrics('scope');
  const pricingMetrics = calculateMetrics('pricing');

  const overallAccuracy = (scopeMetrics.accuracy + pricingMetrics.accuracy) / 2;
  const jobsTaughtAI = feedback.length;

  // FIXED: Prepare chart data for selected type
  const chartData = feedback
    .filter((f): f is LearningFeedback => f.predictionType === selectedType)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((f, index) => ({
      index,
      date: new Date(f.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      accuracy: (f.performanceMetrics.accuracy || 0) * 100,
      timestamp: new Date(f.timestamp).getTime()
    }));

  return (
    <div className="space-y-6">
      {/* FIXED: Confetti celebration */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              <Sparkle className="w-4 h-4 text-yellow-400" weight="fill" />
            </div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent">
            <Brain className="w-7 h-7 text-white" weight="duotone" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">AI Learning Intelligence</h2>
            <p className="text-muted-foreground">
              Watch our AI get smarter with every job
            </p>
          </div>
        </div>
      </motion.div>

      {/* FIXED: Jobs Taught AI and Accuracy in big bold numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="glass-card p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Brain className="w-5 h-5" weight="bold" />
            <span>Jobs Taught AI</span>
          </div>
          <p className="text-5xl font-bold text-primary font-mono">{jobsTaughtAI}</p>
        </Card>

        <Card className="glass-card p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <TrendUp className="w-5 h-5" weight="bold" />
            <span>Current Avg Accuracy</span>
          </div>
          <p className="text-5xl font-bold text-accent font-mono">{overallAccuracy.toFixed(1)}%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Overall Accuracy',
            value: `${overallAccuracy.toFixed(1)}%`,
            icon: Target,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            trend: scopeMetrics.weekOverWeek,
          },
          {
            label: 'Scope Predictions',
            value: scopeMetrics.total,
            icon: CheckCircle,
            color: 'text-secondary',
            bgColor: 'bg-secondary/10',
            accuracy: scopeMetrics.accuracy,
          },
          {
            label: 'Pricing Suggestions',
            value: pricingMetrics.total,
            icon: Lightning,
            color: 'text-accent',
            bgColor: 'bg-accent/10',
            accuracy: pricingMetrics.accuracy,
          },
          {
            label: 'Week-over-Week',
            value: scopeMetrics.weekOverWeek > 0 ? `+${scopeMetrics.weekOverWeek.toFixed(1)}%` : `${scopeMetrics.weekOverWeek.toFixed(1)}%`,
            icon: scopeMetrics.weekOverWeek > 0 ? TrendUp : TrendDown,
            color: scopeMetrics.weekOverWeek > 0 ? 'text-accent' : 'text-destructive',
            bgColor: scopeMetrics.weekOverWeek > 0 ? 'bg-accent/10' : 'bg-destructive/10',
          },
        ].map((stat, index) => (
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
                    <stat.icon className={`w-6 h-6 ${stat.color}`} weight="duotone" />
                  </div>
                  {stat.trend !== undefined && (
                    <Badge variant={stat.trend > 0 ? 'default' : 'secondary'}>
                      {stat.trend > 0 ? '+' : ''}{stat.trend.toFixed(1)}%
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  {stat.accuracy !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.accuracy.toFixed(1)}% accurate
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <ChartLine className="w-5 h-5 text-primary" weight="duotone" />
            <h3 className="text-xl font-bold">Learning Progress</h3>
          </div>

          {/* FIXED: Real-time accuracy trend chart */}
          {chartData.length > 0 && (
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Accuracy']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <Tabs value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="scope">Scope Analysis</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="scope" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Accuracy Score</span>
                  <span className="text-lg font-bold text-primary">{scopeMetrics.accuracy.toFixed(1)}%</span>
                </div>
                <Progress value={scopeMetrics.accuracy} className="h-3" />
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Predictions</span>
                    <span className="font-semibold">{scopeMetrics.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Week-over-Week</span>
                    <Badge variant={scopeMetrics.weekOverWeek > 0 ? 'default' : 'secondary'}>
                      {scopeMetrics.weekOverWeek > 0 ? '+' : ''}{scopeMetrics.weekOverWeek.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Sparkle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" weight="fill" />
                    <div>
                      <p className="font-semibold mb-1">AI is Learning!</p>
                      <p className="text-sm text-muted-foreground">
                        Every job completed helps improve scope accuracy. Materials estimates are now {scopeMetrics.accuracy > 85 ? 'highly' : 'moderately'} accurate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Win Rate Optimization</span>
                  <span className="text-lg font-bold text-accent">{pricingMetrics.accuracy.toFixed(1)}%</span>
                </div>
                <Progress value={pricingMetrics.accuracy} className="h-3" />
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pricing Suggestions</span>
                    <span className="font-semibold">{pricingMetrics.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Improvement Trend</span>
                    <Badge variant={pricingMetrics.weekOverWeek > 0 ? 'default' : 'secondary'}>
                      {pricingMetrics.weekOverWeek > 0 ? '+' : ''}{pricingMetrics.weekOverWeek.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-start gap-3">
                    <Lightning className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                    <div>
                      <p className="font-semibold mb-1">Dynamic Pricing Active</p>
                      <p className="text-sm text-muted-foreground">
                        AI adjusts pricing based on demand, seasonality, and your win rate history.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" weight="duotone" />
            <h3 className="text-xl font-bold">Learning Timeline</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="bg-accent">Phase 1: Active</Badge>
                <span className="text-xs text-muted-foreground">Weeks 1-8</span>
              </div>
              <h4 className="font-semibold text-sm mt-2">Feedback Collection</h4>
              <p className="text-xs text-muted-foreground">
                Gathering data on estimate accuracy and learning from every completed job
              </p>
              <Progress value={75} className="h-2 mt-2" />
            </div>

            <Separator />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Phase 2: Upcoming</Badge>
                <span className="text-xs text-muted-foreground">Weeks 9-16</span>
              </div>
              <h4 className="font-semibold text-sm mt-2">Automated Learning</h4>
              <p className="text-xs text-muted-foreground">
                Nightly model retraining and confidence score adjustments
              </p>
            </div>

            <Separator />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Phase 3: Planned</Badge>
                <span className="text-xs text-muted-foreground">Months 4-12</span>
              </div>
              <h4 className="font-semibold text-sm mt-2">Predictive Intelligence</h4>
              <p className="text-xs text-muted-foreground">
                Demand forecasting, performance predictions, and risk scoring
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Upcoming Features</h4>
            <div className="space-y-2">
              {[
                'Weather-based demand forecasting',
                'Contractor performance predictions',
                'Real-time market rate adjustments',
                'Scope creep risk analysis',
              ].map((feature, index) => (
                <div key={feature} className="flex items-start gap-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
