import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin, Lightning, CheckCircle, Info } from '@phosphor-icons/react';
import { territoryZips } from '@/lib/territory-data';
import { useIsMobile } from '@/hooks/use-mobile';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface PriorityLeadsMapProps {
  onExplore?: () => void;
}

function MapInitializer() {
  const map = useMap();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      
      // Fit bounds to show all territories
      const validTerritories = territoryZips.filter(t => t.latitude && t.longitude);
      if (validTerritories.length > 0) {
        const points = validTerritories.map(t => [t.latitude, t.longitude] as [number, number]);
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 6 });
      } else {
        map.setView([39.8283, -98.5795], 4);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [map]);
  
  return null;
}

export function PriorityLeadsMap({ onExplore }: PriorityLeadsMapProps) {
  const isMobile = useIsMobile();
  
  // Get top priority territories (high population, available)
  const priorityTerritories = territoryZips
    .filter(t => t.available && t.latitude && t.longitude)
    .sort((a, b) => b.population - a.population)
    .slice(0, 50); // Show top 50 for performance

  return (
    <Card className="relative overflow-hidden border-2 cursor-pointer hover:shadow-lg transition-shadow h-full bg-background z-0" onClick={onExplore}>
      <div className="p-3 md:p-4 border-b bg-primary/5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Lightning className="w-5 h-5 text-primary" weight="fill" />
            <h3 className="font-bold text-sm">Priority Leads Map</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Learn more about priority leads">
                    <Info className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Priority territories are high-value zip codes with exclusive lead rights. 
                    Territory operators pay $45/month for exclusive access to leads in their area.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge variant="secondary" className="text-xs">
            {priorityTerritories.length} Territories
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          High-value zip codes with exclusive lead rights
        </p>
      </div>
      
      <div className="relative w-full" style={{ height: isMobile ? '250px' : '300px', minHeight: isMobile ? '250px' : '300px' }}>
        <style>{`
          .priority-map-container .leaflet-container {
            height: 300px !important;
            width: 100% !important;
            min-height: 300px !important;
          }
          .priority-map-container .leaflet-tile-container img {
            max-width: none !important;
          }
        `}</style>
        <div className="priority-map-container w-full h-full">
          <MapContainer
            center={[39.8283, -98.5795]}
            zoom={4}
            style={{ height: isMobile ? '250px' : '300px', width: '100%' }}
            zoomControl={true}
            scrollWheelZoom={false}
            dragging={true}
          >
            <MapInitializer />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Priority Territory Circles */}
            {priorityTerritories.map(territory => {
              const radiusMeters = Math.max(2000, Math.min(12000, territory.population / 15));
              
              return (
                <Circle
                  key={`priority-${territory.zip}`}
                  center={[territory.latitude, territory.longitude]}
                  radius={radiusMeters}
                  pathOptions={{
                    fillColor: '#22c55e',
                    color: '#16a34a',
                    fillOpacity: 0.3,
                    weight: 2,
                    opacity: 0.7,
                  }}
                />
              );
            })}
            
            {/* Priority Territory Markers */}
            {priorityTerritories.slice(0, 20).map(territory => {
              const icon = L.divIcon({
                html: `
                  <div style="
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #22c55e;
                    border: 3px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    cursor: pointer;
                  "></div>
                `,
                className: 'priority-marker',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              });
              
              return (
                <Marker
                  key={`marker-${territory.zip}`}
                  position={[territory.latitude, territory.longitude]}
                  icon={icon}
                >
                  <Popup>
                    <div className="p-2 min-w-[180px]">
                      <h4 className="font-bold mb-1">{territory.city}, {territory.state}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{territory.zip}</p>
                      <div className="flex justify-between text-xs mb-2">
                        <span>Population:</span>
                        <span className="font-semibold">{(territory.population / 1000).toFixed(1)}K</span>
                      </div>
                      <Badge className="bg-green-600 w-full justify-center text-xs mb-2">
                        <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                        Available - ${territory.monthlyPrice}/mo
                      </Badge>
                      <p className="text-[10px] text-muted-foreground text-center">
                        Exclusive lead rights in this territory
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
      
      <div className="p-3 border-t bg-muted/30">
        <div className="flex items-center justify-between text-xs">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <div className="w-3 h-3 rounded-full bg-green-600 border border-white" />
                  <span className="text-muted-foreground">High-value territories</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Green markers indicate available territories with high population and exclusive lead rights</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent transition-colors" onClick={onExplore}>
            <MapPin className="w-3 h-3 mr-1" />
            Click to explore
          </Badge>
        </div>
      </div>
    </Card>
  );
}

