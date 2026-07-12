import React from 'react';
import { StyleSheet, View, Text, StatusBar, Platform } from 'react-native';
import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export const PaymentFailedScreen = ({ route, navigation }: any) => {
  const { reason } = route.params;

  const handleFinish = () => {
    navigation.popToTop();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <View style={styles.failedIconWrapper}>
          <Text style={styles.icon}>❌</Text>
        </View>
        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.subtitle}>
          The simulation gateway declined the transaction.
        </Text>

        <Card style={styles.detailsCard} shadow="soft">
          <Text style={styles.reasonText}>{reason || 'Verification timed out'}</Text>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ref No:</Text>
            <Text style={styles.infoVal}>TXN{Math.floor(Math.random() * 9000000) + 1000000}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoVal, styles.redText]}>Declined</Text>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button
          title="Back to Home"
          onPress={handleFinish}
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
    paddingHorizontal: theme.spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 70 : 60,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  icon: {
    fontSize: 44,
  },
  title: {
    fontSize: theme.typography.sizes.xl + 2,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
    lineHeight: theme.typography.lineHeights.sm,
    marginBottom: theme.spacing.xxl,
  },
  detailsCard: {
    width: '100%',
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  reasonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.riskHigh,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    width: '100%',
    marginVertical: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
  },
  infoVal: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  redText: {
    color: theme.colors.riskHigh,
  },
  footer: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});
