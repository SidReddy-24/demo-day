import React from 'react';
import { StyleSheet, View, Text, StatusBar, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';

type BiometricSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BiometricSetup'>;

interface Props {
  navigation: BiometricSetupScreenNavigationProp;
}

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>STEP 3 OF 4</Text>
        </View>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🧬</Text>
        </View>
        <Text style={styles.title}>Biometric Lock</Text>
        <Text style={styles.subtitle}>
          Use FaceID or Fingerprint authentication to authenticate risk-flagged transactions instantly.
        </Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 When transactions have medium risk scores, authenticating via biometrics overrides warning delays safely.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Enable Biometric Setup"
          onPress={handleEnable}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="Setup Later"
          onPress={handleSkip}
          variant="text"
          style={[styles.button, styles.skipBtn]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-between',
    padding: theme.spacing.xl,
    paddingTop: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.roundness.sm,
    alignSelf: 'center',
    marginBottom: theme.spacing.xl,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    letterSpacing: 1.5,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    ...theme.shadows.soft,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: theme.typography.sizes.xl + 2,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  infoBox: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
    width: '90%',
  },
  infoText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.xs,
  },
  footer: {
    width: '100%',
    paddingBottom: 20,
  },
  button: {
    width: '100%',
  },
  skipBtn: {
    marginTop: theme.spacing.sm,
  },
});
