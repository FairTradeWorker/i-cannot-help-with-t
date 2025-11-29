import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getGlassEngine, type GlassContext } from '@/lib/glassmorphism-engine';
import { cn } from '@/lib/utils';

interface GlassSurfaceProps {
  id: string;
  context: GlassContext;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
}

/**
 * Glassmorphism 2.0 Surface Component
 * 
 * Intelligent glass surface that adapts to context, urgency, confidence, and environment.
 */
export function GlassSurface({ 
  id, 
  context, 
  className, 
  children, 
  onClick,
  onHover 
}: GlassSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const engine = getGlassEngine();

  useEffect(() => {
    if (!ref.current) return;

    // Register with engine
    ref.current.setAttribute('data-glass-id', id);
    engine.registerGlass(id, context);

    return () => {
      engine.unregisterGlass(id);
    };
  }, [id]);

  // Update glass when context changes
  useEffect(() => {
    engine.updateGlass(id, context);
  }, [id, context.urgency, context.confidence, context.completion, context.weather, context.serviceCategory, context.dataComplexity]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(false);
  };

  // Determine animation based on urgency
  const animationProps = context.urgency === 'critical' 
    ? {
        animate: {
          scale: [1, 1.02, 1],
          boxShadow: [
            '0 0 20px rgba(239,68,68,0.4)',
            '0 0 40px rgba(239,68,68,0.6)',
            '0 0 20px rgba(239,68,68,0.4)'
          ]
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1] as const
        }
      }
    : context.urgency === 'high'
    ? {
        animate: {
          scale: [1, 1.01, 1],
          boxShadow: [
            '0 0 15px rgba(249,115,22,0.3)',
            '0 0 30px rgba(249,115,22,0.5)',
            '0 0 15px rgba(249,115,22,0.3)'
          ]
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1] as const
        }
      }
    : {
        whileHover: {
          scale: 1.02,
          y: -4,
          transition: { duration: 0.2 }
        }
      };

  return (
    <motion.div
      ref={ref}
      className={cn('glass-surface', className)}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...animationProps}
    >
      {/* Refraction layer */}
      <div className="glass-refraction-layer" />
      
      {/* Content */}
      <div className="glass-content relative z-10">
        {children}
      </div>

      {/* Progress shimmer for in-progress items */}
      {context.completion !== undefined && context.completion > 0 && context.completion < 1 && (
        <div 
          className="glass-progress-shimmer"
          style={{
            '--progress': context.completion
          } as React.CSSProperties}
        />
      )}
    </motion.div>
  );
}

