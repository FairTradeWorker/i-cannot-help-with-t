// Search Input - Enhanced search with suggestions
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, X, Clock, TrendUp } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'recent' | 'trending' | 'suggestion';
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  showTrending?: boolean;
  loading?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  suggestions = [],
  recentSearches = [],
  showTrending = false,
  loading = false,
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
    setIsOpen(false);
  };

  const handleSuggestionClick = (text: string) => {
    onChange(text);
    onSearch?.(text);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const allSuggestions: SearchSuggestion[] = [
    ...recentSearches.slice(0, 3).map((text, i) => ({
      id: `recent-${i}`,
      text,
      type: 'recent' as const,
    })),
    ...suggestions,
  ];

  const showDropdown = isOpen && (allSuggestions.length > 0 || showTrending);

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <MagnifyingGlass
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
              focused ? 'text-primary' : 'text-muted-foreground'
            }`}
          />
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              setFocused(true);
              setIsOpen(true);
            }}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="pl-10 pr-10"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full"
              />
            </div>
          )}
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 w-full mt-1"
          >
            <Card className="p-2 shadow-lg">
              {allSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted rounded-md"
                >
                  {suggestion.type === 'recent' ? (
                    <Clock size={14} className="text-muted-foreground" />
                  ) : suggestion.type === 'trending' ? (
                    <TrendUp size={14} className="text-amber-500" />
                  ) : (
                    <MagnifyingGlass size={14} className="text-muted-foreground" />
                  )}
                  <span>{suggestion.text}</span>
                </button>
              ))}

              {showTrending && allSuggestions.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Start typing to search...
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
