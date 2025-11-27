import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  CreditCard,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  Lock,
  Smartphone,
  Mail,
  MessageSquare,
  MapPin,
} from 'lucide-react-native';
import { COMPLIANCE_DOCUMENTS } from '@/lib/compliance';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

function SettingItem({ icon, title, subtitle, onPress, rightElement, danger }: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-4 px-4 ${onPress ? 'active:bg-gray-50' : ''}`}
    >
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${danger ? 'bg-red-100' : 'bg-gray-100'}`}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className={`font-medium ${danger ? 'text-red-600' : 'text-gray-900'}`}>{title}</Text>
        {subtitle && <Text className="text-gray-500 text-sm mt-0.5">{subtitle}</Text>}
      </View>
      {rightElement || (onPress && <ChevronRight color="#9ca3af" size={20} />)}
    </TouchableOpacity>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="text-gray-500 text-sm font-medium mb-2 px-4">{title}</Text>
      <View className="bg-white rounded-xl mx-4">{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    marketing: false,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    locationSharing: true,
  });

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePreferenceToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePaymentSettings = () => {
    Alert.alert('Payment Settings', 'Payment configuration will be available soon.');
  };

  const handleLegalDocument = (doc: keyof typeof COMPLIANCE_DOCUMENTS) => {
    const url = COMPLIANCE_DOCUMENTS[doc];
    Alert.alert(
      'Legal Document',
      `Opening ${doc.replace(/([A-Z])/g, ' $1').toLowerCase()}...`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => console.log(`Opening ${url}`) },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logging out...') },
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
            Alert.alert('Confirmation Required', 'Please contact support to complete account deletion.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <SettingSection title="NOTIFICATIONS">
          <SettingItem
            icon={<Bell color="#0ea5e9" size={20} />}
            title="Push Notifications"
            subtitle="Receive alerts on your device"
            rightElement={
              <Switch
                value={notifications.push}
                onValueChange={() => handleNotificationToggle('push')}
                trackColor={{ false: '#d1d5db', true: '#0ea5e9' }}
                thumbColor="#ffffff"
              />
            }
          />
          <View className="h-px bg-gray-100 ml-16" />
          <SettingItem
            icon={<Mail color="#22c55e" size={20} />}
            title="Email Notifications"
            subtitle="Get updates via email"
            rightElement={
              <Switch
                value={notifications.email}
                onValueChange={() => handleNotificationToggle('email')}
                trackColor={{ false: '#d1d5db', true: '#22c55e' }}
                thumbColor="#ffffff"
              />
            }
          />
          <View className="h-px bg-gray-100 ml-16" />
          <SettingItem
            icon={<MessageSquare color="#8b5cf6" size={20} />}
            title="SMS Notifications"
            subtitle="Receive text messages"
            rightElement={
              <Switch
                value={notifications.sms}
                onValueChange={() => handleNotificationToggle('sms')}
                trackColor={{ false: '#d1d5db', true: '#8b5cf6' }}
                thumbColor="#ffffff"
              />
            }
          />
          <View className="h-px bg-gray-100 ml-16" />
          <SettingItem
            icon={<Smartphone color="#f59e0b" size={20} />}
            title="Marketing Communications"
            subtitle="Promotions and updates"
            rightElement={
              <Switch
                value={notifications.marketing}
                onValueChange={() => handleNotificationToggle('marketing')}
                trackColor={{ false: '#d1d5db', true: '#f59e0b' }}
                thumbColor="#ffffff"
              />
            }
          />
        </SettingSection>

        {/* Payments */}
        <SettingSection title="PAYMENTS">
          <SettingItem
            icon={<CreditCard color="#22c55e" size={20} />}
            title="Payment Methods"
            subtitle="Manage your cards and bank accounts"
            onPress={handlePaymentSettings}
          />
          <View className="h-px bg-gray-100 ml-16" />
          <SettingItem
            icon={<Shield color="#0ea5e9" size={20} />}
            title="Payment Security"
            subtitle="Two-factor authentication"
            onPress={handlePaymentSettings}
          />
        </SettingSection>

        {/* Preferences */}
        <SettingSection title="PREFERENCES">
          <SettingItem
            icon={<Moon color="#6b7280" size={20} />}
            title="Dark Mode"
            subtitle="Switch to dark theme"
            rightElement={
              <Switch
                value={preferences.darkMode}
                onValueChange={() => handlePreferenceToggle('darkMode')}
                trackColor={{ false: '#d1d5db', true: '#6b7280' }}
                thumbColor="#ffffff"
              />
            }
          />
          <View className="h-px bg-gray-100 ml-16" />
          <SettingItem
            icon={<MapPin color="#ef4444" size={20} />}
            title="Location Sharing"
            subtitle="Share location for job matching"
            rightElement={
              <Switch
                value={preferences.locationSharing}
                onValueChange={() => handlePreferenceToggle('locationSharing')}
                trackColor={{ false: '#d1d5db', true: '#ef4444' }}
                thumbColor="#ffffff"
              />
            }
          />
          <View className="h-px bg-gray-100 ml-16" />
          <SettingItem
            icon={<Globe color="#8b5cf6" size={20} />}
            title="Language"
            subtitle="English (US)"
            onPress={() => Alert.alert('Language', 'Language selection coming soon.')}
          />
        </SettingSection>

        {/* Legal */}
        <SettingSection title="LEGAL">
          <SettingItem
            icon={<FileText color="#6b7280" size={20} />}
            title="Terms of Service"
            onPress={() => handleLegalDocument('termsOfService')}
          />
          <View className="h-px bg-gray-100 ml-16" />
          <SettingItem
            icon={<Lock color="#6b7280" size={20} />}
            title="Privacy Policy"
            onPress={() => handleLegalDocument('privacyPolicy')}
          />
          <View className="h-px bg-gray-100 ml-16" />
          <SettingItem
            icon={<FileText color="#6b7280" size={20} />}
            title="Contractor Agreement"
            onPress={() => handleLegalDocument('contractorAgreement')}
          />
          <View className="h-px bg-gray-100 ml-16" />
          <SettingItem
            icon={<Shield color="#6b7280" size={20} />}
            title="Dispute Resolution"
            onPress={() => handleLegalDocument('disputeResolution')}
          />
        </SettingSection>

        {/* Support */}
        <SettingSection title="SUPPORT">
          <SettingItem
            icon={<HelpCircle color="#0ea5e9" size={20} />}
            title="Help Center"
            subtitle="FAQs and guides"
            onPress={() => Alert.alert('Help Center', 'Opening help center...')}
          />
          <View className="h-px bg-gray-100 ml-16" />
          <SettingItem
            icon={<MessageSquare color="#22c55e" size={20} />}
            title="Contact Support"
            subtitle="Get help from our team"
            onPress={() => Alert.alert('Contact Support', 'support@fairtradeworker.com')}
          />
        </SettingSection>

        {/* Account Actions */}
        <SettingSection title="ACCOUNT">
          <SettingItem
            icon={<LogOut color="#ef4444" size={20} />}
            title="Log Out"
            onPress={handleLogout}
            danger
          />
          <View className="h-px bg-gray-100 ml-16" />
          <SettingItem
            icon={<Shield color="#ef4444" size={20} />}
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
            danger
          />
        </SettingSection>

        {/* App Info */}
        <View className="items-center py-6">
          <Text className="text-gray-400 text-sm">FairTradeWorker Mobile v1.0.0</Text>
          <Text className="text-gray-400 text-xs mt-1">© 2024 FairTradeWorker, Inc.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
