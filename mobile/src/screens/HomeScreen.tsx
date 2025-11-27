import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Video, Briefcase, MapPin, TrendingUp, Shield, DollarSign, Users, Zap } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm flex-1 min-w-[45%] m-1">
      <View className={`w-10 h-10 rounded-lg items-center justify-center mb-3`} style={{ backgroundColor: color }}>
        {icon}
      </View>
      <Text className="text-gray-600 text-xs mb-1">{title}</Text>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      <Text className="text-gray-500 text-xs mt-1">{subtitle}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const stats = [
    {
      icon: <Briefcase color="#ffffff" size={20} />,
      title: 'Active Jobs',
      value: '12',
      subtitle: '+3 this week',
      color: '#0ea5e9',
    },
    {
      icon: <TrendingUp color="#ffffff" size={20} />,
      title: 'Earnings',
      value: '$8,450',
      subtitle: 'This month',
      color: '#22c55e',
    },
    {
      icon: <Users color="#ffffff" size={20} />,
      title: 'Contractors',
      value: '847',
      subtitle: 'In your area',
      color: '#8b5cf6',
    },
    {
      icon: <Zap color="#ffffff" size={20} />,
      title: 'AI Accuracy',
      value: '94.2%',
      subtitle: 'Compounding',
      color: '#f59e0b',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Post a Job Card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('JobPost')}
          className="mx-4 mt-4 bg-primary-500 rounded-2xl p-6 shadow-lg"
          activeOpacity={0.9}
        >
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mr-4">
              <Video color="#ffffff" size={32} />
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-bold mb-1">Post a Job</Text>
              <Text className="text-white/80 text-sm">
                Record a 60-second video and let AI analyze the scope
              </Text>
            </View>
          </View>
          <View className="flex-row items-center mt-4 bg-white/10 rounded-lg p-3">
            <Shield color="#ffffff" size={16} />
            <Text className="text-white/90 text-xs ml-2 flex-1">
              AI-powered scope generation • Instant quotes • Verified contractors
            </Text>
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View className="mx-4 mt-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">Dashboard</Text>
          <View className="flex-row flex-wrap -m-1">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </View>
        </View>

        {/* Territory Teaser */}
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { screen: 'Territories' } as never)}
          className="mx-4 mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-5 shadow-lg overflow-hidden"
          activeOpacity={0.9}
          style={{ backgroundColor: '#8b5cf6' }}
        >
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-white text-lg font-bold mb-1">Own Your Territory</Text>
              <Text className="text-white/80 text-sm mb-3">
                Claim exclusive rights to neighborhoods and build your empire
              </Text>
              <View className="flex-row">
                <View className="bg-white/20 rounded-full px-3 py-1 mr-2">
                  <Text className="text-white text-xs font-medium">$2,500-$50,000</Text>
                </View>
                <View className="bg-white/20 rounded-full px-3 py-1">
                  <Text className="text-white text-xs font-medium">15% Revenue Share</Text>
                </View>
              </View>
            </View>
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center">
              <MapPin color="#ffffff" size={32} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Zero Fees Card */}
        <View className="mx-4 mt-4 mb-6 bg-white rounded-2xl p-5 shadow-sm border border-green-100">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-3">
              <DollarSign color="#22c55e" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">Zero Platform Fees</Text>
              <Text className="text-gray-600 text-sm">Death of the Middleman</Text>
            </View>
          </View>
          <View className="bg-gray-50 rounded-lg p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600 text-sm">Traditional platforms</Text>
              <Text className="text-red-500 font-bold">15-30% fees</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-sm">FairTradeWorker</Text>
              <Text className="text-green-500 font-bold">0% fees</Text>
            </View>
          </View>
          <Text className="text-gray-500 text-xs mt-3 text-center">
            Contractors keep 100% of their earnings. Territory owners earn through revenue share.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
