/**
 * API Key Input Component with Visibility Toggle
 * Secure input for displaying and managing API keys
 */

import React, { useState, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Eye, EyeOff, Copy, Check, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface APIKeyInputProps {
  apiKey: string;
  label?: string;
  description?: string;
  onRegenerate?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  className?: string;
  createdAt?: Date;
  lastUsed?: Date;
}

export function APIKeyInput({
  apiKey,
  label = 'API Key',
  description,
  onRegenerate,
  onDelete,
  isLoading = false,
  className,
  createdAt,
  lastUsed,
}: APIKeyInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Mask the API key when not visible
  const maskedKey = apiKey ? `${'•'.repeat(Math.min(apiKey.length - 8, 32))}${apiKey.slice(-8)}` : '';
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setIsCopied(true);
      toast.success('API key copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy API key');
    }
  };
  
  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
          {(createdAt || lastUsed) && (
            <div className="flex gap-4 text-xs text-muted-foreground">
              {createdAt && (
                <span>Created: {createdAt.toLocaleDateString()}</span>
              )}
              {lastUsed && (
                <span>Last used: {lastUsed.toLocaleDateString()}</span>
              )}
            </div>
          )}
        </div>
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type={isVisible ? 'text' : 'password'}
            value={isVisible ? apiKey : maskedKey}
            readOnly
            className="pr-20 font-mono text-sm"
            data-testid="api-key-value"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleToggleVisibility}
                    data-testid="toggle-visibility"
                  >
                    {isVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isVisible ? 'Hide API key' : 'Show API key'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!apiKey}
                data-testid="copy-key-button"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {onRegenerate && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onRegenerate}
                  disabled={isLoading}
                  data-testid="regenerate-key-button"
                >
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Regenerate API key</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {onDelete && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onDelete}
                  disabled={isLoading}
                  className="text-destructive hover:bg-destructive/10"
                  data-testid="delete-key-button"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete API key</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Keep your API key secure. Do not share it publicly or expose it in client-side code.
      </p>
    </div>
  );
}

// Compact version for displaying in lists
interface APIKeyBadgeProps {
  apiKey: string;
  className?: string;
}

export function APIKeyBadge({ apiKey, className }: APIKeyBadgeProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  const maskedKey = `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setIsCopied(true);
      toast.success('Copied!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };
  
  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted font-mono text-xs hover:bg-muted/80 transition-colors",
        className
      )}
    >
      <span>{maskedKey}</span>
      {isCopied ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  );
}
