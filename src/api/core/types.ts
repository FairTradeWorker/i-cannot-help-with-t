/**
 * API Core Types
 * 
 * This module defines the core types for the FairTradeWorker API layer.
 */

import { z } from 'zod';

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

/**
 * API Error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

/**
 * API Metadata for responses
 */
export interface ApiMeta {
  timestamp: string;
  requestId: string;
  version: string;
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: string;
  };
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// API Request Types
// ============================================================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

// ============================================================================
// Error Codes
// ============================================================================

export const API_ERROR_CODES = {
  // Client errors
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  
  // Business errors
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  TERRITORY_UNAVAILABLE: 'TERRITORY_UNAVAILABLE',
  JOB_NOT_AVAILABLE: 'JOB_NOT_AVAILABLE',
  BID_EXPIRED: 'BID_EXPIRED',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];

// ============================================================================
// Validation Schemas
// ============================================================================

/**
 * Common validation schemas using Zod
 */
export const ValidationSchemas = {
  // Email validation
  email: z.string().email('Invalid email address'),
  
  // Password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  // Phone validation
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  
  // ZIP code validation
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  
  // UUID validation
  uuid: z.string().uuid('Invalid ID format'),
  
  // Money amount validation
  amount: z.number().positive('Amount must be positive').multipleOf(0.01, 'Invalid amount precision'),
  
  // Pagination validation
  pagination: z.object({
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
  
  // Date range validation
  dateRange: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'Start date must be before end date',
  }),
};

// ============================================================================
// API Endpoint Types
// ============================================================================

/**
 * User endpoints
 */
export const UserEndpoints = {
  GET_CURRENT: '/api/users/me',
  GET_BY_ID: '/api/users/:id',
  UPDATE: '/api/users/:id',
  DELETE: '/api/users/:id',
  LIST: '/api/users',
} as const;

/**
 * Job endpoints
 */
export const JobEndpoints = {
  CREATE: '/api/jobs',
  GET_BY_ID: '/api/jobs/:id',
  UPDATE: '/api/jobs/:id',
  DELETE: '/api/jobs/:id',
  LIST: '/api/jobs',
  SEARCH: '/api/jobs/search',
  MY_JOBS: '/api/jobs/my-jobs',
  SUBMIT_BID: '/api/jobs/:id/bids',
  GET_BIDS: '/api/jobs/:id/bids',
  ACCEPT_BID: '/api/jobs/:id/bids/:bidId/accept',
  COMPLETE: '/api/jobs/:id/complete',
} as const;

/**
 * Contractor endpoints
 */
export const ContractorEndpoints = {
  SEARCH: '/api/contractors/search',
  GET_BY_ID: '/api/contractors/:id',
  GET_PROFILE: '/api/contractors/:id/profile',
  UPDATE_PROFILE: '/api/contractors/:id/profile',
  GET_REVIEWS: '/api/contractors/:id/reviews',
  VERIFY: '/api/contractors/:id/verify',
} as const;

/**
 * Territory endpoints
 */
export const TerritoryEndpoints = {
  LIST: '/api/territories',
  GET_BY_ID: '/api/territories/:id',
  CLAIM: '/api/territories/:id/claim',
  GET_AVAILABLE: '/api/territories/available',
  GET_BY_ZIP: '/api/territories/by-zip/:zipCode',
  GET_STATS: '/api/territories/:id/stats',
} as const;

/**
 * Payment endpoints
 */
export const PaymentEndpoints = {
  CREATE_INTENT: '/api/payments/create-intent',
  CONFIRM: '/api/payments/:id/confirm',
  GET_HISTORY: '/api/payments/history',
  GET_METHODS: '/api/payments/methods',
  ADD_METHOD: '/api/payments/methods',
  DELETE_METHOD: '/api/payments/methods/:id',
  REFUND: '/api/payments/:id/refund',
} as const;

/**
 * Message endpoints
 */
export const MessageEndpoints = {
  GET_CONVERSATIONS: '/api/messages/conversations',
  GET_MESSAGES: '/api/messages/conversations/:id',
  SEND: '/api/messages',
  MARK_READ: '/api/messages/:id/read',
} as const;

/**
 * Notification endpoints
 */
export const NotificationEndpoints = {
  LIST: '/api/notifications',
  MARK_READ: '/api/notifications/:id/read',
  MARK_ALL_READ: '/api/notifications/mark-all-read',
  UPDATE_PREFERENCES: '/api/notifications/preferences',
  GET_PREFERENCES: '/api/notifications/preferences',
} as const;

/**
 * Intelligence API endpoints
 */
export const IntelligenceEndpoints = {
  JOB_SCOPE: '/api/intelligence/job-scope',
  INSTANT_QUOTE: '/api/intelligence/instant-quote',
  CONTRACTOR_MATCH: '/api/intelligence/contractor-match',
  DEMAND_HEATMAP: '/api/intelligence/demand-heatmap',
  GET_API_KEY: '/api/intelligence/api-key',
  REGENERATE_API_KEY: '/api/intelligence/api-key/regenerate',
  GET_USAGE: '/api/intelligence/usage',
} as const;

/**
 * Auth endpoints
 */
export const AuthEndpoints = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  VERIFY_EMAIL: '/api/auth/verify-email',
  OAUTH_GOOGLE: '/api/auth/oauth/google',
  OAUTH_APPLE: '/api/auth/oauth/apple',
} as const;

// ============================================================================
// Rate Limiting
// ============================================================================

/**
 * Rate limit tiers
 */
export const RateLimitTiers = {
  FREE: {
    requestsPerMinute: 60,
    requestsPerDay: 1000,
  },
  BASIC: {
    requestsPerMinute: 120,
    requestsPerDay: 5000,
  },
  PRO: {
    requestsPerMinute: 300,
    requestsPerDay: 20000,
  },
  ENTERPRISE: {
    requestsPerMinute: 1000,
    requestsPerDay: 100000,
  },
} as const;

export type RateLimitTier = keyof typeof RateLimitTiers;

// ============================================================================
// HTTP Status Codes
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
