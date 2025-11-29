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

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  House,
  Wrench,
  Lightning,
  Tree,
  Hammer,
  Broom,
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-white px-4 py-3 md:px-6 md:py-4 shadow-sm">
      <div className="text-center">
        {/* Trust line */}
        <p className="text-sm mb-3" style={{ fontSize: '14px', color: '#6b7280' }}>
          Trusted by 3,500+ contractors nationwide
        </p>
        
        {/* Main headline */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Get Free Quotes from Local Pros — No Middleman Fees
        </h2>
        
        {/* Subheadline */}
        <p className="text-sm md:text-base text-muted-foreground font-normal mb-6">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {SERVICE_CATEGORIES.map((category, index) => {
          const Icon = iconMap[category.icon] || House;

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
                className="bg-white border cursor-pointer text-center transition-all duration-200"
                style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: 'none'
                }}
                onClick={() => onCategoryClick?.(category.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.borderColor = '#bfdbfe';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  const iconElement = e.currentTarget.querySelector('svg');
                  if (iconElement) {
                    iconElement.style.transform = 'scale(1.1)';
                    iconElement.style.transition = 'transform 0.2s ease';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                  const iconElement = e.currentTarget.querySelector('svg');
                  if (iconElement) {
                    iconElement.style.transform = 'scale(1)';
                  }
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center">
                    <Icon 
                      className="transition-transform duration-200" 
                      style={{ width: '32px', height: '32px' }}
                      weight="fill"
                    />
                  </div>
                  <div>
                    <h3 
                      className="font-bold text-foreground line-clamp-2"
                      style={{ fontSize: '14px' }}
                    >
                      {category.title}
                    </h3>
                    {/* Show subtitle only on mobile */}
                    <p 
                      className="text-muted-foreground line-clamp-2 hidden sm:block lg:hidden"
                      style={{ fontSize: '12px', color: '#6b7280' }}
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

