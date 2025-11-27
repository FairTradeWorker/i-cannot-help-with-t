import React, { forwardRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, NativeModules } from 'react-native';
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
  initialRegion?: Region;
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

// Check if the native maps module is available BEFORE attempting to load react-native-maps
// This prevents the TurboModuleRegistry.getEnforcing error from being thrown
const checkNativeModuleAvailable = (): boolean => {
  if (isExpoGo) return false;
  
  try {
    // Try to access TurboModuleRegistry to check if maps module exists
    // Using get() instead of getEnforcing() to avoid throwing an error
    const { TurboModuleRegistry } = require('react-native');
    if (TurboModuleRegistry && typeof TurboModuleRegistry.get === 'function') {
      const turboModule = TurboModuleRegistry.get('RNMapsAirModule');
      if (turboModule) return true;
    }
  } catch {
    // TurboModuleRegistry check failed, try legacy NativeModules
  }
  
  try {
    // Fallback to legacy NativeModules check
    if (NativeModules && (NativeModules.AirMapModule || NativeModules.RNMapsAirModule)) {
      return true;
    }
  } catch {
    // Legacy check also failed
  }
  
  return false;
};

// Lazy load MapView to handle cases where native module is not available
let MapViewComponent: any = null;
let MarkerComponent: React.ComponentType<any> | null = null;
let PolygonComponent: React.ComponentType<any> | null = null;
let PolylineComponent: React.ComponentType<any> | null = null;

// Check native module availability first, before any require
const nativeModuleAvailable = checkNativeModuleAvailable();

// Only try to load react-native-maps if native module is confirmed available
if (nativeModuleAvailable) {
  try {
    const maps = require('react-native-maps');
    MapViewComponent = maps.default;
    MarkerComponent = maps.Marker;
    PolygonComponent = maps.Polygon;
    PolylineComponent = maps.Polyline;
  } catch (error) {
    console.log('react-native-maps failed to load, using fallback:', error);
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
  // Use the cached result from module initialization
  return nativeModuleAvailable && MapViewComponent !== null;
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
