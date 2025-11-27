import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Video, Square, Camera, Check, AlertTriangle, Clock, DollarSign, Package, ArrowRight } from 'lucide-react-native';
import type { JobScope } from '@/types';

const MAX_RECORDING_DURATION = 60; // 60 seconds

export default function JobPostScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobScope, setJobScope] = useState<JobScope | null>(null);
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<'record' | 'analyze' | 'result'>('record');
  
  const cameraRef = useRef<CameraView>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_DURATION) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;
    
    setIsRecording(true);
    setRecordingTime(0);
    
    try {
      const video = await cameraRef.current.recordAsync({
        maxDuration: MAX_RECORDING_DURATION,
      });
      if (video) {
        setVideoUri(video.uri);
        setStep('analyze');
      }
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Error', 'Failed to record video');
    }
    setIsRecording(false);
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const analyzeVideo = async () => {
    setIsAnalyzing(true);
    
    // Simulated AI analysis - in production this would call the actual API
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockScope: JobScope = {
      jobTitle: 'Kitchen Faucet Replacement',
      summary: 'Replace existing kitchen faucet with new modern fixture. Includes shutoff valve inspection and potential replacement.',
      estimatedSquareFootage: 25,
      materials: [
        { name: 'Kitchen Faucet', quantity: 1, unit: 'unit', estimatedCost: 150 },
        { name: 'Supply Lines', quantity: 2, unit: 'units', estimatedCost: 30 },
        { name: 'Plumber\'s Putty', quantity: 1, unit: 'unit', estimatedCost: 8 },
        { name: 'Teflon Tape', quantity: 1, unit: 'roll', estimatedCost: 5 },
      ],
      laborHours: 2,
      estimatedCost: { min: 250, max: 400 },
      confidenceScore: 0.92,
      recommendations: [
        'Consider upgrading to a touchless faucet for better hygiene',
        'Check water pressure before installation',
        'Inspect under-sink plumbing for leaks',
      ],
      warningsAndRisks: [
        'Older homes may have corroded valves that need replacement',
        'Counter cutout size should be verified before purchasing faucet',
      ],
      permitRequired: false,
    };
    
    setJobScope(mockScope);
    setIsAnalyzing(false);
    setStep('result');
  };

  const submitJob = () => {
    Alert.alert(
      'Job Posted!',
      'Your job has been posted successfully. Contractors in your area will be notified.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center p-6">
        <Camera color="#0ea5e9" size={64} />
        <Text className="text-xl font-bold text-gray-900 mt-4 text-center">Camera Access Required</Text>
        <Text className="text-gray-600 text-center mt-2 mb-6">
          We need camera access to record a video of your job for AI analysis.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-primary-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (step === 'record') {
    return (
      <View className="flex-1 bg-black">
        <CameraView
          ref={cameraRef}
          className="flex-1"
          facing="back"
          mode="video"
        >
          <SafeAreaView className="flex-1">
            {/* Recording Timer */}
            <View className="items-center mt-4">
              <View className={`px-4 py-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-black/50'}`}>
                <Text className="text-white font-bold text-lg">
                  {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_DURATION)}
                </Text>
              </View>
            </View>

            {/* Instructions */}
            {!isRecording && (
              <View className="px-6 mt-4">
                <View className="bg-black/50 rounded-lg p-4">
                  <Text className="text-white font-bold mb-2">Recording Tips:</Text>
                  <Text className="text-white/80 text-sm">• Show the work area clearly</Text>
                  <Text className="text-white/80 text-sm">• Describe what needs to be done</Text>
                  <Text className="text-white/80 text-sm">• Point out any existing damage</Text>
                  <Text className="text-white/80 text-sm">• Maximum 60 seconds</Text>
                </View>
              </View>
            )}

            {/* Record Button */}
            <View className="flex-1 justify-end items-center pb-8">
              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full border-4 border-white items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-red-500/50'}`}
              >
                {isRecording ? (
                  <Square color="#ffffff" size={32} fill="#ffffff" />
                ) : (
                  <Video color="#ffffff" size={32} />
                )}
              </TouchableOpacity>
              <Text className="text-white mt-2 font-medium">
                {isRecording ? 'Tap to stop' : 'Tap to record'}
              </Text>
            </View>
          </SafeAreaView>
        </CameraView>
      </View>
    );
  }

  if (step === 'analyze') {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 p-6">
        <View className="flex-1 items-center justify-center">
          {isAnalyzing ? (
            <>
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text className="text-xl font-bold text-gray-900 mt-6">Analyzing Video...</Text>
              <Text className="text-gray-600 text-center mt-2">
                Our AI is reviewing your video to generate an accurate job scope
              </Text>
            </>
          ) : (
            <>
              <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
                <Check color="#22c55e" size={40} />
              </View>
              <Text className="text-xl font-bold text-gray-900 mt-6">Video Recorded!</Text>
              <Text className="text-gray-600 text-center mt-2 mb-6">
                Add a brief description to help our AI better understand the job.
              </Text>
              
              <TextInput
                className="w-full bg-white rounded-lg p-4 text-gray-900 mb-4"
                placeholder="Describe the issue (optional)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={{ minHeight: 80 }}
              />
              
              <TouchableOpacity
                onPress={analyzeVideo}
                className="bg-primary-500 px-8 py-4 rounded-full flex-row items-center"
              >
                <Text className="text-white font-semibold mr-2">Analyze with AI</Text>
                <ArrowRight color="#ffffff" size={20} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {jobScope && (
          <View className="p-4">
            {/* Job Title */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-xl font-bold text-gray-900">{jobScope.jobTitle}</Text>
              <Text className="text-gray-600 mt-2">{jobScope.summary}</Text>
              
              <View className="flex-row mt-4">
                <View className="bg-primary-100 px-3 py-1 rounded-full mr-2">
                  <Text className="text-primary-700 text-sm font-medium">
                    {Math.round(jobScope.confidenceScore * 100)}% Confidence
                  </Text>
                </View>
                {!jobScope.permitRequired && (
                  <View className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-700 text-sm font-medium">No Permit Required</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Estimated Cost */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row items-center mb-3">
                <DollarSign color="#22c55e" size={24} />
                <Text className="text-lg font-bold text-gray-900 ml-2">Estimated Cost</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-900">
                ${jobScope.estimatedCost.min} - ${jobScope.estimatedCost.max}
              </Text>
              <View className="flex-row items-center mt-2">
                <Clock color="#6b7280" size={16} />
                <Text className="text-gray-600 ml-2">~{jobScope.laborHours} hours labor</Text>
              </View>
            </View>

            {/* Materials */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row items-center mb-3">
                <Package color="#8b5cf6" size={24} />
                <Text className="text-lg font-bold text-gray-900 ml-2">Materials Needed</Text>
              </View>
              {jobScope.materials.map((material, index) => (
                <View key={index} className="flex-row justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-700">{material.name} x{material.quantity}</Text>
                  <Text className="text-gray-900 font-medium">${material.estimatedCost}</Text>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row items-center mb-3">
                <Check color="#22c55e" size={24} />
                <Text className="text-lg font-bold text-gray-900 ml-2">Recommendations</Text>
              </View>
              {jobScope.recommendations.map((rec, index) => (
                <View key={index} className="flex-row items-start py-2">
                  <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center mr-3 mt-0.5">
                    <Check color="#22c55e" size={14} />
                  </View>
                  <Text className="text-gray-700 flex-1">{rec}</Text>
                </View>
              ))}
            </View>

            {/* Warnings */}
            {jobScope.warningsAndRisks.length > 0 && (
              <View className="bg-yellow-50 rounded-xl p-4 mb-4 border border-yellow-200">
                <View className="flex-row items-center mb-3">
                  <AlertTriangle color="#f59e0b" size={24} />
                  <Text className="text-lg font-bold text-gray-900 ml-2">Potential Risks</Text>
                </View>
                {jobScope.warningsAndRisks.map((warning, index) => (
                  <View key={index} className="flex-row items-start py-2">
                    <View className="w-6 h-6 bg-yellow-200 rounded-full items-center justify-center mr-3 mt-0.5">
                      <AlertTriangle color="#f59e0b" size={14} />
                    </View>
                    <Text className="text-gray-700 flex-1">{warning}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={submitJob}
              className="bg-primary-500 py-4 rounded-xl items-center mb-6"
            >
              <Text className="text-white font-bold text-lg">Post Job</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
