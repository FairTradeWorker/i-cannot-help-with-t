/**
 * Bug Prevention and Error Handling Utilities
 * 10 Bug preventers with defensive programming patterns
 */

import { toast } from 'sonner';

// Bug Preventer 1: Safe JSON parse with validation
export function safeJsonParse<T>(
  json: string,
  validator?: (data: unknown) => data is T,
  fallback?: T
): T | null {
  try {
    const parsed = JSON.parse(json);
    if (validator && !validator(parsed)) {
      console.warn('JSON validation failed:', parsed);
      return fallback ?? null;
    }
    return parsed as T;
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback ?? null;
  }
}

// Bug Preventer 2: Type guard utilities
export const typeGuards = {
  isString: (value: unknown): value is string => typeof value === 'string',
  isNumber: (value: unknown): value is number => typeof value === 'number' && !isNaN(value),
  isBoolean: (value: unknown): value is boolean => typeof value === 'boolean',
  isArray: <T>(value: unknown, itemGuard?: (item: unknown) => item is T): value is T[] =>
    Array.isArray(value) && (!itemGuard || value.every(itemGuard)),
  isObject: (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value),
  isDate: (value: unknown): value is Date =>
    value instanceof Date && !isNaN(value.getTime()),
  isNonEmptyString: (value: unknown): value is string =>
    typeof value === 'string' && value.trim().length > 0,
  isPositiveNumber: (value: unknown): value is number =>
    typeof value === 'number' && !isNaN(value) && value > 0,
  isEmail: (value: unknown): value is string =>
    typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  isPhoneNumber: (value: unknown): value is string =>
    typeof value === 'string' && /^\+?[\d\s\-().]{10,}$/.test(value),
  isZipCode: (value: unknown): value is string =>
    typeof value === 'string' && /^\d{5}(-\d{4})?$/.test(value),
};

// Bug Preventer 3: Input sanitization
export const sanitize = {
  // Remove HTML tags to prevent XSS
  html: (input: string): string =>
    input.replace(/<[^>]*>/g, '').replace(/[<>]/g, ''),

  // Escape special characters for safe display
  escape: (input: string): string =>
    input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;'),

  // Normalize whitespace
  whitespace: (input: string): string =>
    input.replace(/\s+/g, ' ').trim(),

  // Remove non-printable characters
  nonPrintable: (input: string): string =>
    // eslint-disable-next-line no-control-regex
    input.replace(/[\x00-\x1F\x7F]/g, ''),

  // Sanitize filename
  filename: (input: string): string =>
    input.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 255),

  // Sanitize for SQL (basic - use parameterized queries in production)
  sqlBasic: (input: string): string =>
    input.replace(/['";\\]/g, ''),

  // Sanitize phone number
  phone: (input: string): string =>
    input.replace(/[^\d+()-\s]/g, ''),

  // Sanitize currency input
  currency: (input: string): string => {
    const cleaned = input.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return cleaned;
  },
};

// Bug Preventer 4: Boundary value checker
export class BoundaryChecker {
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static ensureArrayBounds<T>(array: T[], index: number): number {
    if (array.length === 0) return -1;
    return this.clamp(index, 0, array.length - 1);
  }

  static safeArrayAccess<T>(array: T[], index: number, fallback: T): T {
    if (index < 0 || index >= array.length) return fallback;
    return array[index];
  }

  static truncateString(str: string, maxLength: number, suffix = '...'): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  static ensureMaxItems<T>(array: T[], maxItems: number): T[] {
    return array.slice(0, maxItems);
  }
}

// Bug Preventer 5: Null-safe operations
export const nullSafe = {
  get: <T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined =>
    obj?.[key],

  getPath: <T>(obj: unknown, path: string, fallback?: T): T | undefined => {
    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
      if (current === null || current === undefined) {
        return fallback;
      }
      current = (current as Record<string, unknown>)[key];
    }

    return (current as T) ?? fallback;
  },

  map: <T, R>(value: T | null | undefined, fn: (v: T) => R): R | undefined =>
    value != null ? fn(value) : undefined,

  flatMap: <T, R>(value: T | null | undefined, fn: (v: T) => R | null | undefined): R | undefined => {
    if (value == null) return undefined;
    const result = fn(value);
    return result ?? undefined;
  },

  coalesce: <T>(...values: (T | null | undefined)[]): T | undefined =>
    values.find(v => v != null) as T | undefined,
};

// Bug Preventer 6: Race condition preventer
export class RaceConditionPreventer {
  private currentOperation: symbol | null = null;

  async execute<T>(operation: () => Promise<T>): Promise<T | null> {
    const operationId = Symbol('operation');
    this.currentOperation = operationId;

    try {
      const result = await operation();
      // Only return result if this is still the current operation
      if (this.currentOperation === operationId) {
        return result;
      }
      return null;
    } catch (error) {
      if (this.currentOperation === operationId) {
        throw error;
      }
      return null;
    }
  }

  cancel(): void {
    this.currentOperation = null;
  }
}

// Bug Preventer 7: Form validation utilities
export interface ValidationRule {
  validate: (value: unknown) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export class FormValidator {
  private rules: Map<string, ValidationRule[]> = new Map();

  addRule(field: string, rule: ValidationRule): this {
    if (!this.rules.has(field)) {
      this.rules.set(field, []);
    }
    this.rules.get(field)!.push(rule);
    return this;
  }

  validate(data: Record<string, unknown>): ValidationResult {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    this.rules.forEach((rules, field) => {
      const value = data[field];
      const fieldErrors: string[] = [];

      rules.forEach(rule => {
        if (!rule.validate(value)) {
          fieldErrors.push(rule.message);
          isValid = false;
        }
      });

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    });

    return { isValid, errors };
  }

  static commonRules = {
    required: (message = 'This field is required'): ValidationRule => ({
      validate: value => value != null && String(value).trim() !== '',
      message,
    }),
    email: (message = 'Invalid email address'): ValidationRule => ({
      validate: value => typeGuards.isEmail(value),
      message,
    }),
    minLength: (min: number, message?: string): ValidationRule => ({
      validate: value => typeof value === 'string' && value.length >= min,
      message: message ?? `Must be at least ${min} characters`,
    }),
    maxLength: (max: number, message?: string): ValidationRule => ({
      validate: value => typeof value === 'string' && value.length <= max,
      message: message ?? `Must be no more than ${max} characters`,
    }),
    pattern: (regex: RegExp, message: string): ValidationRule => ({
      validate: value => typeof value === 'string' && regex.test(value),
      message,
    }),
    numeric: (message = 'Must be a number'): ValidationRule => ({
      validate: value => !isNaN(Number(value)),
      message,
    }),
    positiveNumber: (message = 'Must be a positive number'): ValidationRule => ({
      validate: value => typeGuards.isPositiveNumber(Number(value)),
      message,
    }),
  };
}

// Bug Preventer 8: Memory leak preventer
export class DisposableManager {
  private disposables: (() => void)[] = [];

  add(disposable: () => void): void {
    this.disposables.push(disposable);
  }

  addInterval(interval: ReturnType<typeof setInterval>): void {
    this.add(() => clearInterval(interval));
  }

  addTimeout(timeout: ReturnType<typeof setTimeout>): void {
    this.add(() => clearTimeout(timeout));
  }

  addEventListener(
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    element.addEventListener(event, handler, options);
    this.add(() => element.removeEventListener(event, handler, options));
  }

  dispose(): void {
    this.disposables.forEach(d => {
      try {
        d();
      } catch (e) {
        console.warn('Error during disposal:', e);
      }
    });
    this.disposables = [];
  }
}

// Bug Preventer 9: Error boundary utilities
export class ErrorBoundaryUtils {
  static logError(error: Error, componentStack?: string): void {
    console.error('Component Error:', {
      message: error.message,
      stack: error.stack,
      componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
  }

  static getUserFriendlyMessage(error: Error): string {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Unable to connect. Please check your internet connection.';
    }

    // Timeout errors
    if (error.message.includes('timeout') || error.name === 'AbortError') {
      return 'The request took too long. Please try again.';
    }

    // Permission errors
    if (error.message.includes('permission') || error.message.includes('denied')) {
      return 'You do not have permission to perform this action.';
    }

    // Validation errors
    if (error.message.includes('validation') || error.message.includes('invalid')) {
      return 'Please check your input and try again.';
    }

    // Generic fallback
    return 'Something went wrong. Please try again later.';
  }

  static showErrorToast(error: Error): void {
    toast.error(this.getUserFriendlyMessage(error));
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    fallback?: T,
    onError?: (error: Error) => void
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logError(err);
      onError?.(err);
      return fallback;
    }
  }
}

// Bug Preventer 10: State consistency checker
export class StateConsistencyChecker<T extends Record<string, unknown>> {
  private previousState: T | null = null;
  private rules: ((prev: T | null, next: T) => boolean | string)[] = [];

  addRule(rule: (prev: T | null, next: T) => boolean | string): this {
    this.rules.push(rule);
    return this;
  }

  check(newState: T): { isConsistent: boolean; violations: string[] } {
    const violations: string[] = [];

    this.rules.forEach(rule => {
      const result = rule(this.previousState, newState);
      if (typeof result === 'string') {
        violations.push(result);
      } else if (!result) {
        violations.push('State consistency violation detected');
      }
    });

    this.previousState = { ...newState };

    return {
      isConsistent: violations.length === 0,
      violations,
    };
  }

  reset(): void {
    this.previousState = null;
  }
}

// Scalability helper 1: Pagination utilities
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const normalizedPage = BoundaryChecker.clamp(page, 1, Math.max(1, totalPages));
  const startIndex = (normalizedPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: items.slice(startIndex, endIndex),
    page: normalizedPage,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: normalizedPage < totalPages,
    hasPreviousPage: normalizedPage > 1,
  };
}

// Scalability helper 2: Infinite scroll helper
export interface InfiniteScrollState<T> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  error: Error | null;
  page: number;
}

export function createInfiniteScrollState<T>(): InfiniteScrollState<T> {
  return {
    items: [],
    hasMore: true,
    isLoading: false,
    error: null,
    page: 0,
  };
}

// Export singleton instances
export const raceConditionPreventer = new RaceConditionPreventer();
