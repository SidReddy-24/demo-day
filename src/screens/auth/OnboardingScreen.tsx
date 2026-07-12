import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, StatusBar, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';
import { theme } from '../../theme';
import { Button } from '../../components/Button';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

interface Slide {
  id: string;
  icon: string;
  title: string;
  description: string;
  disclaimer?: boolean;
}

const { width } = Dimensions.get('window');

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: '🛡️',
    title: 'Simulated Security',
    description: 'SentinelPay AI is a secure UPI simulation built strictly for hackathons. No real banking credentials or money transactions occur.',
    disclaimer: true,
  },
  {
    id: '2',
    icon: '🧠',
    title: 'AI Fraud Detection',
    description: 'Analyze real-time transaction anomalies, device trust levels, and user behaviors using mocked AI models and graph engines.',
  },
  {
    id: '3',
    icon: '👥',
    title: 'Community Trust',
    description: 'Crowdsource fraud reports, verify scam merchants dynamically, and flag malicious QR codes instantly across the local ecosystem.',
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const setOnboarded = useAuthStore((state) => state.setOnboarded);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      setOnboarded(true);
      navigation.replace('Welcome');
    }
  };

  const renderSlide = ({ item }: { item: Slide }) => {
    return (
      <View style={styles.slide}>
        <View style={[styles.iconContainer, item.disclaimer && styles.disclaimerIconContainer]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        {item.disclaimer && (
          <View style={styles.disclaimerBadge}>
            <Text style={styles.disclaimerText}>SANDBOX MODE ONLY</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
        <Button
          title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          onPress={handleNext}
          variant="primary"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    ...theme.shadows.soft,
  },
  disclaimerIconContainer: {
    backgroundColor: '#FFF3E0', // warning orange light
  },
  icon: {
    fontSize: 54,
  },
  title: {
    fontSize: theme.typography.sizes.xl + 2,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.md,
    paddingHorizontal: theme.spacing.md,
  },
  disclaimerBadge: {
    backgroundColor: '#FFE0B2',
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.roundness.sm,
    marginTop: theme.spacing.xl,
  },
  disclaimerText: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.riskMedium,
    letterSpacing: 1.5,
  },
  footer: {
    paddingHorizontal: theme.spacing.xxl,
    paddingBottom: 50,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  indicator: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: theme.colors.primary,
    width: 18,
  },
  button: {
    width: '100%',
  },
});
