// Progress Tracker - Visual step-by-step progress indicator
import { motion } from 'framer-motion';
import { Check, Circle } from '@phosphor-icons/react';

interface Step {
  id: string;
  label: string;
  description?: string;
  completed?: boolean;
  current?: boolean;
}

interface ProgressTrackerProps {
  steps: Step[];
  currentStep?: number;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md';
}

export function ProgressTracker({
  steps,
  currentStep = 0,
  orientation = 'horizontal',
  size = 'md',
}: ProgressTrackerProps) {
  const isVertical = orientation === 'vertical';
  const iconSize = size === 'sm' ? 20 : 28;

  return (
    <div className={`flex ${isVertical ? 'flex-col gap-0' : 'items-start gap-0'}`}>
      {steps.map((step, index) => {
        const isCompleted = step.completed ?? index < currentStep;
        const isCurrent = step.current ?? index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.id}
            className={`flex ${isVertical ? 'flex-row' : 'flex-col'} items-center ${
              !isLast ? 'flex-1' : ''
            }`}
          >
            {/* Step indicator */}
            <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center`}>
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? 'rgb(22, 163, 74)'
                    : isCurrent
                    ? 'rgb(37, 99, 235)'
                    : 'rgb(229, 231, 235)',
                }}
                transition={{ duration: 0.2 }}
                className={`
                  flex items-center justify-center rounded-full
                  ${size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'}
                `}
              >
                {isCompleted ? (
                  <Check size={iconSize - 8} weight="bold" className="text-white" />
                ) : (
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`
                    ${isVertical ? 'w-0.5 h-8' : 'h-0.5 flex-1 min-w-8'}
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                />
              )}
            </div>

            {/* Label */}
            <div
              className={`
                ${isVertical ? 'ml-3 pb-6' : 'mt-2 text-center px-1'}
                ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}
              `}
            >
              <p className={`font-medium ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
