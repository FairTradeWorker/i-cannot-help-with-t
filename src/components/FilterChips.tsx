// Filter Chips - Interactive filter tag system
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus } from '@phosphor-icons/react';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  showCounts?: boolean;
  maxVisible?: number;
}

export function FilterChips({
  options,
  selected,
  onChange,
  multiSelect = true,
  showCounts = false,
  maxVisible,
}: FilterChipsProps) {
  const [showAll, setShowAll] = useState(false);
  
  const visibleOptions = maxVisible && !showAll 
    ? options.slice(0, maxVisible) 
    : options;
  const hiddenCount = maxVisible ? options.length - maxVisible : 0;

  const handleToggle = (id: string) => {
    if (multiSelect) {
      if (selected.includes(id)) {
        onChange(selected.filter((s) => s !== id));
      } else {
        onChange([...selected, id]);
      }
    } else {
      onChange(selected.includes(id) ? [] : [id]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <AnimatePresence mode="popLayout">
        {visibleOptions.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <motion.button
              key={option.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToggle(option.id)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                transition-colors duration-200
                ${isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
                }
              `}
            >
              {isSelected && <Check size={14} weight="bold" />}
              {option.label}
              {showCounts && option.count !== undefined && (
                <span className={`text-xs ${isSelected ? 'opacity-80' : 'text-muted-foreground'}`}>
                  ({option.count})
                </span>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>

      {hiddenCount > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium
            bg-transparent hover:bg-muted text-muted-foreground transition-colors"
        >
          <Plus size={14} />
          {hiddenCount} more
        </button>
      )}

      {selected.length > 0 && (
        <button
          onClick={handleClearAll}
          className="inline-flex items-center gap-1 px-2 py-1.5 text-sm text-muted-foreground
            hover:text-foreground transition-colors"
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
}
