// Submit Bid Screen - Enhanced with API Integration
// Contractors can submit bids on jobs

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, DollarSign, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react-native';
import { jobsService } from '@/services/jobs.service';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { isPositiveNumber } from '@/utils/validation';
import { formatCurrency } from '@/utils/formatters';

interface RouteParams {
  jobId: string;
}

export default function SubmitBidScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = (route.params as RouteParams) || {};
  const { user } = useAuth();
  const { addBidToJob } = useJobs();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; message?: string }>({});

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
      Alert.alert('Error', 'Failed to load job. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { amount?: string; message?: string } = {};

    if (!bidAmount.trim()) {
      newErrors.amount = 'Bid amount is required';
    } else {
      const amount = parseFloat(bidAmount.replace(/[^0-9.]/g, ''));
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      }
      if (amount < 10) {
        newErrors.amount = 'Minimum bid amount is $10';
      }
    }

    if (bidMessage.trim().length > 500) {
      newErrors.message = 'Message must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit a bid');
      navigation.navigate('Login' as never);
      return;
    }

    if (user.role !== 'contractor') {
      Alert.alert('Error', 'Only contractors can submit bids');
      navigation.goBack();
      return;
    }

    setSubmitting(true);

    try {
      const amount = parseFloat(bidAmount.replace(/[^0-9.]/g, ''));
      
      await addBidToJob(jobId, {
        amount,
        message: bidMessage.trim() || undefined,
      });

      Alert.alert(
        'Bid Submitted!',
        `Your bid of ${formatCurrency(amount)} has been submitted successfully.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to submit bid:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to submit bid. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center" edges={['bottom']}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading job...</Text>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center" edges={['bottom']}>
        <AlertCircle size={64} color="#ef4444" />
        <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">Job Not Found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-primary-500 px-6 py-3 rounded-full mt-4"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const estimatedCost = job.scope?.estimatedCost;
  const suggestedMin = estimatedCost ? estimatedCost.min * 0.9 : 0;
  const suggestedMax = estimatedCost ? estimatedCost.max * 1.1 : 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 flex-1">Submit Bid</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Job Info Card */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 border border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-2">{job.title}</Text>
          <Text className="text-sm text-gray-600">{job.address.city}, {job.address.state}</Text>
          {estimatedCost && (
            <View className="mt-3 pt-3 border-t border-gray-200">
              <Text className="text-xs text-gray-500 mb-1">Estimated Cost Range</Text>
              <Text className="text-base font-semibold text-gray-900">
                ${estimatedCost.min.toLocaleString()} - ${estimatedCost.max.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Bid Form */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 border border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Your Bid</Text>

          {/* Amount Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Bid Amount <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 border border-gray-300">
              <DollarSign size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-2 text-lg font-semibold text-gray-900"
                placeholder="0.00"
                value={bidAmount}
                onChangeText={(text) => {
                  setBidAmount(text);
                  if (errors.amount) {
                    setErrors({ ...errors, amount: undefined });
                  }
                }}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>
            {errors.amount && (
              <Text className="text-xs text-red-500 mt-1">{errors.amount}</Text>
            )}
            {suggestedMin > 0 && suggestedMax > 0 && (
              <Text className="text-xs text-gray-500 mt-1">
                Suggested range: ${suggestedMin.toLocaleString()} - ${suggestedMax.toLocaleString()}
              </Text>
            )}
          </View>

          {/* Message Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Message (Optional)
            </Text>
            <View className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-300">
              <TextInput
                className="text-base text-gray-900"
                placeholder="Add a message to explain your bid..."
                value={bidMessage}
                onChangeText={(text) => {
                  setBidMessage(text);
                  if (errors.message) {
                    setErrors({ ...errors, message: undefined });
                  }
                }}
                multiline
                numberOfLines={4}
                maxLength={500}
                style={{ minHeight: 100, textAlignVertical: 'top' }}
              />
            </View>
            <Text className="text-xs text-gray-500 mt-1 text-right">
              {bidMessage.length}/500
            </Text>
            {errors.message && (
              <Text className="text-xs text-red-500 mt-1">{errors.message}</Text>
            )}
          </View>

          {/* Tips */}
          <View className="bg-blue-50 rounded-lg p-3 mt-4">
            <View className="flex-row items-start">
              <AlertCircle size={18} color="#0ea5e9" className="mt-0.5" />
              <View className="flex-1 ml-2">
                <Text className="text-sm font-semibold text-blue-900 mb-1">Tips for a Great Bid</Text>
                <Text className="text-xs text-blue-700">
                  • Be competitive but fair{'\n'}
                  • Highlight your relevant experience{'\n'}
                  • Mention your availability{'\n'}
                  • Include any special offers
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="bg-white border-t border-gray-200 px-4 py-4">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting || !bidAmount.trim()}
          className={`py-4 rounded-xl items-center flex-row justify-center ${
            submitting || !bidAmount.trim()
              ? 'bg-gray-300'
              : 'bg-primary-500'
          }`}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <CheckCircle size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-2">
                Submit Bid
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
