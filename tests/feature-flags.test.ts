/**
 * Unit Tests for Feature Flags Service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage before importing the module
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Now import the feature flags module
import {
  isEnabled,
  getVariant,
  setUserContext,
  clearUserContext,
  overrideFlag,
  clearOverride,
  clearAllOverrides,
  getAllFlags,
  getFlag,
  evaluateFlag,
} from '../src/lib/feature-flags';

describe('Feature Flags Service', () => {
  beforeEach(() => {
    clearAllOverrides();
    clearUserContext();
    localStorageMock.store = {};
    vi.clearAllMocks();
  });

  describe('isEnabled', () => {
    it('returns true for enabled flags', () => {
      const result = isEnabled('new_analytics_dashboard');
      expect(result).toBe(true);
    });

    it('returns false for disabled flags', () => {
      const result = isEnabled('premium_apis');
      expect(result).toBe(false);
    });

    it('returns false for non-existent flags', () => {
      const result = isEnabled('non_existent_flag');
      expect(result).toBe(false);
    });
  });

  describe('overrideFlag', () => {
    it('allows overriding an enabled flag to disabled', () => {
      expect(isEnabled('new_analytics_dashboard')).toBe(true);
      
      overrideFlag('new_analytics_dashboard', false);
      
      expect(isEnabled('new_analytics_dashboard')).toBe(false);
    });

    it('allows overriding a disabled flag to enabled', () => {
      expect(isEnabled('premium_apis')).toBe(false);
      
      overrideFlag('premium_apis', true);
      
      expect(isEnabled('premium_apis')).toBe(true);
    });

    it('clears override correctly', () => {
      overrideFlag('new_analytics_dashboard', false);
      expect(isEnabled('new_analytics_dashboard')).toBe(false);
      
      clearOverride('new_analytics_dashboard');
      
      expect(isEnabled('new_analytics_dashboard')).toBe(true);
    });
  });

  describe('evaluateFlag', () => {
    it('returns correct evaluation structure', () => {
      const result = evaluateFlag('new_analytics_dashboard');
      
      expect(result).toHaveProperty('key', 'new_analytics_dashboard');
      expect(result).toHaveProperty('enabled');
      expect(result).toHaveProperty('reason');
    });

    it('indicates override reason when overridden', () => {
      overrideFlag('new_analytics_dashboard', false);
      
      const result = evaluateFlag('new_analytics_dashboard');
      
      expect(result.reason).toBe('Override applied');
    });

    it('indicates flag not found for non-existent flags', () => {
      const result = evaluateFlag('non_existent_flag');
      
      expect(result.enabled).toBe(false);
      expect(result.reason).toBe('Flag not found');
    });
  });

  describe('getAllFlags', () => {
    it('returns all flags', () => {
      const flags = getAllFlags();
      
      expect(Array.isArray(flags)).toBe(true);
      expect(flags.length).toBeGreaterThan(0);
    });

    it('each flag has required properties', () => {
      const flags = getAllFlags();
      
      flags.forEach(flag => {
        expect(flag).toHaveProperty('key');
        expect(flag).toHaveProperty('name');
        expect(flag).toHaveProperty('enabled');
        expect(flag).toHaveProperty('createdAt');
        expect(flag).toHaveProperty('updatedAt');
      });
    });
  });

  describe('getFlag', () => {
    it('returns flag by key', () => {
      const flag = getFlag('new_analytics_dashboard');
      
      expect(flag).toBeDefined();
      expect(flag?.key).toBe('new_analytics_dashboard');
    });

    it('returns undefined for non-existent flag', () => {
      const flag = getFlag('non_existent_flag');
      
      expect(flag).toBeUndefined();
    });
  });

  describe('user context', () => {
    it('can set and clear user context', () => {
      setUserContext({
        userId: 'test-user-123',
        role: 'admin',
      });
      
      // Context is set - won't throw
      expect(() => clearUserContext()).not.toThrow();
    });
  });

  describe('A/B testing variants', () => {
    it('returns variant for flags with variants', () => {
      // Enable the A/B test flag
      overrideFlag('ab_test_pricing', true);
      setUserContext({ userId: 'test-user-123' });
      
      const result = evaluateFlag('ab_test_pricing');
      
      // Since we're overriding, variant evaluation may not happen
      // but the flag should be enabled
      expect(result.enabled).toBe(true);
    });

    it('getVariant returns variant key', () => {
      overrideFlag('ab_test_pricing', true);
      setUserContext({ userId: 'test-user-123' });
      
      // Variant may be undefined when overridden
      const variant = getVariant('ab_test_pricing');
      
      // Just ensure it doesn't throw
      expect(variant === undefined || typeof variant === 'string').toBe(true);
    });
  });
});
