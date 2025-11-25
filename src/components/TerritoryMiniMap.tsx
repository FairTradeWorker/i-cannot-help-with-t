import { motion } from 'framer-motion';
import { useKV } from '@github/spark/hooks';
import { MapTrifold } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { US_STATES } from '@/lib/us-states-data';
import { US_STATE_PATHS } from '@/lib/us-map-paths';
import { territoryZips } from '@/lib/territory-data';

interface TerritoryMiniMapProps {
  onStateClick?: (stateCode: string) => void;
  className?: string;
  compact?: boolean;
}

export function TerritoryMiniMap({ onStateClick, className = '', compact = false }: TerritoryMiniMapProps) {
  const [claimedTerritories] = useKV<string[]>('claimed-territories', []);

  const claimedStates = new Set<string>();
  const stateTerritoryCount = new Map<string, number>();
  
  territoryZips.forEach(territory => {
    if (claimedTerritories?.includes(territory.zip)) {
      claimedStates.add(territory.state);
      const currentCount = stateTerritoryCount.get(territory.state) || 0;
      stateTerritoryCount.set(territory.state, currentCount + 1);
    }
  });

  const handleStateClick = (stateAbbr: string) => {
    if (onStateClick) {
      onStateClick(stateAbbr);
    }
  };

  return (
    <Card className={`p-4 glass-card ${className}`}>
      {!compact && (
        <div className="flex items-center gap-2 mb-3">
          <MapTrifold className="w-5 h-5 text-primary" weight="fill" />
          <h3 className="font-semibold text-sm">Your Territories</h3>
          <span className="ml-auto text-xs text-muted-foreground">
            {claimedStates.size} {claimedStates.size === 1 ? 'state' : 'states'}
          </span>
        </div>
      )}
      
      <TooltipProvider>
        <svg
          viewBox="0 0 959 593"
          className="w-full h-auto"
          style={{ maxHeight: compact ? '120px' : '200px' }}
        >
          <g>
            {US_STATES.map((state) => {
              const isClaimed = claimedStates.has(state.abbreviation);
              const territoryCount = stateTerritoryCount.get(state.abbreviation) || 0;
              const pathData = US_STATE_PATHS[state.abbreviation];
              
              if (!pathData) return null;
              
              return (
                <Tooltip key={state.abbreviation}>
                  <TooltipTrigger asChild>
                    <motion.path
                      d={pathData}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      className={`cursor-pointer transition-all ${
                        isClaimed
                          ? 'fill-emerald-500/80 stroke-emerald-400 hover:fill-emerald-400'
                          : 'fill-muted/30 stroke-border hover:fill-muted/50'
                      }`}
                      strokeWidth="1"
                      onClick={() => handleStateClick(state.abbreviation)}
                      style={{
                        filter: isClaimed ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' : 'none',
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="glass-card border-border/50">
                    <div className="text-xs space-y-1">
                      <div className="font-semibold">{state.name}</div>
                      {isClaimed && (
                        <>
                          <div className="text-emerald-500">✓ Claimed Territory</div>
                          <div className="text-muted-foreground">
                            {territoryCount} {territoryCount === 1 ? 'ZIP' : 'ZIPs'}
                          </div>
                        </>
                      )}
                      {!isClaimed && (
                        <div className="text-muted-foreground">Available</div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </g>
        </svg>
      </TooltipProvider>

      {!compact && claimedStates.size > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex flex-wrap gap-1">
            {Array.from(claimedStates).slice(0, 5).map((state) => (
              <span
                key={state}
                className="px-2 py-1 text-xs rounded-md bg-emerald-500/20 text-emerald-600 font-medium"
              >
                {state}
              </span>
            ))}
            {claimedStates.size > 5 && (
              <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground font-medium">
                +{claimedStates.size - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
