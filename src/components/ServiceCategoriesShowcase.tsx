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
          <h2 className="text-3xl font-bold mb-2">Browse by Service Category</h2>
          <p className="text-muted-foreground">
            Find the right professional for your project
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={onServiceSelect}
          className="hidden sm:flex"
        >
          View All Services
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICE_CATEGORIES.map((category, index) => {
          const Icon = iconMap[category.icon] || House;
          const totalServices = category.subcategories.reduce(
            (sum, sub) => sum + sub.services.length, 
            0
          );
          const avgJobValue = Math.round(
            category.subcategories.reduce((sum, sub) => sum + sub.avgJobValue, 0) / 
            category.subcategories.length
          );

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
            >
                <Card 
                  className="glass-card p-6 h-full border-0 bg-transparent hover:bg-transparent cursor-pointer h-full"
                  onClick={() => onCategoryClick?.(category.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Icon className="w-8 h-8 text-primary" weight="fill" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {totalServices} services
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Avg. Job Value</span>
                      <span className="font-semibold">${avgJobValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Subcategories</span>
                      <span className="font-semibold">{category.subcategories.length}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-4">
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <Badge 
                        key={sub.id} 
                        variant="outline" 
                        className="text-[10px]"
                      >
                        {sub.title}
                      </Badge>
                    ))}
                    {category.subcategories.length > 3 && (
                      <Badge variant="outline" className="text-[10px]">
                        +{category.subcategories.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategoryClick?.(category.id);
                    }}
                  >
                    Explore Category
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

