import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Badge, Button } from '@/components/ui';
import { dataStore } from '@/lib/store';
import type { Territory } from '@/types';

const { width } = Dimensions.get('window');

// US States data with simplified coordinates for visualization
const usStates = [
  { code: 'CA', name: 'California', x: 10, y: 35, width: 25, height: 40, activity: 95 },
  { code: 'TX', name: 'Texas', x: 42, y: 55, width: 35, height: 35, activity: 88 },
  { code: 'FL', name: 'Florida', x: 78, y: 70, width: 20, height: 25, activity: 82 },
  { code: 'NY', name: 'New York', x: 83, y: 20, width: 15, height: 18, activity: 78 },
  { code: 'IL', name: 'Illinois', x: 62, y: 30, width: 12, height: 20, activity: 75 },
  { code: 'PA', name: 'Pennsylvania', x: 76, y: 28, width: 14, height: 12, activity: 72 },
  { code: 'OH', name: 'Ohio', x: 70, y: 30, width: 12, height: 15, activity: 68 },
  { code: 'GA', name: 'Georgia', x: 75, y: 55, width: 14, height: 18, activity: 65 },
  { code: 'NC', name: 'North Carolina', x: 78, y: 45, width: 18, height: 12, activity: 62 },
  { code: 'MI', name: 'Michigan', x: 65, y: 18, width: 15, height: 20, activity: 60 },
  { code: 'WA', name: 'Washington', x: 8, y: 5, width: 20, height: 15, activity: 58 },
  { code: 'AZ', name: 'Arizona', x: 22, y: 50, width: 18, height: 22, activity: 55 },
  { code: 'CO', name: 'Colorado', x: 35, y: 38, width: 18, height: 18, activity: 52 },
];

export default function TerritoriesScreen() {
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    loadTerritories();
  }, []);

  const loadTerritories = async () => {
    const allTerritories = await dataStore.getTerritories();
    setTerritories(allTerritories);
  };

  const getActivityColor = (activity: number) => {
    if (activity >= 80) return colors.primary;
    if (activity >= 60) return colors.secondary;
    if (activity >= 40) return colors.accent;
    return colors.mutedForeground;
  };

  const stats = [
    { label: 'Available', value: '850+', icon: 'map', color: colors.primary },
    { label: 'Active Jobs', value: '2.8K', icon: 'briefcase', color: colors.secondary },
    { label: 'Revenue/Month', value: '$45', icon: 'cash', color: colors.accent },
  ];

  const selectedStateData = selectedState
    ? usStates.find((s) => s.code === selectedState)
    : null;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Territories',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Stats */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statsSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {stats.map((stat) => (
                <View
                  key={stat.label}
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
                  ]}
                >
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                  <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Interactive Map */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Territory Map
            </Text>
            <Card variant="glass" style={styles.mapCard}>
              <View style={styles.mapContainer}>
                <View style={[styles.mapBackground, { backgroundColor: colors.muted }]}>
                  {usStates.map((state) => (
                    <TouchableOpacity
                      key={state.code}
                      style={[
                        styles.stateBox,
                        {
                          left: `${state.x}%`,
                          top: `${state.y}%`,
                          width: `${state.width}%`,
                          height: `${state.height}%`,
                          backgroundColor: getActivityColor(state.activity) + (selectedState === state.code ? 'ff' : '40'),
                          borderColor: selectedState === state.code ? colors.foreground : 'transparent',
                          borderWidth: selectedState === state.code ? 2 : 0,
                          borderRadius: borderRadius.md,
                        },
                      ]}
                      onPress={() => setSelectedState(selectedState === state.code ? null : state.code)}
                    >
                      <Text style={styles.stateCode}>{state.code}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Legend */}
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.legendText, { color: colors.mutedForeground }]}>High Activity</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
                  <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Medium</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
                  <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Low</Text>
                </View>
              </View>

              {/* Selected State Info */}
              {selectedStateData && (
                <Animated.View entering={FadeIn} style={[styles.stateInfo, { backgroundColor: colors.muted, borderRadius: borderRadius.lg }]}>
                  <View style={styles.stateInfoHeader}>
                    <Text style={[styles.stateInfoName, { color: colors.foreground }]}>
                      {selectedStateData.name}
                    </Text>
                    <Badge variant="default">{selectedStateData.activity}% Active</Badge>
                  </View>
                  <Text style={[styles.stateInfoText, { color: colors.mutedForeground }]}>
                    Available territories with exclusive lead rights
                  </Text>
                  <Button
                    onPress={() => router.push(`/territory/${selectedStateData.code}`)}
                    style={styles.stateInfoButton}
                  >
                    View {selectedStateData.code} Territories
                  </Button>
                </Animated.View>
              )}
            </Card>
          </Animated.View>

          {/* How It Works */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              How Territories Work
            </Text>
            <Card variant="glass" style={styles.howItWorksCard}>
              {[
                { icon: 'map', title: 'Choose Your Territory', desc: 'Select ZIP codes in your service area' },
                { icon: 'cash', title: 'Pay $45/month', desc: 'Low monthly fee for exclusive lead access' },
                { icon: 'flash', title: 'Get Exclusive Leads', desc: 'All jobs in your territory come to you first' },
                { icon: 'trending-up', title: 'Grow Your Business', desc: 'Build recurring revenue in your area' },
              ].map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, { color: colors.foreground }]}>{step.title}</Text>
                    <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>{step.desc}</Text>
                  </View>
                </View>
              ))}
            </Card>
          </Animated.View>

          {/* Featured Territories */}
          <Animated.View entering={FadeInDown.delay(400)} style={[styles.section, styles.lastSection]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Featured Territories
              </Text>
              <TouchableOpacity onPress={() => router.push('/territories/browse')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            {usStates.slice(0, 5).map((state, index) => (
              <TouchableOpacity
                key={state.code}
                style={[
                  styles.territoryCard,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.xl },
                ]}
                onPress={() => router.push(`/territory/${state.code}`)}
              >
                <View style={[styles.territoryIcon, { backgroundColor: getActivityColor(state.activity) }]}>
                  <Text style={styles.territoryIconText}>{state.code}</Text>
                </View>
                <View style={styles.territoryInfo}>
                  <Text style={[styles.territoryName, { color: colors.foreground }]}>{state.name}</Text>
                  <Text style={[styles.territoryMeta, { color: colors.mutedForeground }]}>
                    {Math.floor(Math.random() * 50 + 10)} territories available
                  </Text>
                </View>
                <View style={styles.territoryRight}>
                  <Text style={[styles.territoryPrice, { color: colors.primary }]}>$45</Text>
                  <Text style={[styles.territoryPriceLabel, { color: colors.mutedForeground }]}>/mo</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
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
  statsSection: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  statCard: {
    padding: 16,
    marginRight: 12,
    width: width * 0.35,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
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
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  mapCard: {
    padding: 16,
  },
  mapContainer: {
    marginBottom: 16,
  },
  mapBackground: {
    height: 200,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  stateBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateCode: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
  },
  stateInfo: {
    padding: 16,
  },
  stateInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stateInfoName: {
    fontSize: 18,
    fontWeight: '700',
  },
  stateInfoText: {
    fontSize: 14,
    marginBottom: 12,
  },
  stateInfoButton: {
    marginTop: 4,
  },
  howItWorksCard: {
    padding: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 14,
  },
  territoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  territoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  territoryIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  territoryInfo: {
    flex: 1,
    marginLeft: 16,
  },
  territoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  territoryMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  territoryRight: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  territoryPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  territoryPriceLabel: {
    fontSize: 12,
  },
});
