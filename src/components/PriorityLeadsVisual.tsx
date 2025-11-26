import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

  onExplore: () => void;

  const hotZones = [
    { id: 2, x: 45, y: 2
 

  return (
      <div className
          <div>
              <Lightning className="w-4 h-4 mr-2" weight="fill" />
            </Badge>
            <p className="text-muted-foreground text-lg">
            </p>


          
                animate={{ scale: 1, opacity: 1 }}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Badge className="px-4 py-2 text-sm bg-primary border-0 mb-4">
              <Lightning className="w-4 h-4 mr-2" weight="fill" />
              Live Lead Activity
            </Badge>
            <h3 className="text-3xl font-bold mb-3">Priority Lead Access</h3>
            <p className="text-muted-foreground text-lg">
              Territory operators get first access to leads in their claimed zip codes. Watch real-time job demand across active territories.
            </p>
          </div>

          <div className="relative h-64 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-xl border-2 border-border overflow-hidden">
            {hotZones.map((zone, idx) => (
              <motion.div
                key={zone.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.15, duration: 0.4 }}

                  animat
                    opacity: [0.4, 0,
                  transition={{
                    repeat: Infinity,
                  
               
                <motion.div
                  animate={{
                <div className="w-2 h-2
              </div>
              <div c
          </div>
          <div className="grid g
              <div className="text-2x
            </div>
              <div c
            </div>
              <div classNa
            </div>
        </div>
        <div classNa
            <h4 cl
            {[
              { icon: Lightning, label: 'Demand
              { icon: TrendUp, label: 'Growth Analytics', desc: 'Track territory performance metrics' },
              const Icon = benefit.icon;
                <div key={benefit.label} className="flex items-start gap-3 p-3 
                    <Icon className="w-4 h-4 text-primary" weight="bold" />
                  <div>
                      {benefit.label}
                    </div>
                  </div>
              );
          </div>
      </div>
  );






                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: idx * 0.5,
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-accent rounded-full"
                />
              </motion.div>
            ))}

            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-xs font-semibold">Live Activity</span>
              </div>
              <div className="text-2xl font-bold font-mono">638</div>
              <div className="text-[10px] text-muted-foreground">active leads now</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary font-mono">$45</div>
              <div className="text-xs text-muted-foreground">per month</div>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="text-2xl font-bold text-accent font-mono">850+</div>
              <div className="text-xs text-muted-foreground">territories</div>
            </div>
            <div className="text-center p-4 bg-secondary/5 rounded-lg border border-secondary/20">
              <div className="text-2xl font-bold text-secondary font-mono">100%</div>
              <div className="text-xs text-muted-foreground">priority access</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">Territory Benefits</h4>
            
            {[
              { icon: Crosshair, label: 'First Access to Leads', desc: 'Get notified before general contractors' },
              { icon: Lightning, label: 'Demand Forecasting', desc: 'AI-powered job volume predictions' },
              { icon: Users, label: 'Exclusive Rights', desc: 'No competing territory operators' },
              { icon: TrendUp, label: 'Growth Analytics', desc: 'Track territory performance metrics' },
            ].map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.label} className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" weight="bold" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {benefit.label}
                      <CheckCircle className="w-3 h-3 text-accent" weight="fill" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{benefit.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
