import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Badge, Button, Avatar } from '@/components/ui';
import { dataStore } from '@/lib/store';
import type { User, Job } from '@/types';

type DashboardType = 'homeowner' | 'contractor' | 'operator' | 'earnings' | 'analytics';

export default function DashboardScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [type]);

  const loadData = async () => {
    const currentUser = await dataStore.getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      if (type === 'homeowner') {
        const userJobs = await dataStore.getJobsForHomeowner(currentUser.id);
        setJobs(userJobs);
      } else if (type === 'contractor') {
        const contractorJobs = await dataStore.getJobsForContractor(currentUser.id);
        setJobs(contractorJobs);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getTitle = () => {
    switch (type) {
      case 'contractor':
        return 'Contractor Dashboard';
      case 'operator':
        return 'Operator Dashboard';
      case 'earnings':
        return 'Earnings';
      case 'analytics':
        return 'Analytics';
      default:
        return 'Homeowner Dashboard';
    }
  };

  const renderHomeownerDashboard = () => (
    <>
      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.primary, borderRadius: borderRadius.xl }]}
            onPress={() => router.push('/post-job/video')}
          >
            <Ionicons name="videocam" size={28} color="#fff" />
            <Text style={styles.actionText}>Post Video Job</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.secondary, borderRadius: borderRadius.xl }]}
            onPress={() => router.push('/post-job/photo')}
          >
            <Ionicons name="camera" size={28} color="#fff" />
            <Text style={styles.actionText}>Post Photo Job</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.accent, borderRadius: borderRadius.xl }]}
            onPress={() => router.push('/post-job/text')}
          >
            <Ionicons name="document-text" size={28} color="#fff" />
            <Text style={styles.actionText}>Post Text Job</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.muted, borderRadius: borderRadius.xl }]}
            onPress={() => router.push('/(tabs)/messages')}
          >
            <Ionicons name="chatbubbles" size={28} color={colors.foreground} />
            <Text style={[styles.actionText, { color: colors.foreground }]}>Messages</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
        <View style={styles.statsRow}>
          <Card variant="glass" style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{jobs.length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total Jobs</Text>
          </Card>
          <Card variant="glass" style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.secondary }]}>
              {jobs.filter((j) => j.status === 'in_progress').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>In Progress</Text>
          </Card>
          <Card variant="glass" style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {jobs.filter((j) => j.status === 'completed').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Completed</Text>
          </Card>
        </View>
      </Animated.View>

      {/* Recent Jobs */}
      <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Jobs</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {jobs.length > 0 ? (
          jobs.slice(0, 5).map((job) => (
            <TouchableOpacity
              key={job.id}
              style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl }]}
              onPress={() => router.push(`/job/${job.id}`)}
            >
              <View style={styles.jobHeader}>
                <Text style={[styles.jobTitle, { color: colors.foreground }]} numberOfLines={1}>
                  {job.title}
                </Text>
                <Badge
                  variant={
                    job.status === 'completed'
                      ? 'success'
                      : job.status === 'in_progress'
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                >
                  {job.status.replace('_', ' ')}
                </Badge>
              </View>
              <View style={styles.jobMeta}>
                <View style={styles.jobMetaItem}>
                  <Ionicons name="location-outline" size={16} color={colors.mutedForeground} />
                  <Text style={[styles.jobMetaText, { color: colors.mutedForeground }]}>
                    {job.address.city}, {job.address.state}
                  </Text>
                </View>
                <View style={styles.jobMetaItem}>
                  <Ionicons name="people-outline" size={16} color={colors.mutedForeground} />
                  <Text style={[styles.jobMetaText, { color: colors.mutedForeground }]}>
                    {job.bids.length} bids
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Card variant="glass" style={styles.emptyCard}>
            <Ionicons name="briefcase-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Jobs Yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Post your first job to get started
            </Text>
            <Button onPress={() => router.push('/post-job/video')} style={styles.emptyButton}>
              Post a Job
            </Button>
          </Card>
        )}
      </Animated.View>
    </>
  );

  const renderContractorDashboard = () => (
    <>
      {/* Earnings Summary */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
        <Card variant="glass" style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <View>
              <Text style={[styles.earningsLabel, { color: colors.mutedForeground }]}>
                Available Balance
              </Text>
              <Text style={[styles.earningsValue, { color: colors.foreground }]}>$2,450.00</Text>
            </View>
            <Button variant="default" size="sm" onPress={() => router.push('/payout')}>
              Withdraw
            </Button>
          </View>
          <View style={styles.earningsRow}>
            <View style={styles.earningsItem}>
              <Text style={[styles.earningsItemValue, { color: colors.secondary }]}>$12,500</Text>
              <Text style={[styles.earningsItemLabel, { color: colors.mutedForeground }]}>
                This Month
              </Text>
            </View>
            <View style={styles.earningsItem}>
              <Text style={[styles.earningsItemValue, { color: colors.accent }]}>$850</Text>
              <Text style={[styles.earningsItemLabel, { color: colors.mutedForeground }]}>
                Pending
              </Text>
            </View>
            <View style={styles.earningsItem}>
              <Text style={[styles.earningsItemValue, { color: colors.primary }]}>15</Text>
              <Text style={[styles.earningsItemLabel, { color: colors.mutedForeground }]}>
                Jobs Done
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.primary, borderRadius: borderRadius.xl }]}
            onPress={() => router.push('/(tabs)/jobs')}
          >
            <Ionicons name="search" size={28} color="#fff" />
            <Text style={styles.actionText}>Find Jobs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.secondary, borderRadius: borderRadius.xl }]}
            onPress={() => router.push('/route-optimizer')}
          >
            <Ionicons name="navigate" size={28} color="#fff" />
            <Text style={styles.actionText}>Route Planner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.accent, borderRadius: borderRadius.xl }]}
            onPress={() => router.push('/territories')}
          >
            <Ionicons name="map" size={28} color="#fff" />
            <Text style={styles.actionText}>Territories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.muted, borderRadius: borderRadius.xl }]}
            onPress={() => router.push('/(tabs)/messages')}
          >
            <Ionicons name="chatbubbles" size={28} color={colors.foreground} />
            <Text style={[styles.actionText, { color: colors.foreground }]}>Messages</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Active Jobs */}
      <Animated.View entering={FadeInDown.delay(400)} style={[styles.section, styles.lastSection]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Jobs</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <Card variant="glass" style={styles.emptyCard}>
          <Ionicons name="hammer-outline" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Active Jobs</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Browse available jobs and start bidding
          </Text>
          <Button onPress={() => router.push('/(tabs)/jobs')} style={styles.emptyButton}>
            Find Jobs
          </Button>
        </Card>
      </Animated.View>
    </>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: getTitle(),
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
        >
          {/* User Header */}
          <Animated.View entering={FadeIn.delay(100)} style={styles.userHeader}>
            <Avatar source={user?.avatar} name={user?.name} size="lg" />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.foreground }]}>{user?.name || 'User'}</Text>
              <Badge variant={type === 'contractor' ? 'default' : 'secondary'}>
                {type === 'contractor' ? 'Contractor' : 'Homeowner'}
              </Badge>
            </View>
          </Animated.View>

          {type === 'contractor' ? renderContractorDashboard() : renderHomeownerDashboard()}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    padding: 20,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  earningsCard: {
    padding: 20,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  earningsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningsItem: {
    alignItems: 'center',
  },
  earningsItemValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  earningsItemLabel: {
    fontSize: 12,
    marginTop: 2,
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
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  jobMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  jobMetaItem: {
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
    marginBottom: 20,
  },
  emptyButton: {
    marginTop: 8,
  },
});
