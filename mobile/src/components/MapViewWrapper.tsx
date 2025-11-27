import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, NativeModules } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
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

// Constant for Expo Go execution environment string value
const EXPO_GO_EXECUTION_ENV = 'storeClient';

// Check if running in Expo Go (where native modules aren't available)
// Use executionEnvironment for SDK 54+, with fallback to appOwnership for older SDKs
const isExpoGo = (() => {
  try {
    // Debug logging in development
    if (__DEV__) {
      console.log('[MapViewWrapper] Constants.executionEnvironment:', Constants.executionEnvironment);
      console.log('[MapViewWrapper] ExecutionEnvironment.StoreClient value:', ExecutionEnvironment.StoreClient);
      console.log('[MapViewWrapper] Constants.appOwnership:', Constants.appOwnership);
    }
    
    // Primary check: executionEnvironment (recommended for SDK 54+)
    // Cast to string for comparison to handle any type mismatches
    const execEnv = String(Constants.executionEnvironment || '');
    const storeClientValue = String(ExecutionEnvironment.StoreClient || EXPO_GO_EXECUTION_ENV);
    
    if (execEnv === storeClientValue || execEnv === EXPO_GO_EXECUTION_ENV) {
      if (__DEV__) {
        console.log('[MapViewWrapper] Detected Expo Go via executionEnvironment');
      }
      return true;
    }
    
    // Fallback check: appOwnership for older SDKs or edge cases
    // Note: appOwnership is deprecated and may be null in EAS builds
    if (Constants.appOwnership === 'expo') {
      if (__DEV__) {
        console.log('[MapViewWrapper] Detected Expo Go via appOwnership');
      }
      return true;
    }
  } catch (e) {
    // If Constants access fails, log the error in dev mode
    // Assume Expo Go to prevent crashes from TurboModuleRegistry.getEnforcing
    if (__DEV__) {
      console.log('[MapViewWrapper] Error checking environment:', e);
    }
    // Be conservative: assume Expo Go if we can't determine, to prevent native module errors
    return true;
  }
  return false;
})();

// Check if the native maps module is available BEFORE attempting to load react-native-maps
// This prevents the TurboModuleRegistry.getEnforcing error from being thrown
const checkNativeModuleAvailable = (): boolean => {
  // Always return false for Expo Go - maps are never available there
  if (isExpoGo) {
    if (__DEV__) {
      console.log('[MapViewWrapper] Detected Expo Go environment, maps unavailable');
    }
    return false;
  }
  
  try {
    // Try to access TurboModuleRegistry to check if maps module exists
    // Using get() instead of getEnforcing() to avoid throwing an error
    const { TurboModuleRegistry } = require('react-native');
    if (TurboModuleRegistry && typeof TurboModuleRegistry.get === 'function') {
      const turboModule = TurboModuleRegistry.get('RNMapsAirModule');
      if (__DEV__) {
        console.log('[MapViewWrapper] TurboModuleRegistry.get result:', turboModule !== null && turboModule !== undefined);
      }
      if (turboModule !== null && turboModule !== undefined) {
        return true;
      }
    }
  } catch (e) {
    // TurboModuleRegistry check failed, try legacy NativeModules
    if (__DEV__) {
      console.log('[MapViewWrapper] TurboModuleRegistry check failed:', e);
    }
  }
  
  try {
    // Fallback to legacy NativeModules check
    const hasAirMapModule = NativeModules && NativeModules.AirMapModule !== undefined && NativeModules.AirMapModule !== null;
    const hasRNMapsAirModule = NativeModules && NativeModules.RNMapsAirModule !== undefined && NativeModules.RNMapsAirModule !== null;
    if (__DEV__) {
      console.log('[MapViewWrapper] Legacy NativeModules check - AirMapModule:', hasAirMapModule, 'RNMapsAirModule:', hasRNMapsAirModule);
    }
    if (hasAirMapModule || hasRNMapsAirModule) {
      return true;
    }
  } catch (e) {
    // Legacy check also failed
    if (__DEV__) {
      console.log('[MapViewWrapper] Legacy NativeModules check failed:', e);
    }
  }
  
  return false;
};

// Cache for loaded map components - loaded lazily on first use
interface MapComponents {
  MapView: any;
  Marker: React.ComponentType<any>;
  Polygon: React.ComponentType<any>;
  Polyline: React.ComponentType<any>;
}

let cachedMapComponents: MapComponents | null = null;
let mapLoadAttempted = false;
let mapLoadError: Error | null = null;

// Lazy load map components - only called when actually needed
const loadMapComponents = (): MapComponents | null => {
  // Return cached result if already attempted
  if (mapLoadAttempted) {
    return cachedMapComponents;
  }
  
  mapLoadAttempted = true;
  
  // Don't even try if we know native module isn't available
  if (!checkNativeModuleAvailable()) {
    if (__DEV__) {
      console.log('[MapViewWrapper] Skipping map load - native module not available');
    }
    return null;
  }
  
  try {
    const maps = require('react-native-maps');
    cachedMapComponents = {
      MapView: maps.default,
      Marker: maps.Marker,
      Polygon: maps.Polygon,
      Polyline: maps.Polyline,
    };
    if (__DEV__) {
      console.log('[MapViewWrapper] Successfully loaded react-native-maps');
    }
    return cachedMapComponents;
  } catch (error) {
    mapLoadError = error as Error;
    if (__DEV__) {
      console.log('[MapViewWrapper] Failed to load react-native-maps:', error);
    }
    return null;
  }
};

// Get cached map components (fast path for already-loaded components)
const getMapComponents = (): MapComponents | null => {
  if (mapLoadAttempted) {
    return cachedMapComponents;
  }
  return loadMapComponents();
};

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
  const components = getMapComponents();
  return components !== null;
};

// Wrapper component that handles the availability check
export const MapViewWrapper = forwardRef<any, MapViewProps>((props, ref) => {
  const [mapsAvailable, setMapsAvailable] = useState<boolean | null>(null);
  const mapComponentsRef = useRef<MapComponents | null>(null);

  useEffect(() => {
    // Load map components on mount (after React has initialized)
    const components = loadMapComponents();
    mapComponentsRef.current = components;
    setMapsAvailable(components !== null);
  }, []);

  // Still loading
  if (mapsAvailable === null) {
    return <MapFallback style={props.style} />;
  }

  // Maps not available
  if (!mapsAvailable || !mapComponentsRef.current) {
    return <MapFallback style={props.style}>{props.children}</MapFallback>;
  }

  // Maps available, render the actual component
  const MapViewComponent = mapComponentsRef.current.MapView;
  return <MapViewComponent ref={ref} {...props} />;
});

MapViewWrapper.displayName = 'MapViewWrapper';

// Re-export map components with fallback wrappers
// These use the cached components from getMapComponents() which returns immediately if already loaded
export const Marker: React.FC<MapMarkerProps> = (props) => {
  const components = getMapComponents();
  if (!components?.Marker) return null;
  const MarkerComponent = components.Marker;
  return <MarkerComponent {...props} />;
};

export const Polygon: React.FC<MapPolygonProps> = (props) => {
  const components = getMapComponents();
  if (!components?.Polygon) return null;
  const PolygonComponent = components.Polygon;
  return <PolygonComponent {...props} />;
};

export const Polyline: React.FC<MapPolylineProps> = (props) => {
  const components = getMapComponents();
  if (!components?.Polyline) return null;
  const PolylineComponent = components.Polyline;
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
