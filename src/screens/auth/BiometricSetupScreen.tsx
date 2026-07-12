import React from 'react';
import { StyleSheet, View, Text, StatusBar, Alert, TouchableOpacity, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

type BiometricSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BiometricSetup'>;

interface Props {
  navigation: BiometricSetupScreenNavigationProp;
}

const C = {
  bg: '#F4F6FA',
  primary: '#6C5CE7',
  primaryLight: '#EDE9FF',
  text: '#1A1D2E',
  sub: '#8A8FA8',
  white: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E8EBF4',
};

export const BiometricSetupScreen: React.FC<Props> = ({ navigation }) => {
  const setBiometricsEnabled = useAuthStore((state) => state.setBiometricsEnabled);

  const handleEnable = () => {
    Alert.alert(
      'Biometric Request',
      'Allow "SentinelPay AI" to use Face ID / Touch ID to verify transactions?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: () => {
            setBiometricsEnabled(true);
            navigation.navigate('PinSetup');
          },
        },
      ]
    );
  };

  const handleSkip = () => {
    setBiometricsEnabled(false);
    navigation.navigate('PinSetup');
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      
      <Animated.View entering={FadeInDown.delay(50).duration(500)} style={s.content}>
        <View style={s.badge}>
          <Text style={s.badgeText}>STEP 3 OF 4</Text>
        </View>

        <View style={s.illustWrapper}>
          <View style={s.ring3} />
          <View style={s.ring2} />
          <View style={s.ring1} />
          <View style={s.iconContainer}>
            <Text style={s.icon}>🧬</Text>
          </View>
        </View>

        <Text style={s.title}>Biometric Lock</Text>
        <Text style={s.subtitle}>
          Use FaceID or Fingerprint authentication to authenticate risk-flagged transactions instantly.
        </Text>

        <View style={s.infoBox}>
          <Text style={s.infoText}>
            💡 When transactions have medium risk scores, authenticating via biometrics overrides warning delays safely.
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(500)} style={s.footer}>
        <TouchableOpacity style={s.primaryBtn} onPress={handleEnable} activeOpacity={0.85}>
          <Text style={s.primaryBtnText}>Enable Biometric Setup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondaryBtn} onPress={handleSkip} activeOpacity={0.85}>
          <Text style={s.secondaryBtnText}>Setup Later</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: C.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 28,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: 1.5,
  },
  illustWrapper: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  ring3: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(108,92,231,0.03)' },
  ring2: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(108,92,231,0.06)' },
  ring1: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: C.primaryLight },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: C.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: C.sub,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  infoBox: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.border,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  infoText: {
    fontSize: 12,
    color: C.text,
    lineHeight: 18,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: C.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
  },
  secondaryBtnText: {
    color: C.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
