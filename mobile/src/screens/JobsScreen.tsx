import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Modal, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, Filter, MapPin, Clock, DollarSign, Star, ChevronRight, X, Send } from 'lucide-react-native';
import { JobCard } from '@/components/JobCard';
import { dataStore } from '@fairtradeworker/shared';
import type { Job, Bid, UrgencyLevel } from '@/types';

interface JobListItem {
  id: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  address: { city: string; state: string };
  estimatedCost: { min: number; max: number };
  laborHours: number;
  createdAt: Date;
  bidsCount: number;
  distance?: number;
}

const mockJobs: JobListItem[] = [
  {
    id: '1',
    title: 'Kitchen Faucet Replacement',
    description: 'Need to replace old kitchen faucet with a new one. Water pressure is low and there\'s some rust.',
    urgency: 'normal',
    address: { city: 'Austin', state: 'TX' },
    estimatedCost: { min: 250, max: 400 },
    laborHours: 2,
    createdAt: new Date(),
    bidsCount: 3,
    distance: 2.5,
  },
  {
    id: '2',
    title: 'Electrical Panel Upgrade',
    description: 'Upgrade from 100A to 200A panel. Home is 40 years old and needs more capacity for EV charger.',
    urgency: 'urgent',
    address: { city: 'Round Rock', state: 'TX' },
    estimatedCost: { min: 1500, max: 2500 },
    laborHours: 8,
    createdAt: new Date(Date.now() - 86400000),
    bidsCount: 5,
    distance: 8.2,
  },
  {
    id: '3',
    title: 'Roof Leak Repair',
    description: 'Water is leaking in the attic area. Noticed after recent storm. Need immediate attention.',
    urgency: 'emergency',
    address: { city: 'Cedar Park', state: 'TX' },
    estimatedCost: { min: 500, max: 1200 },
    laborHours: 4,
    createdAt: new Date(Date.now() - 3600000),
    bidsCount: 8,
    distance: 5.7,
  },
  {
    id: '4',
    title: 'HVAC Maintenance',
    description: 'Annual AC maintenance and filter replacement. System is about 5 years old.',
    urgency: 'normal',
    address: { city: 'Pflugerville', state: 'TX' },
    estimatedCost: { min: 150, max: 250 },
    laborHours: 1,
    createdAt: new Date(Date.now() - 172800000),
    bidsCount: 2,
    distance: 12.3,
  },
];

const urgencyColors: Record<UrgencyLevel, { bg: string; text: string }> = {
  normal: { bg: 'bg-green-100', text: 'text-green-700' },
  urgent: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  emergency: { bg: 'bg-red-100', text: 'text-red-700' },
};

export default function JobsScreen() {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<UrgencyLevel | 'all'>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const allJobs = await dataStore.getAvailableJobs();
      setJobs(allJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      Alert.alert('Error', 'Failed to load jobs. Please try again.');
      // Fallback to mock data if API fails
      setJobs(mockJobs as any);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.address.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = filterUrgency === 'all' || job.urgency === filterUrgency;
    return matchesSearch && matchesUrgency;
  });

  const handleSubmitBid = () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid bid amount');
      return;
    }

    Alert.alert(
      'Bid Submitted!',
      `Your bid of $${bidAmount} has been submitted for "${selectedJob?.title}". You'll be notified when the homeowner responds.`,
      [{ text: 'OK', onPress: () => {
        setBidModalVisible(false);
        setBidAmount('');
        setBidMessage('');
        setSelectedJob(null);
      }}]
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <JobCard
      job={item}
      onPress={() => {
        // Navigate to JobDetailsScreen
        navigation.navigate('JobDetails' as never, { jobId: item.id } as never);
      }}
    />
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading jobs...</Text>
      </SafeAreaView>
    );
  }

  const renderJobCardOld = ({ item }: { item: JobListItem }) => (
    <TouchableOpacity
      onPress={() => setSelectedJob(item)}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm"
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>{item.title}</Text>
          <View className="flex-row items-center mt-1">
            <MapPin color="#6b7280" size={14} />
            <Text className="text-gray-500 text-sm ml-1">
              {item.address.city}, {item.address.state} • {item.distance} mi
            </Text>
          </View>
        </View>
        <View className={`px-2 py-1 rounded-full ${urgencyColors[item.urgency].bg}`}>
          <Text className={`text-xs font-medium ${urgencyColors[item.urgency].text}`}>
            {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}
          </Text>
        </View>
      </View>

      <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>{item.description}</Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <DollarSign color="#22c55e" size={16} />
          <Text className="text-gray-900 font-bold ml-1">
            ${item.estimatedCost.min}-${item.estimatedCost.max}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Clock color="#6b7280" size={14} />
          <Text className="text-gray-500 text-sm ml-1">{formatTimeAgo(item.createdAt)}</Text>
        </View>
        <View className="flex-row items-center">
          <Star color="#f59e0b" size={14} />
          <Text className="text-gray-500 text-sm ml-1">{item.bidsCount} bids</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      {/* Search and Filter */}
      <View className="bg-white px-4 py-3 shadow-sm">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-3">
          <Search color="#6b7280" size={20} />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder="Search jobs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['all', 'normal', 'urgent', 'emergency'] as const).map((urgency) => (
            <TouchableOpacity
              key={urgency}
              onPress={() => setFilterUrgency(urgency)}
              className={`px-4 py-2 rounded-full mr-2 ${filterUrgency === urgency ? 'bg-primary-500' : 'bg-gray-100'}`}
            >
              <Text className={`font-medium ${filterUrgency === urgency ? 'text-white' : 'text-gray-600'}`}>
                {urgency === 'all' ? 'All Jobs' : urgency.charAt(0).toUpperCase() + urgency.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Jobs List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-gray-500 text-lg">No jobs found</Text>
          </View>
        }
      />

      {/* Job Details Modal */}
      <Modal
        visible={selectedJob !== null && !bidModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedJob(null)}
      >
        <SafeAreaView className="flex-1 bg-gray-100">
          <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900">Job Details</Text>
            <TouchableOpacity onPress={() => setSelectedJob(null)}>
              <X color="#6b7280" size={24} />
            </TouchableOpacity>
          </View>

          {selectedJob && (
            <ScrollView className="flex-1 p-4">
              <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <Text className="text-xl font-bold text-gray-900 flex-1">{selectedJob.title}</Text>
                  <View className={`px-3 py-1 rounded-full ${urgencyColors[selectedJob.urgency].bg}`}>
                    <Text className={`text-sm font-medium ${urgencyColors[selectedJob.urgency].text}`}>
                      {selectedJob.urgency.charAt(0).toUpperCase() + selectedJob.urgency.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center mb-3">
                  <MapPin color="#6b7280" size={16} />
                  <Text className="text-gray-600 ml-2">
                    {selectedJob.address.city}, {selectedJob.address.state} ({selectedJob.distance} mi away)
                  </Text>
                </View>

                <Text className="text-gray-700">{selectedJob.description}</Text>
              </View>

              <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <Text className="text-lg font-bold text-gray-900 mb-3">Job Details</Text>
                
                <View className="flex-row justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600">Estimated Cost</Text>
                  <Text className="text-gray-900 font-bold">
                    ${selectedJob.estimatedCost.min} - ${selectedJob.estimatedCost.max}
                  </Text>
                </View>
                
                <View className="flex-row justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600">Estimated Hours</Text>
                  <Text className="text-gray-900 font-bold">{selectedJob.laborHours}h</Text>
                </View>
                
                <View className="flex-row justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600">Current Bids</Text>
                  <Text className="text-gray-900 font-bold">{selectedJob.bidsCount}</Text>
                </View>
                
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-600">Posted</Text>
                  <Text className="text-gray-900 font-bold">{formatTimeAgo(selectedJob.createdAt)}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setBidModalVisible(true)}
                className="bg-primary-500 py-4 rounded-xl items-center mb-4"
              >
                <Text className="text-white font-bold text-lg">Submit Bid</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Bid Submission Modal */}
      <Modal
        visible={bidModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setBidModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-100">
          <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900">Submit Bid</Text>
            <TouchableOpacity onPress={() => setBidModalVisible(false)}>
              <X color="#6b7280" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-600 mb-2">Suggested Range</Text>
              <Text className="text-2xl font-bold text-gray-900 mb-4">
                ${selectedJob?.estimatedCost.min} - ${selectedJob?.estimatedCost.max}
              </Text>

              <Text className="text-gray-600 mb-2">Your Bid Amount</Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-4">
                <DollarSign color="#22c55e" size={24} />
                <TextInput
                  className="flex-1 text-2xl font-bold text-gray-900 ml-2"
                  placeholder="0.00"
                  value={bidAmount}
                  onChangeText={setBidAmount}
                  keyboardType="decimal-pad"
                />
              </View>

              <Text className="text-gray-600 mb-2">Message to Homeowner</Text>
              <TextInput
                className="bg-gray-100 rounded-lg p-4 text-gray-900"
                placeholder="Introduce yourself and explain your approach..."
                value={bidMessage}
                onChangeText={setBidMessage}
                multiline
                numberOfLines={4}
                style={{ minHeight: 100, textAlignVertical: 'top' }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmitBid}
              className="bg-primary-500 py-4 rounded-xl items-center flex-row justify-center mb-4"
            >
              <Send color="#ffffff" size={20} />
              <Text className="text-white font-bold text-lg ml-2">Submit Bid</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
