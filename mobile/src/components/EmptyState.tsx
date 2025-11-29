// Mobile Empty State Component
// Reusable empty state for lists and screens

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { 
  Inbox, Briefcase, MessageSquare, MapPin, Bell, 
  Search, FolderOpen, AlertCircle 
} from 'lucide-react-native';

type EmptyStateType = 
  | 'jobs'
  | 'messages'
  | 'notifications'
  | 'territories'
  | 'contractors'
  | 'search'
  | 'files'
  | 'error'
  | 'custom';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const defaultConfig: Record<EmptyStateType, { icon: any; title: string; message: string }> = {
  jobs: {
    icon: Briefcase,
    title: 'No Jobs Found',
    message: 'There are no jobs available at the moment. Check back later!',
  },
  messages: {
    icon: MessageSquare,
    title: 'No Messages',
    message: 'Your conversations will appear here once you start messaging.',
  },
  notifications: {
    icon: Bell,
    title: 'All Caught Up!',
    message: 'You don\'t have any notifications right now.',
  },
  territories: {
    icon: MapPin,
    title: 'No Territories',
    message: 'You haven\'t claimed any territories yet.',
  },
  contractors: {
    icon: Briefcase,
    title: 'No Contractors Found',
    message: 'No contractors match your search criteria.',
  },
  search: {
    icon: Search,
    title: 'No Results',
    message: 'Try adjusting your search terms or filters.',
  },
  files: {
    icon: FolderOpen,
    title: 'No Files',
    message: 'No files have been uploaded yet.',
  },
  error: {
    icon: AlertCircle,
    title: 'Something Went Wrong',
    message: 'We couldn\'t load this content. Please try again.',
  },
  custom: {
    icon: Inbox,
    title: '',
    message: '',
  },
};

export function EmptyState({
  type = 'custom',
  title,
  message,
  icon,
  actionLabel,
  onAction
}: EmptyStateProps) {
  const config = defaultConfig[type];
  const Icon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {typeof Icon === 'function' ? (
          <Icon size={64} color="#9ca3af" />
        ) : (
          Icon
        )}
      </View>
      
      <Text style={styles.title}>{displayTitle}</Text>
      <Text style={styles.message}>{displayMessage}</Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={styles.actionButton}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 300,
  },
  iconContainer: {
    marginBottom: 16,
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

