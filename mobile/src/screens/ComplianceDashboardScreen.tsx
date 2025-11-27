import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Shield, 
  FileText, 
  Award, 
  Star,
  ChevronRight,
  RefreshCw
} from 'lucide-react-native';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'expiring_soon' | 'pending';
  expiryDate?: Date;
  lastChecked: Date;
  category: 'license' | 'insurance' | 'certification' | 'training';
}

const mockComplianceItems: ComplianceItem[] = [
  {
    id: '1',
    title: 'Contractor License',
    description: 'State contractor license #12345',
    status: 'compliant',
    expiryDate: new Date('2025-12-31'),
    lastChecked: new Date(),
    category: 'license',
  },
  {
    id: '2',
    title: 'General Liability Insurance',
    description: '$1M coverage - Policy #GL-789456',
    status: 'compliant',
    expiryDate: new Date('2025-06-15'),
    lastChecked: new Date(),
    category: 'insurance',
  },
  {
    id: '3',
    title: 'Workers Compensation',
    description: 'Policy #WC-456789',
    status: 'expiring_soon',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    lastChecked: new Date(),
    category: 'insurance',
  },
  {
    id: '4',
    title: 'OSHA Safety Training',
    description: '10-Hour General Industry Certificate',
    status: 'compliant',
    expiryDate: new Date('2026-03-01'),
    lastChecked: new Date(),
    category: 'training',
  },
  {
    id: '5',
    title: 'Background Check',
    description: 'Annual background verification',
    status: 'pending',
    lastChecked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    category: 'certification',
  },
];

const categoryIcons = {
  license: <FileText color="#0ea5e9" size={20} />,
  insurance: <Shield color="#0ea5e9" size={20} />,
  certification: <Award color="#0ea5e9" size={20} />,
  training: <Star color="#0ea5e9" size={20} />,
};

const statusConfig = {
  compliant: {
    color: '#22c55e',
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: <CheckCircle color="#22c55e" size={20} />,
    label: 'Compliant',
  },
  non_compliant: {
    color: '#ef4444',
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: <XCircle color="#ef4444" size={20} />,
    label: 'Action Required',
  },
  expiring_soon: {
    color: '#f59e0b',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: <AlertCircle color="#f59e0b" size={20} />,
    label: 'Expiring Soon',
  },
  pending: {
    color: '#6b7280',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: <RefreshCw color="#6b7280" size={20} />,
    label: 'Pending',
  },
};

export default function ComplianceDashboardScreen() {
  const [items] = useState(mockComplianceItems);

  const compliantCount = items.filter(i => i.status === 'compliant').length;
  const totalCount = items.length;
  const compliancePercent = Math.round((compliantCount / totalCount) * 100);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilExpiry = (date: Date) => {
    const diff = date.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Compliance Score Card */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4 text-center">
            Compliance Score
          </Text>
          
          <View className="items-center mb-4">
            <View className="w-32 h-32 rounded-full border-8 items-center justify-center"
              style={{ 
                borderColor: compliancePercent >= 80 ? '#22c55e' : compliancePercent >= 50 ? '#f59e0b' : '#ef4444' 
              }}
            >
              <Text className="text-4xl font-bold text-gray-900">{compliancePercent}%</Text>
            </View>
          </View>

          <View className="flex-row justify-around">
            <View className="items-center">
              <View className="flex-row items-center">
                <CheckCircle color="#22c55e" size={16} />
                <Text className="text-green-600 font-bold ml-1">{compliantCount}</Text>
              </View>
              <Text className="text-gray-500 text-xs">Compliant</Text>
            </View>
            <View className="items-center">
              <View className="flex-row items-center">
                <AlertCircle color="#f59e0b" size={16} />
                <Text className="text-yellow-600 font-bold ml-1">
                  {items.filter(i => i.status === 'expiring_soon').length}
                </Text>
              </View>
              <Text className="text-gray-500 text-xs">Expiring</Text>
            </View>
            <View className="items-center">
              <View className="flex-row items-center">
                <XCircle color="#ef4444" size={16} />
                <Text className="text-red-600 font-bold ml-1">
                  {items.filter(i => i.status === 'non_compliant').length}
                </Text>
              </View>
              <Text className="text-gray-500 text-xs">Issues</Text>
            </View>
          </View>
        </View>

        {/* Alerts Section */}
        {items.some(i => i.status === 'expiring_soon' || i.status === 'non_compliant') && (
          <View className="mx-4 mt-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">Attention Needed</Text>
            
            {items
              .filter(i => i.status === 'expiring_soon' || i.status === 'non_compliant')
              .map((item) => {
                const config = statusConfig[item.status];
                return (
                  <TouchableOpacity 
                    key={item.id}
                    className={`${config.bg} rounded-xl p-4 mb-3`}
                  >
                    <View className="flex-row items-center">
                      {config.icon}
                      <View className="flex-1 ml-3">
                        <Text className={`font-bold ${config.text}`}>{item.title}</Text>
                        <Text className={`text-sm ${config.text} opacity-80`}>
                          {item.expiryDate 
                            ? `Expires in ${getDaysUntilExpiry(item.expiryDate)} days`
                            : 'Action required'
                          }
                        </Text>
                      </View>
                      <ChevronRight color={config.color} size={20} />
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        )}

        {/* All Compliance Items */}
        <View className="mx-4 mt-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">All Requirements</Text>
          
          {items.map((item) => {
            const config = statusConfig[item.status];
            return (
              <TouchableOpacity 
                key={item.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm"
              >
                <View className="flex-row items-start">
                  <View className="w-10 h-10 bg-primary-50 rounded-full items-center justify-center mr-3">
                    {categoryIcons[item.category]}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-gray-900 font-bold">{item.title}</Text>
                      <View className={`px-2 py-1 rounded-full ${config.bg}`}>
                        <Text className={`text-xs font-medium ${config.text}`}>
                          {config.label}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm mb-2">{item.description}</Text>
                    {item.expiryDate && (
                      <Text className="text-gray-500 text-xs">
                        Expires: {formatDate(item.expiryDate)}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Help Section */}
        <View className="mx-4 mb-6 bg-blue-50 rounded-xl p-4">
          <Text className="text-blue-900 font-bold mb-2">Need Help?</Text>
          <Text className="text-blue-700 text-sm mb-3">
            Our compliance team can assist you with renewals, documentation, and requirements.
          </Text>
          <TouchableOpacity className="bg-blue-600 py-3 rounded-lg items-center">
            <Text className="text-white font-bold">Contact Compliance Team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
