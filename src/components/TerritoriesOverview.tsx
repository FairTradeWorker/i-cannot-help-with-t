import { useState, useEffect, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import {
  Sparkle,
  Lightning,
  MapTrifold,
  Shield,
  CurrencyDollar,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface Territory {
  id: string;
  state: string;
  zip: string;
  demandScore: number;
  annualRevenue: number;
  claimed: boolean;
}

interface TerritoriesOverviewProps {
  onNavigateToDetail?: (stateCode: string) => void;
}

const statePathsSimplified: Record<string, string> = {
  CA: "M50,200 L150,180 L170,350 L80,360 Z",
  TX: "M400,380 L550,380 L550,520 L380,500 Z",
  FL: "M720,460 L780,460 L780,560 L740,560 Z",
  NY: "M800,150 L850,150 L850,220 L800,220 Z",
  PA: "M750,200 L830,200 L830,260 L750,260 Z",
  IL: "M550,220 L600,220 L600,320 L550,320 Z",
  OH: "M650,230 L710,230 L710,300 L650,300 Z",
  GA: "M680,380 L740,380 L740,480 L680,480 Z",
  NC: "M680,340 L780,340 L780,400 L680,400 Z",
  MI: "M600,140 L650,140 L650,240 L600,240 Z",
  WA: "M90,80 L170,80 L170,140 L90,140 Z",
  AZ: "M180,340 L260,340 L260,440 L180,440 Z",
  MA: "M820,160 L860,160 L860,190 L820,190 Z",
  VA: "M720,280 L790,280 L790,350 L720,350 Z",
  CO: "M280,220 L380,220 L380,320 L280,320 Z",
  WI: "M550,120 L610,120 L610,220 L550,220 Z",
  MN: "M500,100 L590,100 L590,200 L500,200 Z",
  OR: "M90,140 L170,140 L170,220 L90,220 Z",
  NV: "M140,220 L200,220 L200,340 L140,340 Z",
  NM: "M250,360 L320,360 L320,480 L250,480 Z",
  UT: "M230,240 L280,240 L280,340 L230,340 Z",
  KS: "M380,270 L500,270 L500,340 L380,340 Z",
  SD: "M360,130 L460,130 L460,200 L360,200 Z",
  LA: "M500,430 L570,430 L570,510 L500,510 Z",
  AL: "M620,380 L670,380 L670,480 L620,480 Z",
  KY: "M620,300 L700,300 L700,360 L620,360 Z",
  WV: "M700,240 L750,240 L750,310 L700,310 Z",
  MD: "M760,250 L810,250 L810,290 L760,290 Z",
  NJ: "M790,210 L820,210 L820,260 L790,260 Z",
  RI: "M830,180 L845,180 L845,200 L830,200 Z",
  VT: "M810,120 L835,120 L835,170 L810,170 Z",
  ME: "M840,80 L880,80 L880,160 L840,160 Z",
};

export function TerritoriesOverview({ onNavigateToDetail }: TerritoriesOverviewProps) {
  const [claimedTerritories, setClaimedTerritories] = useKV<string[]>('claimed-territories', []);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const territories: Territory[] = Object.keys(statePathsSimplified).map((state) => ({
    id: `${state}-001`,
    state,
    zip: '00000',
    demandScore: Math.floor(Math.random() * 100),
    annualRevenue: (Math.random() * 2 + 0.5) * 1000000,
    claimed: claimedTerritories?.includes(state) || false,
  }));

  const claimedCount = claimedTerritories?.length || 0;
  const moatMultiplier = Math.min(10, (claimedCount / territories.length) * 10 + 1).toFixed(1);
  const runRate = ((claimedCount * 45000) / 1000000).toFixed(1);

  useEffect(() => {
    if (claimedCount > 10) {
      setShowParticles(true);
    }
  }, [claimedCount]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const getStateColorType = (stateCode: string): 'default' | 'claimed' | 'high-demand' => {
    const stateTerritories = territories.filter((t) => t.state === stateCode);
    const claimedInState = stateTerritories.filter((t) => t.claimed).length;
    const highDemandInState = stateTerritories.some((t) => t.demandScore > 70);
    
    if (claimedInState > 0) return 'claimed';
    if (highDemandInState) return 'high-demand';
    return 'default';
  };

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
            Territory Dominance Engine
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
            <div className="text-2xl font-bold">{claimedCount}</div>
            <div className="text-xs text-muted-foreground">territories claimed</div>
          </div>
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
          </defs>

          {Object.entries(statePathsSimplified).map(([stateCode, path]) => {
            const colorType = getStateColorType(stateCode);
            const fillColor = 
              colorType === 'claimed' ? 'oklch(0.50 0.20 260 / 0.5)' :
              colorType === 'high-demand' ? 'oklch(0.70 0.20 320 / 0.3)' :
              'oklch(0.95 0.01 250 / 0.3)';
            
            return (
              <motion.path
                key={stateCode}
                d={path}
                fill={fillColor}
                stroke="oklch(0.90 0.01 250 / 0.5)"
                strokeWidth="1"
                className="cursor-pointer transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  filter: 'url(#glow)',
                }}
                onMouseEnter={() => setHoveredTerritory(stateCode)}
                onMouseLeave={() => setHoveredTerritory(null)}
                onClick={() => handleStateClick(stateCode)}
              />
            );
          })}
        </svg>
      </div>

      {hoveredTerritory && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute glass-card p-4 rounded-xl border border-border/50 backdrop-blur-xl pointer-events-none z-30"
          style={{
            left: mousePos.x + 20,
            top: mousePos.y + 20,
          }}
        >
          <div className="font-bold text-lg mb-2">{hoveredTerritory}</div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Sparkle className="w-3 h-3 mr-1" weight="fill" />
              Available
            </Badge>
            <Badge className="bg-accent/20 text-accent border-accent/30">
              <Shield className="w-3 h-3 mr-1" weight="fill" />
              High Growth
            </Badge>
            <Badge className="bg-secondary/20 text-secondary border-secondary/30">
              <CurrencyDollar className="w-3 h-3 mr-1" weight="fill" />
              $2.5M potential
            </Badge>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
