import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Path } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { OptimizedRoute } from '@/lib/routing-api';

interface RouteMapProps {
  route: OptimizedRoute;
}

export function RouteMap({ route }: RouteMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !route.polyline || route.polyline.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const lngs = route.polyline.map(coord => coord[0]);
    const lats = route.polyline.map(coord => coord[1]);

    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const padding = 40;
    const lngRange = maxLng - minLng || 0.01;
    const latRange = maxLat - minLat || 0.01;

    const scaleX = (width - 2 * padding) / lngRange;
    const scaleY = (height - 2 * padding) / latRange;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (width - lngRange * scale) / 2;
    const offsetY = (height - latRange * scale) / 2;

    const toCanvasX = (lng: number) => (lng - minLng) * scale + offsetX;
    const toCanvasY = (lat: number) => height - ((lat - minLat) * scale + offsetY);

    ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    route.polyline.forEach((coord, index) => {
      const x = toCanvasX(coord[0]);
      const y = toCanvasY(coord[1]);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    route.stops.forEach((stop, index) => {
      const x = toCanvasX(stop.lng);
      const y = toCanvasY(stop.lat);

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = index === 0 ? '#10b981' : '#6366f1';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (index > 0) {
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index.toString(), x, y);
      }
    });
  }, [route]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <MapPin className="w-5 h-5 text-primary" weight="fill" />
          </div>
          Route Visualization
        </CardTitle>
        <CardDescription>
          Optimized path through {route.stops.length - 1} job location{route.stops.length !== 2 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full bg-muted/30 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            className="w-full h-full"
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Start/End</span>
            </div>
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Job Site</span>
            </div>
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Path className="w-3 h-3 text-primary" />
              <span>Route</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
