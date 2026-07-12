import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { theme } from '../theme';

interface LoadingProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Processing...',
  subMessage,
  fullScreen = false,
  style,
}) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const content = (
    <View style={[styles.innerContainer, style]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Animated.View style={[styles.textContainer, animatedStyle]}>
        <Text style={styles.message}>{message}</Text>
        {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
      </Animated.View>
    </View>
  );

  if (fullScreen) {
    return <View style={styles.fullScreenContainer}>{content}</View>;
  }

  return content;
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  textContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  message: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});
