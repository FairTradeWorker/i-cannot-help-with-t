import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Badge, Button, Avatar, Input } from '@/components/ui';
import { dataStore } from '@/lib/store';
import type { Job, User, Bid } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const [job, setJob] = useState<Job | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    const currentUser = await dataStore.getCurrentUser();
    setUser(currentUser);
    if (id) {
      const jobData = await dataStore.getJobById(id);
      setJob(jobData);
    }
    setLoading(false);
  };

  const handleSubmitBid = async () => {
    if (!job || !user || !bidAmount) return;

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      jobId: job.id,
      contractorId: user.id,
      contractor: {
        name: user.name,
        rating: user.contractorProfile?.rating || 0,
        completedJobs: user.contractorProfile?.completedJobs || 0,
        avatar: user.avatar,
        hourlyRate: user.contractorProfile?.hourlyRate || 0,
      },
      amount: parseFloat(bidAmount),
      timeline: {
        start: new Date(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      message: bidMessage,
      status: 'pending',
      createdAt: new Date(),
    };

    await dataStore.addBidToJob(job.id, newBid);
    Alert.alert('Success', 'Your bid has been submitted!');
    setShowBidForm(false);
    setBidAmount('');
    setBidMessage('');
    loadData();
  };

  const handleAcceptBid = async (bidId: string) => {
    if (!job) return;

    Alert.alert(
      'Accept Bid',
      'Are you sure you want to accept this bid?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            await dataStore.acceptBid(job.id, bidId);
            Alert.alert('Success', 'Bid accepted! The contractor will be notified.');
            loadData();
          },
        },
      ]
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'destructive';
      case 'urgent':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading job details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.foreground }]}>
            Job not found
          </Text>
          <Button onPress={() => router.back()}>Go Back</Button>
        </View>
      </SafeAreaView>
    );
  }

  const isOwner = job.homeownerId === user?.id;
  const isContractor = user?.role === 'contractor' || user?.role === 'subcontractor';
  const hasBid = job.bids.some((b) => b.contractorId === user?.id);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Job Details',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Card */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <Card variant="glass" style={styles.headerCard}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: colors.foreground }]}>
                  {job.title}
                </Text>
                <Badge variant={getUrgencyColor(job.urgency) as any}>
                  {job.urgency}
                </Badge>
              </View>

              <Text style={[styles.description, { color: colors.mutedForeground }]}>
                {job.description}
              </Text>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={20} color={colors.mutedForeground} />
                  <Text style={[styles.detailText, { color: colors.foreground }]}>
                    {job.address.city}, {job.address.state}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="cash-outline" size={20} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.primary, fontWeight: '600' }]}>
                    ${job.estimatedCost.min.toLocaleString()} - ${job.estimatedCost.max.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={20} color={colors.mutedForeground} />
                  <Text style={[styles.detailText, { color: colors.foreground }]}>
                    {job.laborHours} hours estimated
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={20} color={colors.mutedForeground} />
                  <Text style={[styles.detailText, { color: colors.foreground }]}>
                    Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                  </Text>
                </View>
              </View>

              {job.videoUrl && (
                <TouchableOpacity
                  style={[styles.videoButton, { backgroundColor: colors.primary }]}
                  onPress={() => {/* Play video */}}
                >
                  <Ionicons name="play-circle" size={24} color="#fff" />
                  <Text style={styles.videoButtonText}>Watch Job Video</Text>
                </TouchableOpacity>
              )}
            </Card>
          </Animated.View>

          {/* Scope Section */}
          {job.scope && (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                AI-Generated Scope
              </Text>
              <Card variant="glass">
                <View style={styles.scopeHeader}>
                  <Ionicons name="sparkles" size={20} color={colors.primary} />
                  <Text style={[styles.scopeConfidence, { color: colors.primary }]}>
                    {job.scope.confidenceScore}% confidence
                  </Text>
                </View>
                <Text style={[styles.scopeSummary, { color: colors.foreground }]}>
                  {job.scope.summary}
                </Text>
                {job.scope.materials.length > 0 && (
                  <View style={styles.materialsSection}>
                    <Text style={[styles.materialsTitle, { color: colors.foreground }]}>
                      Materials
                    </Text>
                    {job.scope.materials.map((material, index) => (
                      <View key={index} style={styles.materialItem}>
                        <Text style={[styles.materialName, { color: colors.foreground }]}>
                          {material.name}
                        </Text>
                        <Text style={[styles.materialQty, { color: colors.mutedForeground }]}>
                          {material.quantity} {material.unit} - ${material.estimatedCost}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {job.scope.recommendations.length > 0 && (
                  <View style={styles.recommendationsSection}>
                    <Text style={[styles.recommendationsTitle, { color: colors.foreground }]}>
                      Recommendations
                    </Text>
                    {job.scope.recommendations.map((rec, index) => (
                      <View key={index} style={styles.recommendationItem}>
                        <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
                        <Text style={[styles.recommendationText, { color: colors.mutedForeground }]}>
                          {rec}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            </Animated.View>
          )}

          {/* Bids Section */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Bids ({job.bids.length})
              </Text>
              {isContractor && !hasBid && !isOwner && (
                <Button
                  variant="default"
                  size="sm"
                  onPress={() => setShowBidForm(true)}
                >
                  Place Bid
                </Button>
              )}
            </View>

            {showBidForm && (
              <Card variant="glass" style={styles.bidForm}>
                <Text style={[styles.bidFormTitle, { color: colors.foreground }]}>
                  Submit Your Bid
                </Text>
                <Input
                  label="Bid Amount ($)"
                  value={bidAmount}
                  onChangeText={setBidAmount}
                  keyboardType="numeric"
                  placeholder="Enter your bid amount"
                />
                <Input
                  label="Message"
                  value={bidMessage}
                  onChangeText={setBidMessage}
                  multiline
                  numberOfLines={3}
                  placeholder="Explain why you're the best fit for this job"
                />
                <View style={styles.bidFormActions}>
                  <Button variant="outline" onPress={() => setShowBidForm(false)}>
                    Cancel
                  </Button>
                  <Button onPress={handleSubmitBid}>Submit Bid</Button>
                </View>
              </Card>
            )}

            {job.bids.length > 0 ? (
              job.bids.map((bid) => (
                <Card key={bid.id} variant="glass" style={styles.bidCard}>
                  <View style={styles.bidHeader}>
                    <Avatar
                      source={bid.contractor.avatar}
                      name={bid.contractor.name}
                      size="md"
                    />
                    <View style={styles.bidContractor}>
                      <Text style={[styles.bidContractorName, { color: colors.foreground }]}>
                        {bid.contractor.name}
                      </Text>
                      <View style={styles.bidContractorStats}>
                        <Ionicons name="star" size={14} color={colors.accent} />
                        <Text style={[styles.bidStat, { color: colors.mutedForeground }]}>
                          {bid.contractor.rating.toFixed(1)}
                        </Text>
                        <Text style={[styles.bidStat, { color: colors.mutedForeground }]}>
                          • {bid.contractor.completedJobs} jobs
                        </Text>
                      </View>
                    </View>
                    <View style={styles.bidAmount}>
                      <Text style={[styles.bidAmountValue, { color: colors.primary }]}>
                        ${bid.amount.toLocaleString()}
                      </Text>
                      <Badge
                        variant={
                          bid.status === 'accepted'
                            ? 'success'
                            : bid.status === 'rejected'
                            ? 'destructive'
                            : 'outline'
                        }
                        size="sm"
                      >
                        {bid.status}
                      </Badge>
                    </View>
                  </View>
                  {bid.message && (
                    <Text style={[styles.bidMessage, { color: colors.mutedForeground }]}>
                      {bid.message}
                    </Text>
                  )}
                  {isOwner && bid.status === 'pending' && (
                    <View style={styles.bidActions}>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => router.push(`/conversation/new?contractorId=${bid.contractorId}`)}
                      >
                        Message
                      </Button>
                      <Button
                        size="sm"
                        onPress={() => handleAcceptBid(bid.id)}
                      >
                        Accept Bid
                      </Button>
                    </View>
                  )}
                </Card>
              ))
            ) : (
              <Card variant="glass" style={styles.noBidsCard}>
                <Ionicons name="hand-left-outline" size={32} color={colors.mutedForeground} />
                <Text style={[styles.noBidsText, { color: colors.mutedForeground }]}>
                  No bids yet. Be the first to bid!
                </Text>
              </Card>
            )}
          </Animated.View>

          {/* Contact Section */}
          <Animated.View entering={FadeInDown.delay(400)} style={[styles.section, styles.lastSection]}>
            <Card variant="glass">
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => router.push(`/conversation/new?jobId=${job.id}`)}
              >
                <Ionicons name="chatbubbles-outline" size={24} color={colors.primary} />
                <Text style={[styles.contactButtonText, { color: colors.foreground }]}>
                  Send Message
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </Card>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerCard: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 15,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scopeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  scopeConfidence: {
    fontSize: 14,
    fontWeight: '600',
  },
  scopeSummary: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  materialsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  materialsTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  materialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  materialName: {
    fontSize: 14,
  },
  materialQty: {
    fontSize: 14,
  },
  recommendationsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  recommendationsTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  recommendationText: {
    fontSize: 14,
    flex: 1,
  },
  bidForm: {
    padding: 20,
    marginBottom: 16,
  },
  bidFormTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  bidFormActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  bidCard: {
    padding: 16,
    marginBottom: 12,
  },
  bidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidContractor: {
    flex: 1,
    marginLeft: 12,
  },
  bidContractorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  bidContractorStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  bidStat: {
    fontSize: 13,
  },
  bidAmount: {
    alignItems: 'flex-end',
  },
  bidAmountValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  bidMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  bidActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  noBidsCard: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  noBidsText: {
    fontSize: 15,
    textAlign: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  contactButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});
