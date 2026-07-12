import React, { useState, useRef } from 'react';
import {
  StyleSheet, View, Text, FlatList, Dimensions,
  StatusBar, TouchableOpacity, Platform,
} from 'react-native';
import Animated, {
  FadeInDown, FadeInUp, useSharedValue, withTiming,
  useAnimatedStyle, interpolate, withSpring,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';
import { useAuthStore } from '../../store/authStore';

const { width, height } = Dimensions.get('window');

const C = {
  bg: '#F4F6FA',
  primary: '#6C5CE7',
  primaryLight: '#EDE9FF',
  primaryDark: '#4A3AB5',
  accent: '#00C9A7',
  text: '#1A1D2E',
  sub: '#8A8FA8',
  white: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E8EBF4',
};

interface Slide {
  id: string;
  emoji: string;
  bgColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  tag?: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    emoji: '🛡️',
    bgColor: '#EDE9FF',
    iconBg: C.primary,
    title: 'Simulated Security',
    subtitle: 'SentinelPay AI is a secure UPI simulation. No real banking credentials or money are involved — strictly sandbox.',
    tag: 'SANDBOX ONLY',
  },
  {
    id: '2',
    emoji: '🧠',
    bgColor: '#E0FAF5',
    iconBg: C.accent,
    title: 'AI Fraud Detection',
    subtitle: 'Real-time anomaly detection, device trust scoring, and behavioural biometrics powered by a mocked AI engine.',
  },
  {
    id: '3',
    emoji: '👥',
    bgColor: '#E8EBF4',
    iconBg: '#1A1D2E',
    title: 'Community Shield',
    subtitle: 'Crowdsource scam reports, flag malicious QR codes, and verify merchant trust scores across the ecosystem.',
  },
];

const SlideIllustration = ({ slide }: { slide: Slide }) => (
  <View style={[si.illustrationWrap, { backgroundColor: slide.bgColor }]}>
    {/* Decorative circles */}
    <View style={si.decCircle1} />
    <View style={si.decCircle2} />
    {/* Main icon circle */}
    <View style={[si.iconCircle, { backgroundColor: slide.iconBg }]}>
      <Text style={si.emoji}>{slide.emoji}</Text>
    </View>
    {/* Small floating badges */}
    <View style={[si.badge1, { backgroundColor: C.white }]}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: slide.iconBg }}>✓ Secure</Text>
    </View>
    <View style={[si.badge2, { backgroundColor: C.white }]}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: C.text }}>AI Ready</Text>
    </View>
  </View>
);

const si = StyleSheet.create({
  illustrationWrap: { width: width - 40, height: 280, borderRadius: 32, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginHorizontal: 20 },
  decCircle1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.35)', top: -40, right: -40 },
  decCircle2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.2)', bottom: -20, left: -20 },
  iconCircle: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  emoji: { fontSize: 48 },
  badge1: { position: 'absolute', top: 28, right: 28, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  badge2: { position: 'absolute', bottom: 32, left: 28, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
});

export const OnboardingScreen = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const setOnboarded = useAuthStore(s => s.setOnboarded);

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(idx);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      setOnboarded(true);
      navigation.replace('Welcome');
    }
  };

  const handleSkip = () => {
    setOnboarded(true);
    navigation.replace('Welcome');
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={s.slide}>
      <SlideIllustration slide={item} />
      <View style={s.textWrap}>
        <Text style={s.slideTitle}>{item.title}</Text>
        <Text style={s.slideDesc}>{item.subtitle}</Text>
        {item.tag && (
          <View style={s.tagBadge}>
            <Text style={s.tagText}>{item.tag}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Skip button */}
      <Animated.View entering={FadeInUp.delay(100).duration(400)} style={s.topBar}>
        <Text style={s.skipText} onPress={handleSkip}>Skip</Text>
      </Animated.View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={item => item.id}
        style={{ flexGrow: 0 }}
      />

      {/* Footer */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={s.footer}>
        {/* Dots */}
        <View style={s.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[s.dot, i === currentIndex && s.dotActive, i === currentIndex && { backgroundColor: SLIDES[i].iconBg }]}
            />
          ))}
        </View>
        {/* Next / Get Started */}
        <TouchableOpacity
          style={[s.nextBtn, { backgroundColor: SLIDES[currentIndex].iconBg }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={s.nextText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started →' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  topBar: { paddingTop: Platform.OS === 'ios' ? 56 : 44, paddingHorizontal: 24, alignItems: 'flex-end', marginBottom: 16 },
  skipText: { fontSize: 14, color: C.sub, fontWeight: '700' },

  slide: { width, paddingHorizontal: 0, paddingTop: 8, paddingBottom: 16 },
  textWrap: { paddingHorizontal: 28, marginTop: 30 },
  slideTitle: { fontSize: 28, fontWeight: '900', color: C.text, marginBottom: 10 },
  slideDesc: { fontSize: 15, color: C.sub, lineHeight: 23, marginBottom: 16 },
  tagBadge: { alignSelf: 'flex-start', backgroundColor: '#FFE0B2', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 10, fontWeight: '800', color: '#F57C00', letterSpacing: 1.5 },

  footer: { paddingHorizontal: 28, paddingBottom: Platform.OS === 'ios' ? 50 : 36, gap: 20 },
  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.border },
  dotActive: { width: 24 },
  nextBtn: { width: '100%', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  nextText: { color: C.white, fontSize: 15, fontWeight: '800' },
});
