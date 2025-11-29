// Mobile Territory Card Component
// Displays territory information in list view

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Users, TrendingUp, Lock, CheckCircle, DollarSign } from 'lucide-react-native';
import type { Territory } from '@/types';

interface TerritoryCardProps {
  territory: Territory;
  onPress: () => void;
  isSelected?: boolean;
}

export function TerritoryCard({ territory, onPress, isSelected = false }: TerritoryCardProps) {
  const isClaimed = !!territory.operatorId;
  const monthlyRevenue = territory.stats?.monthlyRevenue || 0;
  const activeJobs = territory.stats?.totalJobs || 0;
  const contractors = territory.stats?.activeContractors || 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        isClaimed && styles.claimedCard
      ]}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={1}>
            {territory.name}
          </Text>
          <View className="flex-row items-center mb-2">
            <MapPin size={14} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-1">
              {territory.zipCodes?.slice(0, 3).join(', ') || 'No zip codes'}
              {territory.zipCodes && territory.zipCodes.length > 3 && ` +${territory.zipCodes.length - 3} more`}
            </Text>
          </View>
        </View>

        <View style={[
          styles.statusBadge,
          isClaimed ? styles.claimedBadge : styles.availableBadge
        ]}>
          {isClaimed ? (
            <View className="flex-row items-center">
              <Lock size={12} color="#ef4444" />
              <Text className="text-red-700 text-xs font-semibold ml-1">Claimed</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <CheckCircle size={12} color="#22c55e" />
              <Text className="text-green-700 text-xs font-semibold ml-1">Available</Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap -m-1 mb-3">
        <View className="w-1/3 p-1">
          <View className="bg-gray-50 rounded-lg p-2 items-center">
            <TrendingUp size={16} color="#0ea5e9" />
            <Text className="text-xs text-gray-600 mt-1">Jobs</Text>
            <Text className="text-base font-bold text-gray-900">{activeJobs}</Text>
          </View>
        </View>

        <View className="w-1/3 p-1">
          <View className="bg-gray-50 rounded-lg p-2 items-center">
            <Users size={16} color="#8b5cf6" />
            <Text className="text-xs text-gray-600 mt-1">Contractors</Text>
            <Text className="text-base font-bold text-gray-900">{contractors}</Text>
          </View>
        </View>

        <View className="w-1/3 p-1">
          <View className="bg-gray-50 rounded-lg p-2 items-center">
            <DollarSign size={16} color="#22c55e" />
            <Text className="text-xs text-gray-600 mt-1">Revenue</Text>
            <Text className="text-base font-bold text-gray-900">
              ${(monthlyRevenue / 1000).toFixed(1)}k
            </Text>
          </View>
        </View>
      </View>

      {/* Purchase Price or Status */}
      {isClaimed ? (
        <View className="bg-red-50 rounded-lg p-2 border border-red-200">
          <Text className="text-red-700 text-xs text-center">
            This territory has been claimed
          </Text>
        </View>
      ) : (
        <View className="bg-green-50 rounded-lg p-2 border border-green-200">
          <Text className="text-green-700 text-xs font-semibold text-center">
            Available to Claim • First Priority Available
          </Text>
        </View>
      )}
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
  selectedCard: {
    borderColor: '#0ea5e9',
    borderWidth: 2,
    backgroundColor: '#eff6ff',
  },
  claimedCard: {
    borderColor: '#ef4444',
    borderWidth: 1,
    opacity: 0.8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#dcfce7',
  },
  claimedBadge: {
    backgroundColor: '#fee2e2',
  },
});

