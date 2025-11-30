// 3D Pushable Button Component
// Animated button with depth effect

import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Animated, StyleSheet } from 'react-native';

interface PushableButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  color?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export function PushableButton({
  onPress,
  children,
  color = '#008bf8',
  fullWidth = false,
  disabled = false
}: PushableButtonProps) {
  const [pressed, setPressed] = useState(false);
  const animatedValue = new Animated.Value(0);

  const handlePressIn = () => {
    setPressed(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 34,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-4, -2],
  });

  const shadowTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 1],
  });

  // Generate darker shades for edge and shadow
  const edgeColor = adjustBrightness(color, -20);
  const shadowColor = adjustBrightness(color, -40);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled
      ]}
    >
      {/* Shadow */}
      <Animated.View
        style={[
          styles.shadow,
          {
            backgroundColor: shadowColor,
            transform: [{ translateY: shadowTranslateY }],
          },
        ]}
      />

      {/* Edge */}
      <View style={[styles.edge, { backgroundColor: edgeColor }]} />

      {/* Front */}
      <Animated.View
        style={[
          styles.front,
          {
            backgroundColor: color,
            transform: [{ translateY }],
          },
        ]}
      >
        {typeof children === 'string' ? (
          <Text style={styles.text}>{children}</Text>
        ) : (
          children
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

// Helper function to adjust color brightness
function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);

  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    opacity: 0.3,
  },
  edge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
  },
  front: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
