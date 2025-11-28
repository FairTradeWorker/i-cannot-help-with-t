// Notification Badge - Animated notification indicator
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBadgeProps {
  count: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'blue' | 'green' | 'amber';
  pulse?: boolean;
  showZero?: boolean;
}

const sizeClasses = {
  sm: 'min-w-4 h-4 text-[10px]',
  md: 'min-w-5 h-5 text-xs',
  lg: 'min-w-6 h-6 text-sm',
};

const colorClasses = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
};

export function NotificationBadge({
  count,
  max = 99,
  size = 'md',
  color = 'red',
  pulse = true,
  showZero = false,
}: NotificationBadgeProps) {
  const displayCount = count > max ? `${max}+` : count.toString();
  const show = showZero || count > 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="relative"
        >
          {pulse && count > 0 && (
            <span
              className={`
                absolute inset-0 rounded-full animate-ping opacity-75
                ${colorClasses[color]}
              `}
            />
          )}
          <span
            className={`
              relative inline-flex items-center justify-center px-1 rounded-full
              font-bold text-white ${sizeClasses[size]} ${colorClasses[color]}
            `}
          >
            {displayCount}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Wrapper component for adding badge to icons
interface WithBadgeProps {
  children: React.ReactNode;
  count: number;
  max?: number;
  color?: 'red' | 'blue' | 'green' | 'amber';
}

export function WithBadge({ children, count, max = 99, color = 'red' }: WithBadgeProps) {
  return (
    <div className="relative inline-flex">
      {children}
      {count > 0 && (
        <div className="absolute -top-1.5 -right-1.5">
          <NotificationBadge count={count} max={max} color={color} size="sm" />
        </div>
      )}
    </div>
  );
}
