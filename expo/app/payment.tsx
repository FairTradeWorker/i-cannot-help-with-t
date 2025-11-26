import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Badge, Button, Input } from '@/components/ui';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  bankName?: string;
  isDefault: boolean;
}

const demoPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    isDefault: true,
  },
  {
    id: 'pm_2',
    type: 'card',
    last4: '5555',
    brand: 'Mastercard',
    isDefault: false,
  },
];

export default function PaymentScreen() {
  const { jobId, amount } = useLocalSearchParams<{ jobId?: string; amount?: string }>();
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(demoPaymentMethods);
  const [selectedMethod, setSelectedMethod] = useState<string>('pm_1');
  const [loading, setLoading] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  // Form state for new card
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const paymentAmount = amount ? parseFloat(amount) : 1500;

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'Payment Successful',
        `Your payment of $${paymentAmount.toLocaleString()} has been processed.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Payment Failed', 'Please try again or use a different payment method.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!cardNumber || !expiry || !cvc || !cardholderName) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    setLoading(true);

    try {
      // Simulate adding card
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: 'card',
        last4: cardNumber.slice(-4),
        brand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
        isDefault: false,
      };

      setPaymentMethods((prev) => [...prev, newMethod]);
      setSelectedMethod(newMethod.id);
      setShowAddCard(false);
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setCardholderName('');

      Alert.alert('Success', 'Card added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add card');
    } finally {
      setLoading(false);
    }
  };

  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'card';
      case 'mastercard':
        return 'card';
      case 'amex':
        return 'card';
      default:
        return 'card-outline';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Payment',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Payment Summary */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <Card variant="glass" style={styles.summaryCard}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                Amount Due
              </Text>
              <Text style={[styles.summaryAmount, { color: colors.foreground }]}>
                ${paymentAmount.toLocaleString()}
              </Text>
              {jobId && (
                <Text style={[styles.summaryJob, { color: colors.mutedForeground }]}>
                  Job #{jobId}
                </Text>
              )}
            </Card>
          </Animated.View>

          {/* Payment Methods */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Payment Method
            </Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  {
                    backgroundColor: selectedMethod === method.id ? colors.primary + '15' : colors.card,
                    borderColor: selectedMethod === method.id ? colors.primary : colors.cardBorder,
                    borderRadius: borderRadius.xl,
                  },
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: selectedMethod === method.id ? colors.primary : colors.border,
                      backgroundColor: selectedMethod === method.id ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {selectedMethod === method.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Ionicons
                  name={getCardIcon(method.brand) as any}
                  size={24}
                  color={colors.primary}
                />
                <View style={styles.methodInfo}>
                  <Text style={[styles.methodName, { color: colors.foreground }]}>
                    {method.brand} •••• {method.last4}
                  </Text>
                  {method.isDefault && (
                    <Badge variant="secondary" size="sm">Default</Badge>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.addMethodButton,
                { borderColor: colors.border, borderRadius: borderRadius.xl },
              ]}
              onPress={() => setShowAddCard(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
              <Text style={[styles.addMethodText, { color: colors.primary }]}>
                Add New Card
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Add Card Form */}
          {showAddCard && (
            <Animated.View entering={FadeIn} style={styles.section}>
              <Card variant="glass" style={styles.addCardForm}>
                <Text style={[styles.formTitle, { color: colors.foreground }]}>
                  Add New Card
                </Text>
                <Input
                  label="Cardholder Name"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  placeholder="John Smith"
                  autoCapitalize="words"
                />
                <Input
                  label="Card Number"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="4242 4242 4242 4242"
                  keyboardType="numeric"
                  maxLength={19}
                />
                <View style={styles.formRow}>
                  <View style={styles.formHalf}>
                    <Input
                      label="Expiry"
                      value={expiry}
                      onChangeText={setExpiry}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </View>
                  <View style={styles.formHalf}>
                    <Input
                      label="CVC"
                      value={cvc}
                      onChangeText={setCvc}
                      placeholder="123"
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                    />
                  </View>
                </View>
                <View style={styles.formActions}>
                  <Button variant="outline" onPress={() => setShowAddCard(false)}>
                    Cancel
                  </Button>
                  <Button onPress={handleAddCard} loading={loading}>
                    Add Card
                  </Button>
                </View>
              </Card>
            </Animated.View>
          )}

          {/* Security Info */}
          <Animated.View entering={FadeInDown.delay(300)} style={[styles.section, styles.lastSection]}>
            <Card variant="glass" style={styles.securityCard}>
              <Ionicons name="shield-checkmark" size={24} color={colors.secondary} />
              <View style={styles.securityInfo}>
                <Text style={[styles.securityTitle, { color: colors.foreground }]}>
                  Secure Payment
                </Text>
                <Text style={[styles.securityText, { color: colors.mutedForeground }]}>
                  Your payment is protected with 256-bit SSL encryption. Powered by Stripe.
                </Text>
              </View>
            </Card>
          </Animated.View>
        </ScrollView>

        {/* Pay Button */}
        <Animated.View
          entering={FadeIn.delay(400)}
          style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}
        >
          <View style={styles.totalSection}>
            <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>Total</Text>
            <Text style={[styles.totalAmount, { color: colors.foreground }]}>
              ${paymentAmount.toLocaleString()}
            </Text>
          </View>
          <Button
            onPress={handlePayment}
            loading={loading}
            style={styles.payButton}
          >
            Pay Now
          </Button>
        </Animated.View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 120,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  summaryCard: {
    padding: 24,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '700',
  },
  summaryJob: {
    fontSize: 14,
    marginTop: 8,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  methodInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodName: {
    fontSize: 15,
    fontWeight: '500',
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 8,
  },
  addMethodText: {
    fontSize: 15,
    fontWeight: '600',
  },
  addCardForm: {
    padding: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formHalf: {
    flex: 1,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  securityText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  totalSection: {},
  totalLabel: {
    fontSize: 12,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  payButton: {
    minWidth: 150,
  },
});
