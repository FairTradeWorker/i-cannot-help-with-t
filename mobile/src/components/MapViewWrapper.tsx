import React, { forwardRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { MapPin } from 'lucide-react-native';

// Define prop types locally to avoid importing from react-native-maps at module level
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapViewProps {
  style?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  children?: React.ReactNode;
  [key: string]: any;
}

interface MapMarkerProps {
  coordinate: { latitude: number; longitude: number };
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  [key: string]: any;
}

interface MapPolygonProps {
  coordinates: { latitude: number; longitude: number }[];
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  tappable?: boolean;
  onPress?: () => void;
  [key: string]: any;
}

interface MapPolylineProps {
  coordinates: { latitude: number; longitude: number }[];
  strokeColor?: string;
  strokeWidth?: number;
  [key: string]: any;
}

// Check if running in Expo Go (where native modules aren't available)
const isExpoGo = Constants.appOwnership === 'expo';

// Lazy load MapView to handle cases where native module is not available
let MapViewComponent: any = null;
let MarkerComponent: React.ComponentType<any> | null = null;
let PolygonComponent: React.ComponentType<any> | null = null;
let PolylineComponent: React.ComponentType<any> | null = null;

// Only try to load react-native-maps if not in Expo Go
if (!isExpoGo) {
  try {
    const maps = require('react-native-maps');
    MapViewComponent = maps.default;
    MarkerComponent = maps.Marker;
    PolygonComponent = maps.Polygon;
    PolylineComponent = maps.Polyline;
  } catch (error) {
    console.log('react-native-maps not available, using fallback');
  }
}

interface MapFallbackProps {
  style?: any;
  children?: React.ReactNode;
}

const MapFallback: React.FC<MapFallbackProps> = ({ style }) => (
  <View style={[styles.fallbackContainer, style]}>
    <View style={styles.fallbackContent}>
      <MapPin color="#9ca3af" size={48} />
      <Text style={styles.fallbackTitle}>Map Not Available</Text>
      <Text style={styles.fallbackSubtitle}>
        Maps require a development build.{'\n'}
        Run `npx expo run:ios` or `npx expo run:android`
      </Text>
    </View>
  </View>
);

// Check if maps are available at runtime
export const isMapsAvailable = (): boolean => {
  // If in Expo Go, maps are never available
  if (isExpoGo) return false;
  
  if (!MapViewComponent) return false;
  
  // Additional runtime check for native module
  try {
    const { TurboModuleRegistry } = require('react-native');
    // Check if the native module is registered (using get, not getEnforcing)
    const nativeModule = TurboModuleRegistry.get('RNMapsAirModule');
    return nativeModule !== null;
  } catch {
    // If TurboModuleRegistry is not available or throws, try legacy check
    try {
      const { NativeModules } = require('react-native');
      return !!NativeModules.AirMapModule || !!NativeModules.RNMapsAirModule;
    } catch {
      return false;
    }
  }
};

// Wrapper component that handles the availability check
export const MapViewWrapper = forwardRef<any, MapViewProps>((props, ref) => {
  const [mapsAvailable, setMapsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    // Check availability on mount
    setMapsAvailable(isMapsAvailable());
  }, []);

  // Still checking
  if (mapsAvailable === null) {
    return <MapFallback style={props.style} />;
  }

  // Maps not available
  if (!mapsAvailable || !MapViewComponent) {
    return <MapFallback style={props.style}>{props.children}</MapFallback>;
  }

  // Maps available, render the actual component
  return <MapViewComponent ref={ref} {...props} />;
});

MapViewWrapper.displayName = 'MapViewWrapper';

// Re-export map components with fallback wrappers
export const Marker: React.FC<MapMarkerProps> = (props) => {
  if (!MarkerComponent) return null;
  return <MarkerComponent {...props} />;
};

export const Polygon: React.FC<MapPolygonProps> = (props) => {
  if (!PolygonComponent) return null;
  return <PolygonComponent {...props} />;
};

export const Polyline: React.FC<MapPolylineProps> = (props) => {
  if (!PolylineComponent) return null;
  return <PolylineComponent {...props} />;
};

const styles = StyleSheet.create({
  fallbackContainer: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackContent: {
    alignItems: 'center',
    padding: 24,
  },
  fallbackTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  fallbackSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MapViewWrapper;
