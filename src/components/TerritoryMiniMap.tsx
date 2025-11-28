import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapTrifold, Lightning, Circle, ArrowRight } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  territoryZips, 
  getStateStats, 
  getAvailableTerritoryCount,
  getTotalTerritoryCount,
  takenTerritories 
} from '@/lib/territory-data';

interface TerritoryMiniMapProps {
  onExplore: () => void;
}

export function TerritoryMiniMap({ onExplore }: TerritoryMiniMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [liveCount, setLiveCount] = useState(0);
  
  // Simulate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(c => c + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Draw mini map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = 'rgba(248, 250, 252, 1)';
    ctx.fillRect(0, 0, width, height);
    
    // Map bounds for continental US
    const minLat = 24.5;
    const maxLat = 49.5;
    const minLng = -125;
    const maxLng = -66;
    
    const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * width;
    const toY = (lat: number) => height - ((lat - minLat) / (maxLat - minLat)) * height;
    
    // Draw territories as small dots
    territoryZips.forEach(t => {
      const x = toX(t.longitude);
      const y = toY(t.latitude);
      
      const isAvailable = t.available && !takenTerritories.has(t.zip);
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = isAvailable ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.5)';
      ctx.fill();
    });
    
    // Add some animated "pulse" dots for activity
    const pulsingDots = [
      { lat: 30.27, lng: -97.74 }, // Austin
      { lat: 33.45, lng: -112.07 }, // Phoenix
      { lat: 39.74, lng: -104.99 }, // Denver
      { lat: 41.88, lng: -87.63 }, // Chicago
      { lat: 47.61, lng: -122.33 }, // Seattle
    ];
    
    const pulsePhase = (Date.now() % 2000) / 2000;
    const pulseSize = 4 + Math.sin(pulsePhase * Math.PI * 2) * 2;
    
    pulsingDots.forEach(dot => {
      const x = toX(dot.lng);
      const y = toY(dot.lat);
      
      ctx.beginPath();
      ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(pulsePhase * Math.PI * 2) * 0.2})`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
      ctx.fill();
    });
    
  }, [liveCount]);

  const availableCount = getAvailableTerritoryCount();
  const totalCount = getTotalTerritoryCount();
  const topStates = getStateStats().slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="glass-card p-4 cursor-pointer hover:border-primary/50 transition-all"
        onClick={onExplore}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapTrifold className="w-5 h-5 text-primary" weight="fill" />
            <h3 className="text-sm font-bold">Territory Activity</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="w-2 h-2 text-green-500 animate-pulse" weight="fill" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        
        <div className="relative bg-slate-50 rounded-lg overflow-hidden mb-3">
          <canvas 
            ref={canvasRef} 
            width={280} 
            height={160} 
            className="w-full h-auto"
          />
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{availableCount}</p>
              <p className="text-[10px] text-muted-foreground">Available</p>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <p className="text-lg font-bold">{totalCount}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            $45/mo
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-2">
            {topStates.map(s => (
              <Badge key={s.state} variant="secondary" className="text-[10px]">
                {s.state}: {s.available}
              </Badge>
            ))}
          </div>
          <span className="text-primary font-semibold flex items-center gap-1">
            Explore <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
