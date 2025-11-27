/**
 * Internationalization (i18n) Configuration
 * 
 * This module provides multi-language support for the FairTradeWorker platform.
 * Currently supports: English (en), Spanish (es), French (fr)
 * 
 * Usage:
 * ```typescript
 * import { t, setLanguage, getCurrentLanguage } from '@/i18n/config';
 * 
 * // Get translated string
 * const text = t('common.loading');
 * 
 * // Change language
 * setLanguage('es');
 * 
 * // Get current language
 * const lang = getCurrentLanguage();
 * ```
 */

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

/** Supported languages */
export type SupportedLanguage = 'en' | 'es' | 'fr';

/** Translation resources by language */
const resources: Record<SupportedLanguage, typeof en> = {
  en,
  es,
  fr,
};

/** Language display names */
export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

/** Default language */
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/** Storage key for persisted language preference */
const LANGUAGE_STORAGE_KEY = 'ftw_language';

/** Current language state */
let currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;

/**
 * Initialize language from browser or storage
 */
export function initializeLanguage(): SupportedLanguage {
  // Try to get from localStorage first
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
    if (stored && resources[stored]) {
      currentLanguage = stored;
      return currentLanguage;
    }

    // Try browser language
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    if (resources[browserLang]) {
      currentLanguage = browserLang;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
      return currentLanguage;
    }
  }

  currentLanguage = DEFAULT_LANGUAGE;
  return currentLanguage;
}

/**
 * Get the current language
 */
export function getCurrentLanguage(): SupportedLanguage {
  return currentLanguage;
}

/**
 * Set the current language
 * @param lang - The language code to set
 */
export function setLanguage(lang: SupportedLanguage): void {
  if (resources[lang]) {
    currentLanguage = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      // Optionally dispatch event for React components to re-render
      window.dispatchEvent(new CustomEvent('languagechange', { detail: lang }));
    }
  }
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): SupportedLanguage[] {
  return Object.keys(resources) as SupportedLanguage[];
}

/**
 * Get translation by key path
 * Supports dot notation: 'common.loading', 'jobs.status.completed'
 * 
 * @param key - The translation key path
 * @param params - Optional parameters for interpolation (e.g., { count: 5 })
 * @returns The translated string or the key if not found
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: unknown = resources[currentLanguage];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to English if not found in current language
      value = resources.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = (value as Record<string, unknown>)[fallbackKey];
        } else {
          return key; // Return key if not found in fallback
        }
      }
      break;
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // Handle parameter interpolation
  if (params) {
    return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
      return result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
    }, value);
  }

  return value;
}

/**
 * React hook for using translations with language change detection
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   const { t, language, setLanguage } = useTranslation();
 *   return <h1>{t('common.welcome')}</h1>;
 * }
 * ```
 */
export function useTranslation() {
  // Note: This is a simple implementation. For React, consider using
  // react-i18next or a similar library for proper re-rendering on language change.
  
  return {
    t,
    language: currentLanguage,
    setLanguage,
    languages: getSupportedLanguages(),
    languageNames,
  };
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeLanguage();
}

export default {
  t,
  setLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  initializeLanguage,
  useTranslation,
  languageNames,
};
