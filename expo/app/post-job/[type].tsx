import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Badge, Button, Input } from '@/components/ui';
import { dataStore } from '@/lib/store';
import type { Job, Address } from '@/types';

export default function PostJobScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [estimatedMin, setEstimatedMin] = useState('');
  const [estimatedMax, setEstimatedMax] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  const getJobTypeTitle = () => {
    switch (type) {
      case 'video':
        return 'Video Job Post';
      case 'photo':
        return 'Photo Job Post';
      default:
        return 'Text Job Post';
    }
  };

  const getJobTypeIcon = () => {
    switch (type) {
      case 'video':
        return 'videocam';
      case 'photo':
        return 'camera';
      default:
        return 'document-text';
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'video' 
        ? ImagePicker.MediaTypeOptions.Videos 
        : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: type === 'video' 
        ? ImagePicker.MediaTypeOptions.Videos 
        : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const handleGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Location permission is needed to auto-fill your address.');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const [result] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (result) {
        setAddress({
          street: result.street || '',
          city: result.city || '',
          state: result.region || '',
          zip: result.postalCode || '',
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not get your location. Please enter manually.');
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !address.city || !address.state) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const user = await dataStore.getCurrentUser();
      if (!user) {
        router.replace('/login');
        return;
      }

      const newJob: Job = {
        id: `job-${Date.now()}`,
        title,
        description,
        status: 'posted',
        homeownerId: user.id,
        address,
        urgency,
        videoUrl: type === 'video' ? mediaUri || undefined : undefined,
        imageUrls: type === 'photo' && mediaUri ? [mediaUri] : undefined,
        estimatedCost: {
          min: estimatedMin ? parseFloat(estimatedMin) : 500,
          max: estimatedMax ? parseFloat(estimatedMax) : 2000,
        },
        laborHours: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
        bids: [],
        messages: [],
        milestones: [],
      };

      await dataStore.saveJob(newJob);

      Alert.alert(
        'Success!',
        'Your job has been posted. Contractors will start bidding soon.',
        [
          {
            text: 'View Job',
            onPress: () => router.replace(`/job/${newJob.id}`),
          },
          {
            text: 'Done',
            onPress: () => router.replace('/(tabs)/jobs'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <Animated.View entering={FadeInDown.delay(100)}>
      {type !== 'text' && (
        <Card variant="glass" style={styles.mediaCard}>
          <Text style={[styles.mediaTitle, { color: colors.foreground }]}>
            {type === 'video' ? 'Record or Upload Video' : 'Take or Upload Photo'}
          </Text>
          <Text style={[styles.mediaSubtitle, { color: colors.mutedForeground }]}>
            {type === 'video'
              ? 'A 60-second video helps contractors understand the job better'
              : 'Photos help contractors give more accurate estimates'}
          </Text>

          {mediaUri ? (
            <View style={styles.mediaPreview}>
              <View style={[styles.mediaPlaceholder, { backgroundColor: colors.muted }]}>
                <Ionicons name={type === 'video' ? 'videocam' : 'image'} size={48} color={colors.primary} />
                <Text style={[styles.mediaFileName, { color: colors.foreground }]}>
                  Media uploaded
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.removeMedia, { backgroundColor: colors.destructive }]}
                onPress={() => setMediaUri(null)}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mediaButtons}>
              <TouchableOpacity
                style={[styles.mediaButton, { backgroundColor: colors.primary, borderRadius: borderRadius.lg }]}
                onPress={handleTakePhoto}
              >
                <Ionicons name={type === 'video' ? 'videocam' : 'camera'} size={28} color="#fff" />
                <Text style={styles.mediaButtonText}>
                  {type === 'video' ? 'Record' : 'Camera'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.mediaButton, { backgroundColor: colors.muted, borderRadius: borderRadius.lg }]}
                onPress={handlePickImage}
              >
                <Ionicons name="images" size={28} color={colors.foreground} />
                <Text style={[styles.mediaButtonText, { color: colors.foreground }]}>
                  Gallery
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>
      )}

      <Input
        label="Job Title *"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., Kitchen Sink Repair, Roof Inspection"
      />

      <Input
        label="Description *"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the job in detail..."
        multiline
        numberOfLines={4}
        style={{ height: 100, textAlignVertical: 'top' }}
      />

      <Text style={[styles.inputLabel, { color: colors.foreground }]}>Urgency</Text>
      <View style={styles.urgencyButtons}>
        {(['normal', 'urgent', 'emergency'] as const).map((u) => (
          <TouchableOpacity
            key={u}
            style={[
              styles.urgencyButton,
              {
                backgroundColor: urgency === u ? (u === 'emergency' ? colors.destructive : u === 'urgent' ? colors.accent : colors.secondary) : colors.muted,
                borderRadius: borderRadius.lg,
              },
            ]}
            onPress={() => setUrgency(u)}
          >
            <Text
              style={[
                styles.urgencyButtonText,
                { color: urgency === u ? '#fff' : colors.foreground },
              ]}
            >
              {u.charAt(0).toUpperCase() + u.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button onPress={() => setStep(2)} style={styles.nextButton}>
        Next: Location
      </Button>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View entering={FadeInDown.delay(100)}>
      <View style={styles.locationHeader}>
        <Text style={[styles.stepTitle, { color: colors.foreground }]}>Job Location</Text>
        <Button
          variant="outline"
          size="sm"
          onPress={handleGetLocation}
          icon={<Ionicons name="locate" size={18} color={colors.primary} />}
        >
          Use Current Location
        </Button>
      </View>

      <Input
        label="Street Address"
        value={address.street}
        onChangeText={(text) => setAddress({ ...address, street: text })}
        placeholder="123 Main St"
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Input
            label="City *"
            value={address.city}
            onChangeText={(text) => setAddress({ ...address, city: text })}
            placeholder="City"
          />
        </View>
        <View style={styles.halfWidth}>
          <Input
            label="State *"
            value={address.state}
            onChangeText={(text) => setAddress({ ...address, state: text })}
            placeholder="ST"
          />
        </View>
      </View>

      <Input
        label="ZIP Code"
        value={address.zip}
        onChangeText={(text) => setAddress({ ...address, zip: text })}
        placeholder="12345"
        keyboardType="numeric"
      />

      <View style={styles.buttonRow}>
        <Button variant="outline" onPress={() => setStep(1)}>
          Back
        </Button>
        <Button onPress={() => setStep(3)}>
          Next: Budget
        </Button>
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View entering={FadeInDown.delay(100)}>
      <Text style={[styles.stepTitle, { color: colors.foreground }]}>
        Budget Estimate (Optional)
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.mutedForeground }]}>
        Provide a rough budget range if you have one in mind
      </Text>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Input
            label="Min ($)"
            value={estimatedMin}
            onChangeText={setEstimatedMin}
            placeholder="500"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfWidth}>
          <Input
            label="Max ($)"
            value={estimatedMax}
            onChangeText={setEstimatedMax}
            placeholder="2000"
            keyboardType="numeric"
          />
        </View>
      </View>

      <Card variant="glass" style={styles.summaryCard}>
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Job Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Title</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{title || '-'}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Location</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {address.city && address.state ? `${address.city}, ${address.state}` : '-'}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Urgency</Text>
          <Badge
            variant={urgency === 'emergency' ? 'destructive' : urgency === 'urgent' ? 'warning' : 'secondary'}
          >
            {urgency}
          </Badge>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Media</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {mediaUri ? 'Attached' : 'None'}
          </Text>
        </View>
      </Card>

      <View style={styles.buttonRow}>
        <Button variant="outline" onPress={() => setStep(2)}>
          Back
        </Button>
        <Button onPress={handleSubmit} loading={loading}>
          Post Job
        </Button>
      </View>
    </Animated.View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: getJobTypeTitle(),
          headerBackTitle: 'Cancel',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Progress */}
          <View style={styles.progressContainer}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[
                  styles.progressStep,
                  {
                    backgroundColor: step >= s ? colors.primary : colors.muted,
                    borderRadius: borderRadius.full,
                  },
                ]}
              />
            ))}
          </View>

          {/* Type Badge */}
          <Animated.View entering={FadeIn} style={styles.typeBadge}>
            <Badge variant="default" size="md">
              <Ionicons name={getJobTypeIcon() as any} size={16} color="#fff" />
              <Text style={styles.typeBadgeText}> {getJobTypeTitle()}</Text>
            </Badge>
          </Animated.View>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  progressStep: {
    width: 60,
    height: 4,
  },
  typeBadge: {
    alignItems: 'center',
    marginBottom: 24,
  },
  typeBadgeText: {
    color: '#fff',
    fontWeight: '600',
  },
  mediaCard: {
    padding: 20,
    marginBottom: 24,
  },
  mediaTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  mediaSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  mediaButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mediaPreview: {
    position: 'relative',
  },
  mediaPlaceholder: {
    height: 150,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mediaFileName: {
    fontSize: 14,
    fontWeight: '500',
  },
  removeMedia: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  urgencyButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  urgencyButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  nextButton: {
    marginTop: 8,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  stepSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  summaryCard: {
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
