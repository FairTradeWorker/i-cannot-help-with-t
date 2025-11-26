import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Badge, Button } from '@/components/ui';
import type { Job } from '@/types';
import { dataStore } from '@/lib/store';

const { width } = Dimensions.get('window');

interface RouteStop {
  id: string;
  job: Job;
  order: number;
  estimatedArrival: string;
  estimatedDuration: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export default function RouteOptimizerScreen() {
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [routeOptimized, setRouteOptimized] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteStop[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const user = await dataStore.getCurrentUser();
    if (user) {
      const contractorJobs = await dataStore.getJobsForContractor(user.id);
      const inProgressJobs = contractorJobs.filter(
        (j) => j.status === 'assigned' || j.status === 'in_progress'
      );
      setJobs(inProgressJobs);
    }
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
    setRouteOptimized(false);
  };

  const optimizeRoute = () => {
    // Simulate route optimization
    const selectedJobsData = jobs.filter((j) => selectedJobs.includes(j.id));
    const stops: RouteStop[] = selectedJobsData.map((job, index) => ({
      id: `stop-${index}`,
      job,
      order: index + 1,
      estimatedArrival: `${8 + index}:00 AM`,
      estimatedDuration: `${job.laborHours} hours`,
      status: 'pending',
    }));
    setOptimizedRoute(stops);
    setRouteOptimized(true);
  };

  const routeStats = {
    totalDistance: '23.5 mi',
    totalTime: '4h 30m',
    fuelCost: '$12.50',
    earnings: '$1,850',
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Route Optimizer',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Map Preview */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <Card variant="glass" style={styles.mapCard}>
              <View style={[styles.mapPlaceholder, { backgroundColor: colors.muted, borderRadius: borderRadius.xl }]}>
                <Ionicons name="map" size={48} color={colors.mutedForeground} />
                <Text style={[styles.mapText, { color: colors.mutedForeground }]}>
                  Route Map
                </Text>
                {routeOptimized && (
                  <View style={styles.routeInfo}>
                    <Badge variant="success">Optimized</Badge>
                    <Text style={[styles.routeDistance, { color: colors.foreground }]}>
                      {routeStats.totalDistance} • {routeStats.totalTime}
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          </Animated.View>

          {/* Stats Cards */}
          {routeOptimized && (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
                  ]}
                >
                  <Ionicons name="navigate" size={24} color={colors.primary} />
                  <Text style={[styles.statValue, { color: colors.foreground }]}>{routeStats.totalDistance}</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Distance</Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
                  ]}
                >
                  <Ionicons name="time" size={24} color={colors.secondary} />
                  <Text style={[styles.statValue, { color: colors.foreground }]}>{routeStats.totalTime}</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Duration</Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
                  ]}
                >
                  <Ionicons name="car" size={24} color={colors.accent} />
                  <Text style={[styles.statValue, { color: colors.foreground }]}>{routeStats.fuelCost}</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Fuel Cost</Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
                  ]}
                >
                  <Ionicons name="cash" size={24} color={colors.primary} />
                  <Text style={[styles.statValue, { color: colors.foreground }]}>{routeStats.earnings}</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Earnings</Text>
                </View>
              </ScrollView>
            </Animated.View>
          )}

          {/* Optimized Route */}
          {routeOptimized && optimizedRoute.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Optimized Route
              </Text>
              {optimizedRoute.map((stop, index) => (
                <View key={stop.id} style={styles.stopContainer}>
                  {index > 0 && (
                    <View style={[styles.routeLine, { backgroundColor: colors.primary }]} />
                  )}
                  <TouchableOpacity
                    style={[
                      styles.stopCard,
                      { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
                    ]}
                    onPress={() => router.push(`/job/${stop.job.id}`)}
                  >
                    <View style={[styles.stopNumber, { backgroundColor: colors.primary }]}>
                      <Text style={styles.stopNumberText}>{stop.order}</Text>
                    </View>
                    <View style={styles.stopInfo}>
                      <Text style={[styles.stopTitle, { color: colors.foreground }]} numberOfLines={1}>
                        {stop.job.title}
                      </Text>
                      <Text style={[styles.stopAddress, { color: colors.mutedForeground }]}>
                        {stop.job.address.city}, {stop.job.address.state}
                      </Text>
                      <View style={styles.stopMeta}>
                        <View style={styles.stopMetaItem}>
                          <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
                          <Text style={[styles.stopMetaText, { color: colors.mutedForeground }]}>
                            {stop.estimatedArrival}
                          </Text>
                        </View>
                        <View style={styles.stopMetaItem}>
                          <Ionicons name="hourglass-outline" size={14} color={colors.mutedForeground} />
                          <Text style={[styles.stopMetaText, { color: colors.mutedForeground }]}>
                            {stop.estimatedDuration}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
                  </TouchableOpacity>
                </View>
              ))}
            </Animated.View>
          )}

          {/* Select Jobs */}
          <Animated.View entering={FadeInDown.delay(routeOptimized ? 400 : 200)} style={[styles.section, styles.lastSection]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {routeOptimized ? 'All Jobs' : 'Select Jobs to Optimize'}
            </Text>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  style={[
                    styles.jobCard,
                    {
                      backgroundColor: selectedJobs.includes(job.id) ? colors.primary + '15' : colors.card,
                      borderColor: selectedJobs.includes(job.id) ? colors.primary : colors.cardBorder,
                      borderRadius: borderRadius.xl,
                    },
                  ]}
                  onPress={() => toggleJobSelection(job.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: selectedJobs.includes(job.id) ? colors.primary : 'transparent',
                        borderColor: selectedJobs.includes(job.id) ? colors.primary : colors.border,
                        borderRadius: borderRadius.md,
                      },
                    ]}
                  >
                    {selectedJobs.includes(job.id) && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <View style={styles.jobInfo}>
                    <Text style={[styles.jobTitle, { color: colors.foreground }]} numberOfLines={1}>
                      {job.title}
                    </Text>
                    <View style={styles.jobMeta}>
                      <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
                      <Text style={[styles.jobMetaText, { color: colors.mutedForeground }]}>
                        {job.address.city}, {job.address.state}
                      </Text>
                    </View>
                  </View>
                  <Badge
                    variant={job.status === 'in_progress' ? 'default' : 'outline'}
                    size="sm"
                  >
                    {job.status.replace('_', ' ')}
                  </Badge>
                </TouchableOpacity>
              ))
            ) : (
              <Card variant="glass" style={styles.emptyCard}>
                <Ionicons name="car-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Assigned Jobs</Text>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Accept bids on jobs to start planning routes
                </Text>
              </Card>
            )}
          </Animated.View>
        </ScrollView>

        {/* Optimize Button */}
        {selectedJobs.length > 0 && !routeOptimized && (
          <Animated.View entering={FadeIn} style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
            <Text style={[styles.selectedCount, { color: colors.mutedForeground }]}>
              {selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''} selected
            </Text>
            <Button onPress={optimizeRoute}>
              Optimize Route
            </Button>
          </Animated.View>
        )}

        {/* Start Route Button */}
        {routeOptimized && (
          <Animated.View entering={FadeIn} style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
            <Button
              variant="outline"
              onPress={() => {
                setRouteOptimized(false);
                setSelectedJobs([]);
              }}
            >
              Clear Route
            </Button>
            <Button onPress={() => {/* Navigate to first stop */}}>
              Start Navigation
            </Button>
          </Animated.View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 120,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  mapCard: {
    padding: 0,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 14,
    marginTop: 8,
  },
  routeInfo: {
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  routeDistance: {
    fontSize: 16,
    fontWeight: '600',
  },
  statCard: {
    padding: 16,
    marginRight: 12,
    width: width * 0.35,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  stopContainer: {
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    left: 19,
    top: -12,
    width: 2,
    height: 12,
  },
  stopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  stopNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  stopInfo: {
    flex: 1,
    marginLeft: 12,
  },
  stopTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  stopAddress: {
    fontSize: 13,
    marginBottom: 6,
  },
  stopMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  stopMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stopMetaText: {
    fontSize: 12,
  },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobInfo: {
    flex: 1,
    marginLeft: 12,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobMetaText: {
    fontSize: 13,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    gap: 12,
  },
  selectedCount: {
    fontSize: 14,
    flex: 1,
  },
});
