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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">What do you need done?</h2>
          <p className="text-xs text-muted-foreground">
            Tap a category to start a job post
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onServiceSelect}
          className="hidden sm:inline-flex text-xs"
        >
          View All Services
          <ArrowRight className="w-3 h-3 ml-1.5" />
        </Button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {SERVICE_CATEGORIES.map((category, index) => {
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
            >
              <Card 
                className="glass-card p-3 md:p-4 h-full border-0 bg-transparent hover:bg-transparent cursor-pointer text-center"
                onClick={() => onCategoryClick?.(category.id)}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full ${color}`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6" weight="fill" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs md:text-sm font-semibold line-clamp-1">
                      {category.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2">
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

