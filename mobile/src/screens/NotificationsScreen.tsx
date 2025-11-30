// Enhanced Notifications Screen - Full API Integration
// Real-time notification management

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Bell, Check, Trash2, Filter } from 'lucide-react-native';
import { NotificationCard } from '@/components/NotificationCard';
import { EmptyState } from '@/components/EmptyState';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [filterUnread, setFilterUnread] = useState(false);
  
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications({
    unreadOnly: filterUnread,
    autoRefresh: true,
    refreshInterval: 10000, // Refresh every 10 seconds
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: any) => {
    // Mark as read when opened
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.data?.jobId) {
      navigation.navigate('JobDetails' as never, { jobId: notification.data.jobId } as never);
    } else if (notification.data?.messageId) {
      navigation.navigate('Messages' as never, { jobId: notification.data.jobId } as never);
    }
  };

  const handleDismiss = async (notificationId: string) => {
    // Mark as read (dismiss)
    await markAsRead(notificationId);
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) {
      Alert.alert('Info', 'All notifications are already read');
      return;
    }

    Alert.alert(
      'Mark All Read',
      `Mark all ${unreadCount} unread notifications as read?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark All Read',
          onPress: async () => {
            await markAllAsRead();
          },
        },
      ]
    );
  };

  const displayedNotifications = notifications;

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Bell size={24} color="#111827" />
            <Text className="text-xl font-bold text-gray-900 ml-2">Notifications</Text>
            {unreadCount > 0 && (
              <View className="bg-primary-500 px-3 py-1 rounded-full ml-3">
                <Text className="text-white text-xs font-semibold">
                  {unreadCount} new
                </Text>
              </View>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllRead}
              className="flex-row items-center"
            >
              <Check size={20} color="#0ea5e9" />
              <Text className="text-primary-500 font-semibold ml-1">Mark All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View className="flex-row mt-3 gap-2">
          <TouchableOpacity
            onPress={() => setFilterUnread(false)}
            className={`px-4 py-2 rounded-full ${
              !filterUnread ? 'bg-primary-500' : 'bg-gray-200'
            }`}
          >
            <Text className={`text-sm font-semibold ${!filterUnread ? 'text-white' : 'text-gray-700'}`}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterUnread(true)}
            className={`px-4 py-2 rounded-full ${
              filterUnread ? 'bg-primary-500' : 'bg-gray-200'
            }`}
          >
            <Text className={`text-sm font-semibold ${filterUnread ? 'text-white' : 'text-gray-700'}`}>
              Unread
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text className="text-gray-600 mt-4">Loading notifications...</Text>
        </View>
      ) : displayedNotifications.length === 0 ? (
        <EmptyState
          type="notifications"
          title={filterUnread ? 'No Unread Notifications' : 'No Notifications'}
          message={
            filterUnread
              ? "You're all caught up! No unread notifications."
              : 'You have no notifications yet. New notifications will appear here.'
          }
        />
      ) : (
        <FlatList
          data={displayedNotifications}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onPress={() => handleNotificationPress(item)}
              onDismiss={() => handleDismiss(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}
