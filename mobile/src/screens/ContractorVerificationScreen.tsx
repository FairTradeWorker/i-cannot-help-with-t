import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  Shield, 
  FileText, 
  Camera, 
  CheckCircle, 
  Upload, 
  AlertCircle,
  User,
  Award,
  Car
} from 'lucide-react-native';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  required: boolean;
}

export default function ContractorVerificationScreen() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [insurancePolicy, setInsurancePolicy] = useState('');

  const verificationSteps: VerificationStep[] = [
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Upload a valid government ID (driver\'s license or passport)',
      icon: <User color="#0ea5e9" size={24} />,
      status: 'completed',
      required: true,
    },
    {
      id: 'license',
      title: 'Professional License',
      description: 'Provide your contractor license number for verification',
      icon: <Award color="#0ea5e9" size={24} />,
      status: 'in_progress',
      required: true,
    },
    {
      id: 'insurance',
      title: 'Insurance Verification',
      description: 'Upload proof of liability insurance (minimum $1M coverage)',
      icon: <Shield color="#0ea5e9" size={24} />,
      status: 'pending',
      required: true,
    },
    {
      id: 'vehicle',
      title: 'Vehicle Registration',
      description: 'Add your work vehicle for routing optimization',
      icon: <Car color="#0ea5e9" size={24} />,
      status: 'pending',
      required: false,
    },
    {
      id: 'background',
      title: 'Background Check',
      description: 'Authorize a background check for homeowner safety',
      icon: <FileText color="#0ea5e9" size={24} />,
      status: 'pending',
      required: true,
    },
  ];

  const getStatusColor = (status: VerificationStep['status']) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'in_progress': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  const getStatusText = (status: VerificationStep['status']) => {
    switch (status) {
      case 'completed': return 'Verified';
      case 'in_progress': return 'In Progress';
      case 'failed': return 'Failed';
      default: return 'Pending';
    }
  };

  const handleUploadDocument = (stepId: string) => {
    Alert.alert(
      'Upload Document',
      'Select how you want to upload your document',
      [
        { text: 'Take Photo', onPress: () => console.log('Camera') },
        { text: 'Choose from Library', onPress: () => console.log('Library') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmitLicense = () => {
    if (!licenseNumber.trim()) {
      Alert.alert('Error', 'Please enter your license number');
      return;
    }
    Alert.alert(
      'License Submitted',
      'Your license is being verified. This usually takes 1-2 business days.',
      [{ text: 'OK' }]
    );
  };

  const completedCount = verificationSteps.filter(s => s.status === 'completed').length;
  const progressPercent = (completedCount / verificationSteps.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Progress Header */}
        <View className="bg-white px-4 py-5 border-b border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">Verification Progress</Text>
            <Text className="text-primary-500 font-bold">{completedCount}/{verificationSteps.length}</Text>
          </View>
          <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <View 
              className="h-full bg-primary-500 rounded-full" 
              style={{ width: `${progressPercent}%` }}
            />
          </View>
          <Text className="text-gray-500 text-sm mt-2">
            Complete all required steps to start accepting jobs
          </Text>
        </View>

        {/* Verification Steps */}
        <View className="p-4">
          {verificationSteps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              onPress={() => setCurrentStep(index)}
              className={`bg-white rounded-xl p-4 mb-3 shadow-sm border-2 ${
                currentStep === index ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              <View className="flex-row items-start">
                <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center mr-4">
                  {step.status === 'completed' ? (
                    <CheckCircle color="#22c55e" size={24} />
                  ) : step.status === 'failed' ? (
                    <AlertCircle color="#ef4444" size={24} />
                  ) : (
                    step.icon
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-lg font-bold text-gray-900">{step.title}</Text>
                    {step.required && (
                      <Text className="text-red-500 text-xs font-medium">Required</Text>
                    )}
                  </View>
                  <Text className="text-gray-600 text-sm mb-2">{step.description}</Text>
                  <View 
                    className="self-start px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${getStatusColor(step.status)}20` }}
                  >
                    <Text 
                      className="text-sm font-medium"
                      style={{ color: getStatusColor(step.status) }}
                    >
                      {getStatusText(step.status)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Expanded Content */}
              {currentStep === index && step.status !== 'completed' && (
                <View className="mt-4 pt-4 border-t border-gray-100">
                  {step.id === 'license' && (
                    <View>
                      <Text className="text-gray-700 font-medium mb-2">License Number</Text>
                      <TextInput
                        className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900 mb-3"
                        placeholder="Enter your license number"
                        value={licenseNumber}
                        onChangeText={setLicenseNumber}
                      />
                      <TouchableOpacity
                        onPress={handleSubmitLicense}
                        className="bg-primary-500 py-3 rounded-lg items-center"
                      >
                        <Text className="text-white font-bold">Verify License</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {step.id === 'insurance' && (
                    <View>
                      <Text className="text-gray-700 font-medium mb-2">Policy Number</Text>
                      <TextInput
                        className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900 mb-3"
                        placeholder="Enter your policy number"
                        value={insurancePolicy}
                        onChangeText={setInsurancePolicy}
                      />
                      <TouchableOpacity
                        onPress={() => handleUploadDocument(step.id)}
                        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg py-6 items-center mb-3"
                      >
                        <Upload color="#6b7280" size={32} />
                        <Text className="text-gray-600 mt-2">Upload Insurance Certificate</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="bg-primary-500 py-3 rounded-lg items-center">
                        <Text className="text-white font-bold">Submit for Verification</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {(step.id === 'identity' || step.id === 'vehicle') && (
                    <TouchableOpacity
                      onPress={() => handleUploadDocument(step.id)}
                      className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg py-8 items-center"
                    >
                      <Camera color="#6b7280" size={40} />
                      <Text className="text-gray-600 mt-2 font-medium">Take Photo or Upload</Text>
                      <Text className="text-gray-400 text-sm mt-1">Supported: JPG, PNG, PDF</Text>
                    </TouchableOpacity>
                  )}

                  {step.id === 'background' && (
                    <View>
                      <View className="bg-blue-50 rounded-lg p-4 mb-4">
                        <Text className="text-blue-800 text-sm">
                          Background checks are processed by a third-party provider. 
                          Your data is handled securely and in compliance with FCRA regulations.
                        </Text>
                      </View>
                      <TouchableOpacity className="bg-primary-500 py-3 rounded-lg items-center">
                        <Text className="text-white font-bold">Authorize Background Check</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Help Section */}
        <View className="mx-4 mb-6 bg-gray-100 rounded-xl p-4">
          <Text className="text-gray-900 font-bold mb-2">Need Help?</Text>
          <Text className="text-gray-600 text-sm mb-3">
            If you're having trouble with verification, our support team is here to help.
          </Text>
          <TouchableOpacity className="bg-white py-3 rounded-lg items-center border border-gray-200">
            <Text className="text-primary-500 font-bold">Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
