import React from 'react';
import {
  StyleSheet, View, Text, StatusBar, TouchableOpacity,
  Platform, Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const C = {
  bg: '#F4F6FA',
  primary: '#6C5CE7',
  primaryLight: '#EDE9FF',
  primaryDark: '#4A3AB5',
  accent: '#00C9A7',
  accentLight: '#E0FAF5',
  text: '#1A1D2E',
  sub: '#8A8FA8',
  white: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E8EBF4',
};

const ShieldHero = () => (
  <View style={hero.wrap}>
    {/* Outer glow ring */}
    <View style={hero.ring3} />
    <View style={hero.ring2} />
    <View style={hero.ring1} />
    {/* Central shield */}
    <View style={hero.shield}>
      <Text style={{ fontSize: 52 }}>🛡️</Text>
    </View>
    {/* Floating stat chips */}
    <View style={[hero.chip, hero.chipTR, { backgroundColor: C.accentLight }]}>
      <Text style={[hero.chipText, { color: C.accent }]}>✓ 256-bit Encrypted</Text>
    </View>
    <View style={[hero.chip, hero.chipBL, { backgroundColor: C.primaryLight }]}>
      <Text style={[hero.chipText, { color: C.primary }]}>🧠 AI Protected</Text>
    </View>
    <View style={[hero.chip, hero.chipBR, { backgroundColor: '#FFF3E0' }]}>
      <Text style={[hero.chipText, { color: '#F57C00' }]}>🔒 Zero Trust</Text>
    </View>
  </View>
);

const hero = StyleSheet.create({
  wrap: { width: width - 40, height: 300, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, marginBottom: 10 },
  ring3: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(108,92,231,0.04)', borderWidth: 1, borderColor: 'rgba(108,92,231,0.08)' },
  ring2: { position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: 'rgba(108,92,231,0.07)', borderWidth: 1, borderColor: 'rgba(108,92,231,0.12)' },
  ring1: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: C.primaryLight },
  shield: { width: 90, height: 90, borderRadius: 45, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  chip: { position: 'absolute', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  chipTR: { top: 28, right: 0 },
  chipBL: { bottom: 40, left: 0 },
  chipBR: { bottom: 24, right: 10 },
  chipText: { fontSize: 11, fontWeight: '800' },
});

export const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Logo + Brand */}
      <Animated.View entering={FadeInDown.delay(60).duration(500)} style={s.topBar}>
        <View style={s.logoRow}>
          <View style={s.logoMark}>
            <Text style={{ fontSize: 18 }}>⚡</Text>
          </View>
          <Text style={s.logoText}>SentinelPay</Text>
        </View>
      </Animated.View>

      {/* Hero illustration */}
      <Animated.View entering={FadeInDown.delay(120).duration(600)}>
        <ShieldHero />
      </Animated.View>

      {/* Copy */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={s.copy}>
        <Text style={s.headline}>Secure UPI{'\n'}Powered by AI</Text>
        <Text style={s.tagline}>
          Behavioural biometrics, real-time fraud detection and community-driven trust — all in one place.
        </Text>
        <View style={s.sandboxBadge}>
          <Text style={s.sandboxText}>🔬 SANDBOX DEMO MODE</Text>
        </View>
      </Animated.View>

      {/* CTA buttons */}
      <Animated.View entering={FadeInDown.delay(300).duration(600)} style={s.ctas}>
        <TouchableOpacity
          style={s.primaryBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.88}
        >
          <Text style={s.primaryBtnText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.secondaryBtn}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.88}
        >
          <Text style={s.secondaryBtnText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={s.disclaimer}>
          No real accounts created • For demo purposes only
        </Text>
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, justifyContent: 'space-between', paddingBottom: Platform.OS === 'ios' ? 48 : 36 },

  topBar: { paddingTop: Platform.OS === 'ios' ? 56 : 44, paddingHorizontal: 24, paddingBottom: 4 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 20, fontWeight: '900', color: C.text },

  copy: { paddingHorizontal: 28 },
  headline: { fontSize: 36, fontWeight: '900', color: C.text, lineHeight: 44, marginBottom: 14 },
  tagline: { fontSize: 15, color: C.sub, lineHeight: 23, marginBottom: 16 },
  sandboxBadge: { alignSelf: 'flex-start', backgroundColor: '#FFE0B2', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  sandboxText: { fontSize: 10, fontWeight: '800', color: '#E65100', letterSpacing: 1 },

  ctas: { paddingHorizontal: 28, gap: 14 },
  primaryBtn: { width: '100%', height: 56, borderRadius: 28, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  primaryBtnText: { color: C.white, fontSize: 15, fontWeight: '800' },
  secondaryBtn: { width: '100%', height: 56, borderRadius: 28, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: C.border },
  secondaryBtnText: { color: C.text, fontSize: 15, fontWeight: '700' },
  disclaimer: { textAlign: 'center', fontSize: 11, color: C.sub, marginTop: 4 },
});
