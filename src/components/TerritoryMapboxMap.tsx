import { useEffect, useRef, useState } from 'react';
import { MapPin, CheckCircle, Lock } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { territoryZips, type TerritoryZip } from '@/lib/territory-data';
import { useKV } from '@github/spark/hooks';

interface TerritoryMapboxMapProps {
  onTerritorySelect?: (territory: TerritoryZip) => void;
  onTerritoryClaim?: (territory: TerritoryZip) => void;
}

/**
 * Territory Map with Mapbox Integration
 * 
 * Note: Requires Mapbox access token in environment variables:
 * VITE_MAPBOX_ACCESS_TOKEN=your_token_here
 * 
 * To use:
 * 1. Sign up at https://mapbox.com
 * 2. Get your access token
 * 3. Add to .env file
 * 4. Install: npm install mapbox-gl
 */
export function TerritoryMapboxMap({ onTerritorySelect, onTerritoryClaim }: TerritoryMapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryZip | null>(null);
  const [claimedTerritories, setClaimedTerritories] = useKV<string[]>('claimed-territories', []);

  useEffect(() => {
    const initMap = async () => {
      if (!mapContainer.current) return;

      const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      
      if (!mapboxToken) {
        console.warn('Mapbox access token not found. Add VITE_MAPBOX_ACCESS_TOKEN to .env');
        // Show fallback UI
        return;
      }

      try {
        // Dynamically import mapbox-gl
        const mapboxgl = await import('mapbox-gl') as any;
        mapboxgl.accessToken = mapboxToken;

        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-98.5795, 39.8283], // Center of USA
          zoom: 4,
          attributionControl: false
        });

        map.current.on('load', () => {
          setMapLoaded(true);
          addTerritoryMarkers();
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      } catch (error) {
        console.error('Failed to initialize Mapbox:', error);
      }
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const addTerritoryMarkers = () => {
    if (!map.current || !mapLoaded) return;

    // Group territories by state for clustering
    const markers: any[] = [];

    territoryZips.forEach(territory => {
      if (!territory.latitude || !territory.longitude) return;

      const isClaimed = claimedTerritories?.includes(territory.zip);
      const status = isClaimed ? 'claimed' : (territory.available ? 'available' : 'unavailable');

      // Create marker element
      const el = document.createElement('div');
      el.className = 'territory-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Color by status
      if (status === 'claimed') {
        el.style.backgroundColor = '#ef4444'; // red
      } else if (status === 'available') {
        el.style.backgroundColor = '#22c55e'; // green
      } else {
        el.style.backgroundColor = '#6b7280'; // gray
      }

      el.addEventListener('click', () => {
        setSelectedTerritory(territory);
        onTerritorySelect?.(territory);
        
        // Fly to territory
        map.current.flyTo({
          center: [territory.longitude, territory.latitude],
          zoom: 10,
          duration: 1000
        });
      });

      // Create marker
      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat([territory.longitude, territory.latitude])
        .setPopup(
          new (window as any).mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${territory.city}, ${territory.state}</h3>
                <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${territory.zip}</p>
                <p style="font-size: 12px; color: #666;">${territory.county} County</p>
                ${status === 'available' ? `<p style="color: #22c55e; font-weight: bold; margin-top: 4px;">Available</p>` : ''}
              </div>
            `)
        )
        .addTo(map.current);

      markers.push(marker);
    });
  };

  useEffect(() => {
    if (mapLoaded && map.current) {
      addTerritoryMarkers();
    }
  }, [mapLoaded, claimedTerritories]);

  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  if (!mapboxToken) {
    return (
      <Card className="p-8 text-center">
        <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Mapbox Integration Required</h3>
        <p className="text-sm text-muted-foreground mb-4">
          To enable the interactive territory map, add your Mapbox access token:
        </p>
        <div className="bg-muted p-4 rounded-lg text-left max-w-md mx-auto">
          <code className="text-xs">
            VITE_MAPBOX_ACCESS_TOKEN=your_token_here
          </code>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Get your token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
        </p>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div ref={mapContainer} className="w-full h-[600px] rounded-lg overflow-hidden" />
      
      {selectedTerritory && (
        <Card className="absolute top-4 left-4 max-w-sm z-10">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{selectedTerritory.city}, {selectedTerritory.state}</h3>
                <p className="text-sm text-muted-foreground">{selectedTerritory.zip}</p>
                <p className="text-xs text-muted-foreground">{selectedTerritory.county} County</p>
              </div>
              {claimedTerritories?.includes(selectedTerritory.zip) ? (
                <Badge className="bg-red-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Claimed
                </Badge>
              ) : (
                <Badge className="bg-green-600">
                  Available
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Population</p>
                <p className="font-semibold">{(selectedTerritory.population / 1000).toFixed(1)}K</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-semibold">
                  {claimedTerritories && claimedTerritories.length < 10 ? 'FREE' : `$${selectedTerritory.monthlyPrice}/mo`}
                </p>
              </div>
            </div>

            {!claimedTerritories?.includes(selectedTerritory.zip) && (
              <Button
                className="w-full"
                onClick={() => onTerritoryClaim?.(selectedTerritory)}
              >
                Claim Territory
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

