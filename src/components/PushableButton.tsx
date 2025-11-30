// 3D Pushable Button Component
// Animated button with depth effect

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PushableButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PushableButton({
  onClick,
  children,
  color = '#008bf8',
  fullWidth = false,
  disabled = false,
  className = '',
}: PushableButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  // Generate darker shades for edge and shadow
  const adjustBrightness = (hexColor: string, amount: number): string => {
    const hex = hexColor.replace('#', '');
    const num = parseInt(hex, 16);

    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00ff) + amount;
    let b = (num & 0x0000ff) + amount;

    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  };

  const edgeColor = adjustBrightness(color, -20);
  const shadowColor = adjustBrightness(color, -40);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
      className={`
        relative
        ${fullWidth ? 'w-full' : 'inline-block'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{ background: 'transparent', border: 'none', padding: 0 }}
    >
      {/* Shadow */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-30"
        style={{ backgroundColor: shadowColor }}
        animate={{
          y: isPressed ? 1 : 2,
        }}
        transition={{ duration: isPressed ? 0.034 : 0.25 }}
      />

      {/* Edge */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{ backgroundColor: edgeColor }}
      />

      {/* Front */}
      <motion.div
        className="relative rounded-lg px-8 py-4 flex items-center justify-center"
        style={{ backgroundColor: color }}
        animate={{
          y: isPressed ? -2 : -4,
        }}
        transition={{ duration: isPressed ? 0.034 : 0.25 }}
      >
        {typeof children === 'string' ? (
          <span className="text-white font-semibold uppercase tracking-wider text-base">
            {children}
          </span>
        ) : (
          children
        )}
      </motion.div>
    </button>
  );
}
