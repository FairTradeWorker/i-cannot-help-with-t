import { useState, useEffect, useRef } from 'react';
import { TrendUp, CheckCircle, XCircle, Clock, Brain, Sparkle } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { learningDB, type LearningFeedback } from '@/lib/learning-db';

export function LearningDashboard() {
  const [feedback, setFeedback] = useState<LearningFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasCelebratedRef = useRef(false);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await learningDB.getAll();
      setFeedback(data);
      
      // FIXED: Check if accuracy crossed 90% for the first time
      const scopeFeedback = data.filter((f): f is LearningFeedback => f.predictionType === "scope");
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

  const calculateStats = () => {
    if (feedback.length === 0) {
      return {
        totalPredictions: 0,
        avgAccuracy: 0,
        scopePredictions: 0,
        pricingPredictions: 0,
        jobsTaughtAI: 0
      };
    }

    // FIXED: Use type guards for filtering
    const scopeFeedback = feedback.filter((f): f is LearningFeedback => f.predictionType === "scope");
    const pricingFeedback = feedback.filter((f): f is LearningFeedback => f.predictionType === "pricing");

    const avgAccuracy = feedback.reduce((sum, f) => sum + (f.performanceMetrics.accuracy || 0), 0) / feedback.length;

    return {
      totalPredictions: feedback.length,
      avgAccuracy: (avgAccuracy * 100).toFixed(1),
      scopePredictions: scopeFeedback.length,
      pricingPredictions: pricingFeedback.length,
      jobsTaughtAI: feedback.length
    };
  };

  const stats = calculateStats();

  // FIXED: Prepare chart data with timestamps
  const chartData = feedback
    .filter((f): f is LearningFeedback => f.predictionType === "scope")
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((f, index) => ({
      index,
      date: new Date(f.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      accuracy: (f.performanceMetrics.accuracy || 0) * 100,
      timestamp: new Date(f.timestamp).getTime()
    }));

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-3 text-muted-foreground">Loading learning data...</p>
        </div>
      </Card>
    );
  }

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

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendUp className="w-8 h-8 text-primary" weight="fill" />
          <div>
            <h3 className="text-2xl font-bold">AI Learning Dashboard</h3>
            <p className="text-muted-foreground">System performance and self-improvement metrics</p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* FIXED: Jobs Taught AI and Accuracy in big bold numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-8 border-2 border-primary/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Brain className="w-5 h-5" weight="bold" />
              <span>Jobs Taught AI</span>
            </div>
            <p className="text-5xl font-bold text-primary font-mono">{stats.jobsTaughtAI}</p>
          </div>

          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg p-8 border-2 border-accent/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <TrendUp className="w-5 h-5" weight="bold" />
              <span>Current Avg Accuracy</span>
            </div>
            <p className="text-5xl font-bold text-accent font-mono">{stats.avgAccuracy}%</p>
          </div>
        </div>

        {/* FIXED: Real-time accuracy trend chart */}
        {chartData.length > 0 && (
          <Card className="p-6 mb-6">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendUp className="w-5 h-5 text-primary" />
              Accuracy Trend Over Time
            </h4>
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
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-primary/10 rounded-lg p-6 border-2 border-primary/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CheckCircle className="w-4 h-4" weight="bold" />
              <span>Total Predictions</span>
            </div>
            <p className="text-4xl font-bold text-primary font-mono">{stats.totalPredictions}</p>
          </div>

          <div className="bg-accent/10 rounded-lg p-6 border-2 border-accent/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <TrendUp className="w-4 h-4" weight="bold" />
              <span>Avg Accuracy</span>
            </div>
            <p className="text-4xl font-bold text-accent font-mono">{stats.avgAccuracy}%</p>
          </div>

          <div className="bg-muted rounded-lg p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CheckCircle className="w-4 h-4" weight="bold" />
              <span>Scope Predictions</span>
            </div>
            <p className="text-4xl font-bold text-foreground font-mono">{stats.scopePredictions}</p>
          </div>

          <div className="bg-muted rounded-lg p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CheckCircle className="w-4 h-4" weight="bold" />
              <span>Pricing Predictions</span>
            </div>
            <p className="text-4xl font-bold text-foreground font-mono">{stats.pricingPredictions}</p>
          </div>
        </div>
      </Card>

      {feedback.length === 0 ? (
        <Card className="p-8 text-center">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
          <h4 className="text-lg font-semibold mb-2">No Learning Data Yet</h4>
          <p className="text-muted-foreground">Start analyzing videos and providing feedback to train the AI system</p>
        </Card>
      ) : (
        <Card className="p-6">
          <h4 className="text-lg font-bold mb-4">Recent Predictions</h4>
          <div className="space-y-3">
            {feedback.slice(-10).reverse().map((item, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={item.predictionType === 'scope' ? 'default' : 'secondary'}>
                      {item.predictionType}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  {/* FIXED: Safe optional chaining for userFeedback */}
                  {item.userFeedback && (
                    <div className="flex items-center gap-2 mt-2">
                      {item.userFeedback.wasAccurate ? (
                        <CheckCircle className="w-4 h-4 text-accent" weight="fill" />
                      ) : item.userFeedback.wasAccurate === false ? (
                        <XCircle className="w-4 h-4 text-destructive" weight="fill" />
                      ) : null}
                      <span className="text-sm">
                        Rating: {item.userFeedback.rating ?? "—"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                  <p className="text-xl font-bold font-mono">
                    {((item.performanceMetrics.accuracy || 0) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
