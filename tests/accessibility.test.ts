/**
 * Unit Tests for Accessibility Utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock React
vi.mock('react', () => ({
  useEffect: vi.fn((fn) => fn()),
  useCallback: vi.fn((fn) => fn),
  useRef: vi.fn(() => ({ current: null })),
  useState: vi.fn((initial) => [initial, vi.fn()]),
}));

import {
  prefersReducedMotion,
  getContrastRatio,
  meetsContrastRequirements,
  hexToRgb,
  generateAriaId,
  visuallyHiddenStyles,
  skipLinkClassName,
  getFormFieldProps,
  runAccessibilityChecks,
} from '../src/lib/accessibility';

describe('Accessibility Utilities', () => {
  describe('prefersReducedMotion', () => {
    it('returns a boolean', () => {
      const result = prefersReducedMotion();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('hexToRgb', () => {
    it('converts hex color to RGB', () => {
      const result = hexToRgb('#ffffff');
      expect(result).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('converts hex without # prefix', () => {
      const result = hexToRgb('000000');
      expect(result).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('handles various colors', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('returns null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#fff')).toBeNull(); // 3-char hex not supported
    });
  });

  describe('getContrastRatio', () => {
    it('returns 21 for black on white', () => {
      const white = { r: 255, g: 255, b: 255 };
      const black = { r: 0, g: 0, b: 0 };
      const ratio = getContrastRatio(white, black);
      
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('returns 1 for same colors', () => {
      const color = { r: 128, g: 128, b: 128 };
      const ratio = getContrastRatio(color, color);
      
      expect(ratio).toBeCloseTo(1, 0);
    });

    it('calculates ratio correctly for other colors', () => {
      const white = { r: 255, g: 255, b: 255 };
      const gray = { r: 128, g: 128, b: 128 };
      const ratio = getContrastRatio(white, gray);
      
      expect(ratio).toBeGreaterThan(1);
      expect(ratio).toBeLessThan(21);
    });
  });

  describe('meetsContrastRequirements', () => {
    it('returns true for high contrast (normal text)', () => {
      expect(meetsContrastRequirements(4.5)).toBe(true);
      expect(meetsContrastRequirements(7)).toBe(true);
      expect(meetsContrastRequirements(21)).toBe(true);
    });

    it('returns false for low contrast (normal text)', () => {
      expect(meetsContrastRequirements(3)).toBe(false);
      expect(meetsContrastRequirements(1)).toBe(false);
    });

    it('has lower threshold for large text', () => {
      expect(meetsContrastRequirements(3, true)).toBe(true);
      expect(meetsContrastRequirements(2.9, true)).toBe(false);
    });
  });

  describe('generateAriaId', () => {
    it('generates unique IDs', () => {
      const id1 = generateAriaId();
      const id2 = generateAriaId();
      
      expect(id1).not.toBe(id2);
    });

    it('uses custom prefix', () => {
      const id = generateAriaId('custom');
      expect(id.startsWith('custom-')).toBe(true);
    });

    it('uses default prefix', () => {
      const id = generateAriaId();
      expect(id.startsWith('aria-')).toBe(true);
    });
  });

  describe('visuallyHiddenStyles', () => {
    it('contains required CSS properties', () => {
      expect(visuallyHiddenStyles.position).toBe('absolute');
      expect(visuallyHiddenStyles.width).toBe('1px');
      expect(visuallyHiddenStyles.height).toBe('1px');
      expect(visuallyHiddenStyles.overflow).toBe('hidden');
    });
  });

  describe('skipLinkClassName', () => {
    it('is a non-empty string', () => {
      expect(typeof skipLinkClassName).toBe('string');
      expect(skipLinkClassName.length).toBeGreaterThan(0);
    });

    it('contains sr-only class', () => {
      expect(skipLinkClassName).toContain('sr-only');
    });

    it('contains focus styles', () => {
      expect(skipLinkClassName).toContain('focus:');
    });
  });

  describe('getFormFieldProps', () => {
    it('generates field props correctly', () => {
      const props = getFormFieldProps({
        id: 'email',
        label: 'Email Address',
        required: true,
      });

      expect(props.field.id).toBe('email');
      expect(props.field['aria-required']).toBe(true);
      expect(props.label.htmlFor).toBe('email');
    });

    it('handles error state', () => {
      const props = getFormFieldProps({
        id: 'password',
        label: 'Password',
        error: 'Password is required',
      });

      expect(props.field['aria-invalid']).toBe(true);
      expect(props.error).not.toBeNull();
      expect(props.error?.id).toBe('password-error');
      expect(props.error?.role).toBe('alert');
    });

    it('handles description', () => {
      const props = getFormFieldProps({
        id: 'username',
        label: 'Username',
        description: 'Choose a unique username',
      });

      expect(props.description).not.toBeNull();
      expect(props.description?.id).toBe('username-description');
    });

    it('handles aria-describedby correctly', () => {
      const props = getFormFieldProps({
        id: 'field',
        label: 'Field',
        description: 'Description',
        error: 'Error',
      });

      expect(props.field['aria-describedby']).toContain('field-description');
      expect(props.field['aria-describedby']).toContain('field-error');
    });
  });

  describe('runAccessibilityChecks', () => {
    beforeEach(() => {
      // Create a mock document
      document.body.innerHTML = '';
    });

    it('returns an array of issues', () => {
      const issues = runAccessibilityChecks();
      expect(Array.isArray(issues)).toBe(true);
    });

    it('detects images without alt text', () => {
      document.body.innerHTML = '<img src="test.jpg">';
      const issues = runAccessibilityChecks();
      
      expect(issues.some(issue => issue.includes('image'))).toBe(true);
    });

    it('detects empty buttons without aria-label', () => {
      document.body.innerHTML = '<button></button>';
      const issues = runAccessibilityChecks();
      
      expect(issues.some(issue => issue.includes('button'))).toBe(true);
    });
  });
});
