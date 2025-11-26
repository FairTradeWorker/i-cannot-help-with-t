import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  style,
}: BadgeProps) {
  const { colors, borderRadius } = useTheme();

  const getVariantStyles = (): ViewStyle & { textColor: string } => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          textColor: colors.secondaryForeground,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
          textColor: colors.foreground,
        };
      case 'destructive':
        return {
          backgroundColor: colors.destructive,
          textColor: colors.destructiveForeground,
        };
      case 'success':
        return {
          backgroundColor: colors.success,
          textColor: '#ffffff',
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
          textColor: '#000000',
        };
      default:
        return {
          backgroundColor: colors.primary,
          textColor: colors.primaryForeground,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'md':
        return {
          paddingHorizontal: 10,
          paddingVertical: 4,
          fontSize: 14,
        };
      default:
        return {
          paddingHorizontal: 8,
          paddingVertical: 2,
          fontSize: 12,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          borderRadius: borderRadius.full,
          backgroundColor: variantStyles.backgroundColor,
          borderWidth: variantStyles.borderWidth,
          borderColor: variantStyles.borderColor,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            styles.text,
            { color: variantStyles.textColor, fontSize: sizeStyles.fontSize },
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
