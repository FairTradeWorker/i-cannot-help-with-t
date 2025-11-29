// Mobile Video Recorder Component
// Records 60-second videos for job creation

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Video } from 'expo-av';
import { Record, Stop, RotateCcw, CheckCircle, X } from 'lucide-react-native';

interface VideoRecorderProps {
  maxDuration?: number; // in seconds, default 60
  onRecordingComplete: (uri: string) => void;
  onCancel: () => void;
}

export function VideoRecorder({ 
  maxDuration = 60, 
  onRecordingComplete, 
  onCancel 
}: VideoRecorderProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const cameraRef = useRef<CameraView>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recording, maxDuration]);

  const startRecording = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to record videos.');
        return;
      }
    }

    try {
      setRecording(true);
      setRecordingTime(0);
      setVideoUri(null);

      if (cameraRef.current) {
        const video = await cameraRef.current.recordAsync({
          maxDuration,
          quality: '720p',
        });
        
        setVideoUri(video.uri);
        setRecording(false);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (cameraRef.current && recording) {
        cameraRef.current.stopRecording();
        setRecording(false);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const retakeVideo = () => {
    setVideoUri(null);
    setRecordingTime(0);
  };

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleConfirm = () => {
    if (videoUri) {
      onRecordingComplete(videoUri);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Camera Permission Required
        </Text>
        <Text className="text-sm text-gray-600 mb-6 text-center px-4">
          We need access to your camera to record job videos for AI analysis.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.permissionButton, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text className="text-gray-700 font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (videoUri) {
    return (
      <View style={styles.container}>
        <Video
          source={{ uri: videoUri }}
          style={styles.videoPreview}
          useNativeControls
          resizeMode="contain"
        />
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.retakeButton]}
            onPress={retakeVideo}
          >
            <RotateCcw size={24} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirm}
          >
            <CheckCircle size={24} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Use This Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
      >
        <View style={styles.overlay}>
          {/* Timer */}
          <View style={styles.timerContainer}>
            <View style={[styles.timer, recording && styles.timerRecording]}>
              <Text style={styles.timerText}>
                {formatTime(recordingTime)} / {formatTime(maxDuration)}
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onCancel}
            >
              <X size={24} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.recordControls}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={toggleCameraType}
              >
                <RotateCcw size={24} color="#ffffff" />
              </TouchableOpacity>

              {!recording ? (
                <TouchableOpacity
                  style={styles.recordButton}
                  onPress={startRecording}
                >
                  <Record size={48} color="#ffffff" weight="fill" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.recordButton, styles.stopButton]}
                  onPress={stopRecording}
                >
                  <Stop size={48} color="#ffffff" weight="fill" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </CameraView>

      <View style={styles.instructions}>
        <Text className="text-white text-center font-semibold mb-1">
          Record up to {maxDuration} seconds
        </Text>
        <Text className="text-white/80 text-center text-sm">
          Show the damage or issue clearly for AI analysis
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  timerContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  timer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerRecording: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  timerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  stopButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 80,
    height: 80,
  },
  videoPreview: {
    flex: 1,
    backgroundColor: '#000',
  },
  retakeButton: {
    backgroundColor: '#6b7280',
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#10b981',
    flex: 1,
    marginLeft: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  permissionButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  instructions: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
});

