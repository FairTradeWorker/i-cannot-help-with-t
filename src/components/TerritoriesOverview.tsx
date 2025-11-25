import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKV } from '@github/spark/hooks';
import { 
  MapTrifold, 
  TrendUp,
  Shield,
  CurrencyDollar,
  Lightning,
  Sparkle
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { territoryZips, type TerritoryZip } from '@/lib/territory-data';
import { US_STATE_PATHS } from '@/lib/us-map-paths';
import { useIsMobile } from '@/hooks/use-mobile';

interface Territory extends TerritoryZip {
  isClaimed: boolean;
  demandScore: number;
  jobsPerMonth: number;
  annualRevenue: number;
}

interface TerritoriesOverviewProps {
  onNavigateToDetail?: (stateCode?: string) => void;
}

export function TerritoriesOverview({ onNavigateToDetail }: TerritoriesOverviewProps = {}) {
  const [claimedTerritories, setClaimedTerritories] = useKV<string[]>('claimed-territories', []);
  const [hoveredTerritory, setHoveredTerritory] = useState<Territory | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showParticles, setShowParticles] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!claimedTerritories || claimedTerritories.length === 0) {
      const initialClaimed = territoryZips
        .filter(() => Math.random() > 0.65)
        .map(t => t.zip);
      setClaimedTerritories(initialClaimed);
    }
  }, []);

  const territories: Territory[] = territoryZips.map(t => ({
    ...t,
    isClaimed: claimedTerritories?.includes(t.zip) || false,
    demandScore: Math.floor(Math.random() * 100),
    jobsPerMonth: Math.floor(Math.random() * 80) + 10,
    annualRevenue: (Math.random() * 2 + 0.5) * 1000000,
  }));

  const claimedCount = territories.filter(t => t.isClaimed).length;
  const totalDemand = territories.reduce((sum, t) => sum + t.demandScore, 0);
  const moatMultiplier = (claimedCount / territories.length * 50 + 10).toFixed(1);
  const runRate = (territories.filter(t => t.isClaimed).reduce((sum, t) => sum + t.annualRevenue, 0) / 1000000).toFixed(1);

  useEffect(() => {
    if (claimedCount > 100) {
      setShowParticles(true);
    }
  }, [claimedCount]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleStateClick = (stateCode: string) => {
    if (onNavigateToDetail) {
      onNavigateToDetail(stateCode);
    }
  };

  const getStateColor = (stateCode: string) => {
    const stateTerritories = territories.filter(t => t.state === stateCode);
    const claimedInState = stateTerritories.filter(t => t.isClaimed).length;
    const highDemandInState = stateTerritories.filter(t => t.demandScore > 70 && !t.isClaimed).length;

    if (claimedInState > 0) return 'claimed';
    if (highDemandInState > 0) return 'high-demand';
    return 'default';
  };

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4"
      >
        <Card className="glass-card overflow-hidden">
          <div className="relative h-80 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <MapTrifold className="w-24 h-24 text-primary mb-4" weight="fill" />
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">
                FAIRTRADE OS<br />Territory Dominance Engine
              </h2>
              
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Sparkle className="w-3 h-3 mr-1" weight="fill" />
                  {claimedCount} territories
                </Badge>
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  <Shield className="w-3 h-3 mr-1" weight="fill" />
                  {moatMultiplier}× moat
                </Badge>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                  <CurrencyDollar className="w-3 h-3 mr-1" weight="fill" />
                  ${runRate}M run-rate
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Tap to explore detailed territory map with real-time analytics
              </p>
              
              <Button 
                size="lg" 
                className="w-full max-w-xs"
                onClick={() => onNavigateToDetail?.()}
              >
                <Lightning className="w-5 h-5 mr-2" weight="fill" />
                Explore Territories
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-[calc(100vh-10rem)] w-full rounded-2xl overflow-hidden glass-card"
      onMouseMove={handleMouseMove}
    >
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary"
              initial={{ 
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: 0 
              }}
              animate={{
                y: [null, '-100%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear',
              }}
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
        >
          <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            FAIRTRADE OS Territory Dominance Engine
          </h1>
          <p className="text-sm text-muted-foreground">Real-time territory intelligence & market saturation analysis</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-6 right-6 z-20 glass-card p-4 rounded-xl border border-border/50 backdrop-blur-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-right">
            <motion.div 
              className="text-2xl font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {claimedCount}
            </motion.div>
            <div className="text-xs text-muted-foreground">territories claimed</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-right">
            <motion.div 
              className="text-2xl font-bold text-accent"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
            >
              {moatMultiplier}×
            </motion.div>
            <div className="text-xs text-muted-foreground">moat strength</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-right">
            <motion.div 
              className="text-2xl font-bold text-primary"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              ${runRate}M
            </motion.div>
            <div className="text-xs text-muted-foreground">annual run-rate</div>
          </div>
        </div>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center p-12">
        <svg
          viewBox="0 0 960 600"
          className="w-full h-full"
          style={{ maxWidth: '1400px', maxHeight: '800px' }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <linearGradient id="claimedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.70 0.20 150)" />
              <stop offset="50%" stopColor="oklch(0.65 0.22 155)" />
              <stop offset="100%" stopColor="oklch(0.60 0.22 160)" />
            </linearGradient>
            
            <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.70 0.20 150)" stopOpacity="0" />
              <stop offset="50%" stopColor="oklch(0.85 0.25 155)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="oklch(0.70 0.20 150)" stopOpacity="0" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-1 0"
                to="1 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>

          {Object.entries(US_STATE_PATHS).map(([stateCode, pathData]) => {
            const stateColor = getStateColor(stateCode);
            const isClaimed = stateColor === 'claimed';
            const isHighDemand = stateColor === 'high-demand';
            
            const pathParts = pathData.split(' ');
            const firstCoord = pathParts[0].substring(1).split(',');
            const centerX = parseInt(firstCoord[0]) + 25;
            const centerY = parseInt(firstCoord.length > 1 ? firstCoord[1] : pathParts[1]) + 35;

            return (
              <motion.g key={stateCode}>
                <motion.path
                  d={pathData}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    fill: isClaimed 
                      ? 'url(#claimedGradient)'
                      : isHighDemand 
                        ? 'oklch(0.95 0.01 250)'
                        : 'oklch(0.96 0.005 250)',
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  transition={{ 
                    delay: Math.random() * 0.3,
                    duration: 0.5,
                    scale: { type: 'spring', stiffness: 300, damping: 20 }
                  }}
                  stroke={isHighDemand ? 'oklch(0.70 0.20 45)' : 'oklch(0.90 0.01 250)'}
                  strokeWidth={isHighDemand ? 2 : 1}
                  style={{
                    cursor: 'pointer',
                    filter: isClaimed ? 'url(#strongGlow)' : 'none',
                  }}
                  onClick={() => handleStateClick(stateCode)}
                  onMouseEnter={() => {
                    const stateTerritories = territories.filter(t => t.state === stateCode);
                    if (stateTerritories.length > 0) {
                      setHoveredTerritory(stateTerritories[0]);
                    }
                  }}
                  onMouseLeave={() => setHoveredTerritory(null)}
                />
                
                {isClaimed && (
                  <motion.circle
                    cx={centerX}
                    cy={centerY}
                    r="4"
                    fill="oklch(0.85 0.22 150)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>

      <AnimatePresence>
        {hoveredTerritory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-30 pointer-events-none glass-card border border-border/50 rounded-xl p-4 shadow-2xl backdrop-blur-xl"
            style={{
              left: `${mousePos.x + 20}px`,
              top: `${mousePos.y + 20}px`,
              maxWidth: '320px',
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="font-bold text-lg">
                  {hoveredTerritory.zip} – {hoveredTerritory.city}, {hoveredTerritory.state}
                </div>
                <div className="text-sm text-muted-foreground">
                  {hoveredTerritory.county} County
                </div>
              </div>
              <Badge className={
                hoveredTerritory.isClaimed 
                  ? 'bg-primary/20 text-primary border-primary/30'
                  : 'bg-accent/20 text-accent border-accent/30'
              }>
                {hoveredTerritory.isClaimed ? 'CLAIMED' : 'AVAILABLE'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <TrendUp className="w-4 h-4 text-primary" weight="fill" />
                <span className="text-muted-foreground">{hoveredTerritory.jobsPerMonth} jobs/mo</span>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollar className="w-4 h-4 text-accent" weight="fill" />
                <span className="text-muted-foreground">
                  ${(hoveredTerritory.annualRevenue / 1000000).toFixed(1)}M annual
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-secondary" weight="fill" />
                <span className="text-muted-foreground">
                  Score: {hoveredTerritory.demandScore}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Lightning className="w-4 h-4 text-warning" weight="fill" />
                <span className="text-muted-foreground">
                  ${hoveredTerritory.monthlyPrice}/mo
                </span>
              </div>
            </div>

            {!hoveredTerritory.isClaimed && hoveredTerritory.demandScore > 70 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-3 pt-3 border-t border-border/50"
              >
                <div className="text-xs text-accent font-medium">
                  🔥 HIGH DEMAND TERRITORY
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-6 left-6 flex flex-col gap-2"
      >
        <Button
          onClick={() => onNavigateToDetail?.()}
          className="glass-card hover:glass-hover"
          size="lg"
        >
          <MapTrifold className="w-5 h-5 mr-2" weight="fill" />
          View Detailed Territory Map
        </Button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-6 right-6 flex gap-2"
      >
        <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full border border-border/50 text-sm">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-accent" 
               style={{ filter: 'url(#glow)' }} />
          <span className="text-muted-foreground">Claimed Territory</span>
        </div>
        <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full border border-border/50 text-sm">
          <div className="w-3 h-3 rounded-full border-2 border-accent" />
          <span className="text-muted-foreground">High Demand Open</span>
        </div>
        <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full border border-border/50 text-sm">
          <div className="w-3 h-3 rounded-full bg-muted" />
          <span className="text-muted-foreground">Available</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
