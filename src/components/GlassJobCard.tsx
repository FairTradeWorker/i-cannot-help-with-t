import { MapPin, Clock, CurrencyDollar, Warning } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { GlassSurface } from './GlassSurface';
import { jobToGlassContext, enhanceGlassContext } from '@/lib/glass-context-utils';
import type { Job } from '@/lib/types';

interface GlassJobCardProps {
  job: Job;
  onClick?: () => void;
}

/**
 * Job Card with Glassmorphism 2.0
 * 
 * Automatically adapts glass properties based on:
 * - Urgency (critical jobs = thick glowing glass)
 * - AI Confidence (high confidence = sharp, low = hazy)
 * - Service Category (color tint)
 * - Weather (storm = dark, sunny = bright)
 * - Time of Day (morning = cool, evening = warm)
 */
export function GlassJobCard({ job, onClick }: GlassJobCardProps) {
  const baseContext = jobToGlassContext(job);
  const context = enhanceGlassContext(baseContext, {
    city: job.address.city,
    state: job.address.state
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
      case 'critical':
        return 'bg-red-600';
      case 'urgent':
      case 'high':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <GlassSurface
      id={`job-${job.id}`}
      context={context}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{job.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {job.description}
            </p>
          </div>
          <Badge className={getUrgencyColor(job.urgency)}>
            {job.urgency === 'emergency' && <Warning className="w-4 h-4 mr-1" weight="fill" />}
            {job.urgency.toUpperCase()}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{job.address.city}, {job.address.state}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{job.laborHours}h</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="text-xl font-bold text-primary">
              ${(job.estimatedCost.max / 1000).toFixed(1)}k
            </p>
          </div>
          <Badge variant="secondary">{job.bids.length} bids</Badge>
        </div>

        {/* AI Confidence indicator */}
        {job.scope?.confidenceScore && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">AI Confidence</span>
              <span className={job.scope.confidenceScore > 0.8 ? 'text-green-600' : job.scope.confidenceScore > 0.6 ? 'text-yellow-600' : 'text-red-600'}>
                {Math.round(job.scope.confidenceScore * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </GlassSurface>
  );
}

