import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  House,
  Wrench,
  Lightning,
  Tree,
  Hammer,
  Broom,
  CaretRight,
  X,
  ArrowLeft
} from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SERVICE_CATEGORIES, type ServiceCategory, type ServiceSubcategory, type ServiceSelection } from '@/types/service-categories';

interface ServiceCategoryMegaMenuProps {
  open: boolean;
  onClose: () => void;
  onSelect: (selection: ServiceSelection) => void;
  title?: string;
}

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<any>> = {
  House,
  Wrench,
  Lightning,
  Tree,
  Hammer,
  Broom,
};

type ViewState = 'categories' | 'subcategories' | 'services';

export function ServiceCategoryMegaMenu({ open, onClose, onSelect, title = 'Select a Service' }: ServiceCategoryMegaMenuProps) {
  const [view, setView] = useState<ViewState>('categories');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<ServiceSubcategory | null>(null);

  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setView('subcategories');
  };

  const handleSubcategorySelect = (subcategory: ServiceSubcategory) => {
    setSelectedSubcategory(subcategory);
    setView('services');
  };

  const handleServiceSelect = (service: string) => {
    if (!selectedCategory || !selectedSubcategory) return;

    const selection: ServiceSelection = {
      service,
      category: selectedCategory.title,
      subcategory: selectedSubcategory.title,
      categoryId: selectedCategory.id,
      subcategoryId: selectedSubcategory.id,
    };

    onSelect(selection);
    handleClose();
  };

  const handleBack = () => {
    if (view === 'services') {
      setView('subcategories');
      setSelectedSubcategory(null);
    } else if (view === 'subcategories') {
      setView('categories');
      setSelectedCategory(null);
    }
  };

  const handleClose = () => {
    setView('categories');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    onClose();
  };

  const IconComponent = selectedCategory ? iconMap[selectedCategory.icon] || House : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {view !== 'categories' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)]">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {view === 'categories' && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {SERVICE_CATEGORIES.map((category) => {
                    const Icon = iconMap[category.icon] || House;
                    return (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className="p-6 cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm hover:bg-card/80 group"
                          onClick={() => handleCategorySelect(category)}
                        >
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Icon className="w-8 h-8 text-primary" weight="duotone" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg mb-1">{category.title}</h3>
                              <p className="text-sm text-muted-foreground">{category.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{category.subcategories.length} subcategories</span>
                              <CaretRight className="w-4 h-4" />
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {view === 'subcategories' && selectedCategory && (
                <motion.div
                  key="subcategories"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3 mb-6">
                    {IconComponent && (
                      <div className="p-3 rounded-lg bg-primary/10">
                        <IconComponent className="w-6 h-6 text-primary" weight="duotone" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold">{selectedCategory.title}</h2>
                      <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
                    </div>
                  </div>

                  {selectedCategory.subcategories.map((subcategory) => (
                    <motion.div
                      key={subcategory.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="p-4 cursor-pointer border hover:border-primary/50 transition-all duration-300 bg-card/50 hover:bg-card/80 group"
                        onClick={() => handleSubcategorySelect(subcategory)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{subcategory.title}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {subcategory.services.length} services
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {subcategory.services.slice(0, 3).map((service) => (
                                <Badge key={service} variant="outline" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                              {subcategory.services.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{subcategory.services.length - 3} more
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Avg: ${subcategory.avgJobValue.toLocaleString()}</span>
                              <span>•</span>
                              <span>{subcategory.requiredLicenses.join(', ')}</span>
                            </div>
                          </div>
                          <CaretRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {view === 'services' && selectedCategory && selectedSubcategory && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      {IconComponent && (
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="w-5 h-5 text-primary" weight="duotone" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-lg font-semibold">{selectedSubcategory.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          {selectedCategory.title} • {selectedSubcategory.services.length} services
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary">Avg: ${selectedSubcategory.avgJobValue.toLocaleString()}</Badge>
                      {selectedSubcategory.requiredLicenses.map((license) => (
                        <Badge key={license} variant="outline">
                          {license}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedSubcategory.services.map((service) => (
                      <motion.div
                        key={service}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className="p-4 cursor-pointer border hover:border-primary transition-all duration-300 bg-card/50 hover:bg-primary/5 group"
                          onClick={() => handleServiceSelect(service)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium group-hover:text-primary transition-colors">
                              {service}
                            </span>
                            <CaretRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

