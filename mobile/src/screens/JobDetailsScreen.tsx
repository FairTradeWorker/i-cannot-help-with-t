import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  User, 
  Phone, 
  MessageCircle, 
  ChevronRight,
  Calendar,
  Wrench,
  FileText,
  Shield,
  CheckCircle
} from 'lucide-react-native';

interface JobDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: 'normal' | 'urgent' | 'emergency';
  status: 'posted' | 'bidding' | 'assigned' | 'in_progress' | 'completed';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  estimatedCost: { min: number; max: number };
  laborHours: number;
  materials: string[];
  scope: string[];
  photos: string[];
  createdAt: Date;
  scheduledDate?: Date;
  homeowner: {
    id: string;
    name: string;
    rating: number;
    jobsPosted: number;
  };
  bids: {
    id: string;
    contractorName: string;
    amount: number;
    message: string;
    createdAt: Date;
  }[];
}

// Mock data for demonstration
const mockJob: JobDetails = {
  id: '1',
  title: 'Kitchen Faucet Replacement',
  description: 'Need to replace old kitchen faucet with a new one. Water pressure is low and there\'s some rust around the base. Homeowner has already purchased a new Delta faucet.',
  category: 'Plumbing',
  urgency: 'normal',
  status: 'bidding',
  address: {
    street: '123 Main St',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
  },
  estimatedCost: { min: 250, max: 400 },
  laborHours: 2,
  materials: ['Plumber\'s tape', 'Silicone sealant', 'Supply lines (if needed)'],
  scope: [
    'Remove existing faucet',
    'Install new Delta faucet',
    'Connect water supply lines',
    'Test for leaks',
    'Clean up work area',
  ],
  photos: [],
  createdAt: new Date(),
  homeowner: {
    id: 'h1',
    name: 'John D.',
    rating: 4.8,
    jobsPosted: 5,
  },
  bids: [
    {
      id: 'b1',
      contractorName: 'Mike\'s Plumbing',
      amount: 300,
      message: 'I can do this job tomorrow morning. 10 years experience with faucet installations.',
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: 'b2',
      contractorName: 'QuickFix Contractors',
      amount: 350,
      message: 'Available this week. Will include 1-year workmanship warranty.',
      createdAt: new Date(Date.now() - 7200000),
    },
  ],
};

const urgencyColors = {
  normal: { bg: 'bg-green-100', text: 'text-green-700' },
  urgent: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  emergency: { bg: 'bg-red-100', text: 'text-red-700' },
};

const statusColors = {
  posted: { bg: 'bg-blue-100', text: 'text-blue-700' },
  bidding: { bg: 'bg-purple-100', text: 'text-purple-700' },
  assigned: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  in_progress: { bg: 'bg-orange-100', text: 'text-orange-700' },
  completed: { bg: 'bg-green-100', text: 'text-green-700' },
};

export default function JobDetailsScreen() {
  const navigation = useNavigation();
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const job = mockJob; // In real app, fetch from API

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSubmitBid = () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid bid amount');
      return;
    }
    Alert.alert(
      'Bid Submitted!',
      `Your bid of $${bidAmount} has been submitted. The homeowner will be notified.`,
      [{ text: 'OK', onPress: () => setShowBidModal(false) }]
    );
  };

  const handleContact = () => {
    Alert.alert('Contact', 'This would open a chat with the homeowner.');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View className="bg-white p-4 border-b border-gray-100">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-1">{job.title}</Text>
              <Text className="text-primary-500 font-medium">{job.category}</Text>
            </View>
            <View className="flex-row">
              <View className={`px-3 py-1 rounded-full mr-2 ${urgencyColors[job.urgency].bg}`}>
                <Text className={`text-sm font-medium ${urgencyColors[job.urgency].text}`}>
                  {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)}
                </Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${statusColors[job.status].bg}`}>
                <Text className={`text-sm font-medium ${statusColors[job.status].text}`}>
                  {job.status.replace('_', ' ').charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center">
            <MapPin color="#6b7280" size={16} />
            <Text className="text-gray-600 ml-2">
              {job.address.city}, {job.address.state} {job.address.zip}
            </Text>
          </View>
        </View>

        {/* Pricing & Hours */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-3">Estimate Details</Text>
          
          <View className="flex-row">
            <View className="flex-1 items-center p-3 bg-green-50 rounded-lg mr-2">
              <DollarSign color="#22c55e" size={24} />
              <Text className="text-gray-600 text-sm mt-1">Estimated Cost</Text>
              <Text className="text-xl font-bold text-gray-900">
                ${job.estimatedCost.min} - ${job.estimatedCost.max}
              </Text>
            </View>
            <View className="flex-1 items-center p-3 bg-blue-50 rounded-lg ml-2">
              <Clock color="#0ea5e9" size={24} />
              <Text className="text-gray-600 text-sm mt-1">Labor Hours</Text>
              <Text className="text-xl font-bold text-gray-900">{job.laborHours}h</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-3">Description</Text>
          <Text className="text-gray-700 leading-6">{job.description}</Text>
        </View>

        {/* Scope of Work */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <FileText color="#0ea5e9" size={20} />
            <Text className="text-lg font-bold text-gray-900 ml-2">Scope of Work</Text>
          </View>
          {job.scope.map((item, index) => (
            <View key={index} className="flex-row items-start mb-2">
              <CheckCircle color="#22c55e" size={18} />
              <Text className="text-gray-700 ml-3 flex-1">{item}</Text>
            </View>
          ))}
        </View>

        {/* Materials Needed */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <Wrench color="#0ea5e9" size={20} />
            <Text className="text-lg font-bold text-gray-900 ml-2">Materials Needed</Text>
          </View>
          {job.materials.map((item, index) => (
            <View key={index} className="flex-row items-start mb-2">
              <View className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3" />
              <Text className="text-gray-700 flex-1">{item}</Text>
            </View>
          ))}
        </View>

        {/* Homeowner Info */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-3">Posted By</Text>
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
              <User color="#0ea5e9" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold">{job.homeowner.name}</Text>
              <View className="flex-row items-center">
                <Star color="#f59e0b" size={14} fill="#f59e0b" />
                <Text className="text-gray-600 ml-1">{job.homeowner.rating} • {job.homeowner.jobsPosted} jobs posted</Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={handleContact}
              className="bg-primary-50 p-3 rounded-full"
            >
              <MessageCircle color="#0ea5e9" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Bids */}
        {job.bids.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Current Bids ({job.bids.length})
            </Text>
            {job.bids.map((bid) => (
              <View 
                key={bid.id} 
                className="border border-gray-100 rounded-lg p-3 mb-2"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-900 font-bold">{bid.contractorName}</Text>
                  <Text className="text-green-600 font-bold text-lg">${bid.amount}</Text>
                </View>
                <Text className="text-gray-600 text-sm">{bid.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Spacer for bottom button */}
        <View className="h-24" />
      </ScrollView>

      {/* Submit Bid Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <TouchableOpacity
          onPress={() => setShowBidModal(true)}
          className="bg-primary-500 py-4 rounded-xl items-center flex-row justify-center"
        >
          <DollarSign color="#ffffff" size={20} />
          <Text className="text-white font-bold text-lg ml-2">Submit Your Bid</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
