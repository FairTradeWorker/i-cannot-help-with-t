/**
 * Unit Tests for API Validation
 */

import { describe, it, expect } from 'vitest';

import {
  emailSchema,
  passwordSchema,
  strongPasswordSchema,
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
} from '../src/api/core/validation';

describe('API Validation', () => {
  describe('Email Schema', () => {
    it('accepts valid emails', () => {
      expect(emailSchema.safeParse('test@example.com').success).toBe(true);
      expect(emailSchema.safeParse('user.name@domain.org').success).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(emailSchema.safeParse('not-an-email').success).toBe(false);
      expect(emailSchema.safeParse('missing@domain').success).toBe(false);
      expect(emailSchema.safeParse('@nodomain.com').success).toBe(false);
    });
  });

  describe('Password Schema', () => {
    it('accepts valid passwords', () => {
      expect(passwordSchema.safeParse('Password1').success).toBe(true);
      expect(passwordSchema.safeParse('abc12345').success).toBe(true);
    });

    it('rejects passwords without numbers', () => {
      expect(passwordSchema.safeParse('noNumbers').success).toBe(false);
    });

    it('rejects passwords without letters', () => {
      expect(passwordSchema.safeParse('12345678').success).toBe(false);
    });

    it('rejects short passwords', () => {
      expect(passwordSchema.safeParse('abc1').success).toBe(false);
    });
  });

  describe('Strong Password Schema', () => {
    it('accepts strong passwords', () => {
      expect(strongPasswordSchema.safeParse('SecurePass123!').success).toBe(true);
    });

    it('rejects passwords without uppercase', () => {
      expect(strongPasswordSchema.safeParse('securepass123!').success).toBe(false);
    });

    it('rejects passwords without lowercase', () => {
      expect(strongPasswordSchema.safeParse('SECUREPASS123!').success).toBe(false);
    });

    it('rejects passwords without special characters', () => {
      expect(strongPasswordSchema.safeParse('SecurePass123').success).toBe(false);
    });
  });

  describe('Phone Schema', () => {
    it('accepts valid US phone numbers', () => {
      expect(phoneSchema.safeParse('(555) 123-4567').success).toBe(true);
      expect(phoneSchema.safeParse('555-123-4567').success).toBe(true);
      expect(phoneSchema.safeParse('5551234567').success).toBe(true);
      expect(phoneSchema.safeParse('+1 555-123-4567').success).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(phoneSchema.safeParse('123').success).toBe(false);
      expect(phoneSchema.safeParse('abcdefghij').success).toBe(false);
    });
  });

  describe('ZIP Code Schema', () => {
    it('accepts valid ZIP codes', () => {
      expect(zipCodeSchema.safeParse('12345').success).toBe(true);
      expect(zipCodeSchema.safeParse('12345-6789').success).toBe(true);
    });

    it('rejects invalid ZIP codes', () => {
      expect(zipCodeSchema.safeParse('1234').success).toBe(false);
      expect(zipCodeSchema.safeParse('123456').success).toBe(false);
      expect(zipCodeSchema.safeParse('abcde').success).toBe(false);
    });
  });

  describe('Login Schema', () => {
    it('accepts valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'mypassword',
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing email', () => {
      const result = loginSchema.safeParse({
        password: 'mypassword',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Register Schema', () => {
    it('accepts valid registration data', () => {
      const result = registerSchema.safeParse({
        email: 'user@example.com',
        password: 'Password1',
        confirmPassword: 'Password1',
        name: 'John Doe',
        role: 'homeowner',
        acceptTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
      const result = registerSchema.safeParse({
        email: 'user@example.com',
        password: 'Password1',
        confirmPassword: 'Password2',
        name: 'John Doe',
        role: 'homeowner',
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects without accepting terms', () => {
      const result = registerSchema.safeParse({
        email: 'user@example.com',
        password: 'Password1',
        confirmPassword: 'Password1',
        name: 'John Doe',
        role: 'homeowner',
        acceptTerms: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Create Job Schema', () => {
    it('accepts valid job data', () => {
      const result = createJobSchema.safeParse({
        title: 'Kitchen Faucet Replacement',
        description: 'Need to replace the old faucet in the kitchen with a new one.',
        category: 'plumbing',
        address: {
          city: 'Austin',
          state: 'TX',
          zip: '78701',
        },
      });
      expect(result.success).toBe(true);
    });

    it('rejects short title', () => {
      const result = createJobSchema.safeParse({
        title: 'Fix',
        description: 'Need to replace the old faucet in the kitchen with a new one.',
        category: 'plumbing',
        address: { city: 'Austin', state: 'TX', zip: '78701' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects short description', () => {
      const result = createJobSchema.safeParse({
        title: 'Kitchen Faucet Replacement',
        description: 'Fix faucet',
        category: 'plumbing',
        address: { city: 'Austin', state: 'TX', zip: '78701' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Create Bid Schema', () => {
    it('accepts valid bid data', () => {
      const result = createBidSchema.safeParse({
        amount: 500,
        message: 'I can do this job next week.',
      });
      expect(result.success).toBe(true);
    });

    it('rejects zero amount', () => {
      const result = createBidSchema.safeParse({
        amount: 0,
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative amount', () => {
      const result = createBidSchema.safeParse({
        amount: -100,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('validate function', () => {
    it('returns success for valid data', () => {
      const result = validate(emailSchema, 'test@example.com');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test@example.com');
      }
    });

    it('returns errors for invalid data', () => {
      const result = validate(emailSchema, 'not-an-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeDefined();
      }
    });
  });

  describe('formatValidationErrors', () => {
    it('formats Zod errors to a readable format', () => {
      const result = loginSchema.safeParse({});
      
      if (!result.success) {
        const formatted = formatValidationErrors(result.error);
        expect(formatted).toHaveProperty('email');
        expect(formatted).toHaveProperty('password');
        expect(Array.isArray(formatted.email)).toBe(true);
      }
    });
  });

  describe('createValidator', () => {
    it('returns data for valid input', () => {
      const validateEmail = createValidator(emailSchema);
      const result = validateEmail('test@example.com');
      expect(result).toBe('test@example.com');
    });

    it('throws ValidationError for invalid input', () => {
      const validateEmail = createValidator(emailSchema);
      expect(() => validateEmail('not-an-email')).toThrow(ValidationError);
    });
  });

  describe('ValidationError', () => {
    it('has errors property', () => {
      const error = new ValidationError('Test error', { field: ['error message'] });
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Test error');
      expect(error.errors.field).toContain('error message');
    });
  });
});
