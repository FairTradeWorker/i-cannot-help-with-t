import { motion } from 'framer-motion';
import { 
  Sparkle, 
  TrendUp, 
  ShieldCheck, 
  Lightning,
  ArrowRight
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GlassSurface } from './GlassSurface';
import { getDefaultGlassContext } from '@/lib/glass-context-utils';

export function MarketplaceHero() {
  const stats = [
    { label: 'Active Services', value: '2,500+', icon: Sparkle },
    { label: 'Happy Customers', value: '15,000+', icon: TrendUp },
    { label: 'Verified Pros', value: '850+', icon: ShieldCheck },
  ];

  const features = [
    {
      icon: Lightning,
      title: 'Instant Matching',
      description: 'Smart matching finds the perfect service provider for your needs',
      color: 'from-primary to-secondary',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Professionals',
      description: 'All service providers are background checked and verified',
      color: 'from-secondary to-accent',
    },
    {
      icon: TrendUp,
      title: 'Transparent Pricing',
      description: 'See upfront pricing with no hidden fees or surprises',
      color: 'from-accent to-primary',
    },
  ];

  return (
    <div className="space-y-12 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
        >
          <Sparkle className="w-4 h-4 text-accent" weight="fill" />
          <span className="text-sm font-medium">Welcome to FairTradeWorker</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
        >
          Find Perfect Services
          <br />
          In Minutes
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          Connect with verified service professionals, get instant quotes, and book with confidence
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="rounded-full text-lg px-8 h-14">
              Browse Services
              <ArrowRight className="ml-2 w-5 h-5" weight="bold" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="outline" className="rounded-full text-lg px-8 h-14">
              Post a Job
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="glass-card rounded-3xl p-6 text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" weight="duotone" />
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <Card className="glass-card rounded-3xl p-8 h-full">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
              >
                <feature.icon className="w-7 h-7 text-white" weight="duotone" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
