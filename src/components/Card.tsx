import React from 'react';
import { StyleSheet, View, ViewStyle, Pressable, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  shadow?: 'soft' | 'medium' | 'none';
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  shadow = 'soft',
  style,
  contentStyle,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 350 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 350 });
    }
  };

  const getShadowStyles = () => {
    if (shadow === 'soft') return theme.shadows.soft;
    if (shadow === 'medium') return theme.shadows.medium;
    return {};
  };

  const cardBaseStyle = [
    styles.card,
    getShadowStyles(),
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[cardBaseStyle, animatedStyle]}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
      </AnimatedPressable>
    );
  }

  return (
    <View style={cardBaseStyle}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.roundness.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  content: {
    padding: theme.spacing.lg,
  },
});
