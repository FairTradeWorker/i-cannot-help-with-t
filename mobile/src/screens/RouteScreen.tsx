import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, Region, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { Navigation, MapPin, Clock, DollarSign, Fuel, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react-native';
import { routingAPI, type JobLocation, type OptimizedRoute } from '@/lib/routing-api';

const { width, height } = Dimensions.get('window');

const mockJobs: JobLocation[] = [
  {
    id: 'j1',
    name: 'Kitchen Faucet Replacement',
    address: '123 Oak St, Austin, TX',
    lat: 30.2849,
    lng: -97.7341,
    urgency: 'urgent',
    estimatedDuration: 120,
  },
  {
    id: 'j2',
    name: 'Electrical Panel Upgrade',
    address: '456 Elm Ave, Round Rock, TX',
    lat: 30.5083,
    lng: -97.6789,
    urgency: 'normal',
    estimatedDuration: 480,
  },
  {
    id: 'j3',
    name: 'HVAC Maintenance',
    address: '789 Pine Blvd, Cedar Park, TX',
    lat: 30.5052,
    lng: -97.8203,
    urgency: 'normal',
    estimatedDuration: 60,
  },
  {
    id: 'j4',
    name: 'Bathroom Leak Fix',
    address: '321 Maple Dr, Pflugerville, TX',
    lat: 30.4393,
    lng: -97.6200,
    urgency: 'emergency',
    estimatedDuration: 90,
  },
];

const INITIAL_REGION: Region = {
  latitude: 30.3672,
  longitude: -97.7431,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const urgencyColors: Record<string, string> = {
  normal: '#22c55e',
  urgent: '#f59e0b',
  emergency: '#ef4444',
};

export default function RouteScreen() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required for route optimization.');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      // Fallback to Austin, TX
      setUserLocation({ lat: 30.2672, lng: -97.7431 });
    }
  };

  const optimizeRoute = async () => {
    if (!userLocation) {
      Alert.alert('Error', 'Unable to get your current location');
      return;
    }

    setIsOptimizing(true);

    try {
      // TODO: Replace with actual routing API integration
      // This mock implementation demonstrates the route optimization UI
      // In production, this would call routingAPI.optimizeJobRoute() with real job data
      // and receive optimized route coordinates from the TrueWay Routing API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulated optimized route
      const simulatedRoute: OptimizedRoute = {
        totalDistance: 45000, // 45km in meters
        totalDuration: 3600, // 1 hour in seconds
        stops: [
          { id: 'start', name: 'Your Location', address: 'Current Position', lat: userLocation.lat, lng: userLocation.lng },
          mockJobs[3], // Emergency first
          mockJobs[0], // Urgent second
          mockJobs[2], // Normal - close
          mockJobs[1], // Normal - far
        ],
        polyline: [
          [userLocation.lng, userLocation.lat],
          [-97.6200, 30.4393], // Job 4
          [-97.7341, 30.2849], // Job 1
          [-97.8203, 30.5052], // Job 3
          [-97.6789, 30.5083], // Job 2
        ],
        legs: [],
        estimatedCost: 125.50,
        fuelCost: 15.50,
      };

      setOptimizedRoute(simulatedRoute);

      // Fit map to show all points
      if (mapRef.current) {
        const coords = simulatedRoute.stops.map(s => ({ latitude: s.lat, longitude: s.lng }));
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 50, right: 50, bottom: 200, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to optimize route. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const resetRoute = () => {
    setOptimizedRoute(null);
    mapRef.current?.animateToRegion(INITIAL_REGION, 500);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDistance = (meters: number) => {
    const miles = meters * 0.000621371;
    return `${miles.toFixed(1)} mi`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <View className="flex-1">
        {/* Map */}
        <MapView
          ref={mapRef}
          style={{ width, height: height * 0.45 }}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton
        >
          {/* User Location Marker */}
          {userLocation && (
            <Marker
              coordinate={{ latitude: userLocation.lat, longitude: userLocation.lng }}
              title="Your Location"
            >
              <View className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white items-center justify-center">
                <Navigation color="#ffffff" size={16} />
              </View>
            </Marker>
          )}

          {/* Job Markers */}
          {(optimizedRoute ? optimizedRoute.stops.slice(1) : mockJobs).map((job, index) => (
            <Marker
              key={job.id}
              coordinate={{ latitude: job.lat, longitude: job.lng }}
              title={job.name}
              description={job.address}
            >
              <View
                className="items-center justify-center"
                style={{
                  backgroundColor: urgencyColors[job.urgency || 'normal'],
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: '#ffffff',
                }}
              >
                {optimizedRoute ? (
                  <Text className="text-white font-bold text-sm">{index + 1}</Text>
                ) : (
                  <MapPin color="#ffffff" size={16} />
                )}
              </View>
            </Marker>
          ))}

          {/* Route Polyline */}
          {optimizedRoute && (
            <Polyline
              coordinates={optimizedRoute.polyline.map(([lng, lat]) => ({
                latitude: lat,
                longitude: lng,
              }))}
              strokeColor="#0ea5e9"
              strokeWidth={4}
            />
          )}
        </MapView>

        {/* Route Details */}
        <ScrollView className="flex-1 bg-white rounded-t-3xl -mt-6 pt-4">
          {/* Summary */}
          {optimizedRoute && (
            <View className="mx-4 mb-4 bg-primary-50 rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <View className="items-center flex-1">
                  <View className="flex-row items-center">
                    <Navigation color="#0ea5e9" size={16} />
                    <Text className="text-primary-700 font-bold ml-1">
                      {formatDistance(optimizedRoute.totalDistance)}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-xs">Total Distance</Text>
                </View>
                <View className="items-center flex-1">
                  <View className="flex-row items-center">
                    <Clock color="#8b5cf6" size={16} />
                    <Text className="text-purple-700 font-bold ml-1">
                      {formatDuration(optimizedRoute.totalDuration)}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-xs">Est. Travel Time</Text>
                </View>
                <View className="items-center flex-1">
                  <View className="flex-row items-center">
                    <Fuel color="#f59e0b" size={16} />
                    <Text className="text-amber-700 font-bold ml-1">
                      ${optimizedRoute.fuelCost.toFixed(2)}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-xs">Est. Fuel Cost</Text>
                </View>
              </View>
            </View>
          )}

          {/* Jobs List */}
          <View className="px-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">
                {optimizedRoute ? 'Optimized Route' : 'Jobs for Today'}
              </Text>
              {optimizedRoute && (
                <TouchableOpacity onPress={resetRoute} className="flex-row items-center">
                  <RotateCcw color="#6b7280" size={16} />
                  <Text className="text-gray-500 text-sm ml-1">Reset</Text>
                </TouchableOpacity>
              )}
            </View>

            {(optimizedRoute ? optimizedRoute.stops.slice(1) : mockJobs).map((job, index) => (
              <TouchableOpacity
                key={job.id}
                onPress={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                className="bg-gray-50 rounded-xl mb-3 overflow-hidden"
              >
                <View className="p-4 flex-row items-center">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: urgencyColors[job.urgency || 'normal'] }}
                  >
                    {optimizedRoute ? (
                      <Text className="text-white font-bold">{index + 1}</Text>
                    ) : (
                      <MapPin color="#ffffff" size={20} />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold">{job.name}</Text>
                    <Text className="text-gray-500 text-sm">{job.address}</Text>
                  </View>
                  {expandedJob === job.id ? (
                    <ChevronUp color="#9ca3af" size={20} />
                  ) : (
                    <ChevronDown color="#9ca3af" size={20} />
                  )}
                </View>

                {expandedJob === job.id && (
                  <View className="px-4 pb-4 pt-0">
                    <View className="bg-white rounded-lg p-3">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Est. Duration</Text>
                        <Text className="text-gray-900 font-medium">
                          {job.estimatedDuration ? formatDuration(job.estimatedDuration * 60) : 'N/A'}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-gray-600">Urgency</Text>
                        <View
                          className="px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: urgencyColors[job.urgency || 'normal'] + '20' }}
                        >
                          <Text style={{ color: urgencyColors[job.urgency || 'normal'] }} className="text-sm font-medium">
                            {(job.urgency || 'normal').charAt(0).toUpperCase() + (job.urgency || 'normal').slice(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Optimize Button */}
          <View className="px-4 pb-6">
            <TouchableOpacity
              onPress={optimizedRoute ? resetRoute : optimizeRoute}
              className={`py-4 rounded-xl items-center flex-row justify-center ${optimizedRoute ? 'bg-gray-200' : 'bg-primary-500'}`}
              disabled={isOptimizing}
            >
              {isOptimizing ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Navigation color={optimizedRoute ? '#374151' : '#ffffff'} size={20} />
                  <Text className={`font-bold text-lg ml-2 ${optimizedRoute ? 'text-gray-700' : 'text-white'}`}>
                    {optimizedRoute ? 'Reset Route' : 'Optimize Route'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
