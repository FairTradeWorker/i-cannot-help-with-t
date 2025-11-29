// Submit Bid Screen
// Contractors submit bids on jobs

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DollarSign, Clock, Package, Send, X, AlertCircle } from 'lucide-react-native';
import { dataStore } from '@fairtradeworker/shared';
import type { Job, Bid, User as UserType } from '@/types';

interface RouteParams {
  jobId: string;
}

export default function SubmitBidScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = (route.params as RouteParams) || { jobId: '' };

  const [job, setJob] = useState<Job | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bidAmount, setBidAmount] = useState('');
  const [laborHours, setLaborHours] = useState('');
  const [materialsCost, setMaterialsCost] = useState('');
  const [message, setMessage] = useState('');
  const [timelineStart, setTimelineStart] = useState('');
  const [timelineEnd, setTimelineEnd] = useState('');

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
      console.error('Failed to load job:', error);
      Alert.alert('Error', 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const labor = parseFloat(laborHours) || 0;
    const materials = parseFloat(materialsCost) || 0;
    const total = labor + materials;
    return total;
  };

  const handleSubmitBid = async () => {
    if (!job || !currentUser) {
      Alert.alert('Error', 'Please log in to submit a bid');
      return;
    }

    const amount = parseFloat(bidAmount) || calculateTotal();
    if (amount <= 0) {
      Alert.alert('Error', 'Please enter a valid bid amount');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please add a message to your bid');
      return;
    }

    setSubmitting(true);
    try {
      const newBid: Bid = {
        id: `bid-${Date.now()}`,
        jobId: job.id,
        contractorId: currentUser.id,
        contractor: {
          id: currentUser.id,
          name: currentUser.name,
          rating: currentUser.contractorProfile?.rating || 0,
          completedJobs: currentUser.contractorProfile?.completedJobs || 0,
        },
        amount,
        message: message.trim(),
        status: 'pending',
        createdAt: new Date(),
        timeline: {
          start: timelineStart ? new Date(timelineStart) : new Date(),
          end: timelineEnd ? new Date(timelineEnd) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        breakdown: {
          materials: parseFloat(materialsCost) || 0,
          labor: parseFloat(laborHours) || amount,
          overhead: 0,
        },
      };

      await dataStore.addBidToJob(job.id, newBid);
      Alert.alert(
        'Bid Submitted!',
        'Your bid has been submitted successfully. The homeowner will be notified.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to submit bid:', error);
      Alert.alert('Error', 'Failed to submit bid. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center px-6">
        <AlertCircle size={64} color="#ef4444" />
        <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">Job Not Found</Text>
        <Text className="text-gray-600 text-center mb-6">
          This job may have been removed or you don't have access to it.
        </Text>
        <TouchableOpacity
          className="bg-primary-500 px-8 py-3 rounded-full"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const total = calculateTotal();
  const suggestedAmount = job.scope?.estimatedCost
    ? (job.scope.estimatedCost.min + job.scope.estimatedCost.max) / 2
    : null;

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <X size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 flex-1">Submit Bid</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Job Summary */}
        <View className="bg-white px-4 py-4 mb-4 mt-4">
          <Text className="text-sm text-gray-500 mb-2">Bidding on</Text>
          <Text className="text-lg font-bold text-gray-900 mb-1">{job.title}</Text>
          <Text className="text-sm text-gray-600">{job.address.city}, {job.address.state}</Text>
          {suggestedAmount && (
            <View className="mt-3 bg-blue-50 rounded-lg p-3">
              <Text className="text-xs text-blue-700 font-semibold mb-1">
                Suggested Bid Range
              </Text>
              <Text className="text-base text-blue-900">
                ${job.scope?.estimatedCost.min.toLocaleString()} - ${job.scope?.estimatedCost.max.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Bid Amount */}
        <View className="bg-white px-4 py-4 mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">Bid Amount</Text>
          
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <DollarSign size={20} color="#6b7280" />
              <Text className="text-sm text-gray-700 ml-2">Total Bid Amount</Text>
            </View>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 text-lg font-bold text-gray-900"
              placeholder="0.00"
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="decimal-pad"
            />
            {total > 0 && parseFloat(bidAmount) !== total && (
              <Text className="text-xs text-gray-500 mt-1">
                Calculated total: ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            )}
          </View>

          {/* Breakdown */}
          <View className="border-t border-gray-100 pt-4">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Breakdown (Optional)</Text>
            
            <View className="mb-3">
              <View className="flex-row items-center mb-2">
                <Package size={16} color="#6b7280" />
                <Text className="text-sm text-gray-700 ml-2">Materials Cost</Text>
              </View>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-900"
                placeholder="0.00"
                value={materialsCost}
                onChangeText={setMaterialsCost}
                keyboardType="decimal-pad"
              />
            </View>

            <View className="mb-3">
              <View className="flex-row items-center mb-2">
                <Clock size={16} color="#6b7280" />
                <Text className="text-sm text-gray-700 ml-2">Labor Hours × Rate</Text>
              </View>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-900"
                placeholder="0.00"
                value={laborHours}
                onChangeText={setLaborHours}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View className="bg-white px-4 py-4 mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">Timeline</Text>
          
          <View className="mb-3">
            <Text className="text-sm text-gray-700 mb-2">Start Date (Optional)</Text>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-900"
              placeholder="YYYY-MM-DD"
              value={timelineStart}
              onChangeText={setTimelineStart}
            />
          </View>

          <View>
            <Text className="text-sm text-gray-700 mb-2">Expected Completion (Optional)</Text>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-900"
              placeholder="YYYY-MM-DD"
              value={timelineEnd}
              onChangeText={setTimelineEnd}
            />
          </View>
        </View>

        {/* Message */}
        <View className="bg-white px-4 py-4 mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">Message to Homeowner</Text>
          <TextInput
            className="bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-900 min-h-[120px]"
            placeholder="Tell the homeowner about your experience, availability, and why you're the right fit for this job..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text className="text-xs text-gray-500 mt-2">
            {message.length}/500 characters
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="bg-white border-t border-gray-200 px-4 py-4">
        <TouchableOpacity
          onPress={handleSubmitBid}
          disabled={submitting || !message.trim() || (!bidAmount && total === 0)}
          className={`py-4 rounded-xl items-center flex-row justify-center ${
            submitting || !message.trim() || (!bidAmount && total === 0)
              ? 'bg-gray-300'
              : 'bg-primary-500'
          }`}
        >
          {submitting ? (
            <>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text className="text-white font-bold text-lg ml-2">Submitting...</Text>
            </>
          ) : (
            <>
              <Send size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-2">Submit Bid</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

