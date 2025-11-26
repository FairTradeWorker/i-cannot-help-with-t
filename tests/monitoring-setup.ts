/**
 * Sentry and Monitoring Setup for FairTradeWorker
 */

// sentry.config.ts
import * as Sentry from '@sentry/react';

export function initSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    
    // Performance monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    
    // Session replay for debugging
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Filter out known non-issues
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      /Loading chunk \d+ failed/,
    ],
    
    // Enrich error context
    beforeSend(event, hint) {
      // Don't send errors in development
      if (import.meta.env.DEV) {
        console.error('Sentry would send:', event);
        return null;
      }
      
      // Add user context if available
      const user = getCurrentUser();
      if (user) {
        event.user = {
          id: user.id,
          email: user.email,
          subscription: user.plan,
        };
      }
      
      // Add API usage context
      event.extra = {
        ...event.extra,
        apiCallsUsed: getApiUsage(),
        currentPage: window.location.pathname,
      };
      
      return event;
    },
  });
}

// Helper functions (implement based on your auth system)
function getCurrentUser() {
  // Return current user from your auth context
  return null;
}

function getApiUsage() {
  // Return current API usage from your state
  return 0;
}

// Analytics setup
export function initAnalytics() {
  // Google Analytics 4
  if (import.meta.env.VITE_GA_TRACKING_ID) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_TRACKING_ID}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', import.meta.env.VITE_GA_TRACKING_ID);
  }
  
  // Mixpanel
  if (import.meta.env.VITE_MIXPANEL_TOKEN) {
    import('mixpanel-browser').then((mixpanel) => {
      mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
        track_pageview: true,
        persistence: 'localStorage',
      });
    });
  }
}

// Custom error tracking
export function trackError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// Custom event tracking
export function trackEvent(name: string, properties?: Record<string, any>) {
  // Sentry
  Sentry.addBreadcrumb({
    category: 'user-action',
    message: name,
    data: properties,
    level: 'info',
  });
  
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', name, properties);
  }
  
  // Mixpanel
  if (window.mixpanel) {
    window.mixpanel.track(name, properties);
  }
}

// API performance tracking
export function trackApiCall(endpoint: string, duration: number, success: boolean) {
  Sentry.addBreadcrumb({
    category: 'api',
    message: `${endpoint} - ${duration}ms`,
    level: success ? 'info' : 'error',
  });
  
  trackEvent('api_call', {
    endpoint,
    duration,
    success,
  });
  
  // Track slow API calls
  if (duration > 2000) {
    Sentry.captureMessage(`Slow API call: ${endpoint} took ${duration}ms`, 'warning');
  }
}

// User identification
export function identifyUser(userId: string, traits?: Record<string, any>) {
  Sentry.setUser({
    id: userId,
    ...traits,
  });
  
  if (window.mixpanel) {
    window.mixpanel.identify(userId);
    if (traits) {
      window.mixpanel.people.set(traits);
    }
  }
}

// Declare global types
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    mixpanel: any;
  }
}
