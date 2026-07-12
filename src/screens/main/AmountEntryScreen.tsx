import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, Pressable, TouchableOpacity, Platform } from 'react-native';
import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { RiskBadge } from '../../components/RiskBadge';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';

export const AmountEntryScreen = ({ route, navigation }: any) => {
  const { recipientName, recipientUpi, recipientRisk } = route.params;
  const [amountStr, setAmountStr] = useState('0');

  const handleKeyPress = (val: string) => {
    if (amountStr === '0' && val !== '.') {
      setAmountStr(val);
      return;
    }

    if (val === '.') {
      if (amountStr.includes('.')) return; // prevent duplicate decimals
      setAmountStr(amountStr + '.');
      return;
    }

    // Limit length to avoid layout overflow
    if (amountStr.length >= 7) return;

    // Limit to 2 decimal places
    const parts = amountStr.split('.');
    if (parts[1] && parts[1].length >= 2) return;

    setAmountStr(amountStr + val);
  };

  const handleBackspace = () => {
    if (amountStr.length <= 1) {
      setAmountStr('0');
      return;
    }
    setAmountStr(amountStr.slice(0, -1));
  };

  const handleContinue = () => {
    const amountVal = parseFloat(amountStr);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    navigation.navigate('PaymentConfirmation', {
      recipientName,
      recipientUpi,
      amount: amountVal,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Light Upper Section */}
      <View style={styles.topSection}>
        <View>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.title}>Enter Amount</Text>
          </View>

          {/* Recipient Details Card */}
          <Animated.View entering={FadeInUp.delay(50).duration(400)} style={styles.recipientCard}>
            <View style={styles.recipientInfo}>
              <Text style={styles.name}>{recipientName}</Text>
              <Text style={styles.upi}>{recipientUpi}</Text>
            </View>
            <RiskBadge level={recipientRisk} />
          </Animated.View>
        </View>

        {/* Display Value */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.displayContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <Text style={styles.amountText}>{amountStr}</Text>
        </Animated.View>
      </View>

      {/* Dark Bottom Section for Numeric Keypad */}
      <Animated.View entering={SlideInDown.springify().damping(14).mass(0.8).stiffness(95)} style={styles.blackSection}>
        <View style={styles.keypad}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['.', '0', '⌫'],
          ].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((key, keyIndex) => (
                <TouchableOpacity
                  key={keyIndex}
                  onPress={() => (key === '⌫' ? handleBackspace() : handleKeyPress(key))}
                  style={[styles.keypadButton, key === '⌫' && styles.backspaceButton]}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <Button
          title="Proceed to Verify"
          onPress={handleContinue}
          variant="primary"
          style={styles.continueBtn}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f5', // Light pinkish ivory background
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
  },
  topSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f7f6f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  backArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  title: {
    fontSize: theme.typography.sizes.xl - 4,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
  },
  recipientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f6f2', // Soft warm off-white
    padding: theme.spacing.md,
    borderRadius: 20,
    marginVertical: theme.spacing.xs,
  },
  recipientInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  upi: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  displayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  currencySymbol: {
    fontSize: theme.typography.sizes.xxxl + 4,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  amountText: {
    fontSize: theme.typography.sizes.xxxl + 16,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
  },
  blackSection: {
    backgroundColor: '#1c1c1e', // Signature rounded dark slate section
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  keypad: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  keypadButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2e2e30', // Soft charcoal buttons that blend into dark mode container
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  backspaceButton: {
    backgroundColor: '#2e2e30', // Symmetrical key pad shape
  },
  keyText: {
    fontSize: theme.typography.sizes.xl - 4,
    fontWeight: theme.typography.weights.bold,
    color: '#ffffff', // High legibility white text
  },
  continueBtn: {
    width: '100%',
    height: 54,
    borderRadius: 27, // Capsule button shape
    marginTop: theme.spacing.xs,
  },
});
