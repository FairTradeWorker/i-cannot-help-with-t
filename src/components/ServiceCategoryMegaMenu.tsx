import { useState, useEffect } from 'react';
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
  initialCategoryId?: string | null;
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

export function ServiceCategoryMegaMenu({ open, onClose, onSelect, title = 'Select a Service', initialCategoryId }: ServiceCategoryMegaMenuProps) {
  const [view, setView] = useState<ViewState>('categories');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<ServiceSubcategory | null>(null);

  // When opened with an initial category, jump straight into its subcategories view
  useEffect(() => {
    if (!open) return;
    if (initialCategoryId) {
      const category = SERVICE_CATEGORIES.find(cat => cat.id === initialCategoryId);
      if (category) {
        setSelectedCategory(category);
        setSelectedSubcategory(null);
        setView('subcategories');
        return;
      }
    }
    // Default to top-level categories
    setView('categories');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  }, [open, initialCategoryId]);

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
    onClose();
  };

  const IconComponent = selectedCategory ? iconMap[selectedCategory.icon] || House : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[92vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-5 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {view !== 'categories' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="h-9 w-9 hover:bg-primary/10 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <DialogTitle className="text-2xl md:text-3xl font-bold">{title}</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-9 w-9 hover:bg-destructive/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(92vh-140px)]">
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {view === 'categories' && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {SERVICE_CATEGORIES.map((category) => {
                    const Icon = iconMap[category.icon] || House;
                    return (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.03, y: -6 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Card
                          className="p-6 md:p-7 cursor-pointer border-2 hover:border-primary transition-all duration-300 bg-gradient-to-br from-card/80 to-card/50 hover:from-primary/5 hover:to-primary/10 shadow-md hover:shadow-lg group"
                          onClick={() => handleCategorySelect(category)}
                        >
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-5 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                              <Icon className="w-10 h-10 text-primary" weight="duotone" />
                            </div>
                            <div>
                              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{category.title}</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">{category.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-primary/80 group-hover:text-primary transition-colors">
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
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4 mb-8 p-5 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    {IconComponent && (
                      <div className="p-4 rounded-xl bg-primary/20">
                        <IconComponent className="w-8 h-8 text-primary" weight="duotone" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">{selectedCategory.title}</h2>
                      <p className="text-base text-muted-foreground">{selectedCategory.description}</p>
                    </div>
                  </div>

                  {selectedCategory.subcategories.map((subcategory, index) => (
                    <motion.div
                      key={subcategory.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 6, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="p-5 md:p-6 cursor-pointer border-2 hover:border-primary transition-all duration-300 bg-gradient-to-br from-card/80 to-card/50 hover:from-primary/5 hover:to-primary/10 shadow-sm hover:shadow-md group"
                        onClick={() => handleSubcategorySelect(subcategory)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <h3 className="font-bold text-lg md:text-xl group-hover:text-primary transition-colors">{subcategory.title}</h3>
                              <Badge variant="secondary" className="text-sm font-semibold px-2.5 py-1 bg-primary/10 text-primary border-primary/20">
                                {subcategory.services.length} services
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {subcategory.services.slice(0, 3).map((service) => (
                                <Badge key={service} variant="outline" className="text-xs md:text-sm px-2.5 py-1 bg-background hover:bg-primary/5 transition-colors">
                                  {service}
                                </Badge>
                              ))}
                              {subcategory.services.length > 3 && (
                                <Badge variant="outline" className="text-xs md:text-sm px-2.5 py-1 bg-primary/5 text-primary border-primary/30 font-medium">
                                  +{subcategory.services.length - 3} more
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                              <span className="font-semibold text-foreground">Avg: <span className="text-primary">${subcategory.avgJobValue.toLocaleString()}</span></span>
                              <span className="text-muted-foreground/50">•</span>
                              <span className="flex items-center gap-1.5">
                                <Hammer className="w-4 h-4" />
                                {subcategory.requiredLicenses.join(', ')}
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <CaretRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
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
                  className="space-y-5"
                >
                  <div className="mb-8 p-5 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center gap-4 mb-4">
                      {IconComponent && (
                        <div className="p-3 rounded-xl bg-primary/20">
                          <IconComponent className="w-7 h-7 text-primary" weight="duotone" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold mb-1">{selectedSubcategory.title}</h2>
                        <p className="text-base text-muted-foreground">
                          {selectedCategory.title} • {selectedSubcategory.services.length} services available
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-sm font-semibold px-3 py-1.5 bg-primary/10 text-primary border-primary/20">
                        Avg: ${selectedSubcategory.avgJobValue.toLocaleString()}
                      </Badge>
                      {selectedSubcategory.requiredLicenses.map((license) => (
                        <Badge key={license} variant="outline" className="text-sm px-3 py-1.5 bg-background">
                          <Hammer className="w-3.5 h-3.5 mr-1.5" />
                          {license}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSubcategory.services.map((service, index) => (
                      <motion.div
                        key={service}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className="p-5 cursor-pointer border-2 hover:border-primary transition-all duration-300 bg-gradient-to-br from-card/80 to-card/50 hover:from-primary/5 hover:to-primary/10 shadow-sm hover:shadow-md group"
                          onClick={() => handleServiceSelect(service)}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors flex-1">
                              {service}
                            </span>
                            <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <CaretRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                            </div>
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

