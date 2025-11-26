/**
 * Usage Warnings Component
 * Displays warnings at 80% and 90% of API quota usage
 */

import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { X, AlertTriangle, TrendingUp, Bell, ArrowUpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface UsageWarningsProps {
  used: number;
  limit: number;
  plan?: string;
  resetDate?: Date;
  onUpgrade?: () => void;
  onDismiss?: (threshold: number) => void;
  dismissedThresholds?: number[];
  className?: string;
}

export function UsageWarnings({
  used,
  limit,
  plan = 'Free',
  resetDate,
  onUpgrade,
  onDismiss,
  dismissedThresholds = [],
  className
}: UsageWarningsProps) {
  const percentage = (used / limit) * 100;
  const remaining = limit - used;
  
  // Check which threshold we're at
  const getActiveThreshold = (): number | null => {
    if (percentage >= 90 && !dismissedThresholds.includes(90)) return 90;
    if (percentage >= 80 && !dismissedThresholds.includes(80)) return 80;
    return null;
  };
  
  const activeThreshold = getActiveThreshold();
  
  if (!activeThreshold) return null;
  
  const is90Percent = activeThreshold === 90;
  
  return (
    <div className={cn("rounded-lg border p-4", is90Percent ? "border-orange-300 bg-orange-50" : "border-yellow-300 bg-yellow-50", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            is90Percent ? "bg-orange-100" : "bg-yellow-100"
          )}>
            {is90Percent ? (
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            ) : (
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            )}
          </div>
          
          <div className="flex-1">
            <h4 className={cn("font-semibold", is90Percent ? "text-orange-800" : "text-yellow-800")}>
              {is90Percent ? '90% of API Quota Used' : '80% of API Quota Used'}
            </h4>
            
            <p className={cn("text-sm mt-1", is90Percent ? "text-orange-700" : "text-yellow-700")}>
              {is90Percent ? (
                <>You're almost at your limit! Only <strong>{remaining.toLocaleString()}</strong> API calls remaining.</>
              ) : (
                <>You've used {percentage.toFixed(0)}% of your monthly quota. <strong>{remaining.toLocaleString()}</strong> calls remaining.</>
              )}
            </p>
            
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className={is90Percent ? "text-orange-600" : "text-yellow-600"}>
                  {used.toLocaleString()} / {limit.toLocaleString()} calls
                </span>
                <span className={is90Percent ? "text-orange-600" : "text-yellow-600"}>
                  {plan} Plan
                </span>
              </div>
              <Progress 
                value={percentage} 
                className={cn("h-2", is90Percent ? "[&>div]:bg-orange-500" : "[&>div]:bg-yellow-500")}
              />
            </div>
            
            {resetDate && (
              <p className="text-xs text-muted-foreground mt-2">
                Quota resets on {resetDate.toLocaleDateString()} at {resetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-4">
              {onUpgrade && (
                <Button
                  onClick={onUpgrade}
                  size="sm"
                  className={is90Percent ? "bg-orange-600 hover:bg-orange-700" : "bg-yellow-600 hover:bg-yellow-700"}
                >
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDismiss?.(activeThreshold)}
                className={is90Percent ? "border-orange-300 text-orange-700" : "border-yellow-300 text-yellow-700"}
              >
                Remind me later
              </Button>
            </div>
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick={() => onDismiss(activeThreshold)}
            className={cn(
              "p-1 rounded hover:bg-black/5",
              is90Percent ? "text-orange-600" : "text-yellow-600"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Compact banner for top of page
interface UsageBannerProps {
  used: number;
  limit: number;
  onUpgrade?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function UsageBanner({
  used,
  limit,
  onUpgrade,
  onDismiss,
  className
}: UsageBannerProps) {
  const percentage = (used / limit) * 100;
  
  if (percentage < 80) return null;
  
  const is90Plus = percentage >= 90;
  
  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-2 text-sm",
      is90Plus ? "bg-orange-500 text-white" : "bg-yellow-400 text-yellow-900",
      className
    )}>
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <span>
          {is90Plus
            ? `⚠️ You've used ${percentage.toFixed(0)}% of your API quota. Upgrade to avoid interruptions.`
            : `You're approaching your API limit (${percentage.toFixed(0)}% used).`
          }
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {onUpgrade && (
          <Button
            size="sm"
            variant={is90Plus ? "secondary" : "outline"}
            onClick={onUpgrade}
            className="h-7"
          >
            Upgrade Now
          </Button>
        )}
        {onDismiss && (
          <button onClick={onDismiss} className="p-1 hover:opacity-80">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Hook for managing usage warning state
export function useUsageWarnings(used: number, limit: number) {
  const [dismissedThresholds, setDismissedThresholds] = useState<number[]>([]);
  
  // Reset dismissed thresholds when usage drops below thresholds
  useEffect(() => {
    const percentage = (used / limit) * 100;
    
    if (percentage < 80 && dismissedThresholds.includes(80)) {
      setDismissedThresholds(prev => prev.filter(t => t !== 80));
    }
    if (percentage < 90 && dismissedThresholds.includes(90)) {
      setDismissedThresholds(prev => prev.filter(t => t !== 90));
    }
  }, [used, limit, dismissedThresholds]);
  
  const dismiss = (threshold: number) => {
    setDismissedThresholds(prev => [...prev, threshold]);
  };
  
  return {
    dismissedThresholds,
    dismiss,
    shouldShowWarning: (used / limit) * 100 >= 80
  };
}
