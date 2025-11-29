import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { GlassSurface } from './GlassSurface';
import type { GlassContext } from '@/lib/glassmorphism-engine';

interface MagneticGlassCardProps {
  id: string;
  context: GlassContext;
  children: React.ReactNode;
  snapTarget?: { x: number; y: number };
  snapDistance?: number;
  snapStrength?: number;
  onSnap?: () => void;
  onThrow?: () => void;
  className?: string;
}

/**
 * Magnetic Glass Card with physics-based interactions
 * 
 * Features:
 * - Magnetic snapping to targets
 * - Throw-and-catch gestures
 * - Inertia-based sliding
 * - Elastic resize
 */
export function MagneticGlassCard({
  id,
  context,
  children,
  snapTarget,
  snapDistance = 80,
  snapStrength = 0.7,
  onSnap,
  onThrow,
  className
}: MagneticGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  // Magnetic snap effect
  useEffect(() => {
    if (!snapTarget || !cardRef.current || isDragging) return;

    let animationFrameId: number | null = null;
    let isActive = true;

    const checkDistance = () => {
      if (!isActive || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      if (!rect) {
        animationFrameId = requestAnimationFrame(checkDistance);
        return;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(centerX - snapTarget!.x, 2) + 
        Math.pow(centerY - snapTarget!.y, 2)
      );

      if (distance < snapDistance) {
        const force = (1 - distance / snapDistance) * snapStrength;
        const deltaX = (snapTarget!.x - centerX) * force;
        const deltaY = (snapTarget!.y - centerY) * force;

        x.set(x.get() + deltaX * 0.1);
        y.set(y.get() + deltaY * 0.1);

        if (!isSnapping && force > 0.5) {
          setIsSnapping(true);
          onSnap?.();
        }
      } else {
        setIsSnapping(false);
      }

      if (isActive) {
        animationFrameId = requestAnimationFrame(checkDistance);
      }
    };

    animationFrameId = requestAnimationFrame(checkDistance);
    return () => {
      isActive = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [snapTarget, snapDistance, snapStrength, isDragging, isSnapping, x, y, onSnap]);

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    
    const throwVelocity = Math.sqrt(info.velocity.x ** 2 + info.velocity.y ** 2);
    
    if (throwVelocity > 800) {
      // Throw away gesture
      const angle = Math.atan2(info.velocity.y, info.velocity.x);
      const exitDistance = 2000;
      
      x.set(Math.cos(angle) * exitDistance);
      y.set(Math.sin(angle) * exitDistance);
      
      setTimeout(() => {
        onThrow?.();
      }, 400);
    } else {
      // Return to origin
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={{
        x: springX,
        y: springY
      }}
      animate={{
        scale: isSnapping ? 1.05 : 1,
        boxShadow: isSnapping 
          ? '0 0 30px rgba(34,197,94,0.5)' 
          : '0 4px 6px rgba(0,0,0,0.1)'
      }}
      transition={{
        scale: { duration: 0.2 },
        boxShadow: { duration: 0.2 }
      }}
      className={className}
    >
      <GlassSurface
        id={id}
        context={{
          ...context,
          // Add snapping state to context if needed
        }}
      >
        {children}
      </GlassSurface>
    </motion.div>
  );
}

