// Enhanced Jobs Screen with filtering and location
// Browse, filter, and search jobs with real-time updates

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Modal, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, Filter, MapPin, Clock, DollarSign, Star, ChevronRight, X, Send, SlidersHorizontal } from 'lucide-react-native';
import { JobCard } from '@/components/JobCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { dataStore } from '@fairtradeworker/shared';
import { useLocation } from '@/hooks/useLocation';
import { useJobs } from '@/hooks/useJobs';
import { filterJobs, calculateJobDistance, type JobFilters } from '@/utils/job-filters';
import type { Job, Bid, UrgencyLevel } from '@/types';

export default function JobsScreen() {
  const navigation = useNavigation();
  const { location } = useLocation(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<UrgencyLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'date' | 'urgency'>('date');
  const [showFilters, setShowFilters] = useState(false);

  const filters: JobFilters = {
    searchQuery,
    urgency: filterUrgency !== 'all' ? filterUrgency : undefined,
    sortBy,
    sortOrder: 'desc',
  };

  const { jobs, loading, stats, refresh } = useJobs({
    filters,
    autoRefresh: false,
  });

  // Add distance to jobs for display
  const jobsWithDistance = jobs.map(job => {
    const distance = location ? calculateJobDistance(job, location) : null;
    return { ...job, distance };
  });

  const onRefresh = async () => {
    await refresh();
  };

  const handleJobPress = (job: Job) => {
    navigation.navigate('JobDetails' as never, { jobId: job.id } as never);
  };

  const urgencyOptions: Array<UrgencyLevel | 'all'> = ['all', 'normal', 'urgent', 'emergency'];

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      {/* Search and Filter Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center gap-3 mb-3">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-2 text-gray-900"
              placeholder="Search jobs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg ${showFilters ? 'bg-primary-100' : 'bg-gray-100'}`}
          >
            <SlidersHorizontal size={20} color={showFilters ? '#0ea5e9' : '#6b7280'} />
          </TouchableOpacity>
        </View>

        {/* Active Filters */}
        {(filterUrgency !== 'all' || searchQuery) && (
          <View className="flex-row flex-wrap gap-2">
            {searchQuery && (
              <View className="bg-primary-100 px-3 py-1 rounded-full flex-row items-center">
                <Text className="text-primary-700 text-xs font-medium">Search: {searchQuery}</Text>
                <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
                  <X size={14} color="#0ea5e9" />
                </TouchableOpacity>
              </View>
            )}
            {filterUrgency !== 'all' && (
              <View className="bg-primary-100 px-3 py-1 rounded-full flex-row items-center">
                <Text className="text-primary-700 text-xs font-medium capitalize">{filterUrgency}</Text>
                <TouchableOpacity onPress={() => setFilterUrgency('all')} className="ml-2">
                  <X size={14} color="#0ea5e9" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <View className="mt-3 bg-gray-50 rounded-lg p-4">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Filter By Urgency</Text>
            <View className="flex-row flex-wrap gap-2">
              {urgencyOptions.map((urgency) => (
                <TouchableOpacity
                  key={urgency}
                  onPress={() => setFilterUrgency(urgency)}
                  className={`px-4 py-2 rounded-full ${
                    filterUrgency === urgency
                      ? 'bg-primary-500'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium capitalize ${
                      filterUrgency === urgency ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {urgency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-sm font-semibold text-gray-700 mb-3 mt-4">Sort By</Text>
            <View className="flex-row flex-wrap gap-2">
              {['date', 'distance', 'price', 'urgency'].map((sort) => (
                <TouchableOpacity
                  key={sort}
                  onPress={() => setSortBy(sort as any)}
                  className={`px-4 py-2 rounded-full ${
                    sortBy === sort
                      ? 'bg-primary-500'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium capitalize ${
                      sortBy === sort ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {sort}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Stats */}
      {stats.total > 0 && (
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <Text className="text-sm text-gray-600">
            Showing {jobsWithDistance.length} job{jobsWithDistance.length !== 1 ? 's' : ''}
            {stats.urgent > 0 && ` • ${stats.urgent} urgent`}
          </Text>
        </View>
      )}

      {/* Jobs List */}
      {loading ? (
        <LoadingSpinner message="Loading jobs..." />
      ) : jobsWithDistance.length === 0 ? (
        <EmptyState
          type="jobs"
          title={searchQuery || filterUrgency !== 'all' ? 'No Jobs Found' : 'No Jobs Available'}
          message={
            searchQuery || filterUrgency !== 'all'
              ? 'Try adjusting your search or filters'
              : 'There are no jobs available at the moment. Check back later!'
          }
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setFilterUrgency('all');
          }}
        />
      ) : (
        <FlatList
          data={jobsWithDistance}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => handleJobPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}
