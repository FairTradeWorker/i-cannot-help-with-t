/**
 * Feature Flags Service
 * 
 * This module provides feature flag functionality for controlled rollouts,
 * A/B testing, and gradual feature releases.
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Feature flag definition
 */
export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage?: number;
  targetRules?: TargetRule[];
  variants?: FlagVariant[];
  defaultVariant?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Target rule for feature flags
 */
export interface TargetRule {
  id: string;
  type: 'user' | 'role' | 'segment' | 'percentage' | 'environment';
  attribute?: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: string | string[] | number;
  enabled: boolean;
}

/**
 * Feature flag variant for A/B testing
 */
export interface FlagVariant {
  key: string;
  name: string;
  weight: number; // Percentage (0-100)
  payload?: Record<string, unknown>;
}

/**
 * User context for flag evaluation
 */
export interface UserContext {
  userId?: string;
  email?: string;
  role?: string;
  segments?: string[];
  attributes?: Record<string, string | number | boolean>;
}

/**
 * Flag evaluation result
 */
export interface FlagEvaluation {
  key: string;
  enabled: boolean;
  variant?: string;
  payload?: Record<string, unknown>;
  reason: string;
}

// ============================================================================
// Default Feature Flags
// ============================================================================

const DEFAULT_FLAGS: FeatureFlag[] = [
  {
    key: 'new_analytics_dashboard',
    name: 'New Analytics Dashboard',
    description: 'Rebuilt analytics dashboard with Recharts visualizations',
    enabled: true,
    rolloutPercentage: 100,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    key: 'real_time_notifications',
    name: 'Real-time Notifications',
    description: 'WebSocket-based real-time notification system',
    enabled: true,
    rolloutPercentage: 100,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    key: 'video_job_posting',
    name: 'Video Job Posting',
    description: '60-second video analysis for job scope generation',
    enabled: true,
    rolloutPercentage: 100,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    key: 'route_optimization',
    name: 'Route Optimization',
    description: 'Multi-stop route planning for contractors',
    enabled: true,
    rolloutPercentage: 100,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    key: 'intelligence_apis',
    name: 'Intelligence APIs',
    description: 'Self-learning intelligence API platform',
    enabled: true,
    rolloutPercentage: 100,
    targetRules: [
      {
        id: 'admin-access',
        type: 'role',
        operator: 'in',
        value: ['admin', 'operator'],
        enabled: true,
      },
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    key: 'premium_apis',
    name: 'Premium Intelligence APIs',
    description: '34 Premium APIs - Unlocks May 27, 2026',
    enabled: false,
    rolloutPercentage: 0,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    key: 'mobile_app',
    name: 'Mobile App Features',
    description: 'React Native mobile application',
    enabled: true,
    rolloutPercentage: 100,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    key: 'ab_test_pricing',
    name: 'A/B Test: Pricing Display',
    description: 'Test different pricing display formats',
    enabled: false,
    rolloutPercentage: 50,
    variants: [
      { key: 'control', name: 'Control', weight: 50 },
      { key: 'variant_a', name: 'Variant A', weight: 50 },
    ],
    defaultVariant: 'control',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    key: 'dark_mode',
    name: 'Dark Mode',
    description: 'Dark theme support',
    enabled: true,
    rolloutPercentage: 100,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    key: 'i18n_support',
    name: 'Internationalization',
    description: 'Multi-language support (EN, ES, FR)',
    enabled: true,
    rolloutPercentage: 100,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// ============================================================================
// State Management
// ============================================================================

const FLAGS_STORAGE_KEY = 'ftw_feature_flags';
const OVERRIDES_STORAGE_KEY = 'ftw_flag_overrides';

interface FlagState {
  flags: FeatureFlag[];
  overrides: Record<string, boolean>;
  userContext: UserContext | null;
}

let state: FlagState = {
  flags: DEFAULT_FLAGS,
  overrides: {},
  userContext: null,
};

const listeners: Set<(flags: FeatureFlag[]) => void> = new Set();

/**
 * Notify listeners of flag changes
 */
function notifyListeners(): void {
  listeners.forEach(listener => listener([...state.flags]));
}

/**
 * Subscribe to flag changes
 */
export function subscribeToFlags(listener: (flags: FeatureFlag[]) => void): () => void {
  listeners.add(listener);
  listener([...state.flags]);
  return () => listeners.delete(listener);
}

// ============================================================================
// Storage
// ============================================================================

/**
 * Load flags from storage (for persistent overrides)
 */
function loadStoredOverrides(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load flag overrides:', error);
  }
  return {};
}

/**
 * Save overrides to storage
 */
function saveOverrides(overrides: Record<string, boolean>): void {
  try {
    localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch (error) {
    console.error('Failed to save flag overrides:', error);
  }
}

// ============================================================================
// Flag Evaluation
// ============================================================================

/**
 * Hash function for consistent user bucketing
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Get user bucket (0-99) for percentage-based rollouts
 */
function getUserBucket(userId: string, flagKey: string): number {
  const combined = `${userId}-${flagKey}`;
  return hashString(combined) % 100;
}

/**
 * Evaluate a target rule
 */
function evaluateRule(rule: TargetRule, context: UserContext): boolean {
  if (!rule.enabled) return false;
  
  let value: unknown;
  
  switch (rule.type) {
    case 'user':
      value = context.userId;
      break;
    case 'role':
      value = context.role;
      break;
    case 'segment':
      value = context.segments;
      break;
    case 'environment':
      value = import.meta.env.MODE;
      break;
    default:
      value = context.attributes?.[rule.attribute || ''];
  }
  
  switch (rule.operator) {
    case 'equals':
      return value === rule.value;
    case 'not_equals':
      return value !== rule.value;
    case 'contains':
      return Array.isArray(value) 
        ? value.includes(rule.value as string) 
        : String(value).includes(String(rule.value));
    case 'in':
      return Array.isArray(rule.value) && rule.value.includes(value as string);
    case 'not_in':
      return Array.isArray(rule.value) && !rule.value.includes(value as string);
    case 'greater_than':
      return Number(value) > Number(rule.value);
    case 'less_than':
      return Number(value) < Number(rule.value);
    default:
      return false;
  }
}

/**
 * Select variant based on weights
 */
function selectVariant(variants: FlagVariant[], userId: string, flagKey: string): FlagVariant | null {
  if (!variants.length) return null;
  
  const bucket = getUserBucket(userId, flagKey);
  let cumulative = 0;
  
  for (const variant of variants) {
    cumulative += variant.weight;
    if (bucket < cumulative) {
      return variant;
    }
  }
  
  return variants[variants.length - 1];
}

/**
 * Evaluate a feature flag
 */
export function evaluateFlag(flagKey: string, context?: UserContext): FlagEvaluation {
  const flag = state.flags.find(f => f.key === flagKey);
  
  if (!flag) {
    return {
      key: flagKey,
      enabled: false,
      reason: 'Flag not found',
    };
  }
  
  // Check for override
  if (flagKey in state.overrides) {
    return {
      key: flagKey,
      enabled: state.overrides[flagKey],
      reason: 'Override applied',
    };
  }
  
  // Check if globally disabled
  if (!flag.enabled) {
    return {
      key: flagKey,
      enabled: false,
      reason: 'Flag is disabled',
    };
  }
  
  const ctx = context || state.userContext || {};
  
  // Evaluate target rules
  if (flag.targetRules?.length) {
    const matchingRule = flag.targetRules.find(rule => evaluateRule(rule, ctx));
    if (matchingRule) {
      return {
        key: flagKey,
        enabled: true,
        reason: `Matched rule: ${matchingRule.id}`,
      };
    }
  }
  
  // Check percentage rollout
  if (flag.rolloutPercentage !== undefined && ctx.userId) {
    const bucket = getUserBucket(ctx.userId, flagKey);
    const enabled = bucket < flag.rolloutPercentage;
    
    // Handle variants if enabled
    if (enabled && flag.variants?.length) {
      const variant = selectVariant(flag.variants, ctx.userId, flagKey);
      return {
        key: flagKey,
        enabled: true,
        variant: variant?.key,
        payload: variant?.payload,
        reason: `Rollout bucket: ${bucket}/${flag.rolloutPercentage}`,
      };
    }
    
    return {
      key: flagKey,
      enabled,
      reason: `Rollout bucket: ${bucket}/${flag.rolloutPercentage}`,
    };
  }
  
  return {
    key: flagKey,
    enabled: flag.enabled,
    variant: flag.defaultVariant,
    reason: 'Default value',
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Check if a feature is enabled
 */
export function isEnabled(flagKey: string, context?: UserContext): boolean {
  return evaluateFlag(flagKey, context).enabled;
}

/**
 * Get variant for a feature flag
 */
export function getVariant(flagKey: string, context?: UserContext): string | undefined {
  return evaluateFlag(flagKey, context).variant;
}

/**
 * Get variant payload
 */
export function getVariantPayload<T = Record<string, unknown>>(
  flagKey: string, 
  context?: UserContext
): T | undefined {
  return evaluateFlag(flagKey, context).payload as T | undefined;
}

/**
 * Set user context for flag evaluation
 */
export function setUserContext(context: UserContext): void {
  state.userContext = context;
}

/**
 * Clear user context
 */
export function clearUserContext(): void {
  state.userContext = null;
}

/**
 * Get all flags
 */
export function getAllFlags(): FeatureFlag[] {
  return [...state.flags];
}

/**
 * Get a specific flag
 */
export function getFlag(flagKey: string): FeatureFlag | undefined {
  return state.flags.find(f => f.key === flagKey);
}

// ============================================================================
// Admin/Override Functions
// ============================================================================

/**
 * Override a flag locally (for testing/development)
 */
export function overrideFlag(flagKey: string, enabled: boolean): void {
  state.overrides[flagKey] = enabled;
  saveOverrides(state.overrides);
  notifyListeners();
}

/**
 * Clear flag override
 */
export function clearOverride(flagKey: string): void {
  delete state.overrides[flagKey];
  saveOverrides(state.overrides);
  notifyListeners();
}

/**
 * Clear all overrides
 */
export function clearAllOverrides(): void {
  state.overrides = {};
  saveOverrides(state.overrides);
  notifyListeners();
}

/**
 * Get all overrides
 */
export function getOverrides(): Record<string, boolean> {
  return { ...state.overrides };
}

/**
 * Update a flag (admin only)
 */
export function updateFlag(flagKey: string, updates: Partial<FeatureFlag>): void {
  const index = state.flags.findIndex(f => f.key === flagKey);
  if (index !== -1) {
    state.flags[index] = {
      ...state.flags[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    notifyListeners();
  }
}

/**
 * Add a new flag (admin only)
 */
export function addFlag(flag: Omit<FeatureFlag, 'createdAt' | 'updatedAt'>): void {
  const now = new Date().toISOString();
  state.flags.push({
    ...flag,
    createdAt: now,
    updatedAt: now,
  });
  notifyListeners();
}

/**
 * Remove a flag (admin only)
 */
export function removeFlag(flagKey: string): void {
  state.flags = state.flags.filter(f => f.key !== flagKey);
  notifyListeners();
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize feature flags
 */
export function initialize(): void {
  state.overrides = loadStoredOverrides();
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initialize();
}

// ============================================================================
// React Hook
// ============================================================================

/**
 * React hook for feature flags
 */
export function useFeatureFlag(flagKey: string): boolean {
  // Note: In a real React app, you'd use useState and useEffect
  // to subscribe to flag changes
  return isEnabled(flagKey);
}

/**
 * React hook for variants
 */
export function useVariant(flagKey: string): { enabled: boolean; variant?: string; payload?: Record<string, unknown> } {
  const evaluation = evaluateFlag(flagKey);
  return {
    enabled: evaluation.enabled,
    variant: evaluation.variant,
    payload: evaluation.payload,
  };
}

export default {
  isEnabled,
  getVariant,
  getVariantPayload,
  evaluateFlag,
  setUserContext,
  clearUserContext,
  getAllFlags,
  getFlag,
  overrideFlag,
  clearOverride,
  clearAllOverrides,
  getOverrides,
  updateFlag,
  addFlag,
  removeFlag,
  subscribeToFlags,
  initialize,
  useFeatureFlag,
  useVariant,
};
