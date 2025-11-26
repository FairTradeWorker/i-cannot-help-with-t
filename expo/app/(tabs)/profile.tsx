import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '@/theme';
import { Card, Badge, Button, Avatar } from '@/components/ui';
import { dataStore } from '@/lib/store';
import type { User } from '@/types';

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  value?: string;
  toggle?: boolean;
  danger?: boolean;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, borderRadius, isDark } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);

  useEffect(() => {
    loadData();
    checkBiometricAvailability();
  }, []);

  const loadData = async () => {
    const currentUser = await dataStore.getCurrentUser();
    setUser(currentUser);
  };

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricEnabled(compatible && enrolled);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await dataStore.clearCurrentUser();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dataStore.clearAll();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const menuSections: MenuSection[] = [
    {
      title: 'Account',
      items: [
        { id: 'edit-profile', label: 'Edit Profile', icon: 'person-outline', route: '/edit-profile' },
        { id: 'verification', label: 'Verification', icon: 'shield-checkmark-outline', route: '/verification' },
        { id: 'payment-methods', label: 'Payment Methods', icon: 'card-outline', route: '/payment-methods' },
        { id: 'addresses', label: 'Saved Addresses', icon: 'location-outline', route: '/addresses' },
      ],
    },
    {
      title: 'Dashboards',
      items: [
        { id: 'homeowner', label: 'Homeowner Dashboard', icon: 'home-outline', route: '/dashboard/homeowner' },
        { id: 'contractor', label: 'Contractor Dashboard', icon: 'hammer-outline', route: '/dashboard/contractor' },
        { id: 'operator', label: 'Operator Dashboard', icon: 'business-outline', route: '/dashboard/operator' },
        { id: 'earnings', label: 'Earnings', icon: 'wallet-outline', route: '/dashboard/earnings' },
        { id: 'analytics', label: 'Analytics', icon: 'analytics-outline', route: '/dashboard/analytics' },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          icon: 'notifications-outline',
          toggle: true,
        },
        {
          id: 'biometric',
          label: 'Biometric Login',
          icon: 'finger-print-outline',
          toggle: true,
        },
        {
          id: 'dark-mode',
          label: 'Dark Mode',
          icon: 'moon-outline',
          toggle: true,
        },
      ],
    },
    {
      title: 'Referral & Rewards',
      items: [
        { id: 'referral', label: 'Refer a Friend', icon: 'gift-outline', route: '/referral' },
        { id: 'rewards', label: 'Loyalty Points', icon: 'star-outline', value: '250 pts' },
      ],
    },
    {
      title: 'Support & Legal',
      items: [
        { id: 'help', label: 'Help Center', icon: 'help-circle-outline', route: '/help' },
        { id: 'contact', label: 'Contact Support', icon: 'mail-outline', route: '/contact' },
        { id: 'privacy', label: 'Privacy Policy', icon: 'lock-closed-outline', route: '/privacy' },
        { id: 'terms', label: 'Terms of Service', icon: 'document-text-outline', route: '/terms' },
        { id: 'compliance', label: 'Compliance', icon: 'shield-outline', route: '/compliance' },
      ],
    },
    {
      title: 'Account Actions',
      items: [
        { id: 'logout', label: 'Sign Out', icon: 'log-out-outline', danger: false, onPress: handleLogout },
        { id: 'delete', label: 'Delete Account', icon: 'trash-outline', danger: true, onPress: handleDeleteAccount },
      ],
    },
  ];

  const getToggleValue = (id: string): boolean => {
    switch (id) {
      case 'notifications':
        return notificationsEnabled;
      case 'biometric':
        return biometricEnabled;
      case 'dark-mode':
        return darkModeEnabled;
      default:
        return false;
    }
  };

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case 'notifications':
        setNotificationsEnabled(value);
        break;
      case 'biometric':
        setBiometricEnabled(value);
        break;
      case 'dark-mode':
        setDarkModeEnabled(value);
        break;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'contractor':
        return { label: 'Contractor', variant: 'default' as const };
      case 'operator':
        return { label: 'Operator', variant: 'warning' as const };
      case 'admin':
        return { label: 'Admin', variant: 'destructive' as const };
      default:
        return { label: 'Homeowner', variant: 'secondary' as const };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Profile
          </Text>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.muted }]}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Card variant="glass" style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Avatar
                source={user?.avatar}
                name={user?.name}
                size="xl"
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.foreground }]}>
                  {user?.name || 'User'}
                </Text>
                <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>
                  {user?.email || 'user@example.com'}
                </Text>
                <View style={styles.profileBadges}>
                  <Badge variant={getRoleBadge(user?.role || 'homeowner').variant}>
                    {getRoleBadge(user?.role || 'homeowner').label}
                  </Badge>
                  {user?.contractorProfile?.verified && (
                    <Badge variant="success" size="sm">
                      <Ionicons name="checkmark-circle" size={12} color="#fff" />
                      <Text style={styles.verifiedText}> Verified</Text>
                    </Badge>
                  )}
                </View>
              </View>
            </View>
            <Button
              variant="outline"
              onPress={() => router.push('/edit-profile')}
              style={styles.editButton}
            >
              Edit Profile
            </Button>
          </Card>
        </Animated.View>

        {/* Stats Cards */}
        {user?.role === 'contractor' && (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl }]}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {user?.contractorProfile?.rating?.toFixed(1) || '0.0'}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Rating</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl }]}>
                <Text style={[styles.statValue, { color: colors.secondary }]}>
                  {user?.contractorProfile?.completedJobs || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Jobs</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl }]}>
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  ${user?.contractorProfile?.hourlyRate || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Hourly</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay(350 + sectionIndex * 50)}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
              {section.title}
            </Text>
            <Card variant="glass" padding="none">
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    index < section.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.cardBorder,
                    },
                  ]}
                  onPress={() => {
                    if (item.onPress) {
                      item.onPress();
                    } else if (item.route) {
                      router.push(item.route as any);
                    }
                  }}
                  disabled={item.toggle}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={item.danger ? colors.destructive : colors.foreground}
                    />
                    <Text
                      style={[
                        styles.menuItemLabel,
                        { color: item.danger ? colors.destructive : colors.foreground },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.value && (
                      <Text style={[styles.menuItemValue, { color: colors.mutedForeground }]}>
                        {item.value}
                      </Text>
                    )}
                    {item.toggle ? (
                      <Switch
                        value={getToggleValue(item.id)}
                        onValueChange={(value) => handleToggle(item.id, value)}
                        trackColor={{ false: colors.muted, true: colors.primary }}
                        thumbColor="#fff"
                      />
                    ) : !item.onPress && (
                      <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </Card>
          </Animated.View>
        ))}

        {/* Version Info */}
        <Animated.View entering={FadeInDown.delay(700)} style={[styles.section, styles.lastSection]}>
          <Text style={[styles.versionText, { color: colors.mutedForeground }]}>
            ServiceHub Mobile v1.0.0
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 100,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  profileCard: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  profileBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    marginTop: 8,
  },
  statsGrid: {
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontSize: 14,
  },
  versionText: {
    fontSize: 12,
  },
});
