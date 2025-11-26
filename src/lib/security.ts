/**
 * Security utilities for FairTradeWorker
 * Provides API key generation, hashing, rate limiting, input validation,
 * XSS prevention, CORS configuration, and session security.
 */

import { z } from 'zod';

// ============================================
// API KEY SECURITY
// ============================================

/**
 * Generate a cryptographically secure API key
 * Format: sk_live_[base64url encoded random bytes] or sk_test_[...]
 */
export function generateAPIKey(testMode = false): string {
  const prefix = testMode ? 'sk_test_' : 'sk_live_';
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const key = prefix + btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return key;
}

/**
 * Hash an API key before storing (NEVER store plain text keys)
 * Uses SHA-256 for secure one-way hashing
 */
export async function hashAPIKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

/**
 * Validate an API key by comparing hashes
 * Returns true if the key is valid, false otherwise
 */
export async function validateAPIKey(
  providedKey: string, 
  getStoredHash: (keyHash: string) => Promise<string | null>
): Promise<boolean> {
  try {
    const hashedProvided = await hashAPIKey(providedKey);
    const storedHash = await getStoredHash(hashedProvided);
    return storedHash !== null;
  } catch {
    return false;
  }
}

/**
 * Extract key prefix to determine if test or live key
 */
export function getAPIKeyType(key: string): 'live' | 'test' | 'invalid' {
  if (key.startsWith('sk_live_')) return 'live';
  if (key.startsWith('sk_test_')) return 'test';
  return 'invalid';
}

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// In-memory rate limit store (for client-side or simple server-side use)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (API key, IP, user ID, etc.)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  const record = rateLimitStore.get(key);

  // Clean up expired records
  if (record && now > record.resetTime) {
    rateLimitStore.delete(key);
  }

  const current = rateLimitStore.get(key);
  
  if (!current) {
    // First request in window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (current.count >= config.maxRequests) {
    // Rate limited
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
    };
  }

  // Increment counter
  current.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - current.count,
    resetTime: current.resetTime,
  };
}

/**
 * Clear rate limit for an identifier (useful for testing)
 */
export function clearRateLimit(identifier: string): void {
  rateLimitStore.delete(`ratelimit:${identifier}`);
}

// ============================================
// INPUT VALIDATION SCHEMAS
// ============================================

/**
 * Job scope validation schema
 */
export const JobScopeSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must be under 5000 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location must be under 100 characters'),
  images: z.array(z.string().url('Each image must be a valid URL')).max(10, 'Maximum 10 images allowed').optional(),
  budget: z.number().min(0, 'Budget must be positive').max(1000000, 'Budget too high').optional(),
  urgency: z.enum(['low', 'medium', 'high', 'emergency']).optional(),
  category: z.string().min(1).max(50).optional(),
});

/**
 * User registration schema
 */
export const UserRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  role: z.enum(['homeowner', 'contractor', 'subcontractor']),
});

/**
 * API request schema for intelligence endpoints
 */
export const IntelligenceRequestSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  endpoint: z.string().min(1, 'Endpoint is required'),
  payload: z.record(z.unknown()).optional(),
});

/**
 * Validate input against a schema
 * Throws a descriptive error if validation fails
 */
export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Validation failed: ${errors}`);
  }
  return result.data;
}

// ============================================
// XSS PREVENTION
// ============================================

// List of allowed HTML tags for sanitization
const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'];
const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ['href', 'title'],
};

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Strip all HTML tags from a string
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Basic HTML sanitizer (for production, use DOMPurify)
 * This is a simplified version - use DOMPurify for full security
 */
export function sanitizeHtml(dirty: string): string {
  // For production, import and use DOMPurify:
  // import DOMPurify from 'dompurify';
  // return DOMPurify.sanitize(dirty, { ALLOWED_TAGS, ALLOWED_ATTR: [] });
  
  // Basic sanitization - strips all tags except allowed ones
  let clean = dirty;
  
  // Remove script tags and their content
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  clean = clean.replace(/\s*on\w+\s*=\s*(['"])[^'"]*\1/gi, '');
  
  // Remove javascript: URLs
  clean = clean.replace(/javascript:/gi, '');
  
  // Remove data: URLs in sensitive contexts
  clean = clean.replace(/data:\s*[^,]*,/gi, '');
  
  return clean;
}

/**
 * Sanitize user input for safe display
 * Use this for any user-generated content
 */
export function sanitizeUserInput(input: string): string {
  if (typeof input !== 'string') return '';
  return escapeHtml(input.trim());
}

// ============================================
// CORS CONFIGURATION
// ============================================

/**
 * CORS configuration for API endpoints
 * Only allow requests from trusted domains
 */
export const corsConfig = {
  origin: [
    'https://fairtradeworker.com',
    'https://www.fairtradeworker.com',
    'https://api.fairtradeworker.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] as const,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400, // 24 hours
};

/**
 * Check if an origin is allowed
 */
export function isOriginAllowed(origin: string): boolean {
  return corsConfig.origin.includes(origin);
}

/**
 * Generate CORS headers for a response
 */
export function getCorsHeaders(origin: string): Record<string, string> {
  if (!isOriginAllowed(origin)) {
    return {};
  }
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': corsConfig.methods.join(', '),
    'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(', '),
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': corsConfig.maxAge.toString(),
  };
}

// ============================================
// SESSION SECURITY
// ============================================

/**
 * Secure cookie configuration for sessions
 */
export const sessionConfig = {
  httpOnly: true, // Prevents JavaScript access to cookie
  secure: true, // HTTPS only
  sameSite: 'strict' as const, // Prevents CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: '/',
  domain: '.fairtradeworker.com',
};

/**
 * Generate a secure session token
 */
export function generateSessionToken(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// ============================================
// STRIPE WEBHOOK VERIFICATION
// ============================================

/**
 * Verify Stripe webhook signature
 * In production, use the official Stripe SDK
 */
export async function verifyStripeWebhook(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Parse the signature header
    const signatureParts = signature.split(',');
    const timestamp = signatureParts.find(p => p.startsWith('t='))?.slice(2);
    const signatureValue = signatureParts.find(p => p.startsWith('v1='))?.slice(3);
    
    if (!timestamp || !signatureValue) {
      return false;
    }
    
    // Check timestamp is within tolerance (5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
      return false;
    }
    
    // Compute expected signature
    const signedPayload = `${timestamp}.${payload}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedPayload)
    );
    
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Constant-time comparison
    return timingSafeEqual(expectedSignature, signatureValue);
  } catch {
    return false;
  }
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

// ============================================
// ENVIRONMENT VARIABLE HELPERS
// ============================================

/**
 * Safely get an environment variable
 * Throws if required and not set
 */
export function getEnvVar(name: string, required = true): string {
  const value = typeof process !== 'undefined' 
    ? process.env?.[name] 
    : (typeof import.meta !== 'undefined' ? (import.meta as { env?: Record<string, string> }).env?.[name] : undefined);
  
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  
  return value || '';
}

/**
 * Check if all required environment variables are set
 */
export function validateEnvironment(requiredVars: string[]): { valid: boolean; missing: string[] } {
  const missing = requiredVars.filter(name => !getEnvVar(name, false));
  return {
    valid: missing.length === 0,
    missing,
  };
}

// ============================================
// SECURITY HEADERS
// ============================================

/**
 * Recommended security headers for responses
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.fairtradeworker.com",
    "frame-ancestors 'none'",
  ].join('; '),
};

// Export types for use in other files
export type { RateLimitConfig };
