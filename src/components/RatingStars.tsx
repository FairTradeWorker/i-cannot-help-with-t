// Rating Stars - Consistent star rating display and input
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from '@phosphor-icons/react';

interface RatingStarsProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
  precision?: 0.5 | 1;
}

const sizeMap = {
  sm: 14,
  md: 18,
  lg: 24,
};

export function RatingStars({
  value,
  max = 5,
  size = 'md',
  editable = false,
  onChange,
  showValue = false,
  precision = 1,
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;
  const starSize = sizeMap[size];

  const handleClick = (starIndex: number, isHalf: boolean) => {
    if (!editable || !onChange) return;
    const newValue = precision === 0.5 && isHalf ? starIndex + 0.5 : starIndex + 1;
    onChange(newValue);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (!editable) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = precision === 0.5 && x < rect.width / 2;
    setHoverValue(isHalf ? starIndex + 0.5 : starIndex + 1);
  };

  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i;
        const fillPercentage = Math.min(100, Math.max(0, (displayValue - starIndex) * 100));

        return (
          <motion.div
            key={i}
            className={`relative ${editable ? 'cursor-pointer' : ''}`}
            whileHover={editable ? { scale: 1.1 } : undefined}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const isHalf = precision === 0.5 && x < rect.width / 2;
              handleClick(starIndex, isHalf);
            }}
            onMouseMove={(e) => handleMouseMove(e, starIndex)}
            onMouseLeave={() => editable && setHoverValue(null)}
          >
            {/* Background star (empty) */}
            <Star
              size={starSize}
              weight="regular"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Foreground star (filled) - clipped based on percentage */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                size={starSize}
                weight="fill"
                className="text-amber-400"
              />
            </div>
          </motion.div>
        );
      })}
      {showValue && (
        <span className={`ml-1.5 font-medium text-muted-foreground ${
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        }`}>
          {value.toFixed(precision === 0.5 ? 1 : 0)}
        </span>
      )}
    </div>
  );
}
