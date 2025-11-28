/**
 * Extended React Hooks for Platform Optimizations
 * Additional custom hooks for the FairTradeWorker platform
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Hook 21: Use previous value
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Hook 22: Use interval
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// Hook 23: Use timeout
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

// Hook 24: Use media query
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    setMatches(mediaQuery.matches);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Hook 25: Use dark mode
export function useDarkMode(): {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
} {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = useCallback(() => setIsDark(prev => !prev), []);
  const setDark = useCallback((dark: boolean) => setIsDark(dark), []);

  return { isDark, toggle, setDark };
}

// Hook 26: Use document title
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

// Hook 27: Use lock scroll
export function useLockScroll(): { lock: () => void; unlock: () => void } {
  const lock = useCallback(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  }, []);

  const unlock = useCallback(() => {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }, []);

  return { lock, unlock };
}

// Hook 28: Use hover state
export function useHover<T extends HTMLElement>(): [
  React.RefObject<T>,
  boolean
] {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null as unknown as T);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref as React.RefObject<T>, isHovered];
}

// Hook 29: Use focus trap
export function useFocusTrap<T extends HTMLElement>(
  active: boolean
): React.RefObject<T> {
  const ref = useRef<T>(null as unknown as T);

  useEffect(() => {
    if (!active || !ref.current) return;

    const container = ref.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return ref as React.RefObject<T>;
}

// Hook 30: Use async effect
export function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps?: React.DependencyList
): void {
  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | void;

    effect().then((result) => {
      if (mounted && result) {
        cleanup = result;
      }
    });

    return () => {
      mounted = false;
      cleanup?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Hook 31: Use form
export function useForm<T extends Record<string, unknown>>(initialValues: T): {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  handleChange: (name: keyof T, value: T[keyof T]) => void;
  handleBlur: (name: keyof T) => void;
  setError: (name: keyof T, error: string | undefined) => void;
  reset: () => void;
  isValid: boolean;
} {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const setError = useCallback((name: keyof T, error: string | undefined) => {
    setErrors(prev => {
      if (error === undefined) {
        const { [name]: _, ...rest } = prev;
        return rest as unknown as Partial<Record<keyof T, string>>;
      }
      return { ...prev, [name]: error };
    });
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return { values, errors, touched, handleChange, handleBlur, setError, reset, isValid };
}

// Hook 32: Use persistent state with storage sync
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  storage: Storage = localStorage
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      try {
        storage.setItem(key, JSON.stringify(newValue));
      } catch {
        console.warn(`Failed to save ${key} to storage`);
      }
      return newValue;
    });
  }, [key, storage]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [state, setValue];
}

// Hook 33: Use geolocation
export function useGeolocation(): {
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  refresh: () => void;
} {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [loading, setLoading] = useState(false);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation not supported',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      } as GeolocationPositionError);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition(pos);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    getPosition();
  }, [getPosition]);

  return { position, error, loading, refresh: getPosition };
}

// Hook 34: Use countdown
export function useCountdown(
  targetDate: Date | null,
  onComplete?: () => void
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
} {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: !targetDate || targetDate.getTime() <= Date.now(),
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const diff = targetDate.getTime() - Date.now();
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
        onComplete?.();
        return true;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isComplete: false,
      });
      return false;
    };

    if (calculateTimeLeft()) return;

    const interval = setInterval(() => {
      if (calculateTimeLeft()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return timeLeft;
}

// Hook 35: Use step wizard
export function useStepWizard<T>(
  steps: T[],
  initialStep = 0
): {
  currentStep: number;
  currentStepData: T;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  goToStep: (step: number) => void;
  progress: number;
} {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const goToNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const goToPrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, steps.length - 1)));
  }, [steps.length]);

  return {
    currentStep,
    currentStepData: steps[currentStep],
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    goToNext,
    goToPrevious,
    goToStep,
    progress: ((currentStep + 1) / steps.length) * 100,
  };
}

// Hook 36: Use long press
export function useLongPress(
  callback: () => void,
  duration = 500
): {
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
} {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const start = useCallback(() => {
    timeoutRef.current = setTimeout(callback, duration);
  }, [callback, duration]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
  };
}

// Hook 37: Use pagination
export function usePagination<T>(
  items: T[],
  itemsPerPage: number
): {
  currentPage: number;
  totalPages: number;
  currentItems: T[];
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

// Hook 38: Use key press
export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === targetKey) setKeyPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === targetKey) setKeyPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [targetKey]);

  return keyPressed;
}

// Hook 39: Use screen orientation
export function useScreenOrientation(): {
  orientation: 'portrait' | 'landscape';
  angle: number;
} {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const handleChange = () => {
      if (screen.orientation) {
        setAngle(screen.orientation.angle);
        setOrientation(screen.orientation.type.includes('portrait') ? 'portrait' : 'landscape');
      } else {
        setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
      }
    };

    handleChange();

    if (screen.orientation) {
      screen.orientation.addEventListener('change', handleChange);
      return () => screen.orientation.removeEventListener('change', handleChange);
    } else {
      window.addEventListener('resize', handleChange);
      return () => window.removeEventListener('resize', handleChange);
    }
  }, []);

  return { orientation, angle };
}

// Hook 40: Use network status
export function useNetworkStatus(): {
  online: boolean;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
} {
  const [status, setStatus] = useState({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: null as string | null,
    downlink: null as number | null,
    rtt: null as number | null,
  });

  useEffect(() => {
    const updateStatus = () => {
      const connection = (navigator as Navigator & { 
        connection?: { effectiveType?: string; downlink?: number; rtt?: number } 
      }).connection;

      setStatus({
        online: navigator.onLine,
        effectiveType: connection?.effectiveType ?? null,
        downlink: connection?.downlink ?? null,
        rtt: connection?.rtt ?? null,
      });
    };

    updateStatus();

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const connection = (navigator as Navigator & { 
      connection?: { addEventListener?: (type: string, listener: () => void) => void } 
    }).connection;
    connection?.addEventListener?.('change', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return status;
}
