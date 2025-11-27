/**
 * Test Setup and Configuration
 * 
 * This module provides the testing infrastructure for FairTradeWorker.
 * It sets up Vitest with proper mocks and test utilities.
 */

import { afterEach, beforeAll, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

// Mock window.matchMedia
const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Setup before all tests
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  Object.defineProperty(window, 'matchMedia', { value: matchMediaMock });
  
  // Mock crypto.getRandomValues
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      getRandomValues: (array: Uint8Array | Uint32Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      },
      randomUUID: () => 'test-uuid-' + Math.random().toString(36).slice(2, 11),
    },
  });

  // Mock ResizeObserver
  globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver
  globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock performance.now()
  if (!window.performance) {
    (window as any).performance = {
      now: vi.fn(() => Date.now()),
    };
  }
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});

// Export mocks for use in tests
export {
  localStorageMock,
  matchMediaMock,
};
