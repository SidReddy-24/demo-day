import React from 'react';
import { StyleSheet, View, Text, StatusBar, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { Button } from '../../components/Button';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
        </View>
        <Text style={styles.title}>
          Welcome to Sentinel<Text style={styles.accent}>Pay</Text>
        </Text>
        <Text style={styles.subtitle}>
          The AI-Powered secure UPI simulation application. Authenticate or create a profile to test behavior-based fraud prevention.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
          variant="secondary"
          style={[styles.button, styles.registerBtn]}
        />
        <Text style={styles.disclaimerText}>
          No real financial accounts are created or linked.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f5', // Light pinkish ivory
    justifyContent: 'space-between',
    padding: theme.spacing.xxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.soft,
  },
  logoImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    fontSize: theme.typography.sizes.xxl - 2,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  accent: {
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.md,
    paddingHorizontal: theme.spacing.md,
  },
  footer: {
    width: '100%',
    paddingBottom: 20,
  },
  button: {
    width: '100%',
    height: 54,
    borderRadius: 27, // Capsule buttons
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerBtn: {
    marginTop: theme.spacing.md,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  disclaimerText: {
    fontSize: 10,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
});
