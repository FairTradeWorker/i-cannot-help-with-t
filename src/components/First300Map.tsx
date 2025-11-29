// FIRST 300: Claimed zips map visualization
'use client';

import { useMemo } from 'react';
import { MapPin } from '@phosphor-icons/react';
import type { First300Claim } from '@/lib/first300';
import { territoryZips } from '@/lib/territory-data';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface First300MapProps {
  claimedZips: First300Claim[];
}

export function First300Map({ claimedZips }: First300MapProps) {
  // Get coordinates for claimed zips
  const markers = useMemo(() => {
    return claimedZips.map(claim => {
      const territory = territoryZips.find(t => t.zip === claim.zip);
      if (territory && territory.latitude && territory.longitude) {
        return {
          zip: claim.zip,
          coordinates: [territory.longitude, territory.latitude] as [number, number],
          priorityStatus: claim.priorityStatus
        };
      }
      return null;
    }).filter(Boolean) as Array<{
      zip: string;
      coordinates: [number, number];
      priorityStatus: 'first_priority' | 'second_priority';
    }>;
  }, [claimedZips]);

  const centerNumber = claimedZips.length;

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Red dots for claimed territories */}
        {markers.map((marker) => (
          <CircleMarker
            key={marker.zip}
            center={[marker.coordinates[1], marker.coordinates[0]]}
            radius={6}
            pathOptions={{
              fillColor: marker.priorityStatus === 'first_priority' ? '#EF4444' : '#F59E0B',
              fillOpacity: 0.8,
              color: '#fff',
              weight: 2
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">Zip: {marker.zip}</div>
                <div className="text-xs text-muted-foreground">
                  {marker.priorityStatus === 'first_priority' ? 'First Priority' : 'Second Priority'}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Center countdown number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full w-32 h-32 flex items-center justify-center border-4 border-primary shadow-xl">
          <div className="text-center">
            <div className="text-4xl font-black text-primary">{centerNumber}</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Claimed
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>First Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Second Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}

