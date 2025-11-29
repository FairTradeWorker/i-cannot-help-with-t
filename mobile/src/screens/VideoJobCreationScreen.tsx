// Video Job Creation Screen
// Full workflow for creating jobs with video + AI analysis

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Camera, Video, X, CheckCircle, AlertCircle, Upload, Play } from 'lucide-react-native';
import { VideoRecorder } from '@/components/VideoRecorder';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { dataStore } from '@fairtradeworker/shared';
import type { Job, JobScope, User as UserType } from '@/types';

export default function VideoJobCreationScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState<'record' | 'analyze' | 'review' | 'complete'>('record');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [jobScope, setJobScope] = useState<JobScope | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
    urgency: 'normal' as 'normal' | 'urgent' | 'emergency',
  });
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await dataStore.getCurrentUser();
    setCurrentUser(user);
    if (!user) {
      Alert.alert('Login Required', 'Please log in to create a job');
      navigation.goBack();
    }
  };

  const handleVideoRecorded = async (uri: string, thumbnail: string) => {
    setVideoUri(uri);
    setThumbnailUri(thumbnail);
    setStep('analyze');
    await analyzeVideo(uri);
  };

  const analyzeVideo = async (uri: string) => {
    if (!currentUser) return;

    setAnalyzing(true);
    try {
      // TODO: Call AI service to analyze video
      // For now, using mock analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockScope: JobScope = {
        jobTitle: 'Emergency Roof Repair',
        summary: 'Patch leak in valley, replace 8 damaged shingles',
        laborHours: 10,
        estimatedCost: { min: 7200, max: 8900 },
        materials: [
          { name: 'Architectural Shingles', quantity: 3, unit: 'bundles', estimatedCost: 360 },
          { name: 'Ice & Water Shield', quantity: 1, unit: 'roll', estimatedCost: 180 },
        ],
        confidenceScore: 85,
        recommendations: [
          'Check for additional damage in surrounding areas',
          'Consider full roof inspection',
        ],
        warningsAndRisks: [
          'Safety equipment required for roof access',
          'Weather conditions may affect timeline',
        ],
      };

      setJobScope(mockScope);
      setAnalyzing(false);
      setStep('review');
    } catch (error) {
      console.error('Failed to analyze video:', error);
      Alert.alert('Error', 'Failed to analyze video. Please try again.');
      setAnalyzing(false);
      setStep('record');
    }
  };

  const handleCreateJob = async () => {
    if (!currentUser || !jobScope || !videoUri) {
      Alert.alert('Error', 'Missing required information');
      return;
    }

    if (!jobDetails.title || !jobDetails.description) {
      Alert.alert('Error', 'Please fill in job title and description');
      return;
    }

    setSubmitting(true);
    try {
      const newJob: Job = {
        id: `job-${Date.now()}`,
        title: jobDetails.title,
        description: jobDetails.description,
        status: 'posted',
        homeownerId: currentUser.id,
        address: jobDetails.address,
        urgency: jobDetails.urgency,
        videoUrl: videoUri,
        thumbnailUrl: thumbnailUri || undefined,
        scope: jobScope,
        estimatedCost: jobScope.estimatedCost,
        laborHours: jobScope.laborHours,
        createdAt: new Date(),
        updatedAt: new Date(),
        bids: [],
      };

      await dataStore.saveJob(newJob);
      setStep('complete');

      setTimeout(() => {
        navigation.goBack();
        // Navigate to job details
        navigation.navigate('JobDetails' as never, { jobId: newJob.id } as never);
      }, 2000);
    } catch (error) {
      console.error('Failed to create job:', error);
      Alert.alert('Error', 'Failed to create job. Please try again.');
      setSubmitting(false);
    }
  };

  if (step === 'record') {
    return (
      <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
        <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900 flex-1">Create Job with Video</Text>
        </View>

        <VideoRecorder
          onRecordingComplete={handleVideoRecorded}
          maxDuration={60}
        />
      </SafeAreaView>
    );
  }

  if (step === 'analyze') {
    return (
      <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
        <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
          <TouchableOpacity onPress={() => setStep('record')} className="mr-4">
            <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900 flex-1">Analyzing Video...</Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          {analyzing ? (
            <>
              <LoadingSpinner message="AI is analyzing your video..." />
              <Text className="text-gray-600 text-center mt-6">
                Our AI is examining your video to generate an accurate scope of work and cost estimate.
              </Text>
            </>
          ) : (
            <View className="items-center">
              <CheckCircle size={64} color="#22c55e" />
              <Text className="text-xl font-bold text-gray-900 mt-4">Analysis Complete!</Text>
              <TouchableOpacity
                className="bg-primary-500 px-8 py-3 rounded-full mt-6"
                onPress={() => setStep('review')}
              >
                <Text className="text-white font-semibold">Continue</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'review' && jobScope) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-900">Review & Complete</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Video Preview */}
          {thumbnailUri && (
            <View className="bg-white px-4 py-4 mb-4 mt-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Video Preview</Text>
              <View className="bg-gray-900 rounded-lg aspect-video items-center justify-center">
                <Play size={48} color="#ffffff" />
              </View>
            </View>
          )}

          {/* AI Scope */}
          <View className="bg-white px-4 py-4 mb-4">
            <View className="flex-row items-center mb-4">
              <CheckCircle size={20} color="#22c55e" />
              <Text className="text-lg font-bold text-gray-900 ml-2">AI-Generated Scope</Text>
            </View>

            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                {jobScope.jobTitle}
              </Text>
              <Text className="text-sm text-gray-600">{jobScope.summary}</Text>
            </View>

            <View className="bg-green-50 rounded-lg p-4 mb-4">
              <Text className="text-sm font-semibold text-green-700 mb-2">Estimated Cost</Text>
              <Text className="text-2xl font-bold text-green-900">
                ${jobScope.estimatedCost.min.toLocaleString()} - ${jobScope.estimatedCost.max.toLocaleString()}
              </Text>
              <Text className="text-xs text-green-600 mt-1">
                {Math.round(jobScope.confidenceScore || 0)}% AI confidence
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Materials Needed</Text>
              {jobScope.materials?.map((material, index) => (
                <View key={index} className="flex-row justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-700">
                    {material.name} × {material.quantity} {material.unit}
                  </Text>
                  <Text className="text-gray-900 font-semibold">
                    ${material.estimatedCost.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Job Details Form */}
          <View className="bg-white px-4 py-4 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">Job Details</Text>
            {/* TODO: Add form inputs for title, description, address, urgency */}
            <Text className="text-gray-600 text-sm">
              Form inputs will be added in the next update
            </Text>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View className="bg-white border-t border-gray-200 px-4 py-4">
          <TouchableOpacity
            onPress={handleCreateJob}
            disabled={submitting}
            className={`py-4 rounded-xl items-center ${
              submitting ? 'bg-gray-300' : 'bg-primary-500'
            }`}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-lg">Post Job</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'complete') {
    return (
      <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
        <View className="flex-1 items-center justify-center px-6">
          <CheckCircle size={96} color="#22c55e" />
          <Text className="text-3xl font-bold text-gray-900 mt-6 mb-4">Job Posted!</Text>
          <Text className="text-gray-600 text-center text-lg">
            Your job has been posted successfully. Contractors will start bidding soon!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

