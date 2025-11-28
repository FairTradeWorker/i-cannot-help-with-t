// Job Status Badge - Consistent status indicators across the app
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  Warning,
  XCircle,
  Hourglass,
  Play,
  Pause,
  Lightning,
} from '@phosphor-icons/react';

type JobStatus = 
  | 'pending' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled' 
  | 'on-hold' 
  | 'urgent' 
  | 'scheduled'
  | 'reviewing';

interface JobStatusBadgeProps {
  status: JobStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
}

const statusConfig: Record<JobStatus, { 
  label: string; 
  color: string; 
  bg: string; 
  icon: React.ReactNode 
}> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    icon: <Clock weight="fill" />,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: <Play weight="fill" />,
  },
  completed: {
    label: 'Completed',
    color: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: <CheckCircle weight="fill" />,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    icon: <XCircle weight="fill" />,
  },
  'on-hold': {
    label: 'On Hold',
    color: 'text-gray-700 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-900/30',
    icon: <Pause weight="fill" />,
  },
  urgent: {
    label: 'Urgent',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    icon: <Lightning weight="fill" />,
  },
  scheduled: {
    label: 'Scheduled',
    color: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    icon: <Hourglass weight="fill" />,
  },
  reviewing: {
    label: 'Under Review',
    color: 'text-indigo-700 dark:text-indigo-400',
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    icon: <Warning weight="fill" />,
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
};

export function JobStatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true,
  animated = false 
}: JobStatusBadgeProps) {
  const config = statusConfig[status];
  
  const badge = (
    <span className={`
      inline-flex items-center gap-1 font-medium rounded-full
      ${config.bg} ${config.color} ${sizeClasses[size]}
    `}>
      {showIcon && (
        <span className="flex-shrink-0" style={{ width: iconSizes[size], height: iconSizes[size] }}>
          {config.icon}
        </span>
      )}
      {config.label}
    </span>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {badge}
      </motion.div>
    );
  }

  return badge;
}
