import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Briefcase,
  MessageSquare,
  DollarSign,
  Star,
  AlertCircle,
  Info,
  ChevronRight,
  Settings,
} from 'lucide-react-native';

// ============================================================================
// Types
// ============================================================================

type NotificationType = 
  | 'job_posted'
  | 'bid_received'
  | 'bid_accepted'
  | 'bid_rejected'
  | 'message'
  | 'payment_received'
  | 'rating_received'
  | 'system'
  | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'bid_received',
    title: 'New Bid Received',
    message: 'Elite Home Services submitted a bid of $2,450 for your Kitchen Renovation job.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    actionLabel: 'View Bid',
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'Quick Fix Plumbing: "Hi! I wanted to follow up on the bathroom repair quote..."',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
    actionLabel: 'Reply',
  },
  {
    id: '3',
    type: 'bid_accepted',
    title: 'Bid Accepted!',
    message: 'Your bid for HVAC Installation has been accepted. The job starts on Monday.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    actionLabel: 'View Details',
  },
  {
    id: '4',
    type: 'payment_received',
    title: 'Payment Received',
    message: 'You received $1,200 for the Electrical Panel Upgrade job.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '5',
    type: 'rating_received',
    title: 'New Review',
    message: 'John D. left you a 5-star review: "Excellent work, highly professional!"',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    actionLabel: 'View Review',
  },
  {
    id: '6',
    type: 'system',
    title: 'New Territory Available',
    message: 'A new territory is now available in your area: Roofing - ZIP 78660',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: true,
    actionLabel: 'Explore',
  },
  {
    id: '7',
    type: 'warning',
    title: 'License Expiring Soon',
    message: 'Your General Contractor license expires in 30 days. Please renew to continue accepting jobs.',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
    read: true,
    actionLabel: 'Renew Now',
  },
];

// ============================================================================
// Component
// ============================================================================

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = notifications.filter(n => 
    filter === 'all' ? true : !n.read
  );

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'job_posted':
        return <Briefcase color="#0ea5e9" size={20} />;
      case 'bid_received':
      case 'bid_accepted':
      case 'bid_rejected':
        return <Briefcase color="#22c55e" size={20} />;
      case 'message':
        return <MessageSquare color="#8b5cf6" size={20} />;
      case 'payment_received':
        return <DollarSign color="#22c55e" size={20} />;
      case 'rating_received':
        return <Star color="#f59e0b" size={20} />;
      case 'warning':
        return <AlertCircle color="#ef4444" size={20} />;
      default:
        return <Info color="#6b7280" size={20} />;
    }
  };

  const getIconBackground = (type: NotificationType) => {
    switch (type) {
      case 'job_posted':
        return 'bg-blue-100';
      case 'bid_received':
      case 'bid_accepted':
        return 'bg-green-100';
      case 'bid_rejected':
        return 'bg-red-100';
      case 'message':
        return 'bg-purple-100';
      case 'payment_received':
        return 'bg-green-100';
      case 'rating_received':
        return 'bg-yellow-100';
      case 'warning':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications(current =>
      current.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(current => current.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(current => current.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => !item.read && markAsRead(item.id)}
      className={`bg-white rounded-xl p-4 mb-3 shadow-sm ${
        !item.read ? 'border-l-4 border-primary-500' : ''
      }`}
    >
      <View className="flex-row items-start">
        <View className={`w-10 h-10 rounded-full items-center justify-center ${getIconBackground(item.type)}`}>
          {getIcon(item.type)}
        </View>
        
        <View className="flex-1 ml-3">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-gray-900 font-bold">{item.title}</Text>
              {!item.read && (
                <View className="bg-primary-500 w-2 h-2 rounded-full absolute -left-3 top-2" />
              )}
            </View>
            <Text className="text-gray-500 text-xs">{formatTimeAgo(item.timestamp)}</Text>
          </View>
          
          <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>
            {item.message}
          </Text>
          
          {item.actionLabel && (
            <TouchableOpacity className="mt-2 flex-row items-center">
              <Text className="text-primary-500 font-medium text-sm">{item.actionLabel}</Text>
              <ChevronRight color="#0ea5e9" size={16} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => deleteNotification(item.id)}
          className="ml-2 p-1"
        >
          <Trash2 color="#9ca3af" size={18} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      {/* Header Actions */}
      <View className="bg-white px-4 py-3 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Bell color="#0ea5e9" size={24} />
            <Text className="text-xl font-bold text-gray-900 ml-2">Notifications</Text>
            {unreadCount > 0 && (
              <View className="bg-primary-500 rounded-full px-2 py-0.5 ml-2">
                <Text className="text-white text-xs font-bold">{unreadCount}</Text>
              </View>
            )}
          </View>
          
          <View className="flex-row">
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead} className="mr-3">
                <CheckCheck color="#22c55e" size={24} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={clearAll}>
              <Trash2 color="#6b7280" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setFilter('all')}
            className={`px-4 py-2 rounded-full mr-2 ${
              filter === 'all' ? 'bg-primary-500' : 'bg-gray-100'
            }`}
          >
            <Text className={`font-medium ${filter === 'all' ? 'text-white' : 'text-gray-600'}`}>
              All ({notifications.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter('unread')}
            className={`px-4 py-2 rounded-full ${
              filter === 'unread' ? 'bg-primary-500' : 'bg-gray-100'
            }`}
          >
            <Text className={`font-medium ${filter === 'unread' ? 'text-white' : 'text-gray-600'}`}>
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mb-4">
            <BellOff color="#9ca3af" size={40} />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2">No Notifications</Text>
          <Text className="text-gray-500 text-center">
            {filter === 'unread' 
              ? "You're all caught up!" 
              : 'Notifications will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0ea5e9']}
            />
          }
        />
      )}

      {/* Settings Button */}
      <View className="bg-white border-t border-gray-200 px-4 py-3">
        <TouchableOpacity className="flex-row items-center justify-between py-2">
          <View className="flex-row items-center">
            <Settings color="#6b7280" size={20} />
            <Text className="text-gray-700 font-medium ml-3">Notification Settings</Text>
          </View>
          <ChevronRight color="#9ca3af" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
