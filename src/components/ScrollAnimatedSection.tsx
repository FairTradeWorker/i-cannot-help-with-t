import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollAnimatedSectionProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function ScrollAnimatedSection({ 
  children, 
  className = '', 
  staggerDelay = 0 
}: ScrollAnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin: '50px',
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const transitionDelay = staggerDelay > 0 ? `${staggerDelay}s` : '0s';

  return (
    <div
      ref={sectionRef}
      className={`animate-on-scroll ${isVisible ? 'visible' : ''} ${className}`}
      style={{
        transitionDelay: isVisible ? transitionDelay : '0s',
      }}
    >
      {children}
    </div>
  );
}

