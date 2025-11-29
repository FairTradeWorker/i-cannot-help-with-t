// Location Hook
// Manages user location for job matching and routing

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export function useLocation(autoRequest: boolean = true) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    }
  }, [autoRequest]);

  const requestLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setPermissionGranted(false);
        setError(new Error('Location permission denied'));
        setLoading(false);
        return;
      }

      setPermissionGranted(true);

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      // Reverse geocode to get address
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        });

        if (addresses && addresses.length > 0) {
          const addr = addresses[0];
          locationData.address = [
            addr.street,
            addr.city,
            addr.region,
            addr.postalCode,
          ].filter(Boolean).join(', ');
        }
      } catch (geocodeError) {
        console.warn('Failed to reverse geocode:', geocodeError);
      }

      setLocation(locationData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get location');
      setError(error);
      console.error('Location error:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setPermissionGranted(granted);
      
      if (granted) {
        await requestLocation();
      }
      
      return granted;
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  };

  return {
    location,
    loading,
    error,
    permissionGranted,
    requestLocation,
    requestPermission,
  };
}

