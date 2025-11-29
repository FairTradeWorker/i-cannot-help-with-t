// Enhanced Home Screen
// Dashboard for all user types

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  Video, Briefcase, MapPin, TrendingUp, Shield, DollarSign, Users, Zap,
  Plus, ArrowRight, CheckCircle, AlertCircle
} from 'lucide-react-native';
import { dataStore } from '@fairtradeworker/shared';
import type { User as UserType, Job } from '@/types';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  onPress?: () => void;
}

function StatCard({ icon, title, value, subtitle, color, onPress }: StatCardProps) {
  const content = (
    <View className="bg-white rounded-xl p-4 shadow-sm flex-1 min-w-[45%] m-1">
      <View className={`w-10 h-10 rounded-lg items-center justify-center mb-3`} style={{ backgroundColor: color }}>
        {icon}
      </View>
      <Text className="text-gray-600 text-xs mb-1">{title}</Text>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      <Text className="text-gray-500 text-xs mt-1">{subtitle}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [user, allJobs] = await Promise.all([
        dataStore.getCurrentUser(),
        dataStore.getJobs(),
      ]);
      
      setCurrentUser(user);
      
      // Get user-specific jobs
      if (user) {
        if (user.role === 'homeowner') {
          setJobs(allJobs.filter(j => j.homeownerId === user.id));
        } else if (user.role === 'contractor' || user.role === 'subcontractor') {
          setJobs(allJobs.filter(j => j.contractorId === user.id));
        } else {
          setJobs(allJobs.slice(0, 5)); // Show recent jobs
        }
      } else {
        setJobs(allJobs.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  const userRole = currentUser?.role || 'homeowner';
  const recentJobs = jobs.slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-white px-4 py-6 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}!` : 'Welcome to FairTradeWorker'}
          </Text>
          <Text className="text-gray-600">
            {userRole === 'homeowner' && 'Post jobs and find contractors'}
            {userRole === 'contractor' && 'Find jobs and grow your business'}
            {userRole === 'operator' && 'Manage your territories'}
            {!currentUser && 'Connect with local contractors'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Quick Actions</Text>
          
          <View className="flex-row flex-wrap -m-2">
            {userRole === 'homeowner' && (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate('JobPost' as never)}
                  className="w-1/2 p-2"
                >
                  <View className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 items-center">
                    <Video size={32} color="#ffffff" />
                    <Text className="text-white font-semibold mt-2 text-center">Post a Job</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Jobs' as never)}
                  className="w-1/2 p-2"
                >
                  <View className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 items-center">
                    <Briefcase size={32} color="#ffffff" />
                    <Text className="text-white font-semibold mt-2 text-center">My Jobs</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {userRole === 'contractor' && (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Jobs' as never)}
                  className="w-1/2 p-2"
                >
                  <View className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 items-center">
                    <Briefcase size={32} color="#ffffff" />
                    <Text className="text-white font-semibold mt-2 text-center">Browse Jobs</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Route' as never)}
                  className="w-1/2 p-2"
                >
                  <View className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 items-center">
                    <MapPin size={32} color="#ffffff" />
                    <Text className="text-white font-semibold mt-2 text-center">Plan Route</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {userRole === 'operator' && (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Territories' as never)}
                  className="w-1/2 p-2"
                >
                  <View className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 items-center">
                    <MapPin size={32} color="#ffffff" />
                    <Text className="text-white font-semibold mt-2 text-center">My Territories</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Stats */}
        {currentUser && (
          <View className="px-4 py-2">
            <Text className="text-lg font-bold text-gray-900 mb-4">Overview</Text>
            
            <View className="flex-row flex-wrap -m-1">
              {userRole === 'contractor' && (
                <>
                  <StatCard
                    icon={<Briefcase color="#ffffff" size={20} />}
                    title="Active Jobs"
                    value={jobs.filter(j => j.status === 'in_progress' || j.status === 'assigned').length.toString()}
                    subtitle="In progress"
                    color="#0ea5e9"
                    onPress={() => navigation.navigate('Jobs' as never)}
                  />
                  <StatCard
                    icon={<DollarSign color="#ffffff" size={20} />}
                    title="Earnings"
                    value="$0"
                    subtitle="This month"
                    color="#22c55e"
                  />
                </>
              )}

              {userRole === 'homeowner' && (
                <>
                  <StatCard
                    icon={<Briefcase color="#ffffff" size={20} />}
                    title="My Jobs"
                    value={jobs.length.toString()}
                    subtitle="Total posted"
                    color="#0ea5e9"
                    onPress={() => navigation.navigate('Jobs' as never)}
                  />
                  <StatCard
                    icon={<CheckCircle color="#ffffff" size={20} />}
                    title="Completed"
                    value={jobs.filter(j => j.status === 'completed').length.toString()}
                    subtitle="Jobs finished"
                    color="#22c55e"
                  />
                </>
              )}
            </View>
          </View>
        )}

        {/* Recent Jobs */}
        {recentJobs.length > 0 && (
          <View className="px-4 py-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                {userRole === 'homeowner' ? 'My Recent Jobs' : 'Recent Jobs'}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Jobs' as never)}>
                <Text className="text-primary-500 font-semibold">View All</Text>
              </TouchableOpacity>
            </View>

            {recentJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                onPress={() => navigation.navigate('JobDetails' as never, { jobId: job.id } as never)}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                      {job.title}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {job.address.city}, {job.address.state}
                    </Text>
                  </View>
                  <View className={`px-2 py-1 rounded ${
                    job.status === 'completed' ? 'bg-green-100' :
                    job.status === 'in_progress' ? 'bg-blue-100' :
                    'bg-yellow-100'
                  }`}>
                    <Text className={`text-xs font-medium ${
                      job.status === 'completed' ? 'text-green-700' :
                      job.status === 'in_progress' ? 'text-blue-700' :
                      'text-yellow-700'
                    }`}>
                      {job.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* First 300 Teaser */}
        {userRole === 'operator' && (
          <View className="mx-4 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6">
            <View className="flex-row items-center mb-3">
              <Zap size={24} color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-2">First 300 Launch</Text>
            </View>
            <Text className="text-white/90 mb-4">
              Claim First Priority forever - FREE! Only {300 - (jobs.length || 0)} spots left.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Territories' as never)}
              className="bg-white rounded-lg py-3 px-4 flex-row items-center justify-center"
            >
              <Text className="text-primary-600 font-bold mr-2">Claim Now</Text>
              <ArrowRight size={20} color="#0ea5e9" />
            </TouchableOpacity>
          </View>
        )}

        {/* Sign In Prompt */}
        {!currentUser && (
          <View className="mx-4 mb-6 bg-white rounded-xl p-6">
            <Text className="text-lg font-bold text-gray-900 mb-2">Get Started</Text>
            <Text className="text-gray-600 mb-4">
              Sign in or create an account to post jobs, find contractors, and manage your projects.
            </Text>
            <TouchableOpacity
              className="bg-primary-500 rounded-lg py-3 px-4 items-center"
              onPress={() => {
                // Navigate to login/signup
              }}
            >
              <Text className="text-white font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
