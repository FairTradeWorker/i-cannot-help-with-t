// Payment Screen
// Stripe payment integration for territory claims and subscriptions

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CreditCard, Lock, CheckCircle, AlertCircle, X, DollarSign } from 'lucide-react-native';
import { PaymentCard } from '@/components/PaymentCard';
import { paymentService } from '@/services/payment.service';
import type { PaymentIntent, Subscription } from '@/services/payment.service';

interface RouteParams {
  territoryId?: string;
  amount?: number;
  zipCode?: string;
  type: 'territory_claim' | 'subscription';
}

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { territoryId, amount, zipCode, type } = (route.params as RouteParams) || { type: 'territory_claim' };

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      if (type === 'territory_claim' && territoryId && amount && zipCode) {
        const intent = await paymentService.createTerritoryPaymentIntent(
          territoryId,
          amount,
          zipCode
        );
        setPaymentIntent(intent);
      } else if (type === 'subscription' && territoryId) {
        const sub = await paymentService.getSubscription(territoryId);
        setSubscription(sub);
      }
    } catch (error) {
      console.error('Failed to load payment data:', error);
      Alert.alert('Error', 'Failed to load payment information');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentIntent) {
      Alert.alert('Error', 'Payment intent not loaded');
      return;
    }

    setProcessing(true);
    try {
      // TODO: Integrate Stripe SDK for actual payment processing
      // For now, simulate payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Payment Successful!',
        'Your territory has been claimed successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
              // Refresh territories
            },
          },
        ]
      );
    } catch (error) {
      console.error('Payment failed:', error);
      Alert.alert('Payment Failed', 'Please try again or use a different payment method.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading payment...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <X size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 flex-1">Payment</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Payment Summary */}
        {paymentIntent && (
          <View className="bg-white px-4 py-6 mb-4 mt-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">Payment Summary</Text>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600">Territory Claim Fee</Text>
              <Text className="text-gray-900 font-semibold">
                ${paymentIntent.amount.toLocaleString()}
              </Text>
            </View>
            {zipCode && (
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Zip Code</Text>
                <Text className="text-gray-900 font-semibold">{zipCode}</Text>
              </View>
            )}
            <View className="border-t border-gray-200 mt-4 pt-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Total</Text>
              <Text className="text-2xl font-bold text-gray-900">
                ${paymentIntent.amount.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Subscription Info */}
        {subscription && (
          <View className="bg-white px-4 py-6 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">Subscription Status</Text>
            <View className="flex-row items-center mb-2">
              <View
                className={`px-3 py-1 rounded-full mr-3 ${
                  subscription.status === 'active' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    subscription.status === 'active' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {subscription.status.toUpperCase()}
                </Text>
              </View>
              <Text className="text-gray-600">Monthly First Priority</Text>
            </View>
            <Text className="text-sm text-gray-500 mt-2">
              Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Payment Methods */}
        <View className="bg-white px-4 py-4 mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">Payment Method</Text>
          <TouchableOpacity className="bg-blue-50 rounded-lg p-4 border-2 border-blue-500 mb-3">
            <View className="flex-row items-center">
              <CreditCard size={24} color="#0ea5e9" />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-gray-900">Card ending in 4242</Text>
                <Text className="text-sm text-gray-500">Expires 12/25</Text>
              </View>
              <CheckCircle size={20} color="#22c55e" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <View className="flex-row items-center">
              <CreditCard size={24} color="#6b7280" />
              <Text className="text-base font-semibold text-gray-900 ml-3">Add New Card</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Security */}
        <View className="bg-white px-4 py-4 mb-4">
          <View className="flex-row items-center mb-2">
            <Lock size={20} color="#22c55e" />
            <Text className="text-sm font-semibold text-gray-900 ml-2">Secure Payment</Text>
          </View>
          <Text className="text-xs text-gray-600">
            Your payment information is encrypted and secure. We use Stripe for all transactions.
          </Text>
        </View>
      </ScrollView>

      {/* Payment Button */}
      {paymentIntent && (
        <View className="bg-white border-t border-gray-200 px-4 py-4">
          <TouchableOpacity
            onPress={handlePayment}
            disabled={processing}
            className={`py-4 rounded-xl items-center flex-row justify-center ${
              processing ? 'bg-gray-300' : 'bg-primary-500'
            }`}
          >
            {processing ? (
              <>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text className="text-white font-bold text-lg ml-2">Processing...</Text>
              </>
            ) : (
              <>
                <DollarSign size={20} color="#ffffff" />
                <Text className="text-white font-bold text-lg ml-2">
                  Pay ${paymentIntent.amount.toLocaleString()}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

