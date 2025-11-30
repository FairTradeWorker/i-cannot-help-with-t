// Job Details Screen - Enhanced with API Integration
// View job details, bids, and interact with job

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  ArrowLeft, MapPin, Clock, DollarSign, User, MessageCircle, 
  CheckCircle, AlertCircle, Calendar, Briefcase, Video, Send
} from 'lucide-react-native';
import { BidCard } from '@/components/BidCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { jobsService } from '@/services/jobs.service';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { calculateJobDistance } from '@/utils/job-filters';
import type { Job, Bid } from '@/types';

interface RouteParams {
  jobId: string;
}

export default function JobDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = (route.params as RouteParams) || {};
  const { user } = useAuth();
  const { location } = useLocation(true);
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      const jobData = await jobsService.getJobById(jobId);
      setJob(jobData);
    } catch (error) {
      console.error('Failed to load job:', error);
      Alert.alert('Error', 'Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJob();
    setRefreshing(false);
  };

  const handleSubmitBid = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to submit a bid');
      navigation.navigate('Login' as never);
      return;
    }

    if (user.role !== 'contractor') {
      Alert.alert('Error', 'Only contractors can submit bids');
      return;
    }

    navigation.navigate('SubmitBid' as never, { jobId } as never);
  };

  const handleContact = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to contact the homeowner');
      navigation.navigate('Login' as never);
      return;
    }

    navigation.navigate('Messages' as never, { jobId } as never);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimeAgo = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    const minutes = Math.floor(diff / 60000);
    return minutes > 0 ? `${minutes}m ago` : 'Just now';
  };

  if (loading) {
    return <LoadingSpinner message="Loading job details..." />;
  }

  if (!job) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
        <EmptyState
          type="jobs"
          title="Job Not Found"
          message="This job doesn't exist or has been removed."
          actionLabel="Go Back"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const isHomeowner = user?.id === job.homeownerId;
  const isContractor = user?.role === 'contractor';
  const distance = location ? calculateJobDistance(job, location) : null;
  const urgencyColors = {
    normal: 'bg-green-100 text-green-700',
    urgent: 'bg-yellow-100 text-yellow-700',
    emergency: 'bg-red-100 text-red-700',
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 flex-1">Job Details</Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Job Header */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 border border-gray-200">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-2xl font-bold text-gray-900 mb-2">{job.title}</Text>
              <View className={`self-start px-3 py-1 rounded-full ${urgencyColors[job.urgency || 'normal']}`}>
                <Text className={`text-xs font-semibold uppercase ${urgencyColors[job.urgency || 'normal']}`}>
                  {job.urgency || 'Normal'}
                </Text>
              </View>
            </View>
          </View>

          {job.description && (
            <Text className="text-base text-gray-700 mb-4">{job.description}</Text>
          )}

          {/* Details */}
          <View className="space-y-3">
            <View className="flex-row items-center">
              <MapPin size={18} color="#6b7280" />
              <Text className="text-sm text-gray-600 ml-2 flex-1">
                {job.address.city}, {job.address.state} {job.address.zip}
                {distance && ` • ${distance.toFixed(1)} mi away`}
              </Text>
            </View>

            {job.scope?.estimatedCost && (
              <View className="flex-row items-center">
                <DollarSign size={18} color="#22c55e" />
                <Text className="text-base font-bold text-gray-900 ml-2">
                  ${job.scope.estimatedCost.min.toLocaleString()} - ${job.scope.estimatedCost.max.toLocaleString()}
                </Text>
              </View>
            )}

            {job.scope?.laborHours && (
              <View className="flex-row items-center">
                <Clock size={18} color="#6b7280" />
                <Text className="text-sm text-gray-600 ml-2">
                  Estimated {job.scope.laborHours} hours
                </Text>
              </View>
            )}

            <View className="flex-row items-center">
              <Calendar size={18} color="#6b7280" />
              <Text className="text-sm text-gray-600 ml-2">
                Posted {formatTimeAgo(job.createdAt)}
              </Text>
            </View>

            {job.videoUrl && (
              <View className="flex-row items-center">
                <Video size={18} color="#0ea5e9" />
                <Text className="text-sm text-blue-600 ml-2">Video available</Text>
              </View>
            )}
          </View>
        </View>

        {/* Job Scope */}
        {job.scope && (
          <View className="bg-white mx-4 mt-4 rounded-xl p-4 border border-gray-200">
            <Text className="text-lg font-bold text-gray-900 mb-3">Job Scope</Text>
            <Text className="text-base text-gray-700 mb-4">{job.scope.summary}</Text>

            {job.scope.materials && job.scope.materials.length > 0 && (
              <View className="mt-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Materials Needed</Text>
                {job.scope.materials.map((material, index) => (
                  <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-900">{material.name}</Text>
                      <Text className="text-xs text-gray-600">
                        {material.quantity} {material.unit}
                      </Text>
                    </View>
                    <Text className="text-sm font-semibold text-gray-900">
                      ${material.estimatedCost.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Bids Section */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 border border-gray-200">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Bids ({job.bids?.length || 0})
            </Text>
            {isContractor && !isHomeowner && job.status === 'posted' && (
              <TouchableOpacity
                onPress={handleSubmitBid}
                className="bg-primary-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold text-sm">Submit Bid</Text>
              </TouchableOpacity>
            )}
          </View>

          {job.bids && job.bids.length > 0 ? (
            job.bids
              .filter((bid: Bid) => bid.status === 'pending' || bid.status === 'accepted')
              .sort((a: Bid, b: Bid) => (a.amount || 0) - (b.amount || 0))
              .map((bid: Bid) => (
                <BidCard
                  key={bid.id}
                  bid={bid}
                  onPress={() => {
                    // Navigate to bid details or contractor profile
                  }}
                />
              ))
          ) : (
            <View className="py-8 items-center">
              <Briefcase size={48} color="#9ca3af" />
              <Text className="text-gray-500 text-base mt-4">No bids yet</Text>
              {isContractor && job.status === 'posted' && (
                <TouchableOpacity
                  onPress={handleSubmitBid}
                  className="mt-4 bg-primary-500 px-6 py-2 rounded-lg"
                >
                  <Text className="text-white font-semibold">Be the first to bid</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {!isHomeowner && (
        <View className="bg-white border-t border-gray-200 px-4 py-4">
          {isContractor && job.status === 'posted' ? (
            <TouchableOpacity
              onPress={handleSubmitBid}
              className="bg-primary-500 py-4 rounded-xl items-center flex-row justify-center"
            >
              <DollarSign size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-2">Submit Bid</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleContact}
              className="bg-primary-500 py-4 rounded-xl items-center flex-row justify-center"
            >
              <MessageCircle size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-2">Contact Homeowner</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
