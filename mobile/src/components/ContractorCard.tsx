// Mobile Contractor Card Component
// Displays contractor profile in job listings and search

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, MapPin, CheckCircle, Shield, Award } from 'lucide-react-native';
import type { User } from '@/types';

interface ContractorCardProps {
  contractor: User;
  onPress?: () => void;
  showDistance?: boolean;
  distance?: number;
}

export function ContractorCard({
  contractor,
  onPress,
  showDistance = false,
  distance
}: ContractorCardProps) {
  const contractorProfile = contractor.contractorProfile;
  if (!contractorProfile) return null;

  const rating = contractorProfile.rating || 0;
  const completedJobs = contractorProfile.completedJobs || 0;
  const isVerified = contractorProfile.verified || false;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center mb-1">
            <Text className="text-lg font-bold text-gray-900 mr-2">
              {contractor.name}
            </Text>
            {isVerified && (
              <CheckCircle size={18} color="#22c55e" fill="#22c55e" />
            )}
          </View>
          {contractorProfile.location && (
            <View className="flex-row items-center">
              <MapPin size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 ml-1">
                {contractorProfile.location.address}
                {showDistance && distance !== undefined && ` • ${distance.toFixed(1)} mi`}
              </Text>
            </View>
          )}
        </View>
        {showDistance && distance !== undefined && (
          <View className="bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-blue-700 text-xs font-semibold">
              {distance.toFixed(1)} mi
            </Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View className="flex-row items-center mb-3">
        <View className="flex-row items-center mr-4">
          <Star size={16} color="#f59e0b" fill="#f59e0b" />
          <Text className="text-base font-bold text-gray-900 ml-1">
            {rating.toFixed(1)}
          </Text>
          <Text className="text-sm text-gray-500 ml-1">
            ({completedJobs} jobs)
          </Text>
        </View>
        {contractorProfile.hourlyRate && (
          <Text className="text-sm text-gray-600">
            ${contractorProfile.hourlyRate}/hr
          </Text>
        )}
      </View>

      {/* Skills */}
      {contractorProfile.skills && contractorProfile.skills.length > 0 && (
        <View className="mb-3">
          <View className="flex-row flex-wrap -m-1">
            {contractorProfile.skills.slice(0, 3).map((skill, index) => (
              <View
                key={index}
                className="bg-primary-50 px-2 py-1 rounded-full m-1"
              >
                <Text className="text-primary-700 text-xs font-medium">
                  {skill}
                </Text>
              </View>
            ))}
            {contractorProfile.skills.length > 3 && (
              <View className="bg-gray-100 px-2 py-1 rounded-full m-1">
                <Text className="text-gray-600 text-xs font-medium">
                  +{contractorProfile.skills.length - 3} more
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Verification Badges */}
      <View className="flex-row items-center pt-3 border-t border-gray-100">
        {contractorProfile.verified && (
          <View className="flex-row items-center mr-4">
            <Shield size={14} color="#22c55e" />
            <Text className="text-xs text-green-700 ml-1 font-medium">
              Verified
            </Text>
          </View>
        )}
        {contractorProfile.licenses && contractorProfile.licenses.length > 0 && (
          <View className="flex-row items-center mr-4">
            <Award size={14} color="#0ea5e9" />
            <Text className="text-xs text-blue-700 ml-1 font-medium">
              {contractorProfile.licenses.length} License{contractorProfile.licenses.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
        {contractorProfile.insurance && contractorProfile.insurance.verified && (
          <View className="flex-row items-center">
            <Shield size={14} color="#8b5cf6" />
            <Text className="text-xs text-purple-700 ml-1 font-medium">
              Insured
            </Text>
          </View>
        )}
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

