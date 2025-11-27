import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User,
  Star,
  Briefcase,
  DollarSign,
  MapPin,
  Shield,
  Award,
  ChevronRight,
  Settings,
  Navigation,
  Clock,
  TrendingUp,
  CheckCircle,
} from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { UserRole, ContractorProfile } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DashboardStats {
  completedJobs: number;
  rating: number;
  earnings: number;
  activeJobs: number;
}

const mockUser = {
  id: 'user1',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+1 (555) 123-4567',
  role: 'contractor' as UserRole,
  avatar: undefined,
};

const mockContractorProfile: ContractorProfile = {
  userId: 'user1',
  contractorType: 'general_contractor',
  rating: 4.8,
  completedJobs: 127,
  skills: ['Plumbing', 'Electrical', 'HVAC', 'General Repairs'],
  serviceRadius: 25,
  location: { lat: 30.2672, lng: -97.7431, address: 'Austin, TX' },
  hourlyRate: 75,
  availability: 'available',
  verified: true,
  licenses: [
    { type: 'General Contractor', number: 'TX-12345', state: 'TX', expiryDate: new Date('2025-12-31'), verified: true },
    { type: 'Electrical', number: 'TX-67890', state: 'TX', expiryDate: new Date('2025-06-30'), verified: true },
  ],
  insurance: {
    provider: 'State Farm',
    policyNumber: 'SF-123456',
    expiryDate: new Date('2025-08-15'),
    coverageAmount: 1000000,
    verified: true,
  },
  specialties: ['Kitchen Remodeling', 'Bathroom Renovation', 'Smart Home Installation'],
};

const mockStats: DashboardStats = {
  completedJobs: 127,
  rating: 4.8,
  earnings: 45230,
  activeJobs: 4,
};

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isContractor, setIsContractor] = useState(true);

  const renderContractorDashboard = () => (
    <>
      {/* Stats Cards */}
      <View className="flex-row flex-wrap -m-1 mb-4">
        <View className="w-1/2 p-1">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Briefcase color="#0ea5e9" size={20} />
              <Text className="text-gray-600 text-sm ml-2">Completed Jobs</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">{mockStats.completedJobs}</Text>
          </View>
        </View>
        <View className="w-1/2 p-1">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Star color="#f59e0b" size={20} />
              <Text className="text-gray-600 text-sm ml-2">Rating</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">{mockStats.rating}</Text>
          </View>
        </View>
        <View className="w-1/2 p-1">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <DollarSign color="#22c55e" size={20} />
              <Text className="text-gray-600 text-sm ml-2">Total Earnings</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">${mockStats.earnings.toLocaleString()}</Text>
          </View>
        </View>
        <View className="w-1/2 p-1">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Clock color="#8b5cf6" size={20} />
              <Text className="text-gray-600 text-sm ml-2">Active Jobs</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">{mockStats.activeJobs}</Text>
          </View>
        </View>
      </View>

      {/* Verification Status */}
      <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">Verification Status</Text>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
          <View className="flex-row items-center">
            <Shield color="#22c55e" size={20} />
            <Text className="text-gray-700 ml-3">Identity Verified</Text>
          </View>
          <CheckCircle color="#22c55e" size={20} />
        </View>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
          <View className="flex-row items-center">
            <Award color="#22c55e" size={20} />
            <Text className="text-gray-700 ml-3">Licenses Verified</Text>
          </View>
          <CheckCircle color="#22c55e" size={20} />
        </View>
        
        <View className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center">
            <Shield color="#22c55e" size={20} />
            <Text className="text-gray-700 ml-3">Insurance Verified</Text>
          </View>
          <CheckCircle color="#22c55e" size={20} />
        </View>
      </View>

      {/* Skills */}
      <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">Skills & Specialties</Text>
        <View className="flex-row flex-wrap -m-1">
          {mockContractorProfile.skills.map((skill, index) => (
            <View key={index} className="bg-primary-50 px-3 py-1 rounded-full m-1">
              <Text className="text-primary-700 text-sm font-medium">{skill}</Text>
            </View>
          ))}
        </View>
        <View className="flex-row flex-wrap -m-1 mt-2">
          {mockContractorProfile.specialties?.map((specialty, index) => (
            <View key={index} className="bg-purple-50 px-3 py-1 rounded-full m-1">
              <Text className="text-purple-700 text-sm font-medium">{specialty}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View className="bg-white rounded-xl shadow-sm mb-4">
        <TouchableOpacity
          onPress={() => navigation.navigate('Route')}
          className="flex-row items-center justify-between p-4 border-b border-gray-100"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Navigation color="#3b82f6" size={20} />
            </View>
            <Text className="text-gray-900 font-medium">Route Optimizer</Text>
          </View>
          <ChevronRight color="#9ca3af" size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          className="flex-row items-center justify-between p-4"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
              <Settings color="#6b7280" size={20} />
            </View>
            <Text className="text-gray-900 font-medium">Settings</Text>
          </View>
          <ChevronRight color="#9ca3af" size={20} />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderHomeownerDashboard = () => (
    <>
      {/* Stats Cards */}
      <View className="flex-row flex-wrap -m-1 mb-4">
        <View className="w-1/2 p-1">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Briefcase color="#0ea5e9" size={20} />
              <Text className="text-gray-600 text-sm ml-2">Projects</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">5</Text>
          </View>
        </View>
        <View className="w-1/2 p-1">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <DollarSign color="#22c55e" size={20} />
              <Text className="text-gray-600 text-sm ml-2">Saved</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">$2,340</Text>
          </View>
        </View>
        <View className="w-1/2 p-1">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Clock color="#8b5cf6" size={20} />
              <Text className="text-gray-600 text-sm ml-2">Active</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">2</Text>
          </View>
        </View>
        <View className="w-1/2 p-1">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <TrendingUp color="#f59e0b" size={20} />
              <Text className="text-gray-600 text-sm ml-2">Loyalty Points</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">1,250</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="bg-white rounded-xl shadow-sm mb-4">
        <TouchableOpacity
          onPress={() => navigation.navigate('JobPost')}
          className="flex-row items-center justify-between p-4 border-b border-gray-100"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
              <Briefcase color="#0ea5e9" size={20} />
            </View>
            <Text className="text-gray-900 font-medium">Post a New Job</Text>
          </View>
          <ChevronRight color="#9ca3af" size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          className="flex-row items-center justify-between p-4"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
              <Settings color="#6b7280" size={20} />
            </View>
            <Text className="text-gray-900 font-medium">Settings</Text>
          </View>
          <ChevronRight color="#9ca3af" size={20} />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="bg-white p-4 mb-4">
          <View className="flex-row items-center">
            <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mr-4">
              <User color="#0ea5e9" size={40} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-gray-900">{mockUser.name}</Text>
                {mockContractorProfile.verified && (
                  <View className="ml-2 bg-green-100 px-2 py-0.5 rounded-full">
                    <Text className="text-green-700 text-xs font-medium">Verified</Text>
                  </View>
                )}
              </View>
              <Text className="text-gray-500 mt-1">{mockUser.email}</Text>
              <View className="flex-row items-center mt-2">
                <MapPin color="#6b7280" size={14} />
                <Text className="text-gray-600 text-sm ml-1">{mockContractorProfile.location.address}</Text>
              </View>
            </View>
          </View>

          {/* Role Toggle */}
          <View className="flex-row items-center justify-between mt-4 bg-gray-50 rounded-lg p-3">
            <Text className="text-gray-700 font-medium">View as Contractor</Text>
            <Switch
              value={isContractor}
              onValueChange={setIsContractor}
              trackColor={{ false: '#d1d5db', true: '#0ea5e9' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Role-specific Dashboard */}
        <View className="px-4">
          {isContractor ? renderContractorDashboard() : renderHomeownerDashboard()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
