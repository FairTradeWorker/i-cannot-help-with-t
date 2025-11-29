// Enhanced Profile Screen
// User profile management and settings

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, Edit2, Camera, Shield, CreditCard, Bell, LogOut, 
  CheckCircle, MapPin, Phone, Mail, Briefcase, Star
} from 'lucide-react-native';
import { dataStore } from '@fairtradeworker/shared';
import type { User as UserType } from '@/types';

export default function ProfileScreen() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const user = await dataStore.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setEditedName(user.name);
        setEditedPhone(user.phone || '');
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    try {
      const updatedUser: UserType = {
        ...currentUser,
        name: editedName,
        phone: editedPhone || undefined,
      };

      await dataStore.saveUser(updatedUser);
      await dataStore.setCurrentUser(updatedUser);
      setCurrentUser(updatedUser);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await dataStore.setCurrentUser(null as any);
              // Navigate to login screen
              Alert.alert('Signed Out', 'You have been signed out successfully.');
            } catch (error) {
              console.error('Failed to sign out:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center px-6">
        <User size={64} color="#9ca3af" />
        <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">Not Signed In</Text>
        <Text className="text-gray-600 text-center mb-6">
          Sign in or create an account to manage your profile
        </Text>
        <TouchableOpacity
          className="bg-primary-500 px-8 py-3 rounded-full"
          onPress={() => {
            // Navigate to login
          }}
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const userRole = currentUser.role;
  const contractorProfile = currentUser.contractorProfile;
  const homeownerProfile = currentUser.homeownerProfile;

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="bg-white px-4 py-6 border-b border-gray-200">
          <View className="items-center mb-4">
            <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-3">
              {currentUser.avatar ? (
                <Image
                  source={{ uri: currentUser.avatar }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <User size={48} color="#0ea5e9" />
              )}
              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-primary-500 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
              >
                <Camera size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {editing ? (
              <View className="w-full max-w-xs">
                <TextInput
                  className="text-xl font-bold text-gray-900 text-center mb-2 border-b border-gray-300 pb-2"
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Full Name"
                />
                <TextInput
                  className="text-base text-gray-600 text-center border-b border-gray-300 pb-2"
                  value={editedPhone}
                  onChangeText={setEditedPhone}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              </View>
            ) : (
              <>
                <Text className="text-xl font-bold text-gray-900 mb-1">
                  {currentUser.name}
                </Text>
                <View className="flex-row items-center">
                  <View className="bg-primary-100 px-3 py-1 rounded-full">
                    <Text className="text-primary-700 text-xs font-semibold uppercase">
                      {userRole.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
                {currentUser.phone && (
                  <View className="flex-row items-center mt-2">
                    <Phone size={14} color="#6b7280" />
                    <Text className="text-gray-600 text-sm ml-1">{currentUser.phone}</Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View className="flex-row gap-3">
            {editing ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setEditing(false);
                    setEditedName(currentUser.name);
                    setEditedPhone(currentUser.phone || '');
                  }}
                  className="flex-1 bg-gray-200 py-3 rounded-lg items-center"
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  className="flex-1 bg-primary-500 py-3 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold">Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => setEditing(true)}
                className="flex-1 bg-primary-500 py-3 rounded-lg flex-row items-center justify-center"
              >
                <Edit2 size={18} color="#ffffff" />
                <Text className="text-white font-semibold ml-2">Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Account Info */}
        <View className="bg-white px-4 py-4 mb-4 mt-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">Account Information</Text>
          
          <View className="flex-row items-center py-3 border-b border-gray-100">
            <Mail size={20} color="#6b7280" />
            <View className="ml-3 flex-1">
              <Text className="text-xs text-gray-500 mb-1">Email</Text>
              <Text className="text-base text-gray-900">{currentUser.email}</Text>
            </View>
          </View>

          {currentUser.phone && (
            <View className="flex-row items-center py-3 border-b border-gray-100">
              <Phone size={20} color="#6b7280" />
              <View className="ml-3 flex-1">
                <Text className="text-xs text-gray-500 mb-1">Phone</Text>
                <Text className="text-base text-gray-900">{currentUser.phone}</Text>
              </View>
            </View>
          )}

          <View className="flex-row items-center py-3">
            <Briefcase size={20} color="#6b7280" />
            <View className="ml-3 flex-1">
              <Text className="text-xs text-gray-500 mb-1">Role</Text>
              <Text className="text-base text-gray-900 capitalize">
                {userRole.replace('_', ' ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Contractor Stats */}
        {contractorProfile && (
          <View className="bg-white px-4 py-4 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">Contractor Profile</Text>
            
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1">Rating</Text>
                <View className="flex-row items-center">
                  <Star size={18} color="#f59e0b" fill="#f59e0b" />
                  <Text className="text-lg font-bold text-gray-900 ml-2">
                    {contractorProfile.rating.toFixed(1)}
                  </Text>
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1">Completed Jobs</Text>
                <Text className="text-lg font-bold text-gray-900">
                  {contractorProfile.completedJobs}
                </Text>
              </View>
            </View>

            {contractorProfile.location && (
              <View className="flex-row items-center py-3 border-t border-gray-100">
                <MapPin size={20} color="#6b7280" />
                <View className="ml-3 flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Service Area</Text>
                  <Text className="text-base text-gray-900">
                    {contractorProfile.location.address}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Settings */}
        <View className="bg-white px-4 py-4 mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">Settings</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-row items-center flex-1">
              <Bell size={20} color="#6b7280" />
              <View className="ml-3">
                <Text className="text-base text-gray-900">Notifications</Text>
                <Text className="text-sm text-gray-500">Manage notification preferences</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-row items-center flex-1">
              <Shield size={20} color="#6b7280" />
              <View className="ml-3">
                <Text className="text-base text-gray-900">Privacy & Security</Text>
                <Text className="text-sm text-gray-500">Account security settings</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center flex-1">
              <CreditCard size={20} color="#6b7280" />
              <View className="ml-3">
                <Text className="text-base text-gray-900">Payment Methods</Text>
                <Text className="text-sm text-gray-500">Manage payment options</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white px-4 py-4 mb-6 flex-row items-center justify-center"
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="text-red-600 font-semibold ml-2">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
