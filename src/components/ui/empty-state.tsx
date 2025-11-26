import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  emoji?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'large';
}

export function EmptyState({
  icon,
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const sizeClasses = {
    compact: 'py-8',
    default: 'py-12',
    large: 'py-16',
  };

  const iconSizeClasses = {
    compact: 'text-4xl',
    default: 'text-6xl',
    large: 'text-8xl',
  };

  const titleSizeClasses = {
    compact: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'text-center flex flex-col items-center justify-center',
        sizeClasses[variant],
        className
      )}
    >
      {/* Icon or Emoji */}
      {(icon || emoji) && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={cn('mb-4', iconSizeClasses[variant])}
        >
          {emoji ? <span>{emoji}</span> : icon}
        </motion.div>
      )}

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className={cn(
          'font-semibold mb-2 text-foreground',
          titleSizeClasses[variant]
        )}
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-6 max-w-sm mx-auto"
        >
          {description}
        </motion.p>
      )}

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transform hover:scale-105 transition-all"
            >
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Pre-built empty states for common scenarios
export function NoJobsEmptyState({ onPostJob }: { onPostJob: () => void }) {
  return (
    <EmptyState
      emoji="📋"
      title="No jobs yet"
      description="Post your first job to get started and connect with qualified contractors in your area."
      actionLabel="Post Your First Job"
      onAction={onPostJob}
    />
  );
}

export function NoMessagesEmptyState({ onBrowseJobs }: { onBrowseJobs: () => void }) {
  return (
    <EmptyState
      emoji="💬"
      title="No messages"
      description="Start a conversation by posting a job or connecting with contractors."
      actionLabel="Browse Jobs"
      onAction={onBrowseJobs}
    />
  );
}

export function NoResultsEmptyState({ 
  query, 
  onClearSearch 
}: { 
  query: string; 
  onClearSearch: () => void 
}) {
  return (
    <EmptyState
      emoji="🔍"
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search.`}
      actionLabel="Clear Search"
      onAction={onClearSearch}
    />
  );
}

export function ErrorEmptyState({ 
  onRetry 
}: { 
  onRetry: () => void 
}) {
  return (
    <EmptyState
      emoji="😕"
      title="Something went wrong"
      description="We're having trouble loading this content. Please try again."
      actionLabel="Try Again"
      onAction={onRetry}
    />
  );
}

export function NoContractorsEmptyState() {
  return (
    <EmptyState
      emoji="👷"
      title="No contractors available"
      description="We're expanding our network! Check back soon for contractors in your area."
    />
  );
}

export function NoTerritoriesEmptyState({ onExploreTerritories }: { onExploreTerritories: () => void }) {
  return (
    <EmptyState
      emoji="🗺️"
      title="No territories claimed"
      description="Explore available territories and secure exclusive lead rights in your area."
      actionLabel="Explore Territories"
      onAction={onExploreTerritories}
    />
  );
}

export default EmptyState;
