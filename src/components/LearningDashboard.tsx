import { useState, useEffect } from 'react';
import { TrendUp, CheckCircle, XCircle, Clock } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { learningDB, type LearningFeedback } from '@/lib/ai-service';

export function LearningDashboard() {
  const [feedback, setFeedback] = useState<LearningFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await learningDB.getAllFeedback();
      setFeedback(data);
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
        pricingPredictions: 0
      };
    }

    const avgAccuracy = feedback.reduce((sum, f) => sum + (f.performanceMetrics.accuracy || 0), 0) / feedback.length;
    const scopePredictions = feedback.filter(f => f.predictionType === 'scope').length;
    const pricingPredictions = feedback.filter(f => f.predictionType === 'pricing').length;

    return {
      totalPredictions: feedback.length,
      avgAccuracy: (avgAccuracy * 100).toFixed(1),
      scopePredictions,
      pricingPredictions
    };
  };

  const stats = calculateStats();

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
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendUp className="w-8 h-8 text-primary" weight="fill" />
          <div>
            <h3 className="text-2xl font-bold">AI Learning Dashboard</h3>
            <p className="text-muted-foreground">System performance and self-improvement metrics</p>
          </div>
        </div>

        <Separator className="my-6" />

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
                  {item.userFeedback && (
                    <div className="flex items-center gap-2 mt-2">
                      {item.userFeedback.wasAccurate ? (
                        <CheckCircle className="w-4 h-4 text-accent" weight="fill" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" weight="fill" />
                      )}
                      <span className="text-sm">
                        Rating: {item.userFeedback.rating}/5
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
