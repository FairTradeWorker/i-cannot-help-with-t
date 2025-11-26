import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Badge, Button } from '@/components/ui';
import type { User } from '@/types';
import { dataStore } from '@/lib/store';

interface APIProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  tier: 'free' | 'professional' | 'enterprise';
  calls: number;
  icon: string;
  endpoints: string[];
}

const apiProducts: APIProduct[] = [
  {
    id: 'job-scope',
    name: 'Job Scope API',
    description: 'AI-powered job analysis from video, photo, or text',
    price: 0,
    tier: 'free',
    calls: 100,
    icon: 'analytics',
    endpoints: ['POST /api/v1/job-scope'],
  },
  {
    id: 'instant-quote',
    name: 'Instant Quote API',
    description: 'Real-time pricing estimates with confidence scores',
    price: 0,
    tier: 'free',
    calls: 100,
    icon: 'calculator',
    endpoints: ['POST /api/v1/instant-quote'],
  },
  {
    id: 'contractor-match',
    name: 'Contractor Match API',
    description: 'Find the best contractors for any job',
    price: 99,
    tier: 'professional',
    calls: 10000,
    icon: 'people',
    endpoints: ['POST /api/v1/contractor-match'],
  },
  {
    id: 'demand-heatmap',
    name: 'Demand Heatmap API',
    description: 'Market demand analytics by location',
    price: 99,
    tier: 'professional',
    calls: 10000,
    icon: 'map',
    endpoints: ['GET /api/v1/demand-heatmap'],
  },
  {
    id: 'storm-alert',
    name: 'Storm Alert API',
    description: 'Weather-based demand predictions',
    price: 99,
    tier: 'professional',
    calls: 10000,
    icon: 'thunderstorm',
    endpoints: ['GET /api/v1/storm-alert', 'POST /api/v1/storm-webhook'],
  },
  {
    id: 'capital-intel',
    name: 'Capital Intelligence API',
    description: 'Territory valuation and ROI analysis',
    price: 499,
    tier: 'enterprise',
    calls: 1000000,
    icon: 'trending-up',
    endpoints: ['POST /api/v1/capital-intelligence'],
  },
];

export default function IntelligenceScreen() {
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'all' | 'free' | 'professional' | 'enterprise'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await dataStore.getCurrentUser();
    setUser(currentUser);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredProducts = apiProducts.filter((product) => {
    if (selectedTier === 'all') return true;
    return product.tier === selectedTier;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free':
        return colors.secondary;
      case 'professional':
        return colors.primary;
      case 'enterprise':
        return colors.accent;
      default:
        return colors.mutedForeground;
    }
  };

  const learningMetrics = {
    totalPredictions: 10523,
    averageAccuracy: 94.5,
    improvementRate: 12.3,
    compoundingFactor: 2.4,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Intelligence APIs
          </Text>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.muted }]}
            onPress={() => router.push('/api-keys')}
          >
            <Ionicons name="key-outline" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </Animated.View>

        {/* Learning Metrics */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Card variant="glass" style={styles.metricsCard}>
            <View style={styles.metricsHeader}>
              <View style={[styles.metricsIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="sparkles" size={24} color="#fff" />
              </View>
              <View>
                <Text style={[styles.metricsTitle, { color: colors.foreground }]}>
                  AI Learning Loop
                </Text>
                <Text style={[styles.metricsSubtitle, { color: colors.mutedForeground }]}>
                  Continuously improving with every job
                </Text>
              </View>
            </View>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricValue, { color: colors.primary }]}>
                  {learningMetrics.totalPredictions.toLocaleString()}
                </Text>
                <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>
                  Predictions
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricValue, { color: colors.secondary }]}>
                  {learningMetrics.averageAccuracy}%
                </Text>
                <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>
                  Accuracy
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricValue, { color: colors.accent }]}>
                  +{learningMetrics.improvementRate}%
                </Text>
                <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>
                  Improvement
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricValue, { color: colors.foreground }]}>
                  {learningMetrics.compoundingFactor}x
                </Text>
                <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>
                  Compound
                </Text>
              </View>
            </View>
            <Button
              variant="outline"
              onPress={() => router.push('/learning-dashboard')}
              style={styles.metricsButton}
            >
              View Learning Dashboard
            </Button>
          </Card>
        </Animated.View>

        {/* Tier Filter */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tierFilter}
          >
            {(['all', 'free', 'professional', 'enterprise'] as const).map((tier) => (
              <TouchableOpacity
                key={tier}
                style={[
                  styles.tierButton,
                  {
                    backgroundColor: selectedTier === tier ? colors.primary : colors.muted,
                    borderRadius: borderRadius.full,
                  },
                ]}
                onPress={() => setSelectedTier(tier)}
              >
                <Text
                  style={[
                    styles.tierButtonText,
                    { color: selectedTier === tier ? '#fff' : colors.foreground },
                  ]}
                >
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* API Products */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            API Marketplace
          </Text>
          {filteredProducts.map((product, index) => (
            <TouchableOpacity
              key={product.id}
              style={[
                styles.productCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                  borderRadius: borderRadius.xl,
                },
              ]}
              onPress={() => router.push(`/api/${product.id}`)}
            >
              <View style={styles.productHeader}>
                <View
                  style={[
                    styles.productIcon,
                    { backgroundColor: getTierColor(product.tier), borderRadius: borderRadius.lg },
                  ]}
                >
                  <Ionicons name={product.icon as any} size={24} color="#fff" />
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: colors.foreground }]}>
                    {product.name}
                  </Text>
                  <Badge
                    variant={
                      product.tier === 'free'
                        ? 'secondary'
                        : product.tier === 'professional'
                        ? 'default'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {product.tier}
                  </Badge>
                </View>
                <View style={styles.productPrice}>
                  <Text style={[styles.priceValue, { color: colors.foreground }]}>
                    {product.price === 0 ? 'Free' : `$${product.price}`}
                  </Text>
                  <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>
                    /month
                  </Text>
                </View>
              </View>
              <Text style={[styles.productDescription, { color: colors.mutedForeground }]}>
                {product.description}
              </Text>
              <View style={styles.productFooter}>
                <Text style={[styles.callsText, { color: colors.mutedForeground }]}>
                  {product.calls.toLocaleString()} calls/month
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(500)} style={[styles.section, styles.lastSection]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
              ]}
              onPress={() => router.push('/api-keys')}
            >
              <Ionicons name="key" size={28} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.foreground }]}>
                Manage API Keys
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
              ]}
              onPress={() => router.push('/api-usage')}
            >
              <Ionicons name="bar-chart" size={28} color={colors.secondary} />
              <Text style={[styles.actionText, { color: colors.foreground }]}>
                Usage Analytics
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
              ]}
              onPress={() => router.push('/api-docs')}
            >
              <Ionicons name="document-text" size={28} color={colors.accent} />
              <Text style={[styles.actionText, { color: colors.foreground }]}>
                Documentation
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
              ]}
              onPress={() => router.push('/webhooks')}
            >
              <Ionicons name="git-network" size={28} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.foreground }]}>
                Webhooks
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  metricsCard: {
    padding: 20,
  },
  metricsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  metricsSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  metricsButton: {
    marginTop: 8,
  },
  tierFilter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  tierButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  tierButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  priceLabel: {
    fontSize: 12,
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callsText: {
    fontSize: 13,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
});
