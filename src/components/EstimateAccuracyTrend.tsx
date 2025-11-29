import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  TrendUp,
  TrendDown,
  Target,
  CheckCircle,
  Lightning,
  Sparkle,
} from '@phosphor-icons/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { learningDB, type LearningFeedback } from '@/lib/learning-db';

interface EstimateAccuracyTrendProps {
  contractorId?: string;
}

export function EstimateAccuracyTrend({ contractorId }: EstimateAccuracyTrendProps) {
  const [feedback, setFeedback] = useState<LearningFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasCelebratedRef = useRef(false);

  useEffect(() => {
    loadFeedback();
  }, [contractorId]);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const allFeedback = await learningDB.getAll();
      // FIXED: Use type guard for filtering
      const scopeFeedback = allFeedback.filter((f): f is LearningFeedback => f.predictionType === "scope");
      setFeedback(scopeFeedback);
      
      // FIXED: Check if accuracy crossed 90% for the first time
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

  const calculateMetrics = () => {
    if (feedback.length === 0) {
      return {
        overallAccuracy: 0,
        totalPredictions: 0,
        recentTrend: 0,
        weekOverWeek: 0,
        accuracyRating: 'No Data',
      };
    }

    const recent = feedback.slice(-30);
    const avgAccuracy = recent.reduce((sum, f) => sum + (f.performanceMetrics.accuracy || 0), 0) / recent.length;
    
    const lastWeek = feedback.slice(-7);
    const previousWeek = feedback.slice(-14, -7);
    
    const lastWeekAccuracy = lastWeek.length > 0
      ? lastWeek.reduce((sum, f) => sum + (f.performanceMetrics.accuracy || 0), 0) / lastWeek.length
      : 0;
    
    const previousWeekAccuracy = previousWeek.length > 0
      ? previousWeek.reduce((sum, f) => sum + (f.performanceMetrics.accuracy || 0), 0) / previousWeek.length
      : 0;
    
    const weekOverWeek = previousWeekAccuracy > 0
      ? ((lastWeekAccuracy - previousWeekAccuracy) / previousWeekAccuracy) * 100
      : 0;

    let accuracyRating = 'Fair';
    if (avgAccuracy > 0.9) accuracyRating = 'Excellent';
    else if (avgAccuracy > 0.8) accuracyRating = 'Very Good';
    else if (avgAccuracy > 0.7) accuracyRating = 'Good';

    return {
      overallAccuracy: avgAccuracy * 100,
      totalPredictions: feedback.length,
      recentTrend: weekOverWeek,
      weekOverWeek,
      accuracyRating,
    };
  };

  const metrics = calculateMetrics();

  // FIXED: Prepare chart data with timestamps
  const chartData = feedback
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((f, index) => ({
      index,
      date: new Date(f.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      accuracy: (f.performanceMetrics.accuracy || 0) * 100,
      timestamp: new Date(f.timestamp).getTime()
    }));

  if (loading) {
    return (
      <Card className="glass-card p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full" />
        </div>
      </Card>
    );
  }

  if (metrics.totalPredictions === 0) {
    return (
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="w-6 h-6 text-primary" weight="duotone" />
          </div>
          <div>
            <h3 className="font-semibold">AI Estimate Accuracy</h3>
            <p className="text-sm text-muted-foreground">No estimates yet</p>
          </div>
        </div>
        <div className="text-center py-6">
          <Sparkle className="w-12 h-12 text-muted-foreground mx-auto mb-3" weight="duotone" />
          <p className="text-sm text-muted-foreground">
            Complete jobs with AI estimates to see accuracy trends
          </p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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

      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Brain className="w-6 h-6 text-white" weight="duotone" />
            </div>
            <div>
              <h3 className="font-semibold">AI Estimate Accuracy</h3>
              <p className="text-sm text-muted-foreground">
                {metrics.totalPredictions} predictions analyzed
              </p>
            </div>
          </div>
          <Badge variant={metrics.overallAccuracy > 80 ? 'default' : 'secondary'}>
            {metrics.accuracyRating}
          </Badge>
        </div>

        {/* FIXED: Jobs Taught AI and Accuracy in big bold numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-6 border-2 border-primary/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Brain className="w-5 h-5" weight="bold" />
              <span>Jobs Taught AI</span>
            </div>
            <p className="text-4xl font-bold text-primary font-mono">{metrics.totalPredictions}</p>
          </div>

          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg p-6 border-2 border-accent/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <TrendUp className="w-5 h-5" weight="bold" />
              <span>Current Avg Accuracy</span>
            </div>
            <p className="text-4xl font-bold text-accent font-mono">{metrics.overallAccuracy.toFixed(1)}%</p>
          </div>
        </div>

        {/* FIXED: Real-time accuracy trend chart */}
        {chartData.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendUp className="w-5 h-5 text-primary" />
              Accuracy Trend Over Time
            </h4>
            <ResponsiveContainer width="100%" height={250}>
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

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Overall Accuracy</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {metrics.overallAccuracy.toFixed(1)}%
                </span>
                {metrics.weekOverWeek !== 0 && (
                  <Badge variant={metrics.weekOverWeek > 0 ? 'default' : 'secondary'}>
                    {metrics.weekOverWeek > 0 ? (
                      <TrendUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(metrics.weekOverWeek).toFixed(1)}%
                  </Badge>
                )}
              </div>
            </div>
            <Progress value={metrics.overallAccuracy} className="h-3" />
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4 text-primary" weight="duotone" />
              </div>
              <p className="text-2xl font-bold">{metrics.totalPredictions}</p>
              <p className="text-xs text-muted-foreground">Total Jobs</p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="w-4 h-4 text-accent" weight="duotone" />
              </div>
              <p className="text-2xl font-bold">
                {Math.round((metrics.overallAccuracy / 100) * metrics.totalPredictions)}
              </p>
              <p className="text-xs text-muted-foreground">Accurate</p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Lightning className="w-4 h-4 text-secondary" weight="duotone" />
              </div>
              <p className="text-2xl font-bold">
                {metrics.weekOverWeek > 0 ? '+' : ''}
                {metrics.weekOverWeek.toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">Week Trend</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <p className="font-semibold text-sm mb-1">AI Learning Active</p>
                <p className="text-xs text-muted-foreground">
                  {metrics.overallAccuracy > 85
                    ? 'Excellent accuracy! AI predictions are highly reliable for your type of work.'
                    : metrics.overallAccuracy > 70
                    ? 'Good progress! AI is learning your work patterns and improving estimates.'
                    : 'AI is still learning. More completed jobs will improve prediction accuracy.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
