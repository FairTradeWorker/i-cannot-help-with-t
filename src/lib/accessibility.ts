/**
 * Accessibility Utilities
 * 
 * This module provides accessibility (a11y) utilities and hooks
 * to ensure WCAG 2.1 AA compliance throughout the application.
 */

import { useEffect, useCallback, useRef } from 'react';

// ============================================================================
// Focus Management
// ============================================================================

/**
 * Focus trap hook for modals and dialogs
 * Keeps focus within a container element
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus first element when trap activates
    firstElement.focus();

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors.join(', '))
  ).filter((el) => {
    return el.offsetWidth > 0 || el.offsetHeight > 0;
  });
}

/**
 * Restore focus to a previous element when a component unmounts
 */
export function useRestoreFocus() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;

    return () => {
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, []);
}

// ============================================================================
// Keyboard Navigation
// ============================================================================

/**
 * Arrow key navigation for lists and menus
 */
export function useArrowKeyNavigation(options?: {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
}) {
  const { orientation = 'vertical', loop = true } = options || {};
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!containerRef.current) return;

    const focusable = getFocusableElements(containerRef.current);
    const currentIndex = focusable.findIndex(
      (el) => el === document.activeElement
    );

    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    const isVertical = orientation === 'vertical' || orientation === 'both';
    const isHorizontal = orientation === 'horizontal' || orientation === 'both';

    switch (e.key) {
      case 'ArrowDown':
        if (isVertical) {
          e.preventDefault();
          nextIndex = loop
            ? (currentIndex + 1) % focusable.length
            : Math.min(currentIndex + 1, focusable.length - 1);
        }
        break;
      case 'ArrowUp':
        if (isVertical) {
          e.preventDefault();
          nextIndex = loop
            ? (currentIndex - 1 + focusable.length) % focusable.length
            : Math.max(currentIndex - 1, 0);
        }
        break;
      case 'ArrowRight':
        if (isHorizontal) {
          e.preventDefault();
          nextIndex = loop
            ? (currentIndex + 1) % focusable.length
            : Math.min(currentIndex + 1, focusable.length - 1);
        }
        break;
      case 'ArrowLeft':
        if (isHorizontal) {
          e.preventDefault();
          nextIndex = loop
            ? (currentIndex - 1 + focusable.length) % focusable.length
            : Math.max(currentIndex - 1, 0);
        }
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = focusable.length - 1;
        break;
    }

    if (nextIndex !== currentIndex) {
      focusable[nextIndex].focus();
    }
  }, [orientation, loop]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return containerRef;
}

/**
 * Escape key handler
 */
export function useEscapeKey(handler: () => void, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handler, isActive]);
}

// ============================================================================
// Screen Reader Utilities
// ============================================================================

/**
 * Announce a message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Hook for announcing dynamic content changes
 */
export function useAnnounce() {
  return useCallback((message: string, priority?: 'polite' | 'assertive') => {
    announceToScreenReader(message, priority);
  }, []);
}

// ============================================================================
// Reduced Motion
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion(): boolean {
  const mediaQuery = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  const getInitialState = () => mediaQuery?.matches ?? false;

  const ref = useRef(getInitialState());

  useEffect(() => {
    if (!mediaQuery) return;

    const handler = (e: MediaQueryListEvent) => {
      ref.current = e.matches;
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mediaQuery]);

  return ref.current;
}

// ============================================================================
// Color Contrast
// ============================================================================

/**
 * Calculate relative luminance of a color
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  
  const sRGB = [r, g, b].map((val) => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA requirements
 * Normal text: 4.5:1, Large text: 3:1
 */
export function meetsContrastRequirements(
  contrastRatio: number,
  isLargeText: boolean = false
): boolean {
  const threshold = isLargeText ? 3 : 4.5;
  return contrastRatio >= threshold;
}

/**
 * Parse hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// ============================================================================
// ARIA Helpers
// ============================================================================

/**
 * Generate unique ID for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Common ARIA live region props
 */
export const ariaLiveProps = {
  polite: {
    'aria-live': 'polite' as const,
    'aria-atomic': true,
  },
  assertive: {
    'aria-live': 'assertive' as const,
    'aria-atomic': true,
  },
};

/**
 * Props for visually hidden but accessible content
 */
export const visuallyHiddenStyles: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0',
};

// ============================================================================
// Skip Links
// ============================================================================

/**
 * Skip link component props and class name for keyboard users
 * Use in a React component like:
 * <a href="#main-content" className={skipLinkClassName}>Skip to main content</a>
 */
export const skipLinkClassName = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg';

// ============================================================================
// Form Accessibility
// ============================================================================

/**
 * Generate accessible form field props
 */
export function getFormFieldProps(options: {
  id: string;
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
}) {
  const { id, label, error, description, required } = options;
  
  const describedBy = [
    description ? `${id}-description` : null,
    error ? `${id}-error` : null,
  ].filter(Boolean).join(' ') || undefined;

  return {
    field: {
      id,
      'aria-required': required || undefined,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy,
    },
    label: {
      htmlFor: id,
    },
    description: description
      ? {
          id: `${id}-description`,
        }
      : null,
    error: error
      ? {
          id: `${id}-error`,
          role: 'alert' as const,
        }
      : null,
  };
}

// ============================================================================
// Accessibility Audit Helper
// ============================================================================

/**
 * Common accessibility issues to check
 */
export function runAccessibilityChecks(): string[] {
  const issues: string[] = [];

  // Check for images without alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} image(s) without alt text`);
  }

  // Check for form inputs without labels
  const inputsWithoutLabels = document.querySelectorAll(
    'input:not([aria-label]):not([aria-labelledby]):not([id])'
  );
  if (inputsWithoutLabels.length > 0) {
    issues.push(`${inputsWithoutLabels.length} input(s) without labels`);
  }

  // Check for buttons without accessible names
  const buttonsWithoutNames = document.querySelectorAll(
    'button:not([aria-label]):empty'
  );
  if (buttonsWithoutNames.length > 0) {
    issues.push(`${buttonsWithoutNames.length} button(s) without accessible names`);
  }

  // Check for links without accessible names
  const linksWithoutNames = document.querySelectorAll(
    'a:not([aria-label]):empty'
  );
  if (linksWithoutNames.length > 0) {
    issues.push(`${linksWithoutNames.length} link(s) without accessible names`);
  }

  // Check heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1]);
    if (level > lastLevel + 1 && lastLevel !== 0) {
      issues.push(`Skipped heading level: h${lastLevel} to h${level}`);
    }
    lastLevel = level;
  });

  return issues;
}

export default {
  useFocusTrap,
  getFocusableElements,
  useRestoreFocus,
  useArrowKeyNavigation,
  useEscapeKey,
  announceToScreenReader,
  useAnnounce,
  prefersReducedMotion,
  useReducedMotion,
  getContrastRatio,
  meetsContrastRequirements,
  hexToRgb,
  generateAriaId,
  ariaLiveProps,
  visuallyHiddenStyles,
  skipLinkClassName,
  getFormFieldProps,
  runAccessibilityChecks,
};
