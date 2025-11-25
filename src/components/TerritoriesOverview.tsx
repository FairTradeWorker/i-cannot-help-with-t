import { useState, useEffect, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
  MapTrifold, 
  Shield,
  MapTrifold, 
  TrendUp,
  Shield,
  CurrencyDollar,
import { But
  Sparkle
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { territoryZips, type TerritoryZip } from '@/lib/territory-data';
import { useIsMobile } from '@/hooks/use-mobile';

  const containerRef = useRef<HTMLDivEleme

    if (!claimedTerrit
        .filter(() => M
      setClaimedTerritor
 

    isClaimed: claimedTer
    jobsPerMonth: Math.floor(Math.random() * 8
  }));
  const claimedCount = territories.filter(t =>
  const moatMultiplier = (claimedCount / terri

    if (claimedCount > 100) {
    }

    if (containerRef.current) {
  PA: "M730,180 L780,180 L780,240 L730,240 Z",
  OH: "M650,220 L700,220 L700,280 L650,280 Z",
  MI: "M600,140 L650,140 L650,230 L600,230 Z",
  WA: "M100,60 L180,60 L180,140 L100,140 Z",
  OR: "M90,140 L170,140 L170,220 L90,220 Z",
  NV: "M120,220 L170,220 L170,340 L120,340 Z",
  UT: "M230,240 L280,240 L280,340 L230,340 Z",
  NM: "M250,360 L320,360 L320,470 L250,470 Z",
  ID: "M180,120 L240,120 L240,240 L180,240 Z",
  MT: "M240,60 L360,60 L360,160 L240,160 Z",
  WY: "M260,160 L360,160 L360,250 L260,250 Z",
  ND: "M360,60 L460,60 L460,130 L360,130 Z",
  SD: "M360,130 L460,130 L460,200 L360,200 Z",
  NE: "M360,200 L490,200 L490,270 L360,270 Z",
  KS: "M380,270 L500,270 L500,340 L380,340 Z",
  OK: "M380,340 L500,340 L500,410 L380,410 Z",
  MN: "M460,70 L550,70 L550,200 L460,200 Z",
  IA: "M490,200 L570,200 L570,280 L490,280 Z",
  MO: "M500,280 L580,280 L580,360 L500,360 Z",
  AR: "M500,360 L570,360 L570,430 L500,430 Z",
  LA: "M500,430 L570,430 L570,510 L500,510 Z",
  MS: "M570,380 L620,380 L620,480 L570,480 Z",
  AL: "M620,380 L670,380 L670,480 L620,480 Z",
  WI: "M550,120 L610,120 L610,220 L550,220 Z",
  IN: "M600,240 L650,240 L650,320 L600,320 Z",
  KY: "M620,300 L700,300 L700,360 L620,360 Z",
  WV: "M700,240 L750,240 L750,310 L700,310 Z",
  VA: "M710,270 L790,270 L790,330 L710,330 Z",
  NC: "M680,340 L780,340 L780,400 L680,400 Z",
  SC: "M690,400 L750,400 L750,460 L690,460 Z",
  MD: "M760,250 L810,250 L810,290 L760,290 Z",
  DE: "M800,260 L820,260 L820,300 L800,300 Z",
  NJ: "M790,210 L820,210 L820,260 L790,260 Z",
  CT: "M810,180 L840,180 L840,210 L810,210 Z",
              <motion.div
  MA: "M820,150 L870,150 L870,190 L820,190 Z",
                  scale: [1, 1.05, 1]
  NH: "M830,120 L855,120 L855,170 L830,170 Z",
              >
};

export function TerritoriesOverview() {
  const [claimedTerritories, setClaimedTerritories] = useKV<string[]>('claimed-territories', []);
  const [hoveredTerritory, setHoveredTerritory] = useState<Territory | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showParticles, setShowParticles] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const territories: Territory[] = territoryZips.map(t => ({
         
    isClaimed: claimedTerritories?.includes(t.zip) || Math.random() > 0.7,
    demandScore: Math.floor(Math.random() * 100),
    jobsPerMonth: Math.floor(Math.random() * 80) + 10,
    annualRevenue: (Math.random() * 2 + 0.5) * 1000000,
  }));

  const claimedCount = territories.filter(t => t.isClaimed).length;
  const totalDemand = territories.reduce((sum, t) => sum + t.demandScore, 0);
  const moatMultiplier = (claimedCount / territories.length * 50 + 10).toFixed(1);
  const runRate = (territories.filter(t => t.isClaimed).reduce((sum, t) => sum + t.annualRevenue, 0) / 1000000).toFixed(1);

          </div>
    if (claimedCount > 100) {
    );
    }
  return (

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
      {showParticles && (
        y: e.clientY - rect.top,
         
    }
    

  const handleStateClick = (stateCode: string) => {
    console.log('Navigate to detailed view:', stateCode);
    

  const getStateColor = (stateCode: string) => {
    const stateTerritories = territories.filter(t => t.state === stateCode);
    const claimedInState = stateTerritories.filter(t => t.isClaimed).length;
    const highDemandInState = stateTerritories.filter(t => t.demandScore > 70 && !t.isClaimed).length;

    if (claimedInState > 0) return 'claimed';
    if (highDemandInState > 0) return 'high-demand';
    return 'default';
    

          transit
    return (
          <h1 cla
        initial={{ opacity: 0, y: 20 }}
          <p className="text-sm text-m
        transition={{ duration: 0.5 }}

      >
        <Card className="glass-card overflow-hidden">
          <div className="relative h-80 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <motion.div
            <motion.div 
                  rotate: [0, 5, -5, 0],
              transition={{ duration:
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <MapTrifold className="w-24 h-24 text-primary mb-4" weight="fill" />
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">
                FAIRTRADE OS<br />Territory Dominance Engine
              </h2>
              
              <div className="flex flex-wrap gap-2 justify-center mb-4">
          <div className="text-right">
                  <Sparkle className="w-3 h-3 mr-1" weight="fill" />
              animate={{ scale: [1, 1.05, 1]
                </Badge>
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  <Shield className="w-3 h-3 mr-1" weight="fill" />
          </div>
                </Badge>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                  <CurrencyDollar className="w-3 h-3 mr-1" weight="fill" />
                  ${runRate}M run-rate
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Tap to explore detailed territory map with real-time analytics
              </p>
              
            
                size="lg" 
              <feMerge>
                onClick={() => handleStateClick('overview')}
               
                <Lightning className="w-5 h-5 mr-2" weight="fill" />
            
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
      
  }

  return (
               
      ref={containerRef}
              />
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-[calc(100vh-10rem)] w-full rounded-2xl overflow-hidden glass-card"
      onMouseMove={handleMouseMove}
    >
            const pathPar
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary"
              initial={{ 
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: 0 
                
              animate={{
                y: [null, '-100%'],
                opacity: [0, 1, 0],
                
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear',
                
            />
          ))}
        </div>
      )}

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
         
          <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            FAIRTRADE OS Territory Dominance Engine
          </h1>
          <p className="text-sm text-muted-foreground">Real-time territory intelligence & market saturation analysis</p>
        </motion.div>
            

                 
        initial={{ y: -20, opacity: 0 }}
            );
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-6 right-6 z-20 glass-card p-4 rounded-xl border border-border/50 backdrop-blur-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold">{claimedCount}</div>
            <div className="text-xs text-muted-foreground">territories claimed</div>
            clas
          <div className="w-px h-10 bg-border" />
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">{moatMultiplier}×</div>
            <div className="text-xs text-muted-foreground">moat strength</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${runRate}M</div>
            <div className="text-xs text-muted-foreground">annual run-rate</div>
          </div>
        </div>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center p-12">
        <svg
            
          className="w-full h-full"
          style={{ maxWidth: '1400px', maxHeight: '800px' }}
        >
              <d
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
              <div className="flex items-center
                <feMergeNode in="SourceGraphic"/>
                  Score:
            </filter>










































































































































































