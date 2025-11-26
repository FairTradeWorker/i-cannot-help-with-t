/**
 * Rate Limit Messaging Component
 * Displays rate limit warnings and error messages
 */

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { AlertTriangle, Clock, Zap, ArrowUpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface RateLimitWarningProps {
  used: number;
  limit: number;
  resetDate?: Date;
  onUpgrade?: () => void;
  className?: string;
}

export function RateLimitWarning({
  used,
  limit,
  resetDate,
  onUpgrade,
  className
}: RateLimitWarningProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const remaining = limit - used;
  
  // Determine severity
  const getSeverity = () => {
    if (percentage >= 100) return 'critical';
    if (percentage >= 90) return 'warning';
    if (percentage >= 80) return 'caution';
    return 'normal';
  };
  
  const severity = getSeverity();
  
  if (severity === 'normal') return null;
  
  const severityConfig = {
    caution: {
      variant: 'default' as const,
      icon: Clock,
      title: 'Approaching API Limit',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200',
    },
    warning: {
      variant: 'default' as const,
      icon: AlertTriangle,
      title: 'API Limit Warning',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
    },
    critical: {
      variant: 'destructive' as const,
      icon: Zap,
      title: 'API Limit Reached',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
    },
  };
  
  const config = severityConfig[severity];
  const Icon = config.icon;
  
  return (
    <Alert className={cn(config.bgColor, className)}>
      <Icon className={cn('h-4 w-4', config.color)} />
      <AlertTitle className={config.color}>{config.title}</AlertTitle>
      <AlertDescription>
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>
              {used.toLocaleString()} / {limit.toLocaleString()} API calls used
            </span>
            <span className={config.color}>{percentage.toFixed(0)}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
          
          {severity === 'critical' ? (
            <p className="mt-2 text-sm">
              You've reached your monthly API limit. API calls will return 429 errors until your quota resets.
            </p>
          ) : (
            <p className="mt-2 text-sm">
              You have {remaining.toLocaleString()} API calls remaining this month.
            </p>
          )}
          
          {resetDate && (
            <p className="mt-1 text-xs text-muted-foreground">
              Resets on {resetDate.toLocaleDateString()} at {resetDate.toLocaleTimeString()}
            </p>
          )}
          
          {onUpgrade && (
            <Button
              onClick={onUpgrade}
              size="sm"
              className="mt-3"
              variant={severity === 'critical' ? 'default' : 'outline'}
            >
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Inline rate limit indicator for headers/sidebars
interface RateLimitBadgeProps {
  used: number;
  limit: number;
  showText?: boolean;
  className?: string;
}

export function RateLimitBadge({
  used,
  limit,
  showText = true,
  className
}: RateLimitBadgeProps) {
  const percentage = (used / limit) * 100;
  
  const getColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-orange-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        <div className={cn("h-2 w-2 rounded-full", getColor())} />
        {showText && (
          <span className="text-xs text-muted-foreground">
            {used.toLocaleString()}/{limit.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

// Rate limit error message for API responses
interface RateLimitErrorProps {
  retryAfter?: number;
  onRetry?: () => void;
  className?: string;
}

export function RateLimitError({
  retryAfter,
  onRetry,
  className
}: RateLimitErrorProps) {
  const [countdown, setCountdown] = React.useState(retryAfter || 60);
  
  React.useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(c => Math.max(0, c - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);
  
  return (
    <div className={cn(
      "rounded-lg border border-red-200 bg-red-50 p-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <Zap className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-800">Rate Limit Exceeded</h4>
          <p className="text-sm text-red-700 mt-1">
            You've exceeded your API rate limit. Please wait before making more requests.
          </p>
          
          {countdown > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">
                Retry in {countdown} seconds
              </span>
            </div>
          )}
          
          {countdown === 0 && onRetry && (
            <Button
              onClick={onRetry}
              size="sm"
              variant="outline"
              className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
            >
              Retry Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
