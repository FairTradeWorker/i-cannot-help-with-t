import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polygon, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapPin, DollarSign, Users, TrendingUp, Check, Lock } from 'lucide-react-native';
import type { Territory } from '@/types';

const { width, height } = Dimensions.get('window');

interface TerritoryData {
  id: string;
  name: string;
  state: string;
  center: { latitude: number; longitude: number };
  coordinates: { latitude: number; longitude: number }[];
  price: number;
  claimed: boolean;
  stats: {
    monthlyJobs: number;
    avgJobValue: number;
    contractors: number;
    revenue: number;
  };
}

const mockTerritories: TerritoryData[] = [
  {
    id: 't1',
    name: 'Downtown Austin',
    state: 'TX',
    center: { latitude: 30.2672, longitude: -97.7431 },
    coordinates: [
      { latitude: 30.2800, longitude: -97.7600 },
      { latitude: 30.2800, longitude: -97.7260 },
      { latitude: 30.2540, longitude: -97.7260 },
      { latitude: 30.2540, longitude: -97.7600 },
    ],
    price: 15000,
    claimed: false,
    stats: { monthlyJobs: 145, avgJobValue: 850, contractors: 23, revenue: 12300 },
  },
  {
    id: 't2',
    name: 'South Austin',
    state: 'TX',
    center: { latitude: 30.2240, longitude: -97.7570 },
    coordinates: [
      { latitude: 30.2540, longitude: -97.7800 },
      { latitude: 30.2540, longitude: -97.7340 },
      { latitude: 30.1940, longitude: -97.7340 },
      { latitude: 30.1940, longitude: -97.7800 },
    ],
    price: 8500,
    claimed: true,
    stats: { monthlyJobs: 89, avgJobValue: 720, contractors: 15, revenue: 7650 },
  },
  {
    id: 't3',
    name: 'Round Rock',
    state: 'TX',
    center: { latitude: 30.5083, longitude: -97.6789 },
    coordinates: [
      { latitude: 30.5300, longitude: -97.7100 },
      { latitude: 30.5300, longitude: -97.6480 },
      { latitude: 30.4860, longitude: -97.6480 },
      { latitude: 30.4860, longitude: -97.7100 },
    ],
    price: 12000,
    claimed: false,
    stats: { monthlyJobs: 112, avgJobValue: 920, contractors: 18, revenue: 10300 },
  },
];

const INITIAL_REGION: Region = {
  latitude: 30.2672,
  longitude: -97.7431,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
};

export default function TerritoriesScreen() {
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryData | null>(null);
  const mapRef = useRef<MapView>(null);

  const handleTerritoryPress = (territory: TerritoryData) => {
    setSelectedTerritory(territory);
    mapRef.current?.animateToRegion({
      ...territory.center,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    }, 500);
  };

  const handleClaimTerritory = (territory: TerritoryData) => {
    if (territory.claimed) {
      Alert.alert('Territory Claimed', 'This territory has already been claimed by another operator.');
      return;
    }
    
    Alert.alert(
      'Claim Territory',
      `Are you sure you want to claim "${territory.name}" for $${territory.price.toLocaleString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Proceed to Payment', 
          onPress: () => {
            Alert.alert('Coming Soon', 'Territory purchasing will be available in the next update.');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <View className="flex-1">
        {/* Map */}
        <MapView
          ref={mapRef}
          style={{ width, height: height * 0.5 }}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton
        >
          {mockTerritories.map((territory) => (
            <React.Fragment key={territory.id}>
              <Polygon
                coordinates={territory.coordinates}
                fillColor={
                  selectedTerritory?.id === territory.id
                    ? 'rgba(14, 165, 233, 0.4)'
                    : territory.claimed
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(34, 197, 94, 0.2)'
                }
                strokeColor={
                  selectedTerritory?.id === territory.id
                    ? '#0ea5e9'
                    : territory.claimed
                    ? '#ef4444'
                    : '#22c55e'
                }
                strokeWidth={2}
                tappable
                onPress={() => handleTerritoryPress(territory)}
              />
              <Marker
                coordinate={territory.center}
                onPress={() => handleTerritoryPress(territory)}
              >
                <View className={`px-2 py-1 rounded-lg ${territory.claimed ? 'bg-red-500' : 'bg-green-500'}`}>
                  <Text className="text-white text-xs font-bold">{territory.name}</Text>
                </View>
              </Marker>
            </React.Fragment>
          ))}
        </MapView>

        {/* Territory List / Details */}
        <ScrollView className="flex-1 bg-white rounded-t-3xl -mt-6 pt-4">
          {selectedTerritory ? (
            <View className="px-4">
              {/* Selected Territory Details */}
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-2xl font-bold text-gray-900">{selectedTerritory.name}</Text>
                  <Text className="text-gray-500">{selectedTerritory.state}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${selectedTerritory.claimed ? 'bg-red-100' : 'bg-green-100'}`}>
                  {selectedTerritory.claimed ? (
                    <View className="flex-row items-center">
                      <Lock color="#ef4444" size={14} />
                      <Text className="text-red-600 font-medium text-sm ml-1">Claimed</Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center">
                      <Check color="#22c55e" size={14} />
                      <Text className="text-green-600 font-medium text-sm ml-1">Available</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Price */}
              <View className="bg-primary-50 rounded-xl p-4 mb-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-gray-600 text-sm">Territory Price</Text>
                    <Text className="text-3xl font-bold text-primary-700">
                      ${selectedTerritory.price.toLocaleString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-600 text-sm">Est. Monthly Revenue</Text>
                    <Text className="text-xl font-bold text-green-600">
                      ${selectedTerritory.stats.revenue.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stats Grid */}
              <View className="flex-row flex-wrap -m-1 mb-4">
                <View className="w-1/2 p-1">
                  <View className="bg-gray-50 rounded-lg p-3">
                    <View className="flex-row items-center mb-1">
                      <TrendingUp color="#0ea5e9" size={16} />
                      <Text className="text-gray-600 text-xs ml-1">Monthly Jobs</Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-900">{selectedTerritory.stats.monthlyJobs}</Text>
                  </View>
                </View>
                <View className="w-1/2 p-1">
                  <View className="bg-gray-50 rounded-lg p-3">
                    <View className="flex-row items-center mb-1">
                      <DollarSign color="#22c55e" size={16} />
                      <Text className="text-gray-600 text-xs ml-1">Avg Job Value</Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-900">${selectedTerritory.stats.avgJobValue}</Text>
                  </View>
                </View>
                <View className="w-1/2 p-1">
                  <View className="bg-gray-50 rounded-lg p-3">
                    <View className="flex-row items-center mb-1">
                      <Users color="#8b5cf6" size={16} />
                      <Text className="text-gray-600 text-xs ml-1">Contractors</Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-900">{selectedTerritory.stats.contractors}</Text>
                  </View>
                </View>
                <View className="w-1/2 p-1">
                  <View className="bg-gray-50 rounded-lg p-3">
                    <View className="flex-row items-center mb-1">
                      <MapPin color="#f59e0b" size={16} />
                      <Text className="text-gray-600 text-xs ml-1">ROI</Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-900">
                      {Math.round((selectedTerritory.stats.revenue * 12 / selectedTerritory.price) * 100)}%
                    </Text>
                  </View>
                </View>
              </View>

              {/* Claim Button */}
              <TouchableOpacity
                onPress={() => handleClaimTerritory(selectedTerritory)}
                className={`py-4 rounded-xl items-center mb-6 ${selectedTerritory.claimed ? 'bg-gray-300' : 'bg-primary-500'}`}
                disabled={selectedTerritory.claimed}
              >
                <Text className={`font-bold text-lg ${selectedTerritory.claimed ? 'text-gray-500' : 'text-white'}`}>
                  {selectedTerritory.claimed ? 'Territory Unavailable' : 'Claim This Territory'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="px-4">
              <Text className="text-lg font-bold text-gray-900 mb-4">Available Territories</Text>
              {mockTerritories.map((territory) => (
                <TouchableOpacity
                  key={territory.id}
                  onPress={() => handleTerritoryPress(territory)}
                  className="bg-gray-50 rounded-xl p-4 mb-3 flex-row items-center"
                >
                  <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${territory.claimed ? 'bg-red-100' : 'bg-green-100'}`}>
                    <MapPin color={territory.claimed ? '#ef4444' : '#22c55e'} size={24} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold">{territory.name}</Text>
                    <Text className="text-gray-500 text-sm">{territory.stats.monthlyJobs} jobs/month</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-primary-600 font-bold">${territory.price.toLocaleString()}</Text>
                    <Text className={`text-xs ${territory.claimed ? 'text-red-500' : 'text-green-500'}`}>
                      {territory.claimed ? 'Claimed' : 'Available'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
