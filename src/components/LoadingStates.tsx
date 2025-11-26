/**
 * Loading States Component
 * Reusable loading skeletons and spinners for consistent UX
 */

import { Skeleton } from './ui/skeleton';
import { cn } from '../lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

// Generic card skeleton
export function CardSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn("rounded-lg border bg-card p-6", className)}>
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-5/6 mb-4" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </>
  );
}

// Table row skeleton
export function TableRowSkeleton({ count = 5 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b">
          <td className="p-4"><Skeleton className="h-4 w-20" /></td>
          <td className="p-4"><Skeleton className="h-4 w-32" /></td>
          <td className="p-4"><Skeleton className="h-4 w-24" /></td>
          <td className="p-4"><Skeleton className="h-4 w-16" /></td>
          <td className="p-4"><Skeleton className="h-8 w-20" /></td>
        </tr>
      ))}
    </>
  );
}

// Dashboard stats skeleton
export function StatsSkeleton({ count = 4 }: LoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

// API key skeleton
export function APIKeySkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}

// Job list skeleton
export function JobListSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded" />
          <div className="flex-1">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

// Spinner component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent text-primary",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Full page loading
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Inline loading with text
interface InlineLoaderProps {
  text?: string;
  className?: string;
}

export function InlineLoader({ text = 'Loading...', className }: InlineLoaderProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Spinner size="sm" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

// Button loading state
interface ButtonLoaderProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export function ButtonContent({ loading, children, loadingText }: ButtonLoaderProps) {
  if (loading) {
    return (
      <>
        <Spinner size="sm" className="mr-2" />
        {loadingText || 'Loading...'}
      </>
    );
  }
  return <>{children}</>;
}

// Chart/Graph skeleton
export function ChartSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1" 
            style={{ height: `${Math.random() * 80 + 20}%` }} 
          />
        ))}
      </div>
    </div>
  );
}

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
