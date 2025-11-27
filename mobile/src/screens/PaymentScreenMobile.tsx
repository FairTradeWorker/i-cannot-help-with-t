import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  CreditCard, 
  Plus, 
  ChevronRight, 
  Check, 
  DollarSign, 
  Clock, 
  Shield,
  X,
  Trash2,
  Building,
  Star
} from 'lucide-react-native';

/**
 * Detect card brand from card number prefix
 */
function detectCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Visa: starts with 4
  if (/^4/.test(cleaned)) return 'Visa';
  
  // Mastercard: starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'Mastercard';
  
  // American Express: starts with 34 or 37
  if (/^3[47]/.test(cleaned)) return 'Amex';
  
  // Discover: starts with 6011, 622126-622925, 644-649, 65
  if (/^6011|^62|^64[4-9]|^65/.test(cleaned)) return 'Discover';
  
  return 'Card';
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  bankName?: string;
  isDefault: boolean;
  expiryMonth?: number;
  expiryYear?: number;
}

interface PaymentHistoryItem {
  id: string;
  jobTitle: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  date: Date;
  contractorName: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    isDefault: true,
    expiryMonth: 12,
    expiryYear: 2025,
  },
  {
    id: '2',
    type: 'card',
    last4: '5555',
    brand: 'Mastercard',
    isDefault: false,
    expiryMonth: 8,
    expiryYear: 2026,
  },
];

const mockPaymentHistory: PaymentHistoryItem[] = [
  {
    id: '1',
    jobTitle: 'Kitchen Faucet Replacement',
    amount: 350,
    status: 'completed',
    date: new Date(Date.now() - 86400000 * 7),
    contractorName: "Mike's Plumbing",
  },
  {
    id: '2',
    jobTitle: 'Electrical Panel Upgrade',
    amount: 2100,
    status: 'pending',
    date: new Date(),
    contractorName: 'ElectriPro Services',
  },
  {
    id: '3',
    jobTitle: 'AC Repair',
    amount: 450,
    status: 'completed',
    date: new Date(Date.now() - 86400000 * 14),
    contractorName: 'Cool Air HVAC',
  },
];

export default function PaymentScreenMobile() {
  const navigation = useNavigation();
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [showAddCard, setShowAddCard] = useState(false);
  const [activeTab, setActiveTab] = useState<'methods' | 'history'>('methods');
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(m => ({ ...m, isDefault: m.id === id }))
    );
  };

  const handleDeleteMethod = (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setPaymentMethods(methods => methods.filter(m => m.id !== id))
        },
      ]
    );
  };

  const handleAddCard = () => {
    if (!cardNumber || !expiry || !cvc || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      last4: cardNumber.slice(-4),
      brand: detectCardBrand(cardNumber), // Detect from card number prefix
      isDefault: paymentMethods.length === 0,
      expiryMonth: parseInt(expiry.split('/')[0]),
      expiryYear: parseInt('20' + expiry.split('/')[1]),
    };
    
    setPaymentMethods([...paymentMethods, newCard]);
    setShowAddCard(false);
    setCardNumber('');
    setExpiry('');
    setCvc('');
    setName('');
    
    Alert.alert('Success', 'Payment method added successfully');
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const getStatusColor = (status: PaymentHistoryItem['status']) => {
    switch (status) {
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      case 'refunded': return { bg: 'bg-red-100', text: 'text-red-700' };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {/* Tab Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('methods')}
            className={`flex-1 py-2 rounded-md ${activeTab === 'methods' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text className={`text-center font-medium ${activeTab === 'methods' ? 'text-primary-500' : 'text-gray-600'}`}>
              Payment Methods
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-md ${activeTab === 'history' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text className={`text-center font-medium ${activeTab === 'history' ? 'text-primary-500' : 'text-gray-600'}`}>
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {activeTab === 'methods' && (
          <View className="p-4">
            {/* Payment Methods List */}
            {paymentMethods.map((method) => (
              <View 
                key={method.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center mr-4">
                    <CreditCard color="#0ea5e9" size={24} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-gray-900 font-bold">
                        {method.brand} •••• {method.last4}
                      </Text>
                      {method.isDefault && (
                        <View className="bg-primary-100 px-2 py-0.5 rounded ml-2">
                          <Text className="text-primary-600 text-xs font-medium">Default</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-500 text-sm">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </Text>
                  </View>
                </View>

                <View className="flex-row mt-4 pt-4 border-t border-gray-100">
                  {!method.isDefault && (
                    <TouchableOpacity
                      onPress={() => handleSetDefault(method.id)}
                      className="flex-1 flex-row items-center justify-center py-2 bg-gray-100 rounded-lg mr-2"
                    >
                      <Star color="#6b7280" size={16} />
                      <Text className="text-gray-600 ml-2">Set Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => handleDeleteMethod(method.id)}
                    className={`flex-row items-center justify-center py-2 bg-red-50 rounded-lg ${method.isDefault ? 'flex-1' : 'px-4'}`}
                  >
                    <Trash2 color="#ef4444" size={16} />
                    <Text className="text-red-600 ml-2">Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Add Payment Method */}
            <TouchableOpacity
              onPress={() => setShowAddCard(true)}
              className="bg-white rounded-xl p-4 mb-4 shadow-sm border-2 border-dashed border-gray-200"
            >
              <View className="flex-row items-center justify-center">
                <Plus color="#0ea5e9" size={24} />
                <Text className="text-primary-500 font-bold ml-2">Add Payment Method</Text>
              </View>
            </TouchableOpacity>

            {/* Security Notice */}
            <View className="bg-green-50 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Shield color="#22c55e" size={20} />
                <Text className="text-green-800 font-bold ml-2">Secure Payments</Text>
              </View>
              <Text className="text-green-700 text-sm">
                All payments are processed securely through Stripe. 
                Your card details are never stored on our servers.
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'history' && (
          <View className="p-4">
            {mockPaymentHistory.map((payment) => {
              const statusStyle = getStatusColor(payment.status);
              return (
                <TouchableOpacity 
                  key={payment.id}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-gray-900 font-bold">{payment.jobTitle}</Text>
                      <Text className="text-gray-500 text-sm">{payment.contractorName}</Text>
                    </View>
                    <Text className="text-gray-900 font-bold text-lg">
                      ${payment.amount.toLocaleString()}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Clock color="#6b7280" size={14} />
                      <Text className="text-gray-500 text-sm ml-1">
                        {payment.date.toLocaleDateString()}
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${statusStyle.bg}`}>
                      <Text className={`text-sm font-medium capitalize ${statusStyle.text}`}>
                        {payment.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {mockPaymentHistory.length === 0 && (
              <View className="items-center py-12">
                <DollarSign color="#9ca3af" size={48} />
                <Text className="text-gray-500 text-lg mt-4">No payment history</Text>
                <Text className="text-gray-400 text-sm">Your payments will appear here</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={showAddCard}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddCard(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-900">Add Card</Text>
            <TouchableOpacity onPress={() => setShowAddCard(false)}>
              <X color="#6b7280" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Card Number</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>

              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-gray-700 font-medium mb-2">Expiry</Text>
                  <TextInput
                    className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900"
                    placeholder="MM/YY"
                    value={expiry}
                    onChangeText={(text) => setExpiry(formatExpiry(text))}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-gray-700 font-medium mb-2">CVC</Text>
                  <TextInput
                    className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900"
                    placeholder="123"
                    value={cvc}
                    onChangeText={setCvc}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Cardholder Name</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900"
                  placeholder="John Doe"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAddCard}
              className="bg-primary-500 py-4 rounded-xl items-center mt-4"
            >
              <Text className="text-white font-bold text-lg">Add Card</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
