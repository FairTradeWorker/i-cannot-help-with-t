import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CreditCard,
  ChevronRight,
  X,
  Zap,
} from 'lucide-react-native';

// ============================================================================
// Types
// ============================================================================

interface EarningEntry {
  id: string;
  jobTitle: string;
  jobId: string;
  amount: number;
  status: 'pending' | 'available' | 'paid_out';
  completedAt: Date;
}

interface Payout {
  id: string;
  amount: number;
  method: 'instant' | 'standard';
  fee: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  completedAt?: Date;
}

// ============================================================================
// Mock Data
// ============================================================================

const mockEarnings: EarningEntry[] = [
  {
    id: 'e1',
    jobTitle: 'Kitchen Renovation',
    jobId: 'job1',
    amount: 5500,
    status: 'paid_out',
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'e2',
    jobTitle: 'Bathroom Plumbing Repair',
    jobId: 'job2',
    amount: 850,
    status: 'available',
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'e3',
    jobTitle: 'Electrical Panel Upgrade',
    jobId: 'job3',
    amount: 2200,
    status: 'pending',
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'e4',
    jobTitle: 'HVAC Maintenance',
    jobId: 'job4',
    amount: 350,
    status: 'available',
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

const mockPayouts: Payout[] = [
  {
    id: 'p1',
    amount: 4500,
    method: 'standard',
    fee: 0,
    status: 'completed',
    requestedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'p2',
    amount: 1200,
    method: 'instant',
    fee: 18,
    status: 'completed',
    requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

// ============================================================================
// Component
// ============================================================================

export default function EarningsScreen() {
  const [payoutModalVisible, setPayoutModalVisible] = useState(false);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<'instant' | 'standard'>('standard');

  // Calculate totals
  const totalEarnings = mockEarnings.reduce((sum, e) => sum + e.amount, 0);
  const availableBalance = mockEarnings
    .filter(e => e.status === 'available')
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingBalance = mockEarnings
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalPaidOut = mockPayouts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleRequestPayout = () => {
    if (availableBalance <= 0) {
      Alert.alert('No Funds Available', 'You don\'t have any available balance to withdraw.');
      return;
    }
    setPayoutModalVisible(true);
  };

  const handleConfirmPayout = () => {
    const fee = selectedPayoutMethod === 'instant' ? availableBalance * 0.015 : 0;
    const netAmount = availableBalance - fee;
    
    Alert.alert(
      'Payout Requested',
      `Your ${selectedPayoutMethod} payout of $${netAmount.toFixed(2)} has been requested. ${
        selectedPayoutMethod === 'instant' 
          ? 'Funds will be available within minutes.' 
          : 'Funds will arrive in 2-3 business days.'
      }`,
      [{ text: 'OK', onPress: () => setPayoutModalVisible(false) }]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'pending':
      case 'processing':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      case 'paid_out':
        return { bg: 'bg-blue-100', text: 'text-blue-700' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  const renderEarningItem = ({ item }: { item: EarningEntry }) => {
    const colors = getStatusColor(item.status);
    return (
      <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
        <View className="flex-1 mr-3">
          <Text className="text-gray-900 font-medium" numberOfLines={1}>
            {item.jobTitle}
          </Text>
          <Text className="text-gray-500 text-sm">{formatDate(item.completedAt)}</Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-900 font-bold">${item.amount.toLocaleString()}</Text>
          <View className={`px-2 py-0.5 rounded-full ${colors.bg}`}>
            <Text className={`text-xs font-medium ${colors.text}`}>
              {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPayoutItem = ({ item }: { item: Payout }) => {
    const colors = getStatusColor(item.status);
    return (
      <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
        <View className="flex-row items-center flex-1 mr-3">
          <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
            item.method === 'instant' ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            {item.method === 'instant' ? (
              <Zap color="#8b5cf6" size={16} />
            ) : (
              <CreditCard color="#3b82f6" size={16} />
            )}
          </View>
          <View>
            <Text className="text-gray-900 font-medium">
              {item.method === 'instant' ? 'Instant Payout' : 'Standard Payout'}
            </Text>
            <Text className="text-gray-500 text-sm">{formatDate(item.requestedAt)}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-gray-900 font-bold">${item.amount.toLocaleString()}</Text>
          {item.fee > 0 && (
            <Text className="text-gray-500 text-xs">Fee: ${item.fee.toFixed(2)}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Balance Cards */}
        <View className="bg-white m-4 rounded-2xl p-5 shadow-sm">
          <Text className="text-gray-600 mb-1">Available Balance</Text>
          <Text className="text-4xl font-bold text-gray-900 mb-4">
            ${availableBalance.toLocaleString()}
          </Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2 bg-yellow-50 rounded-lg p-3">
              <View className="flex-row items-center mb-1">
                <Clock color="#f59e0b" size={16} />
                <Text className="text-yellow-700 text-sm ml-1">Pending</Text>
              </View>
              <Text className="text-gray-900 font-bold">${pendingBalance.toLocaleString()}</Text>
            </View>
            <View className="flex-1 ml-2 bg-green-50 rounded-lg p-3">
              <View className="flex-row items-center mb-1">
                <TrendingUp color="#22c55e" size={16} />
                <Text className="text-green-700 text-sm ml-1">Total Earned</Text>
              </View>
              <Text className="text-gray-900 font-bold">${totalEarnings.toLocaleString()}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRequestPayout}
            className="bg-primary-500 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold text-lg">Request Payout</Text>
          </TouchableOpacity>
        </View>

        {/* Zero Fees Banner */}
        <View className="mx-4 mb-4 bg-green-50 border border-green-200 rounded-xl p-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
              <CheckCircle color="#22c55e" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-green-800 font-bold">Zero Platform Fees</Text>
              <Text className="text-green-700 text-sm">
                You keep 100% of your earnings. No hidden charges.
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Earnings */}
        <View className="mx-4 mb-4 bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">Recent Earnings</Text>
            <TouchableOpacity>
              <Text className="text-primary-500 font-medium">See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={mockEarnings}
            renderItem={renderEarningItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Payout History */}
        <View className="mx-4 mb-4 bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">Payout History</Text>
            <TouchableOpacity>
              <Text className="text-primary-500 font-medium">See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={mockPayouts}
            renderItem={renderPayoutItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Payout Modal */}
      <Modal
        visible={payoutModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPayoutModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-100">
          <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900">Request Payout</Text>
            <TouchableOpacity onPress={() => setPayoutModalVisible(false)}>
              <X color="#6b7280" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-600 mb-1">Amount to Withdraw</Text>
              <Text className="text-3xl font-bold text-gray-900 mb-4">
                ${availableBalance.toLocaleString()}
              </Text>

              <Text className="text-lg font-bold text-gray-900 mb-3">Choose Payout Method</Text>

              {/* Instant Payout */}
              <TouchableOpacity
                onPress={() => setSelectedPayoutMethod('instant')}
                className={`p-4 rounded-xl mb-3 border-2 ${
                  selectedPayoutMethod === 'instant' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                      <Zap color="#8b5cf6" size={20} />
                    </View>
                    <View>
                      <Text className="text-gray-900 font-bold">Instant Payout</Text>
                      <Text className="text-gray-500 text-sm">Available in minutes</Text>
                    </View>
                  </View>
                  <Text className="text-gray-600">1.5% fee</Text>
                </View>
                {selectedPayoutMethod === 'instant' && (
                  <View className="mt-3 pt-3 border-t border-gray-200">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Fee</Text>
                      <Text className="text-gray-900">-${(availableBalance * 0.015).toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between mt-1">
                      <Text className="text-gray-900 font-bold">You receive</Text>
                      <Text className="text-gray-900 font-bold">
                        ${(availableBalance * 0.985).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              {/* Standard Payout */}
              <TouchableOpacity
                onPress={() => setSelectedPayoutMethod('standard')}
                className={`p-4 rounded-xl border-2 ${
                  selectedPayoutMethod === 'standard' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                      <CreditCard color="#3b82f6" size={20} />
                    </View>
                    <View>
                      <Text className="text-gray-900 font-bold">Standard Payout</Text>
                      <Text className="text-gray-500 text-sm">2-3 business days</Text>
                    </View>
                  </View>
                  <Text className="text-green-600 font-bold">FREE</Text>
                </View>
                {selectedPayoutMethod === 'standard' && (
                  <View className="mt-3 pt-3 border-t border-gray-200">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-900 font-bold">You receive</Text>
                      <Text className="text-gray-900 font-bold">
                        ${availableBalance.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleConfirmPayout}
              className="bg-primary-500 py-4 rounded-xl items-center mb-4"
            >
              <Text className="text-white font-bold text-lg">Confirm Payout</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
