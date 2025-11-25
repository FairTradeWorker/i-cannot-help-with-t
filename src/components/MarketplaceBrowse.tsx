import { useState } from 'react';
import { motion } from 'framer-motion';
  MapPin,
  MapPin,
  CurrencyDollar,
  Lightning,
  MagnifyingGlass,
  SlidersHorizontal,
} from 
  Clock,
import {
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
    },
      id: 3,
    

      priceUnit: 'st
     
      tags: 
    },
      id: 4,
      provider: 'A
      reviews: 143,
      priceUnit: '
      responseTime: '45 min',
      tags: ['Custom', 'Licensed', '
      responseTime: '30 min',
      image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400',
      tags: ['Premium', 'Licensed', 'Insured'],
      verified: true,
      
     
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
  retu
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
      </motion.div>
      provider: 'Sparkle Clean Co.',
          initial=
      reviews: 892,
          <div cl
            <h2 className="te
        </motion.div>

        variants={container}
        animate="show"
      >
    },
     
      id: 6,
            <Card className="glass-card rounded-
                <motion.img
                  
      reviews: 421,
                /
                  <motion.bu
                    whileTap={{ 
                  >
                  </motion.button>

                  <di
    },
    


    hidden: { opacity: 0 },
           
      opacity: 1,

                  <div classN
        
      
    


    hidden: { opacity: 0, y: 20 },
                </div>
  };

  return (
                </div>
                <div className="pt-4 bor
      
      <motion.div
                  </div>
                    <Button className=
                    </Button>
      >
            </Card>
        ))}
    </div>
            <Input











            </Button>

        </div>

















                }`}







      </motion.div>

      {featured && (









        </motion.div>



        variants={container}

        animate="show"

      >
        {services.map((service) => (








                <motion.img











                  >

                  </motion.button>


                {service.verified && (











































                  <div>







                      View Details

                  </motion.div>



          </motion.div>

      </motion.div>

  );

