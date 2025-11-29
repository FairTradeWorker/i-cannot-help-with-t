// Enhanced Job Details Screen
// Full job details with bids, scope, messaging

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  CheckCircle,
  MessageSquare,
  Calendar,
  User
} from 'lucide-react-native';
import { BidCard } from '@/components/BidCard';
import { dataStore } from '@fairtradeworker/shared';
import type { Job, Bid, User as UserType, UrgencyLevel } from '@/types';

interface RouteParams {
  jobId: string;
}

const urgencyColors: Record<UrgencyLevel, { bg: string; text: string }> = {
  normal: { bg: '#dcfce7', text: '#16a34a' },
  urgent: { bg: '#fef3c7', text: '#d97706' },
  emergency: { bg: '#fee2e2', text: '#dc2626' },
};

export default function JobDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = (route.params as RouteParams) || { jobId: '' };

  const [job, setJob] = useState<Job | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    loadData();
  }, [jobId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobData, user] = await Promise.all([
        dataStore.getJobById(jobId),
        dataStore.getCurrentUser(),
      ]);
      
      if (!jobData) {
        Alert.alert('Error', 'Job not found');
        navigation.goBack();
        return;
      }

      setJob(jobData);
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load job details:', error);
      Alert.alert('Error', 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    if (!job || !currentUser) return;

    Alert.alert(
      'Accept Bid',
      'Are you sure you want to accept this bid? This will assign the job to this contractor.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              // Update job status and accept bid
              job.contractorId = job.bids.find(b => b.id === bidId)?.contractorId;
              job.status = 'assigned';
              job.bids.forEach(bid => {
                if (bid.id === bidId) {
                  bid.status = 'accepted';
                } else if (bid.status === 'pending') {
                  bid.status = 'rejected';
                }
              });

              await dataStore.saveJob(job);
              setJob({ ...job });
              
              Alert.alert('Success', 'Bid accepted! The contractor has been notified.');
            } catch (error) {
              console.error('Failed to accept bid:', error);
              Alert.alert('Error', 'Failed to accept bid. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRejectBid = async (bidId: string) => {
    if (!job) return;

    try {
      job.bids.forEach(bid => {
        if (bid.id === bidId) {
          bid.status = 'rejected';
        }
      });

      await dataStore.saveJob(job);
      setJob({ ...job });
    } catch (error) {
      console.error('Failed to reject bid:', error);
      Alert.alert('Error', 'Failed to reject bid. Please try again.');
    }
  };

  const canManageBids = currentUser && job && (
    currentUser.id === job.homeownerId || 
    currentUser.role === 'admin'
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading job details...</Text>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <Text className="text-gray-600">Job not found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 bg-primary-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const urgency = job.urgency || 'normal';
  const colors = urgencyColors[urgency];
  const acceptedBid = job.bids.find(b => b.status === 'accepted');
  const pendingBids = job.bids.filter(b => b.status === 'pending');

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 flex-1">Job Details</Text>
        <TouchableOpacity
          onPress={() => {
            // Navigate to messages
            navigation.navigate('Messages' as never, { jobId: job.id } as never);
          }}
        >
          <MessageSquare size={24} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Job Header */}
        <View className="bg-white px-4 py-6 mb-4">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-gray-900 mb-2">{job.title}</Text>
              <View className="flex-row items-center mb-2">
                <MapPin size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-2">
                  {job.address.city}, {job.address.state} {job.address.zip}
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: colors.bg }} className="px-3 py-1 rounded-full">
              <Text style={{ color: colors.text }} className="text-xs font-semibold uppercase">
                {urgency}
              </Text>
            </View>
          </View>

          <Text className="text-gray-700 text-base leading-6">{job.description}</Text>
        </View>

        {/* Status */}
        <View className="bg-white px-4 py-4 mb-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-gray-500 mb-1">Status</Text>
              <Text className="text-lg font-semibold text-gray-900 capitalize">
                {job.status.replace('_', ' ')}
              </Text>
            </View>
            {job.scheduledStart && (
              <View>
                <Text className="text-sm text-gray-500 mb-1">Scheduled</Text>
                <View className="flex-row items-center">
                  <Calendar size={16} color="#6b7280" />
                  <Text className="text-lg font-semibold text-gray-900 ml-2">
                    {new Date(job.scheduledStart).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Scope & Cost */}
        {job.scope && (
          <View className="bg-white px-4 py-4 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">AI-Generated Scope</Text>
            
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <DollarSign size={20} color="#22c55e" />
                <Text className="text-xl font-bold text-gray-900 ml-2">Estimated Cost</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-900">
                ${job.scope.estimatedCost.min.toLocaleString()} - ${job.scope.estimatedCost.max.toLocaleString()}
              </Text>
              {job.scope.confidenceScore && (
                <Text className="text-sm text-gray-500 mt-1">
                  {Math.round(job.scope.confidenceScore * 100)}% AI confidence
                </Text>
              )}
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Clock size={20} color="#6b7280" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">Labor Hours</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                ~{job.scope.laborHours || job.laborHours || 0} hours
              </Text>
            </View>

            {job.scope.materials && job.scope.materials.length > 0 && (
              <View>
                <View className="flex-row items-center mb-3">
                  <Package size={20} color="#8b5cf6" />
                  <Text className="text-lg font-semibold text-gray-900 ml-2">Materials</Text>
                </View>
                {job.scope.materials.map((material, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between py-2 border-b border-gray-100"
                  >
                    <Text className="text-gray-700 flex-1">
                      {material.name} × {material.quantity} {material.unit}
                    </Text>
                    <Text className="text-gray-900 font-semibold">
                      ${material.estimatedCost.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {job.scope.recommendations && job.scope.recommendations.length > 0 && (
              <View className="mt-4">
                <View className="flex-row items-center mb-3">
                  <CheckCircle size={20} color="#22c55e" />
                  <Text className="text-lg font-semibold text-gray-900 ml-2">Recommendations</Text>
                </View>
                {job.scope.recommendations.map((rec, index) => (
                  <View key={index} className="flex-row items-start mb-2">
                    <View className="w-5 h-5 bg-green-100 rounded-full items-center justify-center mr-3 mt-0.5">
                      <CheckCircle size={12} color="#22c55e" />
                    </View>
                    <Text className="text-gray-700 flex-1">{rec}</Text>
                  </View>
                ))}
              </View>
            )}

            {job.scope.warningsAndRisks && job.scope.warningsAndRisks.length > 0 && (
              <View className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <View className="flex-row items-center mb-3">
                  <AlertTriangle size={20} color="#f59e0b" />
                  <Text className="text-lg font-semibold text-gray-900 ml-2">Warnings</Text>
                </View>
                {job.scope.warningsAndRisks.map((warning, index) => (
                  <View key={index} className="flex-row items-start mb-2">
                    <View className="w-5 h-5 bg-yellow-200 rounded-full items-center justify-center mr-3 mt-0.5">
                      <AlertTriangle size={12} color="#f59e0b" />
                    </View>
                    <Text className="text-gray-700 flex-1">{warning}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Video/Thumbnail */}
        {(job.videoUrl || job.thumbnailUrl) && (
          <View className="bg-white px-4 py-4 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">Media</Text>
            {job.thumbnailUrl && (
              <Image
                source={{ uri: job.thumbnailUrl }}
                className="w-full h-48 rounded-lg"
                resizeMode="cover"
              />
            )}
          </View>
        )}

        {/* Bids Section */}
        <View className="bg-white px-4 py-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Bids ({job.bids?.length || 0})
            </Text>
            {acceptedBid && (
              <View className="flex-row items-center bg-green-100 px-3 py-1 rounded-full">
                <CheckCircle size={16} color="#22c55e" />
                <Text className="text-green-700 font-semibold ml-2">Accepted</Text>
              </View>
            )}
          </View>

          {acceptedBid && (
            <BidCard
              bid={acceptedBid}
              isAccepted={true}
              isWinning={true}
            />
          )}

          {pendingBids.length > 0 && (
            <>
              <Text className="text-sm font-semibold text-gray-700 mb-3 mt-4">
                Pending Bids ({pendingBids.length})
              </Text>
              {pendingBids.map((bid) => (
                <BidCard
                  key={bid.id}
                  bid={bid}
                  canAccept={canManageBids && !acceptedBid}
                  onAccept={() => handleAcceptBid(bid.id)}
                  onReject={() => handleRejectBid(bid.id)}
                />
              ))}
            </>
          )}

          {(!job.bids || job.bids.length === 0) && (
            <View className="items-center py-8">
              <Text className="text-gray-500">No bids yet</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        {currentUser && currentUser.role === 'contractor' && job.status === 'posted' && (
          <View className="px-4 pb-6">
            <TouchableOpacity
              className="bg-primary-500 py-4 rounded-xl items-center"
              onPress={() => {
                // Navigate to submit bid screen
                navigation.navigate('SubmitBid' as never, { jobId: job.id } as never);
              }}
            >
              <Text className="text-white font-bold text-lg">Submit a Bid</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
