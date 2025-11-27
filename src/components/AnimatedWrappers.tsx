import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, ReactNode, useState, useCallback, MouseEvent, useEffect } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedCard({ children, delay = 0, className = '' }: AnimatedCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
}

export function FadeInWhenVisible({ children, delay = 0 }: FadeInWhenVisibleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
}

export function ScaleIn({ children, delay = 0 }: ScaleInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
    >
      {children}
    </motion.div>
  );
}

// Ripple effect for interactive elements
interface RippleProps {
  x: number;
  y: number;
  size: number;
}

interface RippleContainerProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function RippleContainer({ children, className = '', disabled = false }: RippleContainerProps) {
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const createRipple = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, size };
    setRipples(prev => [...prev, newRipple]);

    // Clear previous timeout and set new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setRipples(prev => prev.slice(1));
    }, 600);
  }, [disabled]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseDown={createRipple}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple, index) => (
          <motion.span
            key={index}
            initial={{ scale: 0, opacity: 0.35 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="absolute rounded-full bg-current pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hover scale effect for cards
interface HoverCardProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  lift?: number;
}

export function HoverCard({ children, className = '', scale = 1.02, lift = 4 }: HoverCardProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale, 
        y: -lift,
        transition: { duration: 0.28, ease: [0.34, 1.25, 0.64, 1] }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.11, ease: [0.32, 0, 0.67, 0] }
      }}
    >
      {children}
    </motion.div>
  );
}

// Interactive button wrapper with press feedback
interface PressButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function PressButton({ children, className = '', onClick, disabled = false }: PressButtonProps) {
  return (
    <motion.div
      className={className}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className = '', staggerDelay = 0.1 }: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// Slide in from direction
interface SlideInProps {
  children: ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  distance?: number;
}

export function SlideIn({ 
  children, 
  className = '', 
  direction = 'up', 
  delay = 0,
  distance = 30 
}: SlideInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const directionMap = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance }
  };

  const { x, y } = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

// Success pulse animation
interface SuccessPulseProps {
  children: ReactNode;
  className?: string;
  trigger: boolean;
}

export function SuccessPulse({ children, className = '', trigger }: SuccessPulseProps) {
  return (
    <motion.div
      className={className}
      animate={trigger ? {
        boxShadow: [
          '0 0 0 0 rgba(34, 197, 94, 0.6)',
          '0 0 0 8px rgba(34, 197, 94, 0.3)',
          '0 0 0 0 rgba(34, 197, 94, 0)'
        ]
      } : {}}
      transition={{ duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
    >
      {children}
    </motion.div>
  );
}

// Loading spinner with smooth animation
interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className = '' }: LoadingSpinnerProps) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="text-current"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeOpacity="0.2"
        />
        <path
          d="M12 2C6.48 2 2 6.48 2 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

// Page transition wrapper
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Modal/Dialog animation wrapper
interface ModalAnimationProps {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
}

export function ModalAnimation({ children, className = '', isOpen }: ModalAnimationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className={`fixed z-50 ${className}`}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              duration: 0.25, 
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Glassmorphism card with animations
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({ children, className = '', hover = true, delay = 0 }: GlassCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={`glass-card ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={hover ? { 
        y: -8,
        transition: { duration: 0.28, ease: [0.34, 1.25, 0.64, 1] }
      } : undefined}
      whileTap={hover ? { 
        scale: 0.98,
        transition: { duration: 0.11, ease: [0.32, 0, 0.67, 0] }
      } : undefined}
    >
      {children}
    </motion.div>
  );
}

// Form field with validation animation
interface FormFieldAnimationProps {
  children: ReactNode;
  className?: string;
  hasError?: boolean;
  isSuccess?: boolean;
}

export function FormFieldAnimation({ 
  children, 
  className = '', 
  hasError = false,
  isSuccess = false 
}: FormFieldAnimationProps) {
  return (
    <motion.div
      className={className}
      animate={hasError ? {
        x: [0, -4, 4, -4, 4, 0],
        borderColor: 'var(--destructive)'
      } : isSuccess ? {
        borderColor: 'var(--success)'
      } : {}}
      transition={{ 
        duration: hasError ? 0.4 : 0.3,
        ease: hasError ? 'easeInOut' : [0.32, 0, 0.67, 0]
      }}
    >
      {children}
    </motion.div>
  );
}

// Notification/Toast animation
interface NotificationAnimationProps {
  children: ReactNode;
  className?: string;
  isVisible: boolean;
}

export function NotificationAnimation({ 
  children, 
  className = '', 
  isVisible 
}: NotificationAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
