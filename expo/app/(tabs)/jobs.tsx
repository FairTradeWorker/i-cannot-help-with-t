import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Badge, Button, Input } from '@/components/ui';
import { dataStore } from '@/lib/store';
import type { Job, User } from '@/types';

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'urgent' | 'budget';
type FilterTab = 'all' | 'nearby' | 'urgent' | 'my-jobs';

export default function JobsScreen() {
  const router = useRouter();
  const { colors, borderRadius, spacing } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const currentUser = await dataStore.getCurrentUser();
    setUser(currentUser);
    const allJobs = await dataStore.getJobs();
    setJobs(allJobs);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredJobs = jobs
    .filter((job) => {
      // Tab filter
      switch (activeTab) {
        case 'nearby':
          // In a real app, filter by location
          return job.status === 'posted' || job.status === 'bidding';
        case 'urgent':
          return job.urgency === 'urgent' || job.urgency === 'emergency';
        case 'my-jobs':
          return job.homeownerId === user?.id || job.contractorId === user?.id;
        default:
          return job.status === 'posted' || job.status === 'bidding';
      }
    })
    .filter((job) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.address.city.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'urgent':
          const urgencyOrder = { emergency: 0, urgent: 1, normal: 2 };
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        case 'budget':
          return b.estimatedCost.max - a.estimatedCost.max;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'destructive';
      case 'urgent':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const tabs: { key: FilterTab; label: string; icon: string }[] = [
    { key: 'all', label: 'All Jobs', icon: 'list' },
    { key: 'nearby', label: 'Nearby', icon: 'location' },
    { key: 'urgent', label: 'Urgent', icon: 'flash' },
    { key: 'my-jobs', label: 'My Jobs', icon: 'person' },
  ];

  const renderJobCard = ({ item: job }: { item: Job }) => (
    <TouchableOpacity
      style={[
        styles.jobCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderRadius: borderRadius.xl,
        },
      ]}
      onPress={() => router.push(`/job/${job.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          {job.videoUrl && (
            <Ionicons name="videocam" size={16} color={colors.primary} style={styles.videoIcon} />
          )}
          <Text style={[styles.jobTitle, { color: colors.foreground }]} numberOfLines={2}>
            {job.title}
          </Text>
        </View>
        <Badge variant={getUrgencyColor(job.urgency) as any} size="sm">
          {job.urgency}
        </Badge>
      </View>

      <Text style={[styles.jobDescription, { color: colors.mutedForeground }]} numberOfLines={2}>
        {job.description}
      </Text>

      <View style={styles.jobDetails}>
        <View style={styles.jobDetail}>
          <Ionicons name="location-outline" size={16} color={colors.mutedForeground} />
          <Text style={[styles.jobDetailText, { color: colors.mutedForeground }]}>
            {job.address.city}, {job.address.state}
          </Text>
        </View>
        <View style={styles.jobDetail}>
          <Ionicons name="cash-outline" size={16} color={colors.primary} />
          <Text style={[styles.jobDetailText, { color: colors.primary, fontWeight: '600' }]}>
            ${job.estimatedCost.min.toLocaleString()} - ${job.estimatedCost.max.toLocaleString()}
          </Text>
        </View>
        <View style={styles.jobDetail}>
          <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
          <Text style={[styles.jobDetailText, { color: colors.mutedForeground }]}>
            {job.laborHours} hours estimated
          </Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <View style={styles.bidInfo}>
          <Ionicons name="people-outline" size={16} color={colors.mutedForeground} />
          <Text style={[styles.bidText, { color: colors.mutedForeground }]}>
            {job.bids.length} bid{job.bids.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <Button
          variant="outline"
          size="sm"
          onPress={() => router.push(`/job/${job.id}`)}
        >
          View Details
        </Button>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Jobs
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.muted }]}
            onPress={() => router.push('/territories')}
          >
            <Ionicons name="map-outline" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.muted }]}
            onPress={() => router.push('/route-optimizer')}
          >
            <Ionicons name="navigate-outline" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Search */}
      <Animated.View entering={FadeInDown.delay(150)} style={styles.searchSection}>
        <Input
          placeholder="Search jobs by title, location..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          icon={<Ionicons name="search" size={20} color={colors.mutedForeground} />}
          containerStyle={styles.searchInput}
        />
      </Animated.View>

      {/* Tabs */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                {
                  backgroundColor: activeTab === tab.key ? colors.primary : colors.muted,
                  borderRadius: borderRadius.full,
                },
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={activeTab === tab.key ? '#fff' : colors.foreground}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab.key ? '#fff' : colors.foreground },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Sort & View Toggle */}
      <Animated.View entering={FadeInDown.delay(250)} style={styles.filterBar}>
        <View style={styles.sortButtons}>
          {(['newest', 'urgent', 'budget'] as SortBy[]).map((sort) => (
            <TouchableOpacity
              key={sort}
              style={[
                styles.sortButton,
                {
                  backgroundColor: sortBy === sort ? colors.primary : 'transparent',
                  borderRadius: borderRadius.lg,
                },
              ]}
              onPress={() => setSortBy(sort)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  { color: sortBy === sort ? '#fff' : colors.mutedForeground },
                ]}
              >
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'list' && { backgroundColor: colors.muted },
              { borderRadius: borderRadius.md },
            ]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="list"
              size={20}
              color={viewMode === 'list' ? colors.primary : colors.mutedForeground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'grid' && { backgroundColor: colors.muted },
              { borderRadius: borderRadius.md },
            ]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons
              name="grid"
              size={20}
              color={viewMode === 'grid' ? colors.primary : colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Job Count */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.countSection}>
        <Text style={[styles.countText, { color: colors.mutedForeground }]}>
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </Text>
      </Animated.View>

      {/* Jobs List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.jobsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <Card variant="glass" style={styles.emptyCard}>
            <Ionicons name="briefcase-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No Jobs Found
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {searchTerm
                ? 'Try adjusting your search or filters'
                : activeTab === 'my-jobs'
                ? 'You have no active jobs yet'
                : 'Check back later for new job postings'}
            </Text>
            {activeTab !== 'my-jobs' && (
              <Button
                onPress={() => router.push('/post-job/text')}
                style={styles.emptyButton}
              >
                Post a Job
              </Button>
            )}
          </Card>
        }
      />
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 4,
  },
  viewButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  countText: {
    fontSize: 14,
  },
  jobsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  jobCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  videoIcon: {
    marginRight: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  jobDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  jobDetails: {
    gap: 8,
    marginBottom: 16,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobDetailText: {
    fontSize: 14,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  bidInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bidText: {
    fontSize: 14,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
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
