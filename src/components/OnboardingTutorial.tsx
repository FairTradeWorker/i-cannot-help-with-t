/**
 * Onboarding Tutorial Component
 * Guided walkthrough for first-time users
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  Key, 
  Send, 
  Rocket,
  CheckCircle2,
  Sparkles,
  FileCode,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  content?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const defaultSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to FairTradeWorker!',
    description: 'Let\'s get you set up with our Intelligence APIs. This quick tour will help you make your first API call in under 5 minutes.',
    icon: Sparkles,
  },
  {
    id: 'api-key',
    title: 'Get Your API Key',
    description: 'Every API request requires authentication. Generate your API key to start making calls.',
    icon: Key,
    content: (
      <div className="bg-muted rounded-lg p-4 font-mono text-sm">
        <span className="text-muted-foreground">Authorization: Bearer </span>
        <span className="text-primary">YOUR_API_KEY</span>
      </div>
    ),
  },
  {
    id: 'first-call',
    title: 'Make Your First Call',
    description: 'Try our Instant Quote API to see the magic in action. It analyzes job details and returns accurate cost estimates.',
    icon: Send,
    content: (
      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
        <pre>{`POST /v1/quotes/instant
{
  "jobType": "roof_replacement",
  "squareFootage": 2500,
  "location": { "zip": "78701" }
}`}</pre>
      </div>
    ),
  },
  {
    id: 'explore',
    title: 'Explore 50+ APIs',
    description: 'From contractor matching to demand forecasting, explore our full suite of Intelligence APIs.',
    icon: FileCode,
    content: (
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-primary/10 p-2 rounded">Job Analysis</div>
        <div className="bg-primary/10 p-2 rounded">Instant Quotes</div>
        <div className="bg-primary/10 p-2 rounded">Contractor Match</div>
        <div className="bg-primary/10 p-2 rounded">Route Optimize</div>
        <div className="bg-primary/10 p-2 rounded">Market Trends</div>
        <div className="bg-primary/10 p-2 rounded">Demand Forecast</div>
      </div>
    ),
  },
  {
    id: 'track',
    title: 'Track Your Usage',
    description: 'Monitor API calls, view accuracy metrics, and manage your subscription from your dashboard.',
    icon: BarChart3,
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You\'re ready to build amazing applications with our self-learning APIs. Happy coding!',
    icon: Rocket,
  },
];

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  steps?: OnboardingStep[];
  className?: string;
}

export function OnboardingTutorial({
  isOpen,
  onClose,
  onComplete,
  steps = defaultSteps,
  className
}: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  const step = steps[currentStep];
  const Icon = step.icon;
  
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  
  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSkip = () => {
    onClose();
  };
  
  // Reset step when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          data-testid="onboarding-modal"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
              "bg-background rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden",
              className
            )}
          >
            {/* Header */}
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {currentStep + 1} of {totalSteps}
                  </span>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground p-1"
                  data-testid="skip-onboarding"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
            
            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.1 }}
                      className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                    >
                      <Icon className="h-8 w-8 text-primary" />
                    </motion.div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-center mb-3">
                    {step.title}
                  </h2>
                  
                  <p className="text-muted-foreground text-center mb-6">
                    {step.description}
                  </p>
                  
                  {step.content && (
                    <div className="mb-6">
                      {step.content}
                    </div>
                  )}
                  
                  {step.action && (
                    <Button
                      onClick={step.action.onClick}
                      className="w-full mb-4"
                      variant="outline"
                    >
                      {step.action.label}
                    </Button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Footer */}
            <div className="p-6 pt-0 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={isFirstStep}
                className={isFirstStep ? 'invisible' : ''}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              
              <div className="flex gap-1.5">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentStep 
                        ? "bg-primary" 
                        : "bg-muted hover:bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              
              <Button onClick={handleNext} data-testid="next-step">
                {isLastStep ? (
                  <>
                    Get Started
                    <CheckCircle2 className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing onboarding state
export function useOnboarding(storageKey = 'ftw_onboarding_complete') {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      // Handle SecurityError or other localStorage access issues
      return true;
    }
  });
  
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  
  useEffect(() => {
    // Show onboarding for new users after a short delay
    if (!hasCompletedOnboarding) {
      const timer = setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding]);
  
  const completeOnboarding = () => {
    try {
      localStorage.setItem(storageKey, 'true');
    } catch {
      // Handle SecurityError or other localStorage access issues
    }
    setHasCompletedOnboarding(true);
    setIsOnboardingOpen(false);
  };
  
  const resetOnboarding = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Handle SecurityError or other localStorage access issues
    }
    setHasCompletedOnboarding(false);
  };
  
  const openOnboarding = () => {
    setIsOnboardingOpen(true);
  };
  
  const closeOnboarding = () => {
    setIsOnboardingOpen(false);
  };
  
  return {
    hasCompletedOnboarding,
    isOnboardingOpen,
    completeOnboarding,
    resetOnboarding,
    openOnboarding,
    closeOnboarding,
  };
}

// Spotlight tooltip for highlighting specific elements
interface SpotlightTooltipProps {
  targetSelector: string;
  title: string;
  description: string;
  isVisible: boolean;
  onDismiss: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function SpotlightTooltip({
  targetSelector,
  title,
  description,
  isVisible,
  onDismiss,
  position = 'bottom'
}: SpotlightTooltipProps) {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  
  useEffect(() => {
    if (isVisible) {
      const target = document.querySelector(targetSelector);
      if (target) {
        const rect = target.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    }
  }, [isVisible, targetSelector]);
  
  if (!isVisible) return null;
  
  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' },
  };
  
  return (
    <>
      {/* Backdrop with hole */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onDismiss}
      />
      
      {/* Spotlight */}
      <div
        className="fixed z-50 rounded-lg ring-4 ring-primary ring-offset-2"
        style={{
          top: coords.top - 4,
          left: coords.left - 4,
          width: coords.width + 8,
          height: coords.height + 8,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
        }}
      />
      
      {/* Tooltip */}
      <div
        className="fixed z-50 bg-background rounded-lg shadow-xl p-4 max-w-xs"
        style={{
          top: coords.top + coords.height / 2,
          left: coords.left + coords.width / 2,
          ...positionStyles[position],
        }}
      >
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <Button size="sm" onClick={onDismiss}>Got it</Button>
      </div>
    </>
  );
}
