import { useEffect, useRef } from 'react';
import { getGlassEngine, type GlassContext } from '@/lib/glassmorphism-engine';

/**
 * Hook for managing glass surface registration and updates
 */
export function useGlassSurface(id: string, context: GlassContext) {
  const engine = getGlassEngine();
  const contextRef = useRef(context);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  useEffect(() => {
    // Register on mount
    const element = document.querySelector(`[data-glass-id="${id}"]`);
    if (element) {
      engine.registerGlass(id, context);
    }

    return () => {
      engine.unregisterGlass(id);
    };
  }, [id]);

  useEffect(() => {
    // Update when context changes
    engine.updateGlass(id, context);
  }, [id, context.urgency, context.confidence, context.completion, context.weather, context.serviceCategory]);

  return {
    updateContext: (newContext: Partial<GlassContext>) => {
      engine.updateGlass(id, { ...contextRef.current, ...newContext });
    }
  };
}

