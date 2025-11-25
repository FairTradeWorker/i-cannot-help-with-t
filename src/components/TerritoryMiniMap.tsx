import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapTrifold } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';

interface TerritoryMiniMapProps {
  onExplore: () => void;
}

export function TerritoryMiniMap({ onExplore }: TerritoryMiniMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const stateHeatData: Record<string, number> = {
    CA: 95,
    TX: 88,
    FL: 82,
    NY: 78,
    IL: 75,
    PA: 72,
    OH: 68,
    GA: 65,
    NC: 62,
    MI: 60,
  };

  const getHeatColor = (intensity: number) => {
    if (intensity >= 90) return 'oklch(0.45 0.20 264)';
    if (intensity >= 80) return 'oklch(0.50 0.18 264)';
    if (intensity >= 70) return 'oklch(0.55 0.15 264)';
    if (intensity >= 60) return 'oklch(0.60 0.12 264)';
    return 'oklch(0.88 0.003 264 / 0.3)';
  };

  return (
    <Card className="glass-card p-6 cursor-pointer" onClick={onExplore}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Territory Activity</h3>
        <MapTrifold className="w-6 h-6 text-primary" weight="fill" />
      </div>
      
      <svg viewBox="0 0 960 600" className="w-full h-auto">
        <g id="states">
          <path
            d="M 100,150 L 250,150 L 250,250 L 100,250 Z"
            fill={getHeatColor(stateHeatData['CA'] || 0)}
            stroke="oklch(0.98 0.002 264)"
            strokeWidth="2"
            onMouseEnter={() => setHoveredState('CA')}
            onMouseLeave={() => setHoveredState(null)}
            className="transition-all duration-200 hover:opacity-80"
          />
          <text x="175" y="200" textAnchor="middle" className="text-[10px] fill-white font-bold pointer-events-none">CA</text>

          <path
            d="M 400,300 L 500,300 L 500,400 L 400,400 Z"
            fill={getHeatColor(stateHeatData['TX'] || 0)}
            stroke="oklch(0.98 0.002 264)"
            strokeWidth="2"
            onMouseEnter={() => setHoveredState('TX')}
            onMouseLeave={() => setHoveredState(null)}
            className="transition-all duration-200 hover:opacity-80"
          />
          <text x="450" y="350" textAnchor="middle" className="text-[10px] fill-white font-bold pointer-events-none">TX</text>

          <path
            d="M 700,350 L 780,350 L 780,450 L 700,450 Z"
            fill={getHeatColor(stateHeatData['FL'] || 0)}
            stroke="oklch(0.98 0.002 264)"
            strokeWidth="2"
            onMouseEnter={() => setHoveredState('FL')}
            onMouseLeave={() => setHoveredState(null)}
            className="transition-all duration-200 hover:opacity-80"
          />
          <text x="740" y="400" textAnchor="middle" className="text-[10px] fill-white font-bold pointer-events-none">FL</text>

          <path
            d="M 750,150 L 850,150 L 850,250 L 750,250 Z"
            fill={getHeatColor(stateHeatData['NY'] || 0)}
            stroke="oklch(0.98 0.002 264)"
            strokeWidth="2"
            onMouseEnter={() => setHoveredState('NY')}
            onMouseLeave={() => setHoveredState(null)}
            className="transition-all duration-200 hover:opacity-80"
          />
          <text x="800" y="200" textAnchor="middle" className="text-[10px] fill-white font-bold pointer-events-none">NY</text>

          <path
            d="M 550,200 L 650,200 L 650,300 L 550,300 Z"
            fill={getHeatColor(stateHeatData['IL'] || 0)}
            stroke="oklch(0.98 0.002 264)"
            strokeWidth="2"
            onMouseEnter={() => setHoveredState('IL')}
            onMouseLeave={() => setHoveredState(null)}
            className="transition-all duration-200 hover:opacity-80"
          />
          <text x="600" y="250" textAnchor="middle" className="text-[10px] fill-white font-bold pointer-events-none">IL</text>
        </g>
      </svg>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {hoveredState ? `${hoveredState}: ${stateHeatData[hoveredState]}% active` : 'Hover to see activity'}
        </span>
        <span className="text-primary font-semibold">View Full Map →</span>
      </div>
    </Card>
  );
}
