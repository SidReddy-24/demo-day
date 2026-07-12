import React, { useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue, withTiming, withDelay, withSequence, withSpring,
  useAnimatedStyle, runOnJS, FadeIn, FadeOut,
} from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';

const { width, height } = Dimensions.get('window');

const C = {
  bg: '#6C5CE7',
  bgDark: '#4A3AB5',
  white: '#FFFFFF',
  accent: '#00C9A7',
};

export const SplashScreen = ({ navigation }: any) => {
  const { isOnboarded, isAuthenticated } = useAuthStore();

  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const ring1Scale = useSharedValue(0.3);
  const ring1Opacity = useSharedValue(0);
  const ring2Scale = useSharedValue(0.3);
  const ring2Opacity = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));
  const ring1Style = useAnimatedStyle(() => ({ transform: [{ scale: ring1Scale.value }], opacity: ring1Opacity.value }));
  const ring2Style = useAnimatedStyle(() => ({ transform: [{ scale: ring2Scale.value }], opacity: ring2Opacity.value }));

  useEffect(() => {
    // Logo bounce in
    scale.value = withSequence(
      withTiming(1.15, { duration: 450 }),
      withSpring(1, { damping: 10, stiffness: 120 })
    );
    opacity.value = withTiming(1, { duration: 400 });

    // Rings expand
    ring1Scale.value = withDelay(200, withTiming(1, { duration: 700 }));
    ring1Opacity.value = withDelay(200, withTiming(0.25, { duration: 500 }));
    ring2Scale.value = withDelay(350, withTiming(1, { duration: 800 }));
    ring2Opacity.value = withDelay(350, withTiming(0.15, { duration: 600 }));

    // Text fades in
    textOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));

    // Navigate after 2.2s
    const timer = setTimeout(() => {
      const dest = !isOnboarded ? 'Onboarding' : isAuthenticated ? 'DashboardStub' : 'Welcome';
      navigation.replace(dest);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Background rings */}
      <Animated.View style={[s.ring, s.ring2, ring2Style]} />
      <Animated.View style={[s.ring, s.ring1, ring1Style]} />

      {/* Logo */}
      <Animated.View style={[s.logoCircle, logoStyle]}>
        <Text style={s.logoEmoji}>⚡</Text>
      </Animated.View>

      {/* Brand text */}
      <Animated.View style={[s.textBlock, textStyle]}>
        <Text style={s.brandName}>SentinelPay</Text>
        <Text style={s.tagline}>AI-Powered Secure UPI</Text>
        <View style={s.badge}>
          <Text style={s.badgeText}>🔬 SANDBOX MODE</Text>
        </View>
      </Animated.View>

      {/* Bottom loader */}
      <Animated.View style={[s.bottomWrap, textStyle]}>
        <View style={s.loaderTrack}>
          <Animated.View style={s.loaderBar} />
        </View>
        <Text style={s.loaderText}>Initialising AI Security Engine…</Text>
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' },

  ring: { position: 'absolute', borderRadius: 999, borderWidth: 1.5 },
  ring1: { width: 260, height: 260, borderColor: 'rgba(255,255,255,0.3)' },
  ring2: { width: 360, height: 360, borderColor: 'rgba(255,255,255,0.15)' },

  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 28, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  logoEmoji: { fontSize: 46 },

  textBlock: { alignItems: 'center' },
  brandName: { fontSize: 34, fontWeight: '900', color: C.white, letterSpacing: -0.5, marginBottom: 8 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginBottom: 16 },
  badge: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  badgeText: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: 1 },

  bottomWrap: { position: 'absolute', bottom: Platform.OS === 'ios' ? 60 : 48, alignItems: 'center', width: '100%', paddingHorizontal: 48 },
  loaderTrack: { width: '100%', height: 3, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 12, overflow: 'hidden' },
  loaderBar: { width: '70%', height: '100%', backgroundColor: C.accent, borderRadius: 2 },
  loaderText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
});
