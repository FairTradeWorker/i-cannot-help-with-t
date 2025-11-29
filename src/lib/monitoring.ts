// SCALE: Monitoring & Observability with Sentry
import * as Sentry from '@sentry/react';

// Initialize Sentry (only in production)
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || 'production',
    tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}

// Log slow queries (>500ms)
export function logSlowQuery(queryName: string, duration: number, metadata?: any) {
  if (duration > 500) {
    console.warn(`[SLOW QUERY] ${queryName} took ${duration}ms`, metadata);
    
    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `Slow query: ${queryName}`,
        level: 'warning',
        data: { duration, ...metadata },
      });
    }
  }
}

// Performance timer
export function performanceTimer(queryName: string) {
  const start = Date.now();
  return {
    end: (metadata?: any) => {
      const duration = Date.now() - start;
      logSlowQuery(queryName, duration, metadata);
      return duration;
    },
  };
}

// Error tracking
export function trackError(error: Error, context?: any) {
  console.error('Error tracked:', error, context);
  
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
}

// Page view tracking
export function trackPageView(page: string) {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page view: ${page}`,
      level: 'info',
    });
  }
}

