// Animated Loader Component
// Beautiful three-bar loading animation in black and white

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedLoaderProps {
  size?: 'small' | 'medium' | 'large';
}

export function AnimatedLoader({ size = 'medium' }: AnimatedLoaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const sizeConfig = {
    small: { width: 8, height: 20, spacing: 12 },
    medium: { width: 13.6, height: 32, spacing: 19.992 },
    large: { width: 18, height: 44, spacing: 26 },
  };

  const { width, height, spacing } = sizeConfig[size];

  const barVariants = {
    animate: {
      height: [height, height * 1.25, height],
      opacity: [0.75, 1, 0.75],
    },
  };

  const barColor = isDark ? '#ffffff' : '#000000';

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ height: height * 1.25 }}>
        {/* Bar 1 */}
        <motion.div
          variants={barVariants}
          animate="animate"
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0,
          }}
          style={{
            width,
            backgroundColor: barColor,
            borderRadius: 4,
            position: 'absolute',
            left: -spacing,
            boxShadow: isDark ? '0 -8px 0 0 rgba(255,255,255,0.3)' : '0 -8px 0 0 rgba(0,0,0,0.3)',
          }}
        />

        {/* Bar 2 (center) */}
        <motion.div
          variants={barVariants}
          animate="animate"
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.16,
          }}
          style={{
            width,
            backgroundColor: barColor,
            borderRadius: 4,
            position: 'absolute',
            boxShadow: isDark ? '0 -8px 0 0 rgba(255,255,255,0.3)' : '0 -8px 0 0 rgba(0,0,0,0.3)',
          }}
        />

        {/* Bar 3 */}
        <motion.div
          variants={barVariants}
          animate="animate"
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.32,
          }}
          style={{
            width,
            backgroundColor: barColor,
            borderRadius: 4,
            position: 'absolute',
            left: spacing,
            boxShadow: isDark ? '0 -8px 0 0 rgba(255,255,255,0.3)' : '0 -8px 0 0 rgba(0,0,0,0.3)',
          }}
        />
      </div>
    </div>
  );
}
