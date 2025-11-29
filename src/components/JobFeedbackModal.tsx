import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  Warning,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Target,
  CurrencyDollar,
  Clock,
  Package,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { recordPredictionOutcome, recordLearningFeedback } from '@/lib/ai-service';
import { learningDB } from '@/lib/learning-db';
import type { Job, JobScope } from '@/lib/types';

interface JobFeedbackModalProps {
  open: boolean;
  onClose: () => void;
  job: Job;
  prediction: JobScope;
  actualCost: number;
  actualMaterialsCost: number;
  actualLaborHours: number;
}

export function JobFeedbackModal({
  open,
  onClose,
  job,
  prediction,
  actualCost,
  actualMaterialsCost,
  actualLaborHours,
}: JobFeedbackModalProps) {
  const [scopeAccurate, setScopeAccurate] = useState<boolean | null>(null);
  const [actualMaterialsUsed, setActualMaterialsUsed] = useState<string>('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const predictedCost = (prediction.estimatedCost.min + prediction.estimatedCost.max) / 2;
  const costDifference = actualCost - predictedCost;
  const costDifferencePercent = (costDifference / predictedCost) * 100;

  const predictedMaterialsCost = prediction.materials.reduce((sum, m) => sum + m.estimatedCost, 0);
  const materialsDifference = actualMaterialsCost - predictedMaterialsCost;

  const laborDifference = actualLaborHours - prediction.laborHours;
  
  // Calculate predicted materials list for comparison
  const predictedMaterialsList = prediction.materials.map(m => 
    `${m.name} - ${m.quantity} ${m.unit}`
  ).join('\n');

  const handleSubmit = async () => {
    if (scopeAccurate === null) {
      toast.error('Please indicate if the scope was accurate');
      return;
    }

    setSubmitting(true);
    try {
      // Use predictionId from job if available, otherwise use job.id
      const predictionId = (job as any).predictionId || `job-${job.id}`;
      
      // FIXED: Record learning feedback for AI improvement
      if (job.predictionId) {
        await recordLearningFeedback(
          job.predictionId,
          job.id,
          { totalCost: actualCost, laborHours: actualLaborHours }
        );
        
        // Log learning context after recording feedback
        const ctx = await learningDB.getContext();
        console.log("AI is learning:", ctx);
      }
      
      await recordPredictionOutcome(
        predictionId,
        'scope',
        {
          estimatedCost: prediction.estimatedCost,
          materials: predictedMaterialsCost,
          laborHours: prediction.laborHours,
        },
        {
          finalCost: actualCost,
          materialsCost: actualMaterialsCost,
          laborHours: actualLaborHours,
        },
        {
          scopeAccurate: scopeAccurate,
          actualMaterialsUsed: actualMaterialsUsed || undefined,
          comments: comments || undefined,
        }
      );

      toast.success('Thank you! Our AI just got smarter', {
        description: 'Your feedback helps improve future estimates.',
      });

      onClose();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Brain className="w-6 h-6 text-white" weight="duotone" />
            </div>
            <div>
              <DialogTitle>Help AI Learn</DialogTitle>
              <DialogDescription>
                How accurate was the estimate for this job?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Question 1: Was the scope accurate? */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Was the scope accurate?</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={scopeAccurate === true ? 'default' : 'outline'}
                onClick={() => setScopeAccurate(true)}
                className="flex-1"
                size="lg"
              >
                <ThumbsUp className="w-5 h-5 mr-2" />
                Yes
              </Button>
              <Button
                type="button"
                variant={scopeAccurate === false ? 'destructive' : 'outline'}
                onClick={() => setScopeAccurate(false)}
                className="flex-1"
                size="lg"
              >
                <ThumbsDown className="w-5 h-5 mr-2" />
                No
              </Button>
            </div>
          </div>

          <Separator />

          {/* Actual vs Predicted Comparison */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Actual vs Predicted
            </h4>

            {/* Actual Materials Used */}
            <div className="space-y-2">
              <Label htmlFor="actual-materials">
                Actual Materials Used
                <span className="text-xs text-muted-foreground ml-2">(vs predicted)</span>
              </Label>
              <Textarea
                id="actual-materials"
                placeholder={`Predicted:\n${predictedMaterialsList}\n\nEnter actual materials used...`}
                value={actualMaterialsUsed}
                onChange={(e) => setActualMaterialsUsed(e.target.value)}
                rows={6}
                className="resize-none font-mono text-sm"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Predicted Cost: ${predictedMaterialsCost.toLocaleString()}</span>
                <span>Actual Cost: ${actualMaterialsCost.toLocaleString()}</span>
                {materialsDifference !== 0 && (
                  <Badge variant={Math.abs(materialsDifference) < predictedMaterialsCost * 0.15 ? 'default' : 'secondary'}>
                    {materialsDifference > 0 ? '+' : ''}${Math.abs(materialsDifference).toLocaleString()}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actual Labor Hours */}
            <div className="space-y-2">
              <Label htmlFor="actual-labor-hours">
                Actual Labor Hours
                <span className="text-xs text-muted-foreground ml-2">(vs predicted)</span>
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Predicted</p>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-lg font-bold">{prediction.laborHours}h</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Actual</p>
                  <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <p className="text-lg font-bold">{actualLaborHours}h</p>
                    {laborDifference !== 0 && (
                      <Badge variant={Math.abs(laborDifference) < prediction.laborHours * 0.20 ? 'default' : 'secondary'} className="mt-1">
                        {laborDifference > 0 ? '+' : ''}{laborDifference}h
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actual Total Cost */}
            <div className="space-y-2">
              <Label htmlFor="actual-total-cost">
                Actual Total Cost
                <span className="text-xs text-muted-foreground ml-2">(vs predicted)</span>
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Predicted</p>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-lg font-bold font-mono">
                      ${predictedCost.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Range: ${prediction.estimatedCost.min.toLocaleString()} - ${prediction.estimatedCost.max.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Actual</p>
                  <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <p className="text-lg font-bold font-mono">${actualCost.toLocaleString()}</p>
                    <Badge 
                      variant={Math.abs(costDifferencePercent) < 15 ? 'default' : 'destructive'} 
                      className="mt-1"
                    >
                      {costDifferencePercent > 0 ? '+' : ''}{costDifferencePercent.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="feedback-comments">
              Additional Comments (Optional)
            </Label>
            <Textarea
              id="feedback-comments"
              placeholder="What was different from the estimate? Were there unexpected issues?"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" weight="fill" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Why This Matters</p>
                <p className="text-muted-foreground">
                  Your feedback trains the AI to make better estimates. Over time, this improves pricing accuracy
                  for you and all contractors on the platform.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Skip for Now
            </Button>
            <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface QuickFeedbackPromptProps {
  job: Job;
  prediction: JobScope;
  onProvideFeedback: () => void;
}

export function QuickFeedbackPrompt({ job, prediction, onProvideFeedback }: QuickFeedbackPromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card p-5 border-2 border-primary/30">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="w-6 h-6 text-primary" weight="duotone" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold mb-1 flex items-center gap-2">
              Help AI Improve
              <Badge variant="secondary" className="text-xs">2 min</Badge>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Job completed! Was the AI estimate accurate? Your feedback helps improve future predictions.
            </p>
            
            <div className="flex gap-2">
              <Button size="sm" onClick={onProvideFeedback}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Provide Feedback
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDismissed(true)}>
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
