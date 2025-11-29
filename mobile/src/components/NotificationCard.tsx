// Mobile Notification Card Component
// Displays system notifications

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react-native';
import type { Notification } from '@/types';

interface NotificationCardProps {
  notification: Notification;
  onPress?: () => void;
  onDismiss?: () => void;
}

const notificationIcons: Record<Notification['type'], typeof Bell> = {
  'job_match': Bell,
  'bid_update': CheckCircle,
  'message': Bell,
  'job_status': Info,
  'payment': CheckCircle,
  'system': AlertCircle,
  'job_posted': Bell,
  'bid_received': CheckCircle,
  'bid_accepted': CheckCircle,
  'milestone_completed': CheckCircle,
  'payment_received': CheckCircle,
  'rating_received': Bell,
};

const notificationColors: Record<Notification['type'], { bg: string; icon: string }> = {
  'job_match': { bg: '#dbeafe', icon: '#0ea5e9' },
  'bid_update': { bg: '#dcfce7', icon: '#22c55e' },
  'message': { bg: '#f3f4f6', icon: '#6b7280' },
  'job_status': { bg: '#fef3c7', icon: '#f59e0b' },
  'payment': { bg: '#dcfce7', icon: '#22c55e' },
  'system': { bg: '#fee2e2', icon: '#ef4444' },
  'job_posted': { bg: '#dbeafe', icon: '#0ea5e9' },
  'bid_received': { bg: '#fce7f3', icon: '#ec4899' },
  'bid_accepted': { bg: '#dcfce7', icon: '#22c55e' },
  'milestone_completed': { bg: '#dcfce7', icon: '#22c55e' },
  'payment_received': { bg: '#dcfce7', icon: '#22c55e' },
  'rating_received': { bg: '#fef3c7', icon: '#f59e0b' },
};

export function NotificationCard({ notification, onPress, onDismiss }: NotificationCardProps) {
  const Icon = notificationIcons[notification.type] || Bell;
  const colors = notificationColors[notification.type] || { bg: '#f3f4f6', icon: '#6b7280' };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        !notification.read && styles.unreadCard,
      ]}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
          <Icon size={20} color={colors.icon} />
        </View>

        {/* Content */}
        <View className="flex-1 ml-3">
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-base font-semibold text-gray-900 flex-1">
              {notification.title}
            </Text>
            {!notification.read && (
              <View style={styles.unreadDot} />
            )}
          </View>

          <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
            {notification.message}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-500">
              {formatTime(notification.createdAt)}
            </Text>
            {onDismiss && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                className="p-1"
              >
                <X size={16} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  unreadCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#0ea5e9',
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0ea5e9',
    marginLeft: 8,
  },
});

