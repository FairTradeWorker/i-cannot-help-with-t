// Animated Loader Component
// Beautiful three-bar loading animation in black and white

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, useColorScheme } from 'react-native';

interface AnimatedLoaderProps {
  size?: 'small' | 'medium' | 'large';
}

export function AnimatedLoader({ size = 'medium' }: AnimatedLoaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Animation values for each bar
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  const sizeConfig = {
    small: { width: 8, height: 20, spacing: 12 },
    medium: { width: 13.6, height: 32, spacing: 19.992 },
    large: { width: 18, height: 44, spacing: 26 },
  };

  const { width, height, spacing } = sizeConfig[size];

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: false,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      );
    };

    // Start animations with staggered delays
    const animation1 = createAnimation(anim1, 0);
    const animation2 = createAnimation(anim2, 160);
    const animation3 = createAnimation(anim3, 320);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, [anim1, anim2, anim3]);

  const createInterpolations = (animValue: Animated.Value) => ({
    height: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [height, height * 1.25],
    }),
    opacity: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.75, 1],
    }),
    shadowOpacity: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.3],
    }),
  });

  const bar1Style = createInterpolations(anim1);
  const bar2Style = createInterpolations(anim2);
  const bar3Style = createInterpolations(anim3);

  const barColor = isDark ? '#ffffff' : '#000000';

  return (
    <View style={styles.container}>
      <View style={styles.loader}>
        {/* Bar 1 */}
        <Animated.View
          style={[
            styles.bar,
            {
              width,
              height: bar1Style.height,
              opacity: bar1Style.opacity,
              backgroundColor: barColor,
              shadowOpacity: bar1Style.shadowOpacity,
              left: -spacing,
            },
          ]}
        />

        {/* Bar 2 (center) */}
        <Animated.View
          style={[
            styles.bar,
            {
              width,
              height: bar2Style.height,
              opacity: bar2Style.opacity,
              backgroundColor: barColor,
              shadowOpacity: bar2Style.shadowOpacity,
            },
          ]}
        />

        {/* Bar 3 */}
        <Animated.View
          style={[
            styles.bar,
            {
              width,
              height: bar3Style.height,
              opacity: bar3Style.opacity,
              backgroundColor: barColor,
              shadowOpacity: bar3Style.shadowOpacity,
              left: spacing,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bar: {
    position: 'absolute',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowRadius: 0,
    elevation: 4,
  },
});
