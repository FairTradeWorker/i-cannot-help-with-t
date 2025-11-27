/**
 * Error Boundary Components
 * 
 * This module provides React Error Boundary components for graceful
 * error handling throughout the application.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { captureError } from '@/lib/error-tracking';

// ============================================================================
// Types
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ============================================================================
// Main Error Boundary Class Component
// ============================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log to error tracking service
    captureError(error, {
      component: 'ErrorBoundary',
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Call optional callback
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { level = 'section' } = this.props;

      switch (level) {
        case 'page':
          return (
            <PageErrorFallback
              error={this.state.error}
              onRetry={this.handleRetry}
            />
          );
        case 'component':
          return (
            <ComponentErrorFallback
              error={this.state.error}
              onRetry={this.handleRetry}
            />
          );
        default:
          return (
            <SectionErrorFallback
              error={this.state.error}
              onRetry={this.handleRetry}
            />
          );
      }
    }

    return this.props.children;
  }
}

// ============================================================================
// Page-Level Error Fallback
// ============================================================================

interface ErrorFallbackProps {
  error: Error | null;
  onRetry?: () => void;
}

// Support configuration
const SUPPORT_EMAIL = 'support@fairtradeworker.com';

export function PageErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-10 h-10 text-destructive" weight="fill" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground">
            We're sorry, but something unexpected happened. Please try again.
          </p>
        </div>

        {error && (
          <Card className="mb-6 text-left">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Error details:</p>
              <code className="text-xs text-destructive break-all">
                {error.message}
              </code>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.location.href = `mailto:${SUPPORT_EMAIL}`}
            className="w-full"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// Section-Level Error Fallback
// ============================================================================

export function SectionErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-destructive" weight="fill" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to load this section</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={onRetry} size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Component-Level Error Fallback
// ============================================================================

export function ComponentErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
      <div className="flex items-center gap-2 mb-2">
        <Bug className="w-4 h-4 text-destructive" />
        <span className="text-sm font-medium text-destructive">
          Component Error
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">
        {error?.message || 'Failed to render this component'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" variant="outline">
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// HOC for wrapping components with error boundary
// ============================================================================

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: Omit<ErrorBoundaryProps, 'children'>
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary {...options}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}

// ============================================================================
// Async Error Boundary (for Suspense-like patterns)
// ============================================================================

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
}

export function AsyncErrorBoundary({
  children,
  loadingFallback = <div className="animate-pulse p-4">Loading...</div>,
  errorFallback,
}: AsyncErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <React.Suspense fallback={loadingFallback}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
}

// ============================================================================
// Error Recovery Hook
// ============================================================================

export function useErrorRecovery() {
  const [error, setError] = React.useState<Error | null>(null);
  const [attempts, setAttempts] = React.useState(0);

  const handleError = React.useCallback((err: Error) => {
    setError(err);
    setAttempts(prev => prev + 1);
    captureError(err, {
      action: 'user_action',
      metadata: { recoveryAttempts: attempts },
    });
  }, [attempts]);

  const reset = React.useCallback(() => {
    setError(null);
  }, []);

  const retry = React.useCallback((fn: () => void | Promise<void>) => {
    setError(null);
    try {
      const result = fn();
      if (result instanceof Promise) {
        result.catch(handleError);
      }
    } catch (err) {
      handleError(err as Error);
    }
  }, [handleError]);

  return {
    error,
    attempts,
    handleError,
    reset,
    retry,
    hasError: error !== null,
  };
}

export default ErrorBoundary;
