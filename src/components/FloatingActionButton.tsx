import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Plus, 
  Camera, 
  Pencil, 
  Lightning,
  X 
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onAction?: (action: string) => void;
}

export function FloatingActionButton({ onAction }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'post-job', label: 'Post Job', icon: Pencil, color: 'from-primary to-secondary' },
    { id: 'quick-request', label: 'Quick Request', icon: Lightning, color: 'from-secondary to-accent' },
    { id: 'video-upload', label: 'Video Upload', icon: Camera, color: 'from-accent to-primary' },
  ];

  return (
    <div className="fixed bottom-24 right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  y: 20, 
                  scale: 0.8,
                  transition: { delay: (actions.length - index - 1) * 0.05 }
                }}
                whileHover={{ scale: 1.05, x: -8 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  onAction?.(action.id);
                  setIsOpen(false);
                }}
              >
                <span className="glass px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
                  {action.label}
                </span>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" weight="bold" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-8 h-8 text-white" weight="bold" />
        </motion.div>
      </motion.button>
    </div>
  );
}
