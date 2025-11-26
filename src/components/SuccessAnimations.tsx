/**
 * Success Animations Component
 * Celebratory animations for completed actions
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, PartyPopper, Rocket, Star, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

// Confetti particle
interface ConfettiProps {
  count?: number;
  duration?: number;
}

export function Confetti({ count = 50, duration = 3000 }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string }>>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][
        Math.floor(Math.random() * 6)
      ],
    }));
    setParticles(newParticles);
    
    const timer = setTimeout(() => setParticles([]), duration);
    return () => clearTimeout(timer);
  }, [count, duration]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}vw`, 
              y: -20, 
              rotate: 0,
              scale: 1 
            }}
            animate={{ 
              y: '110vh',
              rotate: Math.random() * 720 - 360,
              scale: [1, 1.2, 0.8, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              ease: 'linear'
            }}
            className="absolute w-3 h-3 rounded-sm"
            style={{ backgroundColor: particle.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Success checkmark animation
interface SuccessCheckProps {
  show: boolean;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SuccessCheck({ show, onComplete, size = 'md', className }: SuccessCheckProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };
  
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          onAnimationComplete={onComplete}
          className={cn(
            "rounded-full bg-green-500 flex items-center justify-center",
            sizeClasses[size],
            className
          )}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          >
            <Check className={cn("text-white", iconSizes[size])} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Celebration overlay
interface CelebrationOverlayProps {
  show: boolean;
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
  duration?: number;
}

export function CelebrationOverlay({
  show,
  title = 'Success!',
  subtitle,
  onComplete,
  duration = 2500
}: CelebrationOverlayProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete, duration]);
  
  return (
    <AnimatePresence>
      {show && (
        <>
          <Confetti />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500 mb-6"
              >
                <PartyPopper className="h-12 w-12 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                {title}
              </motion.h2>
              
              {subtitle && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/80"
                >
                  {subtitle}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Success toast content
interface SuccessToastProps {
  title: string;
  description?: string;
  icon?: 'check' | 'rocket' | 'sparkles' | 'star';
}

export function SuccessToast({ title, description, icon = 'check' }: SuccessToastProps) {
  const icons = {
    check: CheckCircle2,
    rocket: Rocket,
    sparkles: Sparkles,
    star: Star,
  };
  
  const Icon = icons[icon];
  
  return (
    <div className="flex items-start gap-3">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="flex-shrink-0"
      >
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <Icon className="h-4 w-4 text-green-600" />
        </div>
      </motion.div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

// Pulsing success ring
interface PulsingRingProps {
  show: boolean;
  color?: string;
  size?: number;
}

export function PulsingRing({ show, color = '#22c55e', size = 100 }: PulsingRingProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="absolute"
          style={{ width: size, height: size }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-full h-full rounded-full"
            style={{
              border: `4px solid ${color}`,
              opacity: 0.3,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Number counter animation
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  className
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function (ease out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(Math.round(startValue + (value - startValue) * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return (
    <span className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
