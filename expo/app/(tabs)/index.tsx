import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Badge, Button } from '@/components/ui';
import { dataStore } from '@/lib/store';
import type { User, Job } from '@/types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { colors, borderRadius, shadows, spacing } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await dataStore.getCurrentUser();
    setUser(currentUser);
    const jobs = await dataStore.getAvailableJobs();
    setRecentJobs(jobs.slice(0, 5));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const quickPostOptions = [
    {
      id: 'video',
      title: 'Video',
      icon: 'videocam',
      color: colors.primary,
      badge: 'Recommended',
    },
    {
      id: 'photo',
      title: 'Photo',
      icon: 'camera',
      color: colors.secondary,
      badge: 'Quick',
    },
    {
      id: 'text',
      title: 'Text',
      icon: 'document-text',
      color: colors.accent,
      badge: 'Traditional',
    },
  ];

  const stats = [
    { label: 'Territories', value: '850+', icon: 'map' },
    { label: 'Jobs Available', value: '2.8K+', icon: 'briefcase' },
    { label: 'Contractors', value: '3.5K+', icon: 'people' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              Welcome back,
            </Text>
            <Text style={[styles.userName, { color: colors.foreground }]}>
              {user?.name || 'User'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: colors.muted }]}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.foreground} />
            <View style={[styles.notificationBadge, { backgroundColor: colors.accent }]} />
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Job Post */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Post a Job
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>
            Choose how you'd like to create your job listing
          </Text>
          <View style={styles.quickPostGrid}>
            {quickPostOptions.map((option, index) => (
              <Animated.View
                key={option.id}
                entering={FadeInDown.delay(300 + index * 100)}
                style={styles.quickPostItem}
              >
                <TouchableOpacity
                  style={[
                    styles.quickPostCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.cardBorder,
                      borderRadius: borderRadius.xl,
                    },
                  ]}
                  onPress={() => router.push(`/post-job/${option.id}`)}
                >
                  <Badge variant="secondary" size="sm" style={styles.quickPostBadge}>
                    {option.badge}
                  </Badge>
                  <View
                    style={[
                      styles.quickPostIcon,
                      { backgroundColor: option.color, borderRadius: borderRadius.lg },
                    ]}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={28}
                      color="#fff"
                    />
                  </View>
                  <Text style={[styles.quickPostTitle, { color: colors.foreground }]}>
                    {option.title}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stats.map((stat, index) => (
              <TouchableOpacity
                key={stat.label}
                style={[
                  styles.statCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                    borderRadius: borderRadius['2xl'],
                  },
                ]}
                onPress={() => {
                  if (stat.label === 'Territories') router.push('/territories');
                  if (stat.label === 'Jobs Available') router.push('/(tabs)/jobs');
                }}
              >
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: colors.primary, borderRadius: borderRadius.lg },
                  ]}
                >
                  <Ionicons name={stat.icon as any} size={24} color="#fff" />
                </View>
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  {stat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Territory Map Teaser */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Card variant="glass" style={styles.territoryCard}>
            <View style={styles.territoryHeader}>
              <View>
                <Text style={[styles.territoryTitle, { color: colors.foreground }]}>
                  Explore Territories
                </Text>
                <Text style={[styles.territorySubtitle, { color: colors.mutedForeground }]}>
                  $45/month • Exclusive lead rights
                </Text>
              </View>
              <Ionicons name="map" size={32} color={colors.primary} />
            </View>
            <View style={styles.territoryMap}>
              <View style={[styles.mapPlaceholder, { backgroundColor: colors.muted, borderRadius: borderRadius.xl }]}>
                <Ionicons name="location" size={48} color={colors.mutedForeground} />
                <Text style={[styles.mapText, { color: colors.mutedForeground }]}>
                  Interactive Territory Map
                </Text>
              </View>
            </View>
            <View style={styles.territoryStates}>
              {['CA', 'TX', 'FL', 'NY', '+47 states'].map((state) => (
                <Badge key={state} variant="outline" size="sm">
                  {state}
                </Badge>
              ))}
            </View>
            <Button onPress={() => router.push('/territories')} style={styles.territoryButton}>
              View All Territories
            </Button>
          </Card>
        </Animated.View>

        {/* Recent Jobs */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Recent Jobs
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          {recentJobs.length > 0 ? (
            recentJobs.map((job, index) => (
              <TouchableOpacity
                key={job.id}
                style={[
                  styles.jobCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                    borderRadius: borderRadius.xl,
                  },
                ]}
                onPress={() => router.push(`/job/${job.id}`)}
              >
                <View style={styles.jobHeader}>
                  <Text style={[styles.jobTitle, { color: colors.foreground }]} numberOfLines={1}>
                    {job.title}
                  </Text>
                  <Badge
                    variant={
                      job.urgency === 'emergency'
                        ? 'destructive'
                        : job.urgency === 'urgent'
                        ? 'warning'
                        : 'secondary'
                    }
                    size="sm"
                  >
                    {job.urgency}
                  </Badge>
                </View>
                <View style={styles.jobDetails}>
                  <View style={styles.jobDetail}>
                    <Ionicons name="location-outline" size={16} color={colors.mutedForeground} />
                    <Text style={[styles.jobDetailText, { color: colors.mutedForeground }]}>
                      {job.address.city}, {job.address.state}
                    </Text>
                  </View>
                  <View style={styles.jobDetail}>
                    <Ionicons name="cash-outline" size={16} color={colors.mutedForeground} />
                    <Text style={[styles.jobDetailText, { color: colors.mutedForeground }]}>
                      ${job.estimatedCost.min.toLocaleString()} - ${job.estimatedCost.max.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Card variant="glass" style={styles.emptyCard}>
              <Ionicons name="briefcase-outline" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No jobs available yet
              </Text>
            </Card>
          )}
        </Animated.View>

        {/* Zero Fees Banner */}
        <Animated.View entering={FadeInDown.delay(800)} style={[styles.section, styles.lastSection]}>
          <Card variant="glass" style={[styles.feeBanner, { borderColor: colors.primary }]}>
            <View style={styles.feeHeader}>
              <Text style={[styles.feeTitle, { color: colors.foreground }]}>
                Zero Fees for Contractors
              </Text>
              <Badge variant="secondary">100% Earnings</Badge>
            </View>
            <Text style={[styles.feeDescription, { color: colors.mutedForeground }]}>
              Unlike other platforms that charge 15-30% fees, ServiceHub contractors keep
              100% of their job earnings.
            </Text>
            <View style={styles.feePoints}>
              {[
                'No platform fees for contractors',
                'Keep 100% of job payments',
                'Instant payouts available',
                'Secure escrow protection',
              ].map((point, index) => (
                <View key={index} style={styles.feePoint}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.secondary} />
                  <Text style={[styles.feePointText, { color: colors.foreground }]}>
                    {point}
                  </Text>
                </View>
              ))}
            </View>
            <Button
              variant="default"
              onPress={() => router.push('/contractor-signup')}
              style={styles.feeButton}
            >
              Join as Contractor
            </Button>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickPostGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickPostItem: {
    flex: 1,
  },
  quickPostCard: {
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  quickPostBadge: {
    marginBottom: 12,
  },
  quickPostIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickPostTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  statCard: {
    padding: 20,
    marginRight: 12,
    width: width * 0.4,
    borderWidth: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
  },
  territoryCard: {
    padding: 20,
  },
  territoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  territoryTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  territorySubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  territoryMap: {
    marginBottom: 16,
  },
  mapPlaceholder: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 14,
    marginTop: 8,
  },
  territoryStates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  territoryButton: {
    marginTop: 8,
  },
  jobCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  jobDetails: {
    gap: 8,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobDetailText: {
    fontSize: 14,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  feeBanner: {
    padding: 24,
    borderWidth: 2,
  },
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feeTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  feeDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  feePoints: {
    gap: 12,
    marginBottom: 20,
  },
  feePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feePointText: {
    fontSize: 14,
    fontWeight: '500',
  },
  feeButton: {
    marginTop: 8,
  },
});
