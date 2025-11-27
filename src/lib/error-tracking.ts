/**
 * Error Tracking and Monitoring Service
 * 
 * This module provides error tracking, performance monitoring,
 * and logging infrastructure. Integrates with Sentry or similar services.
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Error severity levels
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

/**
 * Error context
 */
export interface ErrorContext {
  userId?: string;
  userEmail?: string;
  userRole?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Performance entry
 */
export interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  entryType: string;
}

/**
 * Web vitals metrics
 */
export interface WebVitals {
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
}

/**
 * Error report
 */
export interface ErrorReport {
  id: string;
  timestamp: string;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  context: ErrorContext;
  url: string;
  userAgent: string;
}

// ============================================================================
// Configuration
// ============================================================================

interface ErrorTrackingConfig {
  enabled: boolean;
  dsn?: string;
  environment: string;
  release?: string;
  sampleRate: number;
  beforeSend?: (report: ErrorReport) => ErrorReport | null;
}

const DEFAULT_CONFIG: ErrorTrackingConfig = {
  enabled: import.meta.env.PROD,
  environment: import.meta.env.MODE,
  sampleRate: 1.0,
};

let config: ErrorTrackingConfig = { ...DEFAULT_CONFIG };
let userContext: ErrorContext = {};

// ============================================================================
// Error Storage (for offline/batching)
// ============================================================================

const ERROR_QUEUE_KEY = 'ftw_error_queue';
const MAX_QUEUED_ERRORS = 50;

function getQueuedErrors(): ErrorReport[] {
  try {
    const stored = localStorage.getItem(ERROR_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function queueError(report: ErrorReport): void {
  try {
    const queue = getQueuedErrors();
    queue.push(report);
    // Keep only the most recent errors
    const trimmed = queue.slice(-MAX_QUEUED_ERRORS);
    localStorage.setItem(ERROR_QUEUE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to queue error:', error);
  }
}

function clearQueuedErrors(): void {
  localStorage.removeItem(ERROR_QUEUE_KEY);
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize error tracking
 */
export function initialize(customConfig?: Partial<ErrorTrackingConfig>): void {
  config = { ...DEFAULT_CONFIG, ...customConfig };
  
  if (!config.enabled) {
    console.log('[ErrorTracking] Disabled in development mode');
    return;
  }

  // Set up global error handlers
  setupGlobalHandlers();
  
  // Initialize performance observer
  setupPerformanceObserver();
  
  // Send any queued errors
  flushErrorQueue();
  
  console.log('[ErrorTracking] Initialized', {
    environment: config.environment,
    release: config.release,
  });
}

/**
 * Set up global error handlers
 */
function setupGlobalHandlers(): void {
  // Unhandled errors
  window.addEventListener('error', (event) => {
    captureError(event.error || new Error(event.message), {
      component: 'global',
      action: 'unhandled_error',
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    captureError(
      event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason)),
      {
        component: 'global',
        action: 'unhandled_rejection',
      }
    );
  });
}

/**
 * Set up performance observer
 */
function setupPerformanceObserver(): void {
  if (!('PerformanceObserver' in window)) {
    return;
  }

  try {
    // Observe largest contentful paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      recordMetric('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Observe first input delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if ('processingStart' in entry) {
          const fidEntry = entry as PerformanceEventTiming;
          recordMetric('FID', fidEntry.processingStart - fidEntry.startTime);
        }
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Observe layout shifts
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if ('hadRecentInput' in entry && !(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      recordMetric('CLS', clsValue);
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.warn('[ErrorTracking] Failed to set up performance observer:', error);
  }
}

// ============================================================================
// Error Capture
// ============================================================================

/**
 * Capture an error
 */
export function captureError(
  error: Error | string,
  context?: Partial<ErrorContext>
): string {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const reportId = generateReportId();
  
  const report: ErrorReport = {
    id: reportId,
    timestamp: new Date().toISOString(),
    severity: 'error',
    message: errorObj.message,
    stack: errorObj.stack,
    context: { ...userContext, ...context },
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Apply beforeSend hook
  const processedReport = config.beforeSend 
    ? config.beforeSend(report) 
    : report;
  
  if (!processedReport) {
    return reportId;
  }

  // Sample rate check
  if (Math.random() > config.sampleRate) {
    return reportId;
  }

  // Log to console in development
  console.error('[ErrorTracking] Captured error:', {
    id: reportId,
    message: errorObj.message,
    context: report.context,
  });

  // Queue for sending
  if (config.enabled) {
    queueError(processedReport);
    sendReport(processedReport);
  }

  return reportId;
}

/**
 * Capture a message (non-error)
 */
export function captureMessage(
  message: string,
  severity: ErrorSeverity = 'info',
  context?: Partial<ErrorContext>
): string {
  const reportId = generateReportId();
  
  const report: ErrorReport = {
    id: reportId,
    timestamp: new Date().toISOString(),
    severity,
    message,
    context: { ...userContext, ...context },
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  if (config.enabled && config.sampleRate >= Math.random()) {
    sendReport(report);
  }

  return reportId;
}

/**
 * Set breadcrumb for error context
 */
const breadcrumbs: Array<{ message: string; timestamp: string; category: string }> = [];
const MAX_BREADCRUMBS = 50;

export function addBreadcrumb(
  message: string,
  category: string = 'action'
): void {
  breadcrumbs.push({
    message,
    timestamp: new Date().toISOString(),
    category,
  });
  
  // Keep only recent breadcrumbs
  if (breadcrumbs.length > MAX_BREADCRUMBS) {
    breadcrumbs.shift();
  }
}

// ============================================================================
// Performance Monitoring
// ============================================================================

const metrics: Record<string, number[]> = {};

/**
 * Record a performance metric
 */
export function recordMetric(name: string, value: number): void {
  if (!metrics[name]) {
    metrics[name] = [];
  }
  metrics[name].push(value);
  
  // Log significant metrics
  if (['LCP', 'FID', 'CLS', 'FCP', 'TTFB'].includes(name)) {
    console.log(`[Performance] ${name}:`, value.toFixed(2));
  }
}

/**
 * Get web vitals
 */
export function getWebVitals(): WebVitals {
  const getLatest = (name: string) => {
    const values = metrics[name];
    return values ? values[values.length - 1] : undefined;
  };

  return {
    LCP: getLatest('LCP'),
    FID: getLatest('FID'),
    CLS: getLatest('CLS'),
    FCP: getLatest('FCP'),
    TTFB: getLatest('TTFB'),
  };
}

/**
 * Start a performance transaction
 */
export function startTransaction(name: string): () => void {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    recordMetric(`transaction.${name}`, duration);
  };
}

/**
 * Measure a function's execution time
 */
export function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const endTransaction = startTransaction(name);
  
  return fn().finally(endTransaction);
}

// ============================================================================
// User Context
// ============================================================================

/**
 * Set user context for error reports
 */
export function setUser(user: {
  id?: string;
  email?: string;
  role?: string;
}): void {
  userContext = {
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
  };
}

/**
 * Clear user context
 */
export function clearUser(): void {
  userContext = {};
}

/**
 * Add tags to error context
 */
export function setTag(key: string, value: string): void {
  userContext.metadata = {
    ...userContext.metadata,
    [key]: value,
  };
}

// ============================================================================
// Internal Functions
// ============================================================================

/**
 * Generate a unique report ID using crypto for better randomness
 */
function generateReportId(): string {
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  const randomPart = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${Date.now()}-${randomPart}`;
}

/**
 * Send error report to backend
 */
async function sendReport(report: ErrorReport): Promise<void> {
  if (!config.enabled) {
    return;
  }

  try {
    // In production, this would send to Sentry or your error tracking service
    // For now, we'll just log it
    console.log('[ErrorTracking] Would send report:', report.id);
    
    // If you have a Sentry DSN configured:
    // await fetch(config.dsn, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(report),
    // });
  } catch (error) {
    console.error('[ErrorTracking] Failed to send report:', error);
    queueError(report);
  }
}

/**
 * Flush queued errors
 */
async function flushErrorQueue(): Promise<void> {
  const queue = getQueuedErrors();
  
  if (queue.length === 0) {
    return;
  }

  console.log(`[ErrorTracking] Flushing ${queue.length} queued errors`);
  
  for (const report of queue) {
    await sendReport(report);
  }
  
  clearQueuedErrors();
}

// ============================================================================
// React Integration
// ============================================================================

/**
 * Error boundary handler for React
 */
export function handleReactError(
  error: Error,
  errorInfo: { componentStack: string }
): void {
  captureError(error, {
    component: 'react_error_boundary',
    metadata: {
      componentStack: errorInfo.componentStack,
    },
  });
}

/**
 * React hook for error tracking
 */
export function useErrorTracking() {
  return {
    captureError,
    captureMessage,
    addBreadcrumb,
    setUser,
    clearUser,
    setTag,
    getWebVitals,
    startTransaction,
  };
}

// ============================================================================
// Exports
// ============================================================================

export default {
  initialize,
  captureError,
  captureMessage,
  addBreadcrumb,
  setUser,
  clearUser,
  setTag,
  recordMetric,
  getWebVitals,
  startTransaction,
  measureAsync,
  handleReactError,
  useErrorTracking,
};
