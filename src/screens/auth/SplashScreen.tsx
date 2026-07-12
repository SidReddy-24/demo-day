import React, { useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';
import { theme } from '../../theme';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  const { isOnboarded, isAuthenticated, pinCode, permissions } = useAuthStore();

  useEffect(() => {
    // Logo entrance animation
    logoScale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.back(1.5)),
    });
    logoOpacity.value = withTiming(1, { duration: 800 });

    // Text fade-in animation
    textOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) })
    );

    // Dynamic routing delay
    const timer = setTimeout(() => {
      if (!isOnboarded) {
        navigation.replace('Onboarding');
      } else if (!isAuthenticated) {
        navigation.replace('Welcome');
      } else if (!permissions.sms || !permissions.location || !permissions.notifications) {
        navigation.replace('Permissions');
      } else if (!pinCode) {
        navigation.replace('PinSetup');
      } else {
        navigation.replace('DashboardStub');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.logoWrapper}>
        <Animated.View style={[styles.logoCircle, logoAnimatedStyle]}>
          <Text style={styles.logoSymbol}>🛡️</Text>
        </Animated.View>
        <Animated.View style={[styles.brandContainer, textAnimatedStyle]}>
          <Text style={styles.brandTitle}>
            Sentinel<Text style={styles.brandAccent}>Pay</Text>
          </Text>
          <Text style={styles.brandSubtitle}>AI-POWERED SECURE UPI</Text>
        </Animated.View>
      </View>
      <Animated.View style={[styles.footerContainer, textAnimatedStyle]}>
        <Text style={styles.footerText}>Secure Banking Simulation</Text>
        <Text style={styles.disclaimerText}>Demo Prototype Only</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  logoSymbol: {
    fontSize: 42,
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.accent,
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: theme.colors.primary,
  },
  brandSubtitle: {
    fontSize: theme.typography.sizes.xs - 2,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
    letterSpacing: 2.5,
    marginTop: theme.spacing.xs,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text,
    fontWeight: theme.typography.weights.semibold,
  },
  disclaimerText: {
    fontSize: theme.typography.sizes.xs - 2,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
});
