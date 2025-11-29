// Mobile Payment Card Component
// Displays payment methods and transaction history

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard, CheckCircle, X, Calendar, DollarSign, AlertCircle } from 'lucide-react-native';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  isDefault: boolean;
  expiryMonth?: number;
  expiryYear?: number;
}

interface PaymentTransaction {
  id: string;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
  type: 'charge' | 'refund' | 'payout';
}

interface PaymentCardProps {
  paymentMethod?: PaymentMethod;
  transaction?: PaymentTransaction;
  onPress?: () => void;
}

export function PaymentCard({ paymentMethod, transaction, onPress }: PaymentCardProps) {
  if (paymentMethod) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.card,
          paymentMethod.isDefault && styles.defaultCard
        ]}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 bg-primary-100 rounded-lg items-center justify-center mr-3">
              <CreditCard size={24} color="#0ea5e9" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-base font-bold text-gray-900">
                  {paymentMethod.brand || 'Card'} •••• {paymentMethod.last4}
                </Text>
                {paymentMethod.isDefault && (
                  <View className="ml-2 bg-green-100 px-2 py-0.5 rounded-full">
                    <Text className="text-green-700 text-xs font-semibold">
                      Default
                    </Text>
                  </View>
                )}
              </View>
              {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
                <Text className="text-sm text-gray-600">
                  Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear.toString().slice(2)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (transaction) {
    const isPositive = transaction.type === 'payout' || transaction.type === 'refund';
    const statusColors = {
      completed: '#22c55e',
      pending: '#f59e0b',
      failed: '#ef4444',
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.card}
        activeOpacity={0.7}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center mb-1">
              {transaction.status === 'completed' ? (
                <CheckCircle size={16} color="#22c55e" />
              ) : transaction.status === 'failed' ? (
                <X size={16} color="#ef4444" />
              ) : (
                <AlertCircle size={16} color="#f59e0b" />
              )}
              <Text className="text-base font-semibold text-gray-900 ml-2 flex-1">
                {transaction.description}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Calendar size={12} color="#6b7280" />
              <Text className="text-xs text-gray-500 ml-1">
                {transaction.date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text
              className="text-lg font-bold"
              style={{ color: isPositive ? '#22c55e' : '#111827' }}
            >
              {isPositive ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
            </Text>
            <View
              className="px-2 py-0.5 rounded-full mt-1"
              style={{ backgroundColor: `${statusColors[transaction.status]}20` }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: statusColors[transaction.status] }}
              >
                {transaction.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return null;
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
  defaultCard: {
    borderColor: '#22c55e',
    borderWidth: 2,
    backgroundColor: '#f0fdf4',
  },
});

