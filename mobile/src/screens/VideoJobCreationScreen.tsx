// Video Job Creation Screen - Enhanced with API Integration
// Complete workflow for creating jobs via video

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { VideoRecorder } from '@/components/VideoRecorder';
import { Video, Upload, CheckCircle, AlertCircle, X } from 'lucide-react-native';
import { jobsService } from '@/services/jobs.service';
import { useLocation } from '@/hooks/useLocation';
import { useAuth } from '@/hooks/useAuth';
import type { JobScope } from '@/types';

export default function VideoJobCreationScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { location } = useLocation(true);
  const [step, setStep] = useState<'record' | 'analyzing' | 'review' | 'creating'>('record');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [jobScope, setJobScope] = useState<JobScope | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleVideoRecorded = (uri: string, thumbnail: string) => {
    setVideoUri(uri);
    setThumbnailUri(thumbnail);
    setStep('analyzing');
    
    // Simulate AI analysis (in production, call actual AI service)
    setTimeout(() => {
      const mockScope: JobScope = {
        jobTitle: 'Roof Repair',
        summary: 'Roof damage detected. Needs repair.',
        laborHours: 8,
        estimatedCost: { min: 1500, max: 2500 },
        materials: [
          { name: 'Shingles', quantity: 20, unit: 'sq ft', estimatedCost: 400 },
          { name: 'Underlayment', quantity: 20, unit: 'sq ft', estimatedCost: 200 },
        ],
        confidenceScore: 85,
      };
      setJobScope(mockScope);
      setJobTitle(mockScope.jobTitle);
      setJobDescription(mockScope.summary);
      setStep('review');
    }, 2000);
  };

  const handleCreateJob = async () => {
    if (!videoUri || !jobScope || !user || !location) {
      Alert.alert('Error', 'Missing required information to create job');
      return;
    }

    if (!jobTitle.trim()) {
      Alert.alert('Error', 'Please enter a job title');
      return;
    }

    setCreating(true);

    try {
      // TODO: Upload video to storage first
      // For now, using videoUri directly
      
      const jobData = {
        title: jobTitle,
        description: jobDescription || jobScope.summary,
        address: {
          lat: location.latitude,
          lng: location.longitude,
          city: 'Unknown',
          state: 'Unknown',
          zip: 'Unknown',
          address: location.address || '',
        },
        videoUrl: videoUri, // TODO: Upload and get public URL
        thumbnailUrl: thumbnailUri,
        scope: jobScope,
        estimatedCost: jobScope.estimatedCost,
        laborHours: jobScope.laborHours,
        urgency: 'normal' as const,
      };

      const job = await jobsService.createJob(jobData);

      Alert.alert(
        'Success!',
        'Your job has been posted successfully.',
        [
          {
            text: 'View Job',
            onPress: () => {
              navigation.navigate('JobDetails' as never, { jobId: job.id } as never);
            },
          },
          {
            text: 'Create Another',
            onPress: () => {
              setStep('record');
              setVideoUri(null);
              setThumbnailUri(null);
              setJobScope(null);
              setJobTitle('');
              setJobDescription('');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Failed to create job:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create job. Please try again.'
      );
    } finally {
      setCreating(false);
    }
  };

  if (step === 'record') {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={['top', 'bottom']}>
        <View className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-black/50">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center"
          >
            <X size={24} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Cancel</Text>
          </TouchableOpacity>
        </View>
        <VideoRecorder
          onRecordingComplete={handleVideoRecorded}
          maxDuration={60}
          onCancel={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  if (step === 'analyzing') {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center" edges={['bottom']}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
          Analyzing Your Video
        </Text>
        <Text className="text-gray-600 text-center px-8">
          Our AI is analyzing your video to understand the work needed...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 mb-1">Review Your Job</Text>
          <Text className="text-gray-600">Review the AI-generated scope and make any adjustments</Text>
        </View>

        {/* Job Scope Summary */}
        {jobScope && (
          <View className="bg-white mx-4 mt-4 rounded-xl p-4 border border-gray-200">
            <View className="flex-row items-center mb-3">
              <CheckCircle size={20} color="#22c55e" />
              <Text className="text-lg font-bold text-gray-900 ml-2">AI Analysis Complete</Text>
            </View>
            
            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-1">Confidence Score</Text>
              <Text className="text-2xl font-bold text-primary-500">{jobScope.confidenceScore}%</Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-1">Estimated Cost</Text>
              <Text className="text-xl font-bold text-gray-900">
                ${jobScope.estimatedCost.min.toLocaleString()} - ${jobScope.estimatedCost.max.toLocaleString()}
              </Text>
            </View>

            <View>
              <Text className="text-sm text-gray-600 mb-1">Labor Hours</Text>
              <Text className="text-lg font-semibold text-gray-900">
                ~{jobScope.laborHours} hours
              </Text>
            </View>
          </View>
        )}

        {/* Job Details Form */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 border border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Job Details</Text>
          
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Job Title</Text>
            <View className="bg-gray-100 rounded-lg px-4 py-3">
              <Text className="text-base text-gray-900">{jobTitle}</Text>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Description</Text>
            <View className="bg-gray-100 rounded-lg px-4 py-3">
              <Text className="text-base text-gray-900">{jobDescription}</Text>
            </View>
          </View>
        </View>

        {/* Materials List */}
        {jobScope?.materials && jobScope.materials.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-xl p-4 border border-gray-200">
            <Text className="text-lg font-bold text-gray-900 mb-4">Materials Needed</Text>
            {jobScope.materials.map((material, index) => (
              <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">{material.name}</Text>
                  <Text className="text-sm text-gray-600">
                    {material.quantity} {material.unit}
                  </Text>
                </View>
                <Text className="text-base font-semibold text-gray-900">
                  ${material.estimatedCost.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Button */}
      <View className="bg-white border-t border-gray-200 px-4 py-4">
        <TouchableOpacity
          onPress={handleCreateJob}
          disabled={creating}
          className={`py-4 rounded-xl items-center flex-row justify-center ${
            creating ? 'bg-gray-300' : 'bg-primary-500'
          }`}
        >
          {creating ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Upload size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-2">Post Job</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
