import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Badge, Button, Input, Avatar } from '@/components/ui';

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'completed' | 'rewarded';
  reward: number;
  createdAt: Date;
}

const demoReferrals: Referral[] = [
  {
    id: 'ref-1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'rewarded',
    reward: 50,
    createdAt: new Date(Date.now() - 86400000 * 30),
  },
  {
    id: 'ref-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'completed',
    reward: 50,
    createdAt: new Date(Date.now() - 86400000 * 14),
  },
  {
    id: 'ref-3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    status: 'pending',
    reward: 50,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
];

export default function ReferralScreen() {
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const [referrals, setReferrals] = useState<Referral[]>(demoReferrals);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const referralCode = 'SH-ABC123';
  const referralLink = `https://servicehub.app/join/${referralCode}`;

  const stats = {
    totalReferrals: referrals.length,
    pendingRewards: referrals.filter((r) => r.status === 'completed').reduce((sum, r) => sum + r.reward, 0),
    earnedRewards: referrals.filter((r) => r.status === 'rewarded').reduce((sum, r) => sum + r.reward, 0),
  };

  const copyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(referralLink);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Referral link copied to clipboard');
  };

  const shareLink = async () => {
    try {
      await Share.share({
        message: `Join me on ServiceHub! Use my referral code ${referralCode} to get $25 off your first job. ${referralLink}`,
        title: 'Join ServiceHub',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const sendInvite = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    setSending(true);

    try {
      // Simulate sending invite
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert('Invite Sent!', `An invitation has been sent to ${email}`);
      setEmail('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send invite');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: Referral['status']) => {
    switch (status) {
      case 'rewarded':
        return 'success';
      case 'completed':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Refer & Earn',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <Card variant="glass" style={styles.heroCard}>
              <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="gift" size={40} color="#fff" />
              </View>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>
                Earn $50 for Every Referral
              </Text>
              <Text style={[styles.heroText, { color: colors.mutedForeground }]}>
                Invite friends to ServiceHub and earn $50 when they complete their first job.
                They also get $25 off!
              </Text>
            </Card>
          </Animated.View>

          {/* Stats */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.statsRow}>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {stats.totalReferrals}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Referrals
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  ${stats.pendingRewards}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Pending
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.secondary }]}>
                  ${stats.earnedRewards}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Earned
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Referral Code */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Your Referral Code
            </Text>
            <Card variant="glass" style={styles.codeCard}>
              <View style={[styles.codeBox, { backgroundColor: colors.muted, borderRadius: borderRadius.lg }]}>
                <Text style={[styles.codeText, { color: colors.foreground }]}>{referralCode}</Text>
              </View>
              <View style={styles.codeActions}>
                <Button variant="outline" size="sm" onPress={copyCode}>
                  Copy Code
                </Button>
                <Button variant="outline" size="sm" onPress={copyLink}>
                  Copy Link
                </Button>
                <Button size="sm" onPress={shareLink}>
                  Share
                </Button>
              </View>
            </Card>
          </Animated.View>

          {/* Invite by Email */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Invite by Email
            </Text>
            <Card variant="glass" style={styles.inviteCard}>
              <Input
                placeholder="friend@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Ionicons name="mail-outline" size={20} color={colors.mutedForeground} />}
                containerStyle={styles.emailInput}
              />
              <Button onPress={sendInvite} loading={sending}>
                Send Invite
              </Button>
            </Card>
          </Animated.View>

          {/* Referral History */}
          <Animated.View entering={FadeInDown.delay(500)} style={[styles.section, styles.lastSection]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Referral History
            </Text>
            {referrals.length > 0 ? (
              referrals.map((referral) => (
                <View
                  key={referral.id}
                  style={[
                    styles.referralCard,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
                  ]}
                >
                  <Avatar name={referral.name} size="md" />
                  <View style={styles.referralInfo}>
                    <Text style={[styles.referralName, { color: colors.foreground }]}>
                      {referral.name}
                    </Text>
                    <Text style={[styles.referralEmail, { color: colors.mutedForeground }]}>
                      {referral.email}
                    </Text>
                  </View>
                  <View style={styles.referralRight}>
                    <Text style={[styles.referralReward, { color: colors.secondary }]}>
                      ${referral.reward}
                    </Text>
                    <Badge variant={getStatusColor(referral.status) as any} size="sm">
                      {referral.status}
                    </Badge>
                  </View>
                </View>
              ))
            ) : (
              <Card variant="glass" style={styles.emptyCard}>
                <Ionicons name="people-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                  No Referrals Yet
                </Text>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Share your referral code to start earning rewards
                </Text>
              </Card>
            )}
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
  heroCard: {
    padding: 24,
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  codeCard: {
    padding: 20,
  },
  codeBox: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
  },
  codeActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  inviteCard: {
    padding: 20,
  },
  emailInput: {
    marginBottom: 16,
  },
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  referralInfo: {
    flex: 1,
    marginLeft: 12,
  },
  referralName: {
    fontSize: 15,
    fontWeight: '600',
  },
  referralEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  referralRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  referralReward: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
