import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  House, 
  Wrench, 
  Lightning, 
  Tree, 
  Hammer, 
  Broom,
  ArrowRight,
  MagnifyingGlass
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SERVICE_CATEGORIES } from '@/types/service-categories';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

// Icon mapping with colors
const iconMap: Record<string, { icon: React.ComponentType<any>; color: string }> = {
  House: { icon: House, color: '#3b82f6' },      // Blue
  Wrench: { icon: Wrench, color: '#22c55e' },    // Green
  Lightning: { icon: Lightning, color: '#f59e0b' }, // Amber
  Tree: { icon: Tree, color: '#10b981' },        // Emerald
  Hammer: { icon: Hammer, color: '#8b5cf6' },    // Purple
  Broom: { icon: Broom, color: '#06b6d4' },      // Cyan
};

interface ServiceCategoriesShowcaseProps {
  onCategoryClick?: (categoryId: string) => void;
  onServiceSelect?: () => void;
  onSearch?: (query: string) => void;
}

export function ServiceCategoriesShowcase({ 
  onCategoryClick, 
  onServiceSelect,
  onSearch
}: ServiceCategoriesShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { elementRef: categoryCardsRef, isVisible: categoryCardsVisible } = useIntersectionObserver({
    rootMargin: '50px',
    triggerOnce: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-white dark:bg-gray-800 px-4 py-3 md:px-6 md:py-4 shadow-sm">
      <div className="text-center">
        {/* Trust line */}
        <p className="text-sm mb-3 text-muted-foreground" style={{ fontSize: '14px' }}>
          Trusted by 3,500+ contractors nationwide
        </p>
        
        {/* Main headline */}
        <h2 className="text-[24px] md:text-3xl lg:text-4xl font-bold text-foreground mb-2 text-center">
          Get Free Quotes from Local Pros — No Middleman Fees
        </h2>
        
        {/* Subheadline */}
        <p className="text-base md:text-base text-muted-foreground font-normal mb-6 text-center">
          Tap a category to start a job post.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex justify-center mb-4">
          <div className="relative w-[90%] md:w-[50%]">
            <MagnifyingGlass 
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ width: '20px', height: '20px', color: '#6b7280' }}
              weight="regular"
            />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe your project or search for a service..."
              className="pl-12 pr-4 transition-all duration-200"
              style={{
                height: '44px',
                borderRadius: '24px',
                border: '1px solid #d1d5db',
                padding: '0 20px 0 48px',
                fontSize: '14px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </form>
      </div>

      {/* All 6 category cards in one row */}
      {/* Mobile: 2 columns (2x3), Tablet: 3 columns (3x2), Desktop: 6 columns (6x1) */}
      <div 
        ref={categoryCardsRef as React.RefObject<HTMLDivElement>}
        className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 animate-on-scroll ${categoryCardsVisible ? 'visible' : ''}`}
      >
        {SERVICE_CATEGORIES.map((category, index) => {
          const iconConfig = iconMap[category.icon] || { icon: House, color: '#3b82f6' };
          const Icon = iconConfig.icon;
          const iconColor = iconConfig.color;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="bg-white dark:bg-gray-800 border cursor-pointer text-center transition-all duration-200 p-3 md:p-4"
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: 'none'
                }}
                onClick={() => onCategoryClick?.(category.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = iconColor;
                  e.currentTarget.style.boxShadow = `0 4px 12px ${iconColor}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center rounded-xl w-12 h-12 md:w-14 md:h-14 mb-1 bg-white dark:bg-gray-700">
                    <Icon
                      className="w-6 h-6 md:w-7 md:h-7 dark:text-gray-300"
                      weight="fill"
                      style={{ color: iconColor }}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-foreground dark:text-white line-clamp-2 text-[13px] md:text-sm"
                    >
                      {category.title}
                    </h3>
                    {/* Show subtitle on mobile and tablet */}
                    <p
                      className="text-muted-foreground dark:text-gray-400 line-clamp-2 block sm:block lg:hidden text-xs"
                    >
                      {category.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

