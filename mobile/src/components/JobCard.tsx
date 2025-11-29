// Mobile Job Card Component
// Displays job information in a card format for iOS

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Clock, DollarSign, AlertCircle, ChevronRight } from 'lucide-react-native';
import type { Job, UrgencyLevel } from '@/types';

interface JobCardProps {
  job: Job;
  onPress: () => void;
}

const urgencyColors: Record<UrgencyLevel, { bg: string; text: string; border: string }> = {
  normal: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  urgent: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  emergency: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export function JobCard({ job, onPress }: JobCardProps) {
  const urgency = job.urgency || 'normal';
  const colors = urgencyColors[urgency];
  const cost = job.estimatedCost 
    ? `$${job.estimatedCost.min.toLocaleString()} - $${job.estimatedCost.max.toLocaleString()}`
    : 'Price not set';
  const laborHours = job.laborHours || job.scope?.laborHours || 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 pr-2">
          <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={2}>
            {job.title}
          </Text>
          <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
            {job.description}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${colors.bg} border ${colors.border}`}>
          <Text className={`text-xs font-semibold uppercase ${colors.text}`}>
            {urgency}
          </Text>
        </View>
      </View>

      <View className="space-y-2">
        <View className="flex-row items-center">
          <MapPin size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-2 flex-1" numberOfLines={1}>
            {job.address.city}, {job.address.state} {job.address.zip}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <DollarSign size={16} color="#6b7280" />
            <Text className="text-sm font-semibold text-gray-900 ml-2">
              {cost}
            </Text>
          </View>

          {laborHours > 0 && (
            <View className="flex-row items-center">
              <Clock size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600 ml-2">
                ~{laborHours}h
              </Text>
            </View>
          )}
        </View>

        {job.bids && job.bids.length > 0 && (
          <View className="flex-row items-center mt-2">
            <View className="bg-blue-100 px-2 py-1 rounded">
              <Text className="text-xs font-semibold text-blue-700">
                {job.bids.length} {job.bids.length === 1 ? 'bid' : 'bids'}
              </Text>
            </View>
          </View>
        )}

        {job.scope?.confidenceScore && (
          <View className="flex-row items-center mt-1">
            <Text className="text-xs text-gray-500">
              AI Confidence: {job.scope.confidenceScore}%
            </Text>
          </View>
        )}
      </View>

      <View className="absolute right-4 top-4">
        <ChevronRight size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});

