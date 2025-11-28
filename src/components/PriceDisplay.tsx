// Price Display - Consistent currency formatting across the app
import { motion } from 'framer-motion';
import { CurrencyDollar, TrendUp, TrendDown } from '@phosphor-icons/react';

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCents?: boolean;
  showSymbol?: boolean;
  change?: number;
  label?: string;
  compact?: boolean;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
};

export function formatPrice(amount: number, compact = false, showCents = true): string {
  if (compact) {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1)}K`;
    }
  }
  
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });
}

export function PriceDisplay({
  amount,
  currency = 'USD',
  size = 'md',
  showCents = true,
  showSymbol = true,
  change,
  label,
  compact = false,
  animated = false,
}: PriceDisplayProps) {
  const formattedPrice = formatPrice(amount, compact, showCents && !compact);
  
  const content = (
    <div className="inline-flex flex-col">
      {label && (
        <span className="text-xs text-muted-foreground mb-0.5">{label}</span>
      )}
      <div className="flex items-center gap-1">
        {showSymbol && (
          <span className={`font-medium ${sizeClasses[size]} text-muted-foreground`}>$</span>
        )}
        <span className={`font-bold ${sizeClasses[size]}`}>
          {formattedPrice}
        </span>
        {change !== undefined && (
          <span className={`flex items-center text-xs font-medium ml-1 ${
            change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            {change > 0 ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
