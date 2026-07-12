import React from 'react';
import { StyleSheet, Text, ActivityIndicator, Pressable, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { theme } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  // Button styles based on variant
  const getButtonStyles = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.roundness.md,
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: theme.colors.primary,
          ...theme.shadows.accent,
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: theme.colors.backgroundSecondary,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.colors.primary,
        };
      case 'danger':
        return {
          ...base,
          backgroundColor: theme.colors.riskHigh,
        };
      case 'text':
        return {
          ...base,
          backgroundColor: 'transparent',
        };
    }
  };

  // Text styles based on variant
  const getTextStyles = (): TextStyle => {
    const base: TextStyle = {
      fontWeight: theme.typography.weights.semibold,
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
      case 'danger':
        return {
          ...base,
          color: theme.colors.textLight,
        };
      case 'secondary':
        return {
          ...base,
          color: theme.colors.text,
        };
      case 'outline':
      case 'text':
        return {
          ...base,
          color: theme.colors.primary,
        };
    }
  };

  // Padding styles based on size
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.roundness.sm,
        };
      case 'md':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
          borderRadius: theme.roundness.md,
        };
      case 'lg':
        return {
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.xxl,
          borderRadius: theme.roundness.lg,
        };
    }
  };

  const getFontSize = (): TextStyle => {
    switch (size) {
      case 'sm':
        return { fontSize: theme.typography.sizes.xs };
      case 'md':
        return { fontSize: theme.typography.sizes.sm };
      case 'lg':
        return { fontSize: theme.typography.sizes.md };
    }
  };

  const isBtnDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={isBtnDisabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        getButtonStyles(),
        getSizeStyles(),
        isBtnDisabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      disabled={isBtnDisabled}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? theme.colors.textLight : theme.colors.primary}
        />
      ) : (
        <Text style={[getTextStyles(), getFontSize(), textStyle]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
});
