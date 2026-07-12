import React from 'react';
import { StyleSheet, View, Text, StatusBar, Pressable, Platform } from 'react-native';
import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { RiskBadge } from '../../components/RiskBadge';

export const QrDetailsScreen = ({ route, navigation }: any) => {
  const { qrData, riskScore, riskLevel, explanation, recipientName } = route.params;

  const handlePay = () => {
    navigation.navigate('AmountEntry', {
      recipientName,
      recipientUpi: qrData,
      recipientRisk: riskLevel,
    });
  };

  const handleReport = () => {
    navigation.navigate('ReportMerchant', { prefilledUpi: qrData });
  };

  const handleCancel = () => {
    navigation.popToTop();
  };

  const isHighRisk = riskLevel === 'HIGH';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Scan Analysis</Text>
      </View>

      {/* Scan Results Content */}
      <View style={styles.content}>
        <Text style={styles.sectionLabel}>DETECTED UPI PAYEE</Text>
        <Card style={styles.infoCard} shadow="soft">
          <View style={styles.payeeRow}>
            <View style={styles.payeeInfo}>
              <Text style={styles.name}>{recipientName}</Text>
              <Text style={styles.upi}>{qrData}</Text>
              <View style={[styles.trustChip, isHighRisk ? styles.trustChipRed : styles.trustChipGreen]}>
                <Text style={styles.trustChipText}>
                  Merchant Trust: {isHighRisk ? '14/100 (Suspicious)' : '98/100 (Verified Merchant)'}
                </Text>
              </View>
            </View>
            <RiskBadge level={riskLevel} />
          </View>
        </Card>

        <Text style={styles.sectionLabel}>AI SAFETY SCREENING</Text>
        <Card
          style={[
            styles.riskReportCard,
            isHighRisk ? styles.riskCardHigh : styles.riskCardLow,
          ]}
          shadow="soft"
        >
          <View style={styles.scoreRow}>
            <Text style={styles.scoreTitle}> payee Threat Index </Text>
            <Text style={[styles.scoreValue, isHighRisk ? styles.highText : styles.lowText]}>
              {riskScore}/100
            </Text>
          </View>
          <View style={styles.divider} />
          
          {explanation.map((reason: string, index: number) => (
            <View key={index} style={styles.reasonRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
        </Card>
      </View>

      {/* Action panel */}
      <View style={styles.footer}>
        {isHighRisk ? (
          <>
            <View style={styles.blockedAlert}>
              <Text style={styles.alertText}>
                🚫 Transfer blocked by Sentinel AI because the recipient matched scam blacklists.
              </Text>
            </View>
            <Button
              title="Report Merchant"
              onPress={handleReport}
              variant="danger"
              style={styles.actionBtn}
            />
            <Button
              title="Cancel & Return"
              onPress={handleCancel}
              variant="secondary"
              style={[styles.actionBtn, styles.cancelBtn]}
            />
          </>
        ) : (
          <>
            <Button
              title="Proceed to Pay"
              onPress={handlePay}
              variant="primary"
              style={styles.actionBtn}
            />
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="secondary"
              style={[styles.actionBtn, styles.cancelBtn]}
            />
          </>
        )}
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
    paddingBottom: 35,
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
    marginTop: theme.spacing.md,
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
  payeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payeeInfo: {
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
  riskReportCard: {
    padding: theme.spacing.lg,
    borderWidth: 1.2,
  },
  riskCardLow: {
    borderColor: '#C8E6C9', // light green border
  },
  riskCardHigh: {
    borderColor: '#FFCDD2', // light red border
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  scoreTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  scoreValue: {
    fontSize: theme.typography.sizes.md + 1,
    fontWeight: theme.typography.weights.heavy,
  },
  lowText: {
    color: theme.colors.riskLow,
  },
  highText: {
    color: theme.colors.riskHigh,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  bullet: {
    marginRight: theme.spacing.sm,
    color: theme.colors.textMuted,
  },
  reasonText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.xs,
    flex: 1,
  },
  footer: {
    width: '100%',
  },
  blockedAlert: {
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.md,
  },
  alertText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.xs,
  },
  actionBtn: {
    width: '100%',
  },
  trustChip: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  trustChipGreen: {
    backgroundColor: '#dcfce7',
  },
  trustChipRed: {
    backgroundColor: '#fee2e2',
  },
  trustChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  cancelBtn: {
    marginTop: theme.spacing.sm,
  },
});
