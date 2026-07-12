import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, Alert, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

type PinSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PinSetup'>;

interface Props {
  navigation: PinSetupScreenNavigationProp;
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
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      
      <Animated.View entering={FadeInDown.delay(50).duration(500)} style={s.header}>
        <View style={s.badge}>
          <Text style={s.badgeText}>STEP 4 OF 4</Text>
        </View>
        <Text style={s.title}>
          {confirming ? 'Confirm Secure PIN' : 'Set Secure PIN'}
        </Text>
        <Text style={s.subtitle}>
          {confirming
            ? 'Re-enter your 4-digit passcode to verify'
            : 'Create a security PIN for authenticating your UPI simulation'}
        </Text>
      </Animated.View>

      {/* Dots Indicator */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={s.dotsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              s.dot,
              pin.length > index && s.dotFilled,
            ]}
          />
        ))}
      </Animated.View>

      {/* Custom Keypad */}
      <Animated.View entering={FadeInDown.delay(150).duration(500)} style={s.keypad}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['', '0', '⌫'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={s.row}>
            {row.map((key, keyIndex) => {
              if (key === '') {
                return <View key={keyIndex} style={s.keypadButtonSpacer} />;
              }
              return (
                <TouchableOpacity
                  key={keyIndex}
                  onPress={() => (key === '⌫' ? handleBackspace() : handleKeyPress(key))}
                  style={[s.keypadButton, key === '⌫' && s.backspaceButton]}
                  activeOpacity={0.8}
                >
                  <Text style={s.keyText}>{key}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
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
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: C.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: C.text,
  },
  subtitle: {
    fontSize: 14,
    color: C.sub,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 32,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: C.border,
    marginHorizontal: 10,
    backgroundColor: C.white,
  },
  dotFilled: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  keypad: {
    width: '100%',
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  keypadButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  keypadButtonSpacer: {
    width: 72,
    height: 72,
  },
  backspaceButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  keyText: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
  },
});
