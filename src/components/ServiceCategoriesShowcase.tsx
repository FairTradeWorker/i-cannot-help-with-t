import { motion } from 'framer-motion';
import { 
  House, 
  Wrench, 
  Lightning, 
  Tree, 
  Hammer, 
  Broom,
  ArrowRight
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
}

export function ServiceCategoriesShowcase({ 
  onCategoryClick, 
  onServiceSelect 
}: ServiceCategoriesShowcaseProps) {

  const firstRow = SERVICE_CATEGORIES.slice(0, 3);
  const secondRow = SERVICE_CATEGORIES.slice(3);

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-white px-4 py-3 md:px-6 md:py-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-foreground">What do you need done?</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Tap a category to start a job post.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onServiceSelect}
          className="hidden sm:inline-flex h-8 w-8"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Core home categories */}
      <div className="space-y-2">
        <p className="text-xs md:text-sm uppercase tracking-wide text-muted-foreground/80 font-medium">
          Home & Systems
        </p>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {firstRow.map((category, index) => {
          const Icon = iconMap[category.icon] || House;
          // Simple color palette per category for more visual variety
          const colorClasses = [
            'bg-sky-500/10 text-sky-500',
            'bg-emerald-500/10 text-emerald-500',
            'bg-amber-500/10 text-amber-500',
            'bg-violet-500/10 text-violet-500',
            'bg-rose-500/10 text-rose-500',
            'bg-slate-500/10 text-slate-500',
          ];
            const color = colorClasses[index % colorClasses.length];

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
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card 
                  className="p-3 md:p-4 h-full border-0 bg-transparent hover:bg-muted/60 dark:hover:bg-muted/40 cursor-pointer text-center rounded-xl transition-colors"
                  onClick={() => onCategoryClick?.(category.id)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full ${color}`}>
                      <Icon className="w-7 h-7 md:w-8 md:h-8" weight="fill" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-1">
                        {category.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
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

      {/* Outdoor & lifestyle categories */}
      <div className="space-y-2">
        <p className="text-xs md:text-sm uppercase tracking-wide text-muted-foreground/80 font-medium">
          Outdoor & Lifestyle
        </p>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {secondRow.map((category, index) => {
            const Icon = iconMap[category.icon] || House;
            const colorClasses = [
              'bg-emerald-500/10 text-emerald-600',
              'bg-amber-500/10 text-amber-600',
              'bg-rose-500/10 text-rose-600',
            ];
            const color = colorClasses[index % colorClasses.length];

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
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card 
                  className="p-3 md:p-4 h-full border-0 bg-transparent hover:bg-muted/60 dark:hover:bg-muted/40 cursor-pointer text-center rounded-xl transition-colors"
                  onClick={() => onCategoryClick?.(category.id)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full ${color}`}>
                      <Icon className="w-7 h-7 md:w-8 md:h-8" weight="fill" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-1">
                        {category.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
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
    </div>
  );
}

