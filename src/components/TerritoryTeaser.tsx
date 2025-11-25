import { motion } from 'framer-motion';
import { MapTrifold, TrendUp, CurrencyDollar, Users, Lightning, ArrowRight, CheckCircle } from '@phosphor-icons/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TerritoryTeaserProps {
  onExplore: () => void;
}

export function TerritoryTeaser({ onExplore }: TerritoryTeaserProps) {
  const stats = [
    { 
      icon: MapTrifold, 
      value: '3,142', 
      label: 'Available Territories',
      color: 'text-primary' 
    },
    { 
      icon: CurrencyDollar, 
      value: '$450K', 
      label: 'Avg. Annual Revenue',
      color: 'text-accent' 
    },
    { 
      icon: Users, 
      value: '8,234', 
      label: 'Active Contractors',
      color: 'text-secondary' 
    },
  ];

  const benefits = [
    'Exclusive territory rights',
    'AI-powered demand forecasting',
    'Automated lead generation',
    'Priority job routing',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden"
    >
      <Card className="glass-card border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
        
        <CardContent className="relative p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="inline-flex">
                <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-primary to-secondary border-0">
                  <Lightning className="w-4 h-4 mr-2" weight="fill" />
                  Limited Territories Available
                </Badge>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tight">
                  Own Your Territory
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Secure exclusive rights to service entire zip codes. Build a sustainable business with AI-powered intelligence and guaranteed lead flow.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <Button 
                  size="lg" 
                  onClick={onExplore}
                  className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                >
                  <MapTrifold className="w-5 h-5 mr-2" weight="fill" />
                  Explore Territories
                  <ArrowRight className="w-5 h-5 ml-2" weight="bold" />
                </Button>
              </motion.div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1, duration: 0.3 }}
                    >
                      <Card className="glass-hover bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} weight="bold" />
                              </div>
                              <div>
                                <div className="text-3xl font-bold font-mono">{stat.value}</div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                              </div>
                            </div>
                            <TrendUp className="w-5 h-5 text-accent" weight="bold" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <Card className="bg-gradient-to-br from-accent/20 to-primary/20 border-accent/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent">
                      <Lightning className="w-5 h-5 text-white" weight="fill" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold">Early Adopter Bonus</h4>
                      <p className="text-sm text-muted-foreground">
                        Claim your territory now and get 3 months of premium intelligence API access free
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
