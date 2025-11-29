// Generate simplified GeoJSON for territories we have
import { territoryZips, type TerritoryZip } from './territory-data';

export interface ZipGeoJSONFeature {
  type: 'Feature';
  properties: {
    ZIP: string;
    ZCTA5CE10: string;
    NAME: string;
    STATE: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}

/**
 * Generate simplified GeoJSON for our territories
 * Since we have lat/lng for each zip, we create point features
 * In production, you'd use actual polygon boundaries from a GeoJSON service
 */
export function generateTerritoryGeoJSON(): {
  type: 'FeatureCollection';
  features: ZipGeoJSONFeature[];
} {
  const features: ZipGeoJSONFeature[] = territoryZips
    .filter(t => t.latitude && t.longitude)
    .map(territory => ({
      type: 'Feature' as const,
      properties: {
        ZIP: territory.zip,
        ZCTA5CE10: territory.zip,
        NAME: `${territory.city}, ${territory.state}`,
        STATE: territory.state
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [territory.longitude, territory.latitude]
      }
    }));

  return {
    type: 'FeatureCollection',
    features
  };
}

