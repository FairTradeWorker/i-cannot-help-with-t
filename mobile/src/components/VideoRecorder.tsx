// Enhanced Video Recorder Component
// 60-second video recording with preview

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Video, X, CheckCircle, AlertCircle } from 'lucide-react-native';

interface VideoRecorderProps {
  onRecordingComplete: (videoUri: string, thumbnailUri: string) => void;
  maxDuration?: number; // seconds
  onCancel?: () => void;
}

export function VideoRecorder({
  onRecordingComplete,
  maxDuration = 60,
  onCancel,
}: VideoRecorderProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [recording, setRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const cameraRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (durationRef.current) clearInterval(durationRef.current);
    };
  }, []);

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <AlertCircle size={64} color="#ffffff" />
        <Text className="text-white text-xl font-bold mt-6 mb-4 text-center">
          Camera Permission Required
        </Text>
        <Text className="text-white/80 text-center mb-8">
          We need access to your camera to record job videos. Please grant permission in settings.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-primary-500 px-8 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
        {onCancel && (
          <TouchableOpacity
            onPress={onCancel}
            className="mt-4"
          >
            <Text className="text-white/60">Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const startRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setRecording(true);
      setDuration(0);

      // Start duration timer
      durationRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newDuration;
        });
      }, 1000);

      const video = await cameraRef.current.recordAsync({
        maxDuration,
        quality: '720p',
      });

      setRecordedUri(video.uri);
      setRecording(false);
      
      if (durationRef.current) {
        clearInterval(durationRef.current);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
      setRecording(false);
      if (durationRef.current) {
        clearInterval(durationRef.current);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && recording) {
      cameraRef.current.stopRecording();
      setRecording(false);
      if (durationRef.current) {
        clearInterval(durationRef.current);
      }
    }
  };

  const handleConfirm = async () => {
    if (!recordedUri) return;

    setProcessing(true);
    try {
      // Generate thumbnail (mock for now)
      const thumbnailUri = recordedUri; // TODO: Generate actual thumbnail
      
      onRecordingComplete(recordedUri, thumbnailUri);
    } catch (error) {
      console.error('Failed to process video:', error);
      Alert.alert('Error', 'Failed to process video. Please try again.');
      setProcessing(false);
    }
  };

  const handleRetake = () => {
    setRecordedUri(null);
    setDuration(0);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {!recordedUri ? (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          >
            {/* Top Controls */}
            <View style={styles.topControls}>
              {onCancel && (
                <TouchableOpacity
                  onPress={onCancel}
                  style={styles.closeButton}
                >
                  <X size={24} color="#ffffff" />
                </TouchableOpacity>
              )}
              <View style={styles.durationContainer}>
                <Text style={styles.durationText}>
                  {formatTime(duration)} / {formatTime(maxDuration)}
                </Text>
                {recording && (
                  <View style={styles.recordingIndicator} />
                )}
              </View>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <TouchableOpacity
                onPress={toggleCameraFacing}
                style={styles.flipButton}
              >
                <Text style={styles.flipButtonText}>Flip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={recording ? stopRecording : startRecording}
                style={[styles.recordButton, recording && styles.recordButtonActive]}
              >
                <View style={styles.recordButtonInner} />
              </TouchableOpacity>

              <View style={styles.placeholder} />
            </View>
          </CameraView>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              {recording
                ? 'Recording... Tap to stop'
                : 'Tap the record button to start. Show the damage or work needed clearly.'}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Video Preview</Text>
            <Text style={styles.previewDuration}>
              {formatTime(duration)}
            </Text>
          </View>

          <View style={styles.previewVideo}>
            <Video size={64} color="#ffffff" />
            <Text style={styles.previewText}>Video recorded successfully</Text>
          </View>

          <View style={styles.previewActions}>
            <TouchableOpacity
              onPress={handleRetake}
              style={styles.retakeButton}
            >
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={processing}
              style={[styles.confirmButton, processing && styles.confirmButtonDisabled]}
            >
              {processing ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <CheckCircle size={20} color="#ffffff" />
                  <Text style={styles.confirmButtonText}>Use This Video</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 30,
    paddingBottom: 50,
  },
  flipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  flipButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#e5e7eb',
  },
  recordButtonActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ffffff',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ef4444',
  },
  placeholder: {
    width: 80,
  },
  instructions: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  instructionsText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  previewTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  previewDuration: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  previewVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 20,
  },
  previewText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
