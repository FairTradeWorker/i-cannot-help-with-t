import { useCallback } from 'react';

export function useSuccessPulse() {
  const triggerSuccess = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('success-pulse');
      setTimeout(() => {
        element.classList.remove('success-pulse');
      }, 400);
    }
  }, []);

  return { triggerSuccess };
}
