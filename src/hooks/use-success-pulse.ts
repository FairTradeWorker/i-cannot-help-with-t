import { useCallback } from 'react';

export function useSuccessPulse() {
  const triggerSuccess = useCallback((elementId?: string) => {
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.classList.add('success-pulse');
        setTimeout(() => {
          element.classList.remove('success-pulse');
        }, 400);
      }
    }
  }, []);

  const triggerSuccessRef = useCallback((ref: HTMLElement | null) => {
    if (ref) {
      ref.classList.add('success-pulse');
      setTimeout(() => {
        ref.classList.remove('success-pulse');
      }, 400);
    }
  }, []);

  return { triggerSuccess, triggerSuccessRef };
}
