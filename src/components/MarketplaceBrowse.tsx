import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin,
  CurrencyDollar,
  Lightning,
  MagnifyingGlass,
  SlidersHorizontal,
  Star,
  Clock,
  Heart,
  Sparkle
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
    { id: 'carpentry', label: 'Carpentry', icon: Sparkle },
    { id: 'cleaning', label: 'Cleaning', icon: Sparkle },
  ];

  const services = [
    {
      id: 1,
      title: 'Professional Kitchen Remodeling',
      provider: 'Elite Home Services',
      rating: 4.9,
      reviews: 234,
      price: 2500,
      priceUnit: 'starting at',
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
      title: 'Deep Cleaning Services',
      provider: 'Sparkle Clean Co.',
      rating: 4.7,
      reviews: 892,
      price: 120,
      priceUnit: 'per visit',
      location: 'San Jose, CA',
      responseTime: '20 min',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      tags: ['Same Day', 'Eco-Friendly', 'Trusted'],
      verified: true,
    },
    {
      id: 6,
      title: 'Electrical Installation & Repair',
      provider: 'Volt Masters',
      rating: 4.9,
      reviews: 421,
      price: 180,
      priceUnit: 'per hour',
      location: 'Palo Alto, CA',
      responseTime: '25 min',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400',
      tags: ['Licensed', 'Emergency', 'Certified'],
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services, providers, or projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-background/50 border-border/50 rounded-2xl"
            />
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" size="lg" className="h-12 rounded-2xl">
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </motion.div>
        </div>

        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {categories.map((cat, index) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-background/50 text-foreground hover:bg-background/80'
                }`}
              >
                <cat.icon className="w-4 h-4 inline mr-2" weight={isSelected ? 'fill' : 'regular'} />
                {cat.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Sparkle className="w-6 h-6 text-accent" weight="fill" />
            <h2 className="text-2xl font-bold">Featured Services</h2>
          </div>
        </motion.div>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={item}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group"
          >
            <Card className="glass-card rounded-3xl overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 h-full">
              <div className="relative overflow-hidden h-48">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center"
                  >
                    <Heart className="w-5 h-5 text-white" />
                  </motion.button>
                </div>

                {service.verified && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-accent text-accent-foreground">
                      <Lightning className="w-3 h-3 mr-1" weight="fill" />
                      Verified
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{service.provider}</p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent" weight="fill" />
                    <span className="font-semibold">{service.rating}</span>
                    <span className="text-muted-foreground">({service.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.responseTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{service.location}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{service.priceUnit}</p>
                    <p className="text-2xl font-bold text-primary">
                      ${service.price}
                    </p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="rounded-full">
                      View Details
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
