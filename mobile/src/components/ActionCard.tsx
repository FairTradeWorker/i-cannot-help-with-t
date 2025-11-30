// Action Card Component
// Clean card design with hover effects for home screen

import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, useColorScheme } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress: () => void;
  buttonText?: string;
  iconColor?: string;
}

export function ActionCard({
  icon: Icon,
  title,
  description,
  onPress,
  buttonText = 'More info',
  iconColor = '#008bf8',
}: ActionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
      activeOpacity={0.9}
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        isHovered && styles.cardHovered,
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        <Icon color="#ffffff" size={28} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Button */}
      {isHovered && (
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 180,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#c3c6ce',
    position: 'relative',
    overflow: 'visible',
  },
  cardLight: {
    backgroundColor: '#ffffff',
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  cardHovered: {
    borderColor: '#008bf8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  titleDark: {
    color: '#ffffff',
  },
  description: {
    fontSize: 14,
    color: '#868686',
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: -20,
    left: '50%',
    transform: [{ translateX: -75 }],
    width: 150,
  },
  button: {
    backgroundColor: '#008bf8',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
