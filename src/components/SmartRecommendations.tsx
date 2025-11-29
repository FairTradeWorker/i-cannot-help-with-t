import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Robot,
  Sparkle,
  Brain,
  Lightning,
  ChartLineUp,
  MagicWand,
  Target,
  Clock,
  ArrowRight,
  CheckCircle,
  Info,
} from '@phosphor-icons/react';

interface SmartSuggestion {
  id: string;
  type: 'pricing' | 'timing' | 'market' | 'efficiency';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionLabel: string;
  details?: string;
}

interface MarketInsight {
  metric: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

const MOCK_SUGGESTIONS: SmartSuggestion[] = [
  {
    id: '1',
    type: 'pricing',
    title: 'Optimize Your Bid',
    description: 'Based on 847 similar jobs, bidding $8,500 gives you a 73% higher win rate',
    impact: 'high',
    confidence: 89,
    actionLabel: 'Apply Suggestion',
    details: 'Your current bid of $9,200 is 8% above market average for roofing jobs in this area.',
  },
  {
    id: '2',
    type: 'timing',
    title: 'Best Time to Post',
    description: 'Jobs posted between 8-10 AM get 45% more contractor bids',
    impact: 'medium',
    confidence: 76,
    actionLabel: 'Schedule Post',
  },
  {
    id: '3',
    type: 'market',
    title: 'High Demand Alert',
    description: 'HVAC installations are up 34% in your service area this month',
    impact: 'high',
    confidence: 94,
    actionLabel: 'View Opportunities',
  },
  {
    id: '4',
    type: 'efficiency',
    title: 'Route Optimization',
    description: 'Rearranging tomorrow\'s jobs could save you 47 minutes of drive time',
    impact: 'medium',
    confidence: 82,
    actionLabel: 'Optimize Route',
  },
];

const MOCK_INSIGHTS: MarketInsight[] = [
  { metric: 'Avg. Job Value', value: '$2,850', trend: 'up', change: 12 },
  { metric: 'Jobs This Week', value: '234', trend: 'up', change: 8 },
  { metric: 'Contractor Activity', value: '1.2K', trend: 'stable', change: 2 },
  { metric: 'Completion Rate', value: '94%', trend: 'up', change: 3 },
];

const TYPE_ICONS = {
  pricing: Target,
  timing: Clock,
  market: ChartLineUp,
  efficiency: Lightning,
};

const TYPE_COLORS = {
  pricing: 'bg-blue-500',
  timing: 'bg-purple-500',
  market: 'bg-green-500',
  efficiency: 'bg-orange-500',
};

export function SmartRecommendations() {
  const [suggestions] = useState<SmartSuggestion[]>(MOCK_SUGGESTIONS);
  const [insights] = useState<MarketInsight[]>(MOCK_INSIGHTS);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const applySuggestion = (id: string) => {
    setAppliedSuggestions(prev => new Set([...prev, id]));
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Brain className="w-8 h-8 text-white" weight="fill" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Assistant</h2>
            <p className="text-muted-foreground">Personalized recommendations powered by AI</p>
          </div>
        </div>
        <Button onClick={runAnalysis} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="mr-2"
              >
                <Sparkle className="w-4 h-4" />
              </motion.div>
              Analyzing...
            </>
          ) : (
            <>
              <MagicWand className="w-4 h-4 mr-2" />
              Run Analysis
            </>
          )}
        </Button>
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="glass-card">
              <Card className="p-4 border-0 bg-transparent">
                <p className="text-xs text-muted-foreground mb-1">{insight.metric}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold">{insight.value}</p>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      insight.trend === 'up'
                        ? 'bg-green-100 text-green-700'
                        : insight.trend === 'down'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {insight.trend === 'up' ? '+' : insight.trend === 'down' ? '-' : ''}
                    {insight.change}%
                  </Badge>
                </div>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Suggestions */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Robot className="w-5 h-5" />
          Smart Suggestions
        </h3>

        <div className="space-y-4">
          {suggestions.map((suggestion, i) => {
            const IconComponent = TYPE_ICONS[suggestion.type];
            const isApplied = appliedSuggestions.has(suggestion.id);

            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`glass-card ${isApplied ? 'opacity-60' : ''}`}>
                  <Card className="p-4 border-0 bg-transparent">
                    <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${TYPE_COLORS[suggestion.type]}`}>
                      <IconComponent className="w-6 h-6 text-white" weight="fill" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{suggestion.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            suggestion.impact === 'high'
                              ? 'border-green-500 text-green-600'
                              : suggestion.impact === 'medium'
                              ? 'border-yellow-500 text-yellow-600'
                              : 'border-gray-400 text-gray-500'
                          }`}
                        >
                          {suggestion.impact} impact
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {suggestion.description}
                      </p>

                      {showDetails === suggestion.id && suggestion.details && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="bg-muted rounded-lg p-3 mb-3"
                        >
                          <p className="text-sm">{suggestion.details}</p>
                        </motion.div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Confidence:</span>
                          <Progress value={suggestion.confidence} className="w-20 h-2" />
                          <span className="text-xs font-medium">{suggestion.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {isApplied ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                          Applied
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={() => applySuggestion(suggestion.id)}>
                          {suggestion.actionLabel}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                      {suggestion.details && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowDetails(showDetails === suggestion.id ? null : suggestion.id)
                          }
                        >
                          <Info className="w-3 h-3 mr-1" />
                          {showDetails === suggestion.id ? 'Hide' : 'Details'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* AI Confidence Explanation */}
      <div className="glass-card border-primary/20">
        <Card className="p-4 border-0 bg-transparent">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">How AI Recommendations Work</h4>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes thousands of data points including job history, market trends, 
                seasonal patterns, and your performance metrics to provide personalized suggestions. 
                Higher confidence scores indicate more reliable predictions based on available data.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
