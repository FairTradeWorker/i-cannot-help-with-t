// Enhanced Territories Screen with full functionality
// Territory map, claiming, First 300 system

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, MapPin, CheckCircle, Lock, X, AlertCircle } from 'lucide-react-native';
import { TerritoryMap } from '@/components/TerritoryMap';
import { dataStore } from '@fairtradeworker/shared';
import type { Territory, User as UserType } from '@/types';

export default function TerritoriesScreen() {
  const navigation = useNavigation();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [territoriesData, user] = await Promise.all([
        dataStore.getTerritories(),
        dataStore.getCurrentUser(),
      ]);
      
      setTerritories(territoriesData);
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load territories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerritorySelect = (territory: Territory) => {
    setSelectedTerritory(territory);
  };

  const handleClaimTerritory = async () => {
    if (!selectedTerritory || !currentUser) {
      Alert.alert('Error', 'Please log in to claim a territory');
      return;
    }

    setClaiming(true);
    try {
      // TODO: Integrate with territory claiming logic
      // This would call processTerritoryClaim from shared package
      Alert.alert(
        'Claim Started',
        'Territory claiming will be available after payment integration is complete.',
        [{ text: 'OK', onPress: () => setShowClaimModal(false) }]
      );
    } catch (error) {
      console.error('Failed to claim territory:', error);
      Alert.alert('Error', 'Failed to claim territory. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  const filteredTerritories = territories.filter(territory => {
    const query = searchQuery.toLowerCase();
    return (
      territory.name?.toLowerCase().includes(query) ||
      territory.zipCodes?.some(zip => zip.includes(query)) ||
      false
    );
  });

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading territories...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search color="#6b7280" size={20} />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder="Search territories by zip code..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View className="flex-1">
        {/* Territory Map */}
        <View className="flex-1">
          <TerritoryMap
            territories={filteredTerritories}
            selectedTerritory={selectedTerritory}
            onTerritorySelect={handleTerritorySelect}
          />
        </View>

        {/* Territory Details */}
        {selectedTerritory && (
          <View className="bg-white border-t border-gray-200 p-4 max-h-64">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  {selectedTerritory.name}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  {selectedTerritory.zipCodes?.join(', ') || 'No zip codes'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedTerritory(null)}
                className="ml-4"
              >
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-xs text-gray-500 mb-1">Active Jobs</Text>
                <Text className="text-xl font-bold text-gray-900">
                  {selectedTerritory.stats?.totalJobs || 0}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-1">Contractors</Text>
                <Text className="text-xl font-bold text-gray-900">
                  {selectedTerritory.stats?.activeContractors || 0}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-1">Revenue</Text>
                <Text className="text-xl font-bold text-green-600">
                  ${(selectedTerritory.stats?.monthlyRevenue || 0).toLocaleString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowClaimModal(true)}
              className={`py-3 rounded-xl items-center ${
                selectedTerritory.operatorId ? 'bg-gray-300' : 'bg-primary-500'
              }`}
              disabled={!!selectedTerritory.operatorId}
            >
              <Text className={`font-bold text-base ${
                selectedTerritory.operatorId ? 'text-gray-500' : 'text-white'
              }`}>
                {selectedTerritory.operatorId ? 'Territory Claimed' : 'Claim Territory'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Claim Modal */}
      <Modal
        visible={showClaimModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowClaimModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-96">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">Claim Territory</Text>
              <TouchableOpacity onPress={() => setShowClaimModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {selectedTerritory && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-gray-700 mb-4">
                  Claim First Priority on {selectedTerritory.name}?
                </Text>

                <View className="bg-blue-50 rounded-lg p-4 mb-4">
                  <View className="flex-row items-center mb-2">
                    <AlertCircle size={20} color="#0ea5e9" />
                    <Text className="text-blue-900 font-semibold ml-2">First 300 Status</Text>
                  </View>
                  <Text className="text-blue-800 text-sm">
                    Check if you qualify for free First Priority (First 300 operators)
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleClaimTerritory}
                  disabled={claiming}
                  className={`py-4 rounded-xl items-center ${
                    claiming ? 'bg-gray-300' : 'bg-primary-500'
                  }`}
                >
                  {claiming ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-white font-bold text-lg">
                      Proceed to Claim
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
