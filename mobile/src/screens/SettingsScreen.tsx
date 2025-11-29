// Enhanced Settings Screen
// Complete app settings and preferences

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, Shield, CreditCard, User, Moon, Globe, 
  HelpCircle, LogOut, ChevronRight, Trash2,
  MapPin, Calendar, DollarSign
} from 'lucide-react-native';
import { dataStore } from '@fairtradeworker/shared';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);

  const handleSignOut = () => {
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
              Alert.alert('Signed Out', 'You have been signed out successfully.');
            } catch (error) {
              console.error('Failed to sign out:', error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Account deletion is not yet implemented.');
          },
        },
      ]
    );
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
      <Text className="text-sm font-semibold text-gray-500 uppercase mb-3 px-4">
        {title}
      </Text>
      <View className="bg-white rounded-xl overflow-hidden">
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ 
    icon, 
    label, 
    value, 
    onPress, 
    showChevron = true,
    rightComponent
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-primary-100 rounded-lg items-center justify-center mr-3">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-base text-gray-900 font-medium">{label}</Text>
          {value && (
            <Text className="text-sm text-gray-500 mt-0.5">{value}</Text>
          )}
        </View>
      </View>
      {rightComponent || (showChevron && onPress && (
        <ChevronRight size={20} color="#9ca3af" />
      ))}
    </TouchableOpacity>
  );

  const SwitchItem = ({
    icon,
    label,
    value,
    onValueChange,
    description
  }: {
    icon: React.ReactNode;
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    description?: string;
  }) => (
    <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-primary-100 rounded-lg items-center justify-center mr-3">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-base text-gray-900 font-medium">{label}</Text>
          {description && (
            <Text className="text-sm text-gray-500 mt-0.5">{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#d1d5db', true: '#0ea5e9' }}
        thumbColor="#ffffff"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        </View>

        {/* Account Settings */}
        <View className="px-4 pt-6">
          <SettingSection title="Account">
            <SettingItem
              icon={<User size={20} color="#0ea5e9" />}
              label="Profile"
              value="Edit your profile information"
              onPress={() => {
                // Navigate to profile edit
              }}
            />
            <SettingItem
              icon={<Shield size={20} color="#0ea5e9" />}
              label="Privacy & Security"
              value="Manage your privacy settings"
              onPress={() => {
                // Navigate to privacy
              }}
            />
            <SettingItem
              icon={<MapPin size={20} color="#0ea5e9" />}
              label="Location"
              value="Manage location permissions"
              onPress={() => {
                // Navigate to location settings
              }}
            />
          </SettingSection>

          {/* Notifications */}
          <SettingSection title="Notifications">
            <SwitchItem
              icon={<Bell size={20} color="#0ea5e9" />}
              label="Notifications"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              description="Enable or disable all notifications"
            />
            {notificationsEnabled && (
              <>
                <SwitchItem
                  icon={<Bell size={20} color="#0ea5e9" />}
                  label="Push Notifications"
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  description="Receive push notifications on your device"
                />
                <SwitchItem
                  icon={<Bell size={20} color="#0ea5e9" />}
                  label="Email Notifications"
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  description="Receive email notifications"
                />
              </>
            )}
          </SettingSection>

          {/* Preferences */}
          <SettingSection title="Preferences">
            <SwitchItem
              icon={<Moon size={20} color="#0ea5e9" />}
              label="Dark Mode"
              value={darkMode}
              onValueChange={setDarkMode}
              description="Switch to dark theme"
            />
            <SettingItem
              icon={<Globe size={20} color="#0ea5e9" />}
              label="Language"
              value="English (US)"
              onPress={() => {
                // Navigate to language settings
              }}
            />
            <SwitchItem
              icon={<MapPin size={20} color="#0ea5e9" />}
              label="Location Tracking"
              value={locationTracking}
              onValueChange={setLocationTracking}
              description="Allow location tracking for better job matching"
            />
          </SettingSection>

          {/* Payments */}
          <SettingSection title="Payments">
            <SettingItem
              icon={<CreditCard size={20} color="#0ea5e9" />}
              label="Payment Methods"
              value="Manage your payment options"
              onPress={() => {
                // Navigate to payment methods
              }}
            />
            <SettingItem
              icon={<DollarSign size={20} color="#0ea5e9" />}
              label="Billing History"
              value="View past transactions"
              onPress={() => {
                // Navigate to billing
              }}
            />
          </SettingSection>

          {/* Support */}
          <SettingSection title="Support">
            <SettingItem
              icon={<HelpCircle size={20} color="#0ea5e9" />}
              label="Help Center"
              value="Get help and support"
              onPress={() => {
                // Open help center
              }}
            />
            <SettingItem
              icon={<HelpCircle size={20} color="#0ea5e9" />}
              label="Contact Us"
              value="Send us feedback"
              onPress={() => {
                // Open contact form
              }}
            />
            <SettingItem
              icon={<Globe size={20} color="#0ea5e9" />}
              label="Terms of Service"
              onPress={() => {
                // Open terms
              }}
            />
            <SettingItem
              icon={<Shield size={20} color="#0ea5e9" />}
              label="Privacy Policy"
              onPress={() => {
                // Open privacy policy
              }}
            />
          </SettingSection>

          {/* Danger Zone */}
          <SettingSection title="Account Actions">
            <SettingItem
              icon={<LogOut size={20} color="#ef4444" />}
              label="Sign Out"
              onPress={handleSignOut}
            />
            <SettingItem
              icon={<Trash2 size={20} color="#ef4444" />}
              label="Delete Account"
              value="Permanently delete your account"
              onPress={handleDeleteAccount}
            />
          </SettingSection>

          {/* App Info */}
          <View className="mt-6 mb-6 items-center">
            <Text className="text-sm text-gray-500">FairTradeWorker</Text>
            <Text className="text-xs text-gray-400 mt-1">Version 1.0.0</Text>
            <Text className="text-xs text-gray-400 mt-1">
              © 2024 FairTradeWorker. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
