import React from 'react';
import { StyleSheet, View, Text, StatusBar, Pressable, Platform } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export const PaymentConfirmationScreen = ({ route, navigation }: any) => {
  const { recipientName, recipientUpi, amount } = route.params;

  const handleConfirm = () => {
    navigation.navigate('FraudAnalysis', {
      recipientName,
      recipientUpi,
      amount,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Confirm Payment</Text>
      </View>

      {/* Review Section */}
      <View style={styles.content}>
        <Text style={styles.sectionLabel}>SENDING TO</Text>
        <Card style={styles.infoCard} shadow="soft">
          <Text style={styles.recipientName}>{recipientName}</Text>
          <Text style={styles.recipientUpi}>{recipientUpi}</Text>
        </Card>

        <Text style={styles.sectionLabel}>FUNDING SOURCE</Text>
        <Card style={styles.infoCard} shadow="soft">
          <View style={styles.accountRow}>
            {/* Bank / Building icon */}
            <View style={styles.bankIconWrapper}>
              <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <Path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" stroke={theme.colors.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View>
              <Text style={styles.bankName}>HDFC Bank Simulation</Text>
              <Text style={styles.bankDetails}>Savings Account •••• 4321</Text>
            </View>
          </View>
        </Card>

        {/* Big Amount Card */}
        <View style={styles.amountContainer}>
          <Text style={styles.currency}>₹</Text>
          <Text style={styles.amountVal}>
            {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.warningBox}>
          <View style={styles.warningRow}>
            <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={styles.warningIcon}>
              <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.warningText}>
              SentinelPay AI is scanning active device hooks and network clusters to evaluate transfer integrity.
            </Text>
          </View>
        </View>
        <Button
          title="Verify & Execute"
          onPress={handleConfirm}
          variant="primary"
          style={styles.confirmBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
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
  content: {
    flex: 1,
    marginTop: theme.spacing.lg,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  infoCard: {
    padding: theme.spacing.md,
    borderWidth: 1.2,
    marginBottom: theme.spacing.xs,
  },
  recipientName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  recipientUpi: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  bankName: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  bankDetails: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xxl * 1.5,
  },
  currency: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  amountVal: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
  },
  footer: {
    paddingBottom: 30,
  },
  warningBox: {
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.md,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 6,
    marginTop: 1,
  },
  warningText: {
    flex: 1,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    lineHeight: theme.typography.lineHeights.xs,
  },
  confirmBtn: {
    width: '100%',
  },
});
