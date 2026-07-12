import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, Alert, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { useAuthStore } from '../../store/authStore';

type PinSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PinSetup'>;

interface Props {
  navigation: PinSetupScreenNavigationProp;
}

export const PinSetupScreen: React.FC<Props> = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [firstPin, setFirstPin] = useState('');
  
  const setPinCode = useAuthStore((state) => state.setPinCode);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      
      if (nextPin.length === 4) {
        // Handle completing pin code input
        setTimeout(() => {
          if (!confirming) {
            setFirstPin(nextPin);
            setPin('');
            setConfirming(true);
          } else {
            if (nextPin === firstPin) {
              setPinCode(nextPin);
              if (Platform.OS === 'web') {
                alert('Security Active\n\nYour transaction PIN has been securely set.');
                navigation.replace('DashboardStub');
              } else {
                Alert.alert('Security Active', 'Your transaction PIN has been securely set.', [
                  {
                    text: 'Enter App',
                    onPress: () => navigation.replace('DashboardStub'),
                  },
                ]);
              }
            } else {
              if (Platform.OS === 'web') {
                alert('PIN Mismatch\n\nPasscodes do not match, please try again.');
              } else {
                Alert.alert('PIN Mismatch', 'Passcodes do not match, please try again.');
              }
              setPin('');
              setFirstPin('');
              setConfirming(false);
            }
          }
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>STEP 4 OF 4</Text>
        </View>
        <Text style={styles.title}>
          {confirming ? 'Confirm Secure PIN' : 'Set Secure PIN'}
        </Text>
        <Text style={styles.subtitle}>
          {confirming
            ? 'Re-enter your 4-digit passcode to verify'
            : 'Create a security PIN for authenticating your UPI simulation'}
        </Text>
      </View>

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.dot,
              pin.length > index && styles.dotFilled,
            ]}
          />
        ))}
      </View>

      {/* Custom Keypad */}
      <View style={styles.keypad}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['', '0', '⌫'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key, keyIndex) => {
              if (key === '') {
                return <View key={keyIndex} style={styles.keypadButtonSpacer} />;
              }
              return (
                <TouchableOpacity
                  key={keyIndex}
                  onPress={() => (key === '⌫' ? handleBackspace() : handleKeyPress(key))}
                  style={[styles.keypadButton, key === '⌫' && styles.backspaceButton]}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
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
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  badge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.roundness.sm,
    marginBottom: theme.spacing.sm,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xl,
    lineHeight: theme.typography.lineHeights.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: theme.spacing.xxl,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: theme.colors.borderDark,
    marginHorizontal: theme.spacing.md,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  keypad: {
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.sm,
  },
  keypadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  keypadButtonSpacer: {
    width: 70,
    height: 70,
  },
  backspaceButton: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  keyText: {
    fontSize: theme.typography.sizes.xl - 2,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
});
