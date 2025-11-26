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
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Badge, Button, Input } from '@/components/ui';

interface VerificationItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  required: boolean;
}

const verificationItems: VerificationItem[] = [
  {
    id: 'identity',
    title: 'Identity Verification',
    description: 'Upload a government-issued ID to verify your identity',
    icon: 'person',
    status: 'verified',
    required: true,
  },
  {
    id: 'license',
    title: 'Contractor License',
    description: 'Upload your valid contractor license for your state',
    icon: 'document-text',
    status: 'submitted',
    required: true,
  },
  {
    id: 'insurance',
    title: 'Insurance Certificate',
    description: 'Proof of liability insurance (minimum $1M coverage)',
    icon: 'shield-checkmark',
    status: 'pending',
    required: true,
  },
  {
    id: 'background',
    title: 'Background Check',
    description: 'Complete a background check through our partner',
    icon: 'checkmark-done',
    status: 'pending',
    required: true,
  },
  {
    id: 'skills',
    title: 'Skills Assessment',
    description: 'Complete skills tests to showcase your expertise',
    icon: 'ribbon',
    status: 'pending',
    required: false,
  },
];

export default function VerificationScreen() {
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const [items, setItems] = useState<VerificationItem[]>(verificationItems);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const completedCount = items.filter((i) => i.status === 'verified').length;
  const totalRequired = items.filter((i) => i.required).length;
  const progress = (completedCount / totalRequired) * 100;

  const getStatusColor = (status: VerificationItem['status']) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'submitted':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: VerificationItem['status']) => {
    switch (status) {
      case 'verified':
        return 'checkmark-circle';
      case 'submitted':
        return 'time';
      case 'rejected':
        return 'close-circle';
      default:
        return 'ellipse-outline';
    }
  };

  const handleUpload = async (itemId: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploading(true);

      try {
        // Simulate upload
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, status: 'submitted' } : item
          )
        );

        Alert.alert('Uploaded!', 'Your document has been submitted for review.');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload document');
      } finally {
        setUploading(false);
        setSelectedItem(null);
      }
    }
  };

  const handleStartBackgroundCheck = () => {
    Alert.alert(
      'Start Background Check',
      'You will be redirected to our partner Checkr to complete your background check. This typically takes 2-3 business days.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // In a real app, this would open a WebView or external link
            setItems((prev) =>
              prev.map((item) =>
                item.id === 'background' ? { ...item, status: 'submitted' } : item
              )
            );
            Alert.alert('Started', 'Check your email for instructions to complete the background check.');
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Verification',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Progress Card */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <Card variant="glass" style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <View>
                  <Text style={[styles.progressTitle, { color: colors.foreground }]}>
                    Verification Progress
                  </Text>
                  <Text style={[styles.progressSubtitle, { color: colors.mutedForeground }]}>
                    {completedCount} of {totalRequired} required items verified
                  </Text>
                </View>
                <Text style={[styles.progressPercent, { color: colors.primary }]}>
                  {Math.round(progress)}%
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%`, backgroundColor: colors.primary },
                  ]}
                />
              </View>
              {progress === 100 ? (
                <View style={styles.verifiedBanner}>
                  <Ionicons name="shield-checkmark" size={24} color={colors.secondary} />
                  <Text style={[styles.verifiedText, { color: colors.secondary }]}>
                    You are fully verified!
                  </Text>
                </View>
              ) : (
                <Text style={[styles.progressHint, { color: colors.mutedForeground }]}>
                  Complete all required verifications to get the verified badge
                </Text>
              )}
            </Card>
          </Animated.View>

          {/* Verification Items */}
          <Animated.View entering={FadeInDown.delay(200)} style={[styles.section, styles.lastSection]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Verification Items
            </Text>
            {items.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(250 + index * 50)}>
                <TouchableOpacity
                  style={[
                    styles.itemCard,
                    {
                      backgroundColor: colors.card,
                      borderColor:
                        item.status === 'verified'
                          ? colors.secondary
                          : item.status === 'rejected'
                          ? colors.destructive
                          : colors.cardBorder,
                      borderRadius: borderRadius.xl,
                    },
                  ]}
                  onPress={() => {
                    if (item.status === 'pending') {
                      setSelectedItem(item.id);
                    }
                  }}
                  disabled={item.status === 'verified' || item.status === 'submitted'}
                >
                  <View
                    style={[
                      styles.itemIcon,
                      {
                        backgroundColor:
                          item.status === 'verified'
                            ? colors.secondary
                            : item.status === 'submitted'
                            ? colors.primary
                            : colors.muted,
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={24}
                      color={item.status === 'pending' || item.status === 'rejected' ? colors.mutedForeground : '#fff'}
                    />
                  </View>
                  <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                      <Text style={[styles.itemTitle, { color: colors.foreground }]}>
                        {item.title}
                      </Text>
                      {item.required && item.status !== 'verified' && (
                        <Text style={[styles.requiredTag, { color: colors.destructive }]}>
                          Required
                        </Text>
                      )}
                    </View>
                    <Text style={[styles.itemDescription, { color: colors.mutedForeground }]}>
                      {item.description}
                    </Text>
                    <View style={styles.itemFooter}>
                      <Badge variant={getStatusColor(item.status) as any} size="sm">
                        <Ionicons
                          name={getStatusIcon(item.status) as any}
                          size={12}
                          color={
                            item.status === 'verified'
                              ? '#fff'
                              : item.status === 'submitted'
                              ? '#fff'
                              : colors.mutedForeground
                          }
                        />
                        <Text
                          style={{
                            color:
                              item.status === 'verified' || item.status === 'submitted'
                                ? '#fff'
                                : colors.mutedForeground,
                            marginLeft: 4,
                            fontSize: 12,
                            fontWeight: '600',
                          }}
                        >
                          {item.status === 'submitted' ? 'Under Review' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Text>
                      </Badge>
                      {item.status === 'pending' && (
                        <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Action Panel for Selected Item */}
                {selectedItem === item.id && (
                  <Animated.View entering={FadeIn} style={[styles.actionPanel, { backgroundColor: colors.muted, borderRadius: borderRadius.lg }]}>
                    {item.id === 'background' ? (
                      <Button onPress={handleStartBackgroundCheck} loading={uploading}>
                        Start Background Check
                      </Button>
                    ) : item.id === 'skills' ? (
                      <Button onPress={() => router.push('/skills-test')} loading={uploading}>
                        Take Skills Test
                      </Button>
                    ) : (
                      <View style={styles.uploadActions}>
                        <Button
                          variant="outline"
                          onPress={() => setSelectedItem(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onPress={() => handleUpload(item.id)}
                          loading={uploading}
                        >
                          Upload Document
                        </Button>
                      </View>
                    )}
                  </Animated.View>
                )}
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>
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
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  progressCard: {
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  progressPercent: {
    fontSize: 28,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressHint: {
    fontSize: 13,
    textAlign: 'center',
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  verifiedText: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  requiredTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionPanel: {
    padding: 16,
    marginBottom: 12,
    marginTop: -4,
  },
  uploadActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
