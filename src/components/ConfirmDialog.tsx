// Confirm Dialog - Reusable confirmation modal
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Warning, Trash, Check, X, Info, Question } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type DialogVariant = 'warning' | 'danger' | 'info' | 'success' | 'question';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: DialogVariant;
  loading?: boolean;
}

const variantConfig: Record<DialogVariant, { 
  icon: React.ReactNode; 
  iconBg: string;
  confirmClass: string;
}> = {
  warning: {
    icon: <Warning size={24} weight="fill" />,
    iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30',
    confirmClass: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  danger: {
    icon: <Trash size={24} weight="fill" />,
    iconBg: 'bg-red-100 text-red-600 dark:bg-red-900/30',
    confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
  info: {
    icon: <Info size={24} weight="fill" />,
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
    confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  success: {
    icon: <Check size={24} weight="fill" />,
    iconBg: 'bg-green-100 text-green-600 dark:bg-green-900/30',
    confirmClass: 'bg-green-600 hover:bg-green-700 text-white',
  },
  question: {
    icon: <Question size={24} weight="fill" />,
    iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
    confirmClass: 'bg-primary hover:bg-primary/90 text-primary-foreground',
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'question',
  loading = false,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const config = variantConfig[variant];

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${config.iconBg}`}>
              {config.icon}
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading || loading}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || loading}
            className={config.confirmClass}
          >
            {isLoading || loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
