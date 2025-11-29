// Mobile Territory Map Component
// Interactive map showing territory availability and claims

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react-native';
import type { Territory } from '@/types';

interface TerritoryMapProps {
  territories: Territory[];
  selectedTerritory?: Territory | null;
  onTerritorySelect?: (territory: Territory) => void;
  userLocation?: { lat: number; lng: number };
}

interface TerritoryMarker {
  id: string;
  latitude: number;
  longitude: number;
  zip: string;
  city: string;
  state: string;
  status: 'available' | 'taken' | 'yours';
}

const TEXAS_CENTER: Region = {
  latitude: 31.9686,
  longitude: -99.9018,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

export function TerritoryMap({ 
  territories, 
  selectedTerritory, 
  onTerritorySelect,
  userLocation 
}: TerritoryMapProps) {
  const [region, setRegion] = useState<Region>(TEXAS_CENTER);
  const [markers, setMarkers] = useState<TerritoryMarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerritoryMarkers();
  }, [territories]);

  const loadTerritoryMarkers = async () => {
    setLoading(true);
    try {
      // Convert territories to markers
      // For now, using mock coordinates - in production, use territory coordinates
      const territoryMarkers: TerritoryMarker[] = territories.slice(0, 50).map((territory, index) => ({
        id: territory.id || `territory-${index}`,
        latitude: 31.9686 + (Math.random() - 0.5) * 6, // Texas area
        longitude: -99.9018 + (Math.random() - 0.5) * 6,
        zip: territory.zipCodes?.[0] || '00000',
        city: territory.name?.split(',')[0] || 'Unknown',
        state: 'TX',
        status: territory.operatorId ? (selectedTerritory?.id === territory.id ? 'yours' : 'taken') : 'available',
      }));

      setMarkers(territoryMarkers);
    } catch (error) {
      console.error('Failed to load territory markers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (status: TerritoryMarker['status']) => {
    switch (status) {
      case 'available':
        return '#10b981'; // green
      case 'taken':
        return '#ef4444'; // red
      case 'yours':
        return '#3b82f6'; // blue
      default:
        return '#6b7280'; // gray
    }
  };

  const handleMarkerPress = (marker: TerritoryMarker) => {
    const territory = territories.find(t => 
      t.zipCodes?.includes(marker.zip) || t.id === marker.id
    );
    if (territory && onTerritorySelect) {
      onTerritorySelect(territory);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading territories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={!!userLocation}
        showsMyLocationButton={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            pinColor={getMarkerColor(marker.status)}
            onPress={() => handleMarkerPress(marker)}
          >
            <View style={[styles.markerContainer, { backgroundColor: getMarkerColor(marker.status) }]}>
              <Text className="text-white text-xs font-bold">{marker.zip}</Text>
            </View>
          </Marker>
        ))}

        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="#0ea5e9"
          />
        )}
      </MapView>

      {/* Legend */}
      <View style={styles.legend}>
        <View className="flex-row items-center mb-2">
          <View className="w-4 h-4 bg-green-500 rounded-full mr-2" />
          <Text className="text-sm text-gray-700">Available</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <View className="w-4 h-4 bg-red-500 rounded-full mr-2" />
          <Text className="text-sm text-gray-700">Taken</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
          <Text className="text-sm text-gray-700">Yours</Text>
        </View>
      </View>

      {/* Territory Info */}
      {selectedTerritory && (
        <View style={styles.infoCard}>
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {selectedTerritory.name}
          </Text>
          <Text className="text-sm text-gray-600 mb-2">
            {selectedTerritory.zipCodes?.join(', ') || 'No zip codes'}
          </Text>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-gray-500">Active Jobs</Text>
              <Text className="text-lg font-bold text-gray-900">
                {selectedTerritory.stats?.totalJobs || 0}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500">Contractors</Text>
              <Text className="text-lg font-bold text-gray-900">
                {selectedTerritory.stats?.activeContractors || 0}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  markerContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  legend: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

