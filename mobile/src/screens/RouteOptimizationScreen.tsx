// Route Optimization Screen
// Optimize contractor routes for multiple jobs

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  Navigation, MapPin, Clock, DollarSign, 
  RefreshCw, Play, CheckCircle, AlertCircle 
} from 'lucide-react-native';
import { MapViewWrapper, Marker, Polyline } from '@/components/MapViewWrapper';
import { dataStore } from '@fairtradeworker/shared';
import type { Job, User as UserType } from '@/types';

interface OptimizedRoute {
  jobs: Job[];
  totalDistance: number; // miles
  totalTime: number; // minutes
  totalEarnings: number;
  waypoints: Array<{ latitude: number; longitude: number }>;
}

export default function RouteOptimizationScreen() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [assignedJobs, setAssignedJobs] = useState<Job[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 30.2672,
    longitude: -97.7431,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await dataStore.getCurrentUser();
      setCurrentUser(user);

      if (user) {
        // Get jobs assigned to contractor
        const allJobs = await dataStore.getJobs();
        const myJobs = allJobs.filter(
          j => j.contractorId === user.id && (j.status === 'assigned' || j.status === 'in_progress')
        );
        setAssignedJobs(myJobs);

        if (myJobs.length > 0) {
          await optimizeRoute(myJobs);
        }
      }
    } catch (error) {
      console.error('Failed to load route data:', error);
    } finally {
      setLoading(false);
    }
  };

  const optimizeRoute = async (jobs: Job[]) => {
    if (jobs.length === 0) return;

    setOptimizing(true);
    try {
      // TODO: Call route optimization API
      // For now, simulate optimization
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Calculate waypoints from job addresses
      const waypoints = jobs.map(job => ({
        latitude: job.address.lat || 30.2672,
        longitude: job.address.lng || -97.7431,
      }));

      // Mock calculations
      const totalDistance = jobs.length * 5.2; // Average distance
      const totalTime = jobs.length * 30; // Average time per job

      const totalEarnings = jobs.reduce((sum, job) => {
        const avgCost = job.scope?.estimatedCost
          ? (job.scope.estimatedCost.min + job.scope.estimatedCost.max) / 2
          : 0;
        return sum + avgCost;
      }, 0);

      setOptimizedRoute({
        jobs,
        totalDistance,
        totalTime,
        totalEarnings,
        waypoints,
      });
    } catch (error) {
      console.error('Failed to optimize route:', error);
      Alert.alert('Error', 'Failed to optimize route. Please try again.');
    } finally {
      setOptimizing(false);
    }
  };

  const handleStartRoute = () => {
    if (!optimizedRoute) return;

    Alert.alert(
      'Start Navigation',
      'Open in maps app for turn-by-turn directions?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Maps',
          onPress: () => {
            // TODO: Open in maps app with waypoints
            Alert.alert('Navigation', 'Maps integration coming soon!');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading route...</Text>
      </SafeAreaView>
    );
  }

  if (assignedJobs.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-900">Route Optimization</Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Navigation size={64} color="#9ca3af" />
          <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
            No Jobs Assigned
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            You need at least one assigned job to optimize a route. Once you have jobs, we'll find the most efficient path!
          </Text>
          <TouchableOpacity
            className="bg-primary-500 px-8 py-3 rounded-full"
            onPress={() => navigation.navigate('Jobs' as never)}
          >
            <Text className="text-white font-semibold">Browse Jobs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900">Optimized Route</Text>
        <TouchableOpacity
          onPress={() => optimizeRoute(assignedJobs)}
          disabled={optimizing}
          className="flex-row items-center"
        >
          <RefreshCw 
            size={20} 
            color="#0ea5e9" 
            className={optimizing ? 'animate-spin' : ''} 
          />
          <Text className="text-primary-500 font-semibold ml-2">
            {optimizing ? 'Optimizing...' : 'Re-optimize'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Route Stats */}
      {optimizedRoute && (
        <View className="bg-white px-4 py-4 mb-4 mt-4">
          <View className="flex-row flex-wrap -m-2">
            <View className="w-1/3 p-2">
              <View className="bg-blue-50 rounded-lg p-3 items-center">
                <Navigation size={20} color="#0ea5e9" />
                <Text className="text-xs text-gray-600 mt-1">Distance</Text>
                <Text className="text-lg font-bold text-gray-900">
                  {optimizedRoute.totalDistance.toFixed(1)} mi
                </Text>
              </View>
            </View>

            <View className="w-1/3 p-2">
              <View className="bg-green-50 rounded-lg p-3 items-center">
                <Clock size={20} color="#22c55e" />
                <Text className="text-xs text-gray-600 mt-1">Time</Text>
                <Text className="text-lg font-bold text-gray-900">
                  {Math.floor(optimizedRoute.totalTime / 60)}h {optimizedRoute.totalTime % 60}m
                </Text>
              </View>
            </View>

            <View className="w-1/3 p-2">
              <View className="bg-purple-50 rounded-lg p-3 items-center">
                <DollarSign size={20} color="#8b5cf6" />
                <Text className="text-xs text-gray-600 mt-1">Earnings</Text>
                <Text className="text-lg font-bold text-gray-900">
                  ${optimizedRoute.totalEarnings.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Map */}
      <View className="flex-1 bg-white mb-4">
        {optimizedRoute && (
          <MapViewWrapper
            style={{ flex: 1 }}
            initialRegion={mapRegion}
            showsUserLocation
            showsMyLocationButton
          >
            {optimizedRoute.waypoints.map((waypoint, index) => (
              <Marker
                key={index}
                coordinate={waypoint}
                title={`Stop ${index + 1}`}
                description={optimizedRoute.jobs[index]?.title}
              >
                <View className="bg-primary-500 rounded-full w-8 h-8 items-center justify-center border-2 border-white">
                  <Text className="text-white font-bold text-xs">{index + 1}</Text>
                </View>
              </Marker>
            ))}

            {optimizedRoute.waypoints.length > 1 && (
              <Polyline
                coordinates={optimizedRoute.waypoints}
                strokeColor="#0ea5e9"
                strokeWidth={3}
              />
            )}
          </MapViewWrapper>
        )}
      </View>

      {/* Route Steps */}
      {optimizedRoute && (
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
          <View className="px-4 py-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Route ({optimizedRoute.jobs.length} stops)
            </Text>

            {optimizedRoute.jobs.map((job, index) => (
              <View
                key={job.id}
                className="flex-row items-start mb-4 pb-4 border-b border-gray-100 last:border-b-0"
              >
                <View className="w-8 h-8 bg-primary-500 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-white font-bold text-sm">{index + 1}</Text>
                </View>

                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900 mb-1">
                    {job.title}
                  </Text>
                  <View className="flex-row items-center mb-2">
                    <MapPin size={14} color="#6b7280" />
                    <Text className="text-sm text-gray-600 ml-1">
                      {job.address.city}, {job.address.state}
                    </Text>
                  </View>
                  {job.scope?.estimatedCost && (
                    <View className="flex-row items-center">
                      <DollarSign size={14} color="#22c55e" />
                      <Text className="text-sm text-green-600 ml-1 font-semibold">
                        ${job.scope.estimatedCost.min.toLocaleString()} - ${job.scope.estimatedCost.max.toLocaleString()}
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('JobDetails' as never, { jobId: job.id } as never);
                  }}
                  className="ml-2"
                >
                  <View className="bg-primary-100 px-3 py-1 rounded-full">
                    <Text className="text-primary-700 text-xs font-semibold">View</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Start Navigation Button */}
      {optimizedRoute && optimizedRoute.jobs.length > 0 && (
        <View className="bg-white border-t border-gray-200 px-4 py-4">
          <TouchableOpacity
            onPress={handleStartRoute}
            className="bg-primary-500 py-4 rounded-xl items-center flex-row justify-center"
          >
            <Play size={20} color="#ffffff" />
            <Text className="text-white font-bold text-lg ml-2">Start Navigation</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

