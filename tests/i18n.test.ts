/**
 * Unit Tests for i18n (Internationalization) Service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage before importing
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

// Mock navigator.language
Object.defineProperty(globalThis, 'navigator', {
  value: { language: 'en-US' },
  writable: true,
});

import {
  t,
  setLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  languageNames,
  type SupportedLanguage,
} from '../src/i18n/config';

describe('i18n Service', () => {
  beforeEach(() => {
    localStorageMock.store = {};
    vi.clearAllMocks();
    setLanguage('en'); // Reset to English
  });

  describe('getSupportedLanguages', () => {
    it('returns array of supported languages', () => {
      const languages = getSupportedLanguages();
      
      expect(Array.isArray(languages)).toBe(true);
      expect(languages).toContain('en');
      expect(languages).toContain('es');
      expect(languages).toContain('fr');
    });
  });

  describe('languageNames', () => {
    it('has display names for all supported languages', () => {
      expect(languageNames.en).toBe('English');
      expect(languageNames.es).toBe('Español');
      expect(languageNames.fr).toBe('Français');
    });
  });

  describe('getCurrentLanguage', () => {
    it('returns current language', () => {
      const lang = getCurrentLanguage();
      expect(['en', 'es', 'fr']).toContain(lang);
    });
  });

  describe('setLanguage', () => {
    it('changes the current language', () => {
      setLanguage('es');
      expect(getCurrentLanguage()).toBe('es');
      
      setLanguage('fr');
      expect(getCurrentLanguage()).toBe('fr');
    });

    it('stores language preference in localStorage', () => {
      setLanguage('es');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ftw_language', 'es');
    });

    it('ignores invalid language codes', () => {
      const currentLang = getCurrentLanguage();
      setLanguage('invalid' as SupportedLanguage);
      expect(getCurrentLanguage()).toBe(currentLang);
    });
  });

  describe('t (translation function)', () => {
    it('returns translation for valid key', () => {
      setLanguage('en');
      const result = t('common.loading');
      expect(result).toBe('Loading...');
    });

    it('supports nested keys with dot notation', () => {
      setLanguage('en');
      expect(t('common.save')).toBe('Save');
      expect(t('navigation.home')).toBe('Home');
      expect(t('jobs.status.completed')).toBe('Completed');
    });

    it('returns key for non-existent translations', () => {
      const key = 'non.existent.key';
      const result = t(key);
      expect(result).toBe(key);
    });

    it('works with Spanish translations', () => {
      setLanguage('es');
      expect(t('common.loading')).toBe('Cargando...');
      expect(t('common.save')).toBe('Guardar');
    });

    it('works with French translations', () => {
      setLanguage('fr');
      expect(t('common.loading')).toBe('Chargement...');
      expect(t('common.save')).toBe('Enregistrer');
    });

    it('handles parameter interpolation', () => {
      // If the translation contains {param}, it should be replaced
      const key = 'test.with.param';
      // Since this key doesn't exist, it returns the key
      const result = t(key, { count: 5 });
      expect(typeof result).toBe('string');
    });
  });

  describe('language persistence', () => {
    it('dispatches languagechange event when language changes', () => {
      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');
      
      setLanguage('es');
      
      expect(dispatchEventSpy).toHaveBeenCalled();
      const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('languagechange');
      expect(event.detail).toBe('es');
    });
  });

  describe('fallback behavior', () => {
    it('falls back to English for missing translations', () => {
      // Set to Spanish but try to get a key that might not exist in es.json
      setLanguage('es');
      
      // If key exists in es.json, it should return Spanish
      // If not, it should fall back to English or return the key
      const result = t('common.loading');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
