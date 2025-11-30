// Enhanced Home Screen
// Dashboard for all user types

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Video, Briefcase, MapPin, TrendingUp, Shield, DollarSign, Users, Zap,
  Plus, ArrowRight, CheckCircle, AlertCircle
} from 'lucide-react-native';
import { dataStore } from '@fairtradeworker/shared';
import type { User as UserType, Job } from '@/types';
import { AnimatedLoader } from '../components/AnimatedLoader';
import { ActionCard } from '../components/ActionCard';
import { PushableButton } from '../components/PushableButton';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  onPress?: () => void;
}

function StatCard({ icon, title, value, subtitle, color, onPress }: StatCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const content = (
    <View className={`rounded-xl p-4 shadow-sm flex-1 min-w-[45%] m-1 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <View className={`w-10 h-10 rounded-lg items-center justify-center mb-3`} style={{ backgroundColor: color }}>
        {icon}
      </View>
      <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</Text>
      <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</Text>
      <Text className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{subtitle}</Text>
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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
      <SafeAreaView className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <AnimatedLoader size="large" />
        <Text className={`mt-8 text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  const userRole = currentUser?.role || 'homeowner';
  const recentJobs = jobs.slice(0, 3);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`} edges={['bottom']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className={`px-4 py-6 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Text className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}!` : 'Welcome to FairTradeWorker'}
          </Text>
          <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {userRole === 'homeowner' && 'Post jobs and find contractors'}
            {userRole === 'contractor' && 'Find jobs and grow your business'}
            {userRole === 'operator' && 'Manage your territories'}
            {!currentUser && 'Connect with local contractors'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="px-4 py-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</Text>

          {userRole === 'homeowner' && (
            <>
              <ActionCard
                icon={Video}
                title="Post a Job"
                description="Record a video or take photos to quickly create a job posting and connect with local contractors."
                onPress={() => navigation.navigate('VideoJobCreation' as never)}
                buttonText="Create Job"
                iconColor="#008bf8"
              />

              <ActionCard
                icon={Briefcase}
                title="My Jobs"
                description="View and manage all your posted jobs, track progress, and communicate with contractors."
                onPress={() => navigation.navigate('Jobs' as never)}
                buttonText="View Jobs"
                iconColor="#22c55e"
              />
            </>
          )}

          {userRole === 'contractor' && (
            <>
              <ActionCard
                icon={Briefcase}
                title="Browse Jobs"
                description="Discover new job opportunities in your area and submit competitive bids."
                onPress={() => navigation.navigate('Jobs' as never)}
                buttonText="Browse"
                iconColor="#008bf8"
              />

              <ActionCard
                icon={MapPin}
                title="Plan Route"
                description="Optimize your daily route to visit multiple job sites efficiently and save time."
                onPress={() => navigation.navigate('Route' as never)}
                buttonText="Plan Now"
                iconColor="#a855f7"
              />
            </>
          )}

          {userRole === 'operator' && (
            <ActionCard
              icon={MapPin}
              title="My Territories"
              description="Manage your service territories and claim exclusive priority in your areas."
              onPress={() => navigation.navigate('Territories' as never)}
              buttonText="Manage"
              iconColor="#008bf8"
            />
          )}
        </View>

        {/* Stats */}
        {currentUser && (
          <View className="px-4 py-2">
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Overview</Text>
            
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
              <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
                className={`rounded-xl p-4 mb-3 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} numberOfLines={1}>
                      {job.title}
                    </Text>
                    <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {job.address.city}, {job.address.state}
                    </Text>
                  </View>
                  <View className={`px-2 py-1 rounded ${
                    job.status === 'completed' ? (isDark ? 'bg-green-900/30' : 'bg-green-100') :
                    job.status === 'in_progress' ? (isDark ? 'bg-blue-900/30' : 'bg-blue-100') :
                    (isDark ? 'bg-yellow-900/30' : 'bg-yellow-100')
                  }`}>
                    <Text className={`text-xs font-medium ${
                      job.status === 'completed' ? (isDark ? 'text-green-400' : 'text-green-700') :
                      job.status === 'in_progress' ? (isDark ? 'text-blue-400' : 'text-blue-700') :
                      (isDark ? 'text-yellow-400' : 'text-yellow-700')
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
          <View className="mx-4 mb-6" style={{ backgroundColor: '#008bf8', borderRadius: 20, padding: 24 }}>
            <View className="flex-row items-center mb-3">
              <Zap size={24} color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-2">First 300 Launch</Text>
            </View>
            <Text className="text-white/90 mb-4">
              Claim First Priority forever - FREE! Only {300 - (jobs.length || 0)} spots left.
            </Text>
            <PushableButton
              onPress={() => navigation.navigate('Territories' as never)}
              color="#ffffff"
              fullWidth
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-primary-600 font-bold mr-2">Claim Now</Text>
                <ArrowRight size={20} color="#0ea5e9" />
              </View>
            </PushableButton>
          </View>
        )}

        {/* Sign In Prompt */}
        {!currentUser && (
          <View className={`mx-4 mb-6 rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Get Started</Text>
            <Text className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in or create an account to post jobs, find contractors, and manage your projects.
            </Text>
            <PushableButton
              onPress={() => {
                // Navigate to login/signup
              }}
              color="#008bf8"
              fullWidth
            >
              Sign In
            </PushableButton>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
