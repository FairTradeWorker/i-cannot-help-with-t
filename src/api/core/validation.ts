/**
 * API Request Validation Utilities
 * 
 * This module provides request validation schemas and utilities
 * using Zod for type-safe validation.
 */

import { z } from 'zod';

// ============================================================================
// Common Validation Schemas
// ============================================================================

/**
 * Email validation
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation (minimum 8 chars, at least one number and letter)
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Strong password validation
 */
export const strongPasswordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

/**
 * Phone number validation (US format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/, 'Invalid phone number');

/**
 * ZIP code validation (US format)
 */
export const zipCodeSchema = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code');

/**
 * UUID validation
 */
export const uuidSchema = z.string().uuid('Invalid ID');

/**
 * URL validation
 */
export const urlSchema = z.string().url('Invalid URL');

/**
 * Date string validation (ISO 8601)
 */
export const dateStringSchema = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  'Invalid date format'
);

/**
 * Positive number validation
 */
export const positiveNumberSchema = z.number().positive('Must be a positive number');

/**
 * Currency amount validation (positive, up to 2 decimal places)
 */
export const currencySchema = z
  .number()
  .nonnegative('Amount cannot be negative')
  .multipleOf(0.01, 'Amount must have at most 2 decimal places');

// ============================================================================
// Authentication Schemas
// ============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['homeowner', 'contractor', 'subcontractor', 'operator']),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const passwordResetSchema = z.object({
  email: emailSchema,
});

export const newPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ============================================================================
// Job Schemas
// ============================================================================

export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zip: zipCodeSchema,
  country: z.string().default('US'),
});

export const createJobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  category: z.string().min(1, 'Category is required'),
  urgency: z.enum(['normal', 'urgent', 'emergency']).default('normal'),
  address: addressSchema,
  photos: z.array(urlSchema).max(10).optional(),
  preferredSchedule: dateStringSchema.optional(),
});

export const updateJobSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(20).max(5000).optional(),
  status: z.enum(['posted', 'bidding', 'assigned', 'in_progress', 'completed', 'cancelled']).optional(),
  urgency: z.enum(['normal', 'urgent', 'emergency']).optional(),
});

// ============================================================================
// Bid Schemas
// ============================================================================

export const createBidSchema = z.object({
  amount: currencySchema.refine((val) => val > 0, 'Bid amount must be greater than 0'),
  message: z.string().max(1000).optional(),
  estimatedStartDate: dateStringSchema.optional(),
  estimatedDuration: z.number().positive().optional(),
});

export const updateBidSchema = z.object({
  amount: currencySchema.optional(),
  message: z.string().max(1000).optional(),
  status: z.enum(['pending', 'accepted', 'rejected', 'withdrawn']).optional(),
});

// ============================================================================
// Contractor Schemas
// ============================================================================

export const contractorProfileSchema = z.object({
  name: z.string().min(2).max(100),
  businessName: z.string().max(100).optional(),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  licenseNumber: z.string().optional(),
  insurancePolicy: z.string().optional(),
  serviceRadius: z.number().positive().max(100),
  hourlyRate: currencySchema.optional(),
  bio: z.string().max(1000).optional(),
});

// ============================================================================
// Payment Schemas
// ============================================================================

export const createPaymentSchema = z.object({
  jobId: uuidSchema,
  amount: currencySchema.refine((val) => val > 0, 'Amount must be greater than 0'),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
  financeOption: z.enum(['full_payment', 'installments_3', 'installments_6', 'installments_12', 'financing']).optional(),
});

export const refundRequestSchema = z.object({
  paymentId: uuidSchema,
  reason: z.string().min(10, 'Please provide a reason').max(500),
  amount: currencySchema.optional(),
});

// ============================================================================
// Territory Schemas
// ============================================================================

export const claimTerritorySchema = z.object({
  territoryId: uuidSchema,
  paymentMethodId: z.string().min(1),
});

// ============================================================================
// Message Schemas
// ============================================================================

export const sendMessageSchema = z.object({
  recipientId: uuidSchema,
  content: z.string().min(1).max(5000),
  jobId: uuidSchema.optional(),
});

// ============================================================================
// Review Schemas
// ============================================================================

export const createReviewSchema = z.object({
  jobId: uuidSchema,
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// ============================================================================
// Pagination Schemas
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ============================================================================
// Validation Utility Functions
// ============================================================================

/**
 * Validate data against a schema
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Format Zod errors for API response
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }
  
  return formatted;
}

/**
 * Create validation middleware
 */
export function createValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const formatted = formatValidationErrors(result.error);
      throw new ValidationError('Validation failed', formatted);
    }
    return result.data;
  };
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  public readonly errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// ============================================================================
// Type Exports
// ============================================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type CreateBidInput = z.infer<typeof createBidSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

export default {
  emailSchema,
  passwordSchema,
  phoneSchema,
  zipCodeSchema,
  loginSchema,
  registerSchema,
  createJobSchema,
  createBidSchema,
  createPaymentSchema,
  validate,
  formatValidationErrors,
  createValidator,
  ValidationError,
};
