import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  CurrencyDollar,
  Lightning,
  MagnifyingGlass,
  SlidersHorizontal,
  Clock,
  Sparkle,
  Star
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MarketplaceHero } from '@/components/MarketplaceHero';

interface MarketplaceBrowseProps {
  featured?: boolean;
}

export function MarketplaceBrowse({ featured = false }: MarketplaceBrowseProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Services', icon: Sparkle },
    { id: 'plumbing', label: 'Plumbing', icon: Sparkle },
    { id: 'painting', label: 'Painting', icon: Sparkle },
    { id: 'electrical', label: 'Electrical', icon: Lightning },
    { id: 'cleaning', label: 'Cleaning', icon: Sparkle },
    { id: 'landscaping', label: 'Landscaping', icon: Sparkle },
  ];

  const services = [
    {
      id: 1,
      title: 'Professional House Cleaning',
      provider: 'Sparkle Clean Co.',
      rating: 4.9,
      reviews: 892,
      price: 120,
      priceUnit: 'per session',
      location: 'San Francisco, CA',
      responseTime: '30 min',
      image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400',
      tags: ['Premium', 'Licensed', 'Insured'],
      verified: true,
    },
    {
      id: 2,
      title: 'Emergency Plumbing Repair',
      provider: 'Quick Fix Plumbing',
      rating: 4.8,
      reviews: 567,
      price: 150,
      priceUnit: 'per hour',
      location: 'Oakland, CA',
      responseTime: '15 min',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
      tags: ['24/7', 'Same Day', 'Emergency'],
      verified: true,
    },
    {
      id: 3,
      title: 'Interior & Exterior Painting',
      provider: 'ColorCraft Painters',
      rating: 5.0,
      reviews: 189,
      price: 800,
      priceUnit: 'starting at',
      location: 'Berkeley, CA',
      responseTime: '1 hour',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
      tags: ['Eco-Friendly', 'Premium', 'Insured'],
      verified: true,
    },
    {
      id: 4,
      title: 'Custom Carpentry & Woodwork',
      provider: 'Artisan Wood Co.',
      rating: 4.9,
      reviews: 143,
      price: 1200,
      priceUnit: 'per project',
      location: 'San Francisco, CA',
      responseTime: '45 min',
      image: 'https://images.unsplash.com/photo-1617082351431-f1c84e5487f5?w=400',
      tags: ['Custom', 'Licensed', 'Premium'],
      verified: true,
    },
    {
      id: 5,
      title: 'Garden & Landscape Design',
      provider: 'Green Thumb Landscaping',
      rating: 4.7,
      reviews: 421,
      price: 500,
      priceUnit: 'per project',
      location: 'San Jose, CA',
      responseTime: '2 hours',
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400',
      tags: ['Design', 'Maintenance', 'Seasonal'],
      verified: true,
    },
    {
      id: 6,
      title: 'Electrical Installation & Repair',
      provider: 'Bright Spark Electric',
      rating: 4.9,
      reviews: 334,
      price: 180,
      priceUnit: 'per hour',
      location: 'Palo Alto, CA',
      responseTime: '30 min',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      tags: ['Licensed', 'Emergency', '24/7'],
      verified: true,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      {!featured && <MarketplaceHero />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-background/50 text-foreground hover:bg-background'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {services.map((service) => (
          <motion.div key={service.id} variants={item}>
            <Card className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div className="relative">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                >
                  <Star className="w-5 h-5" />
                </motion.button>

                {service.verified && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-accent text-accent-foreground">
                      Verified
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {service.provider}
                  </p>

                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent" weight="fill" />
                      <span className="font-medium">{service.rating}</span>
                      <span className="text-muted-foreground">
                        ({service.reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {service.responseTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    {service.location}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-1">
                        <CurrencyDollar className="w-5 h-5 text-primary" />
                        <span className="text-2xl font-bold">
                          ${service.price}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {service.priceUnit}
                      </span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full">View Details</Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {featured && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Button variant="outline" size="lg">
            View All Services
          </Button>
        </motion.div>
      )}
    </div>
  );
}
