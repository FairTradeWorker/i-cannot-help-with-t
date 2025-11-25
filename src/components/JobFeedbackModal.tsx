import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
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
import { recordPredictionOutcome } from '@/lib/ai-service';
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
  const [accuracy, setAccuracy] = useState(50);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const predictedCost = (prediction.estimatedCost.min + prediction.estimatedCost.max) / 2;
  const costDifference = actualCost - predictedCost;
  const costDifferencePercent = (costDifference / predictedCost) * 100;

  const predictedMaterialsCost = prediction.materials.reduce((sum, m) => sum + m.estimatedCost, 0);
  const materialsDifference = actualMaterialsCost - predictedMaterialsCost;

  const laborDifference = actualLaborHours - prediction.laborHours;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await recordPredictionOutcome(
        job.id,
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
          rating: accuracy,
          comments: comments || undefined,
        }
      );

      toast.success('Feedback submitted! AI is learning from this job.', {
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
          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Estimate Accuracy
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Total Cost</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold">${actualCost.toLocaleString()}</p>
                  <Badge variant={Math.abs(costDifferencePercent) < 15 ? 'default' : 'destructive'}>
                    {costDifferencePercent > 0 ? '+' : ''}{costDifferencePercent.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Predicted: ${predictedCost.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Materials</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold">${actualMaterialsCost.toLocaleString()}</p>
                  {materialsDifference !== 0 && (
                    <Badge variant={Math.abs(materialsDifference) < predictedMaterialsCost * 0.15 ? 'default' : 'secondary'}>
                      {materialsDifference > 0 ? '+' : ''}${Math.abs(materialsDifference).toLocaleString()}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Predicted: ${predictedMaterialsCost.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Labor Hours</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold">{actualLaborHours}h</p>
                  {laborDifference !== 0 && (
                    <Badge variant={Math.abs(laborDifference) < prediction.laborHours * 0.20 ? 'default' : 'secondary'}>
                      {laborDifference > 0 ? '+' : ''}{laborDifference}h
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Predicted: {prediction.laborHours}h
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Label>How accurate was the AI estimate?</Label>
            <div className="flex items-center gap-4">
              <ThumbsDown className="w-5 h-5 text-muted-foreground" />
              <Slider
                value={[accuracy]}
                onValueChange={(value) => setAccuracy(value[0])}
                min={0}
                max={100}
                step={5}
                className="flex-1"
              />
              <ThumbsUp className="w-5 h-5 text-accent" weight="fill" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Not Accurate</span>
              <Badge variant={accuracy > 70 ? 'default' : accuracy > 40 ? 'secondary' : 'destructive'}>
                {accuracy}% Accurate
              </Badge>
              <span className="text-muted-foreground">Very Accurate</span>
            </div>
          </div>

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
