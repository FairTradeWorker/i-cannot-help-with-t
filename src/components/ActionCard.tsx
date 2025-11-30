// Action Card Component
// Clean card design with hover effects for home screen

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onPress: () => void;
  buttonText?: string;
  iconColor?: string;
}

export function ActionCard({
  icon: Icon,
  title,
  description,
  onPress,
  buttonText = 'More info',
  iconColor = '#008bf8',
}: ActionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative mb-4"
    >
      <Card
        onClick={onPress}
        className={`
          min-h-[180px] p-6 cursor-pointer transition-all duration-300 relative overflow-visible
          border-2 rounded-[20px]
          ${isHovered
            ? 'border-[#008bf8] shadow-[0_4px_18px_0_rgba(0,0,0,0.25)] dark:shadow-[0_4px_18px_0_rgba(0,0,0,0.5)]'
            : 'border-[#c3c6ce] dark:border-[#444]'
          }
          bg-white dark:bg-[#2a2a2a]
        `}
      >
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-white dark:bg-gray-700"
          style={{ border: '1px solid #e5e7eb' }}
        >
          <Icon className="w-7 h-7 dark:text-gray-300" weight="bold" style={{ color: iconColor }} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-[#868686] leading-5">
            {description}
          </p>
        </div>

        {/* Button that appears on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute left-1/2 -bottom-5 -translate-x-1/2 z-10"
            >
              <Button
                className="bg-[#008bf8] hover:bg-[#0077d4] text-white rounded-2xl px-5 py-2.5 shadow-md"
                size="sm"
              >
                {buttonText}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
