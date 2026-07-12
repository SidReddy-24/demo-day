import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, Pressable, Alert, Platform } from 'react-native';
import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAuthStore } from '../../store/authStore';

export const RiskWarningScreen = ({ route, navigation }: any) => {
  const {
    riskScore,
    riskLevel,
    explanation,
    recipientName,
    amount,
    scamType = 'None',
    confidence = 0,
    timeline = []
  } = route.params || {};

  const { biometricsEnabled } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds for optimal demo pacing

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleBiometricBypass = () => {
    if (timeLeft > 0) {
      Alert.alert('Cooling Period Active', `Please wait another ${timeLeft} seconds for safety checks to cool down.`);
      return;
    }
    Alert.alert(
      'Verify Biometrics',
      biometricsEnabled
        ? 'Confirm Face ID to bypass transaction alert.'
        : 'Scan fingerprint to override security warning.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            navigation.replace('PaymentSuccess', { recipientName, amount });
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    navigation.popToTop();
  };

  const handleCancelAndReport = () => {
    alert('Merchant reported to community database.');
    navigation.popToTop();
  };

  const isHighRisk = riskLevel === 'HIGH';

  return (
    <View style={[styles.container, isHighRisk ? styles.containerHigh : styles.containerMedium]}>
      <StatusBar barStyle="light-content" />

      {/* Warning Header */}
      <View style={styles.header}>
        <Text style={styles.alertIcon}>{isHighRisk ? '⛔' : '⚠️'}</Text>
        <Text style={styles.alertTitle}>
          {isHighRisk ? 'Transaction Blocked' : 'Security Alert'}
        </Text>
        <Text style={styles.alertSubtitle}>
          {isHighRisk
            ? 'Sentinel AI blocked this transfer to prevent immediate financial loss.'
            : 'Unusual activity detected. Confirm recipient authenticity before proceeding.'}
        </Text>
      </View>

      {/* Main Body */}
      <View style={styles.content}>
        {/* Scam Pattern Badge */}
        {scamType !== 'None' && (
          <View style={styles.scamPatternBadge}>
            <Text style={styles.scamPatternText}>🚨 TYPE: {scamType.toUpperCase()}</Text>
            <View style={styles.confidenceChip}>
              <Text style={styles.confidenceText}>AI Conf: {confidence}%</Text>
            </View>
          </View>
        )}

        {/* AI Voice Assistant Warning Panel */}
        <View style={styles.voiceBubble}>
          <Text style={styles.voiceTitle}>🎙️ AI CO-PILOT VOICE WARNING</Text>
          <Text style={styles.voiceSpeech}>
            "You are sending ₹{amount.toLocaleString('en-IN')} to a new beneficiary. This transaction resembles a potential {scamType || 'payment fraud'}. Please review before continuing."
          </Text>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>AI RISK ASSESSMENT</Text>
          {timeline.length > 0 && (
            <Pressable
              onPress={() => navigation.navigate('ScamTimeline', { timeline, scamType })}
              style={styles.timelineLink}
            >
              <Text style={styles.timelineLinkText}>View Scam Timeline →</Text>
            </Pressable>
          )}
        </View>

        <Card style={styles.explanationCard} shadow="none">
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Threat Score:</Text>
            <Text style={[styles.scoreValue, isHighRisk ? styles.scoreHigh : styles.scoreMedium]}>
              {riskScore}/100
            </Text>
          </View>
          <View style={styles.divider} />
          
          {explanation.map((reason: string, index: number) => (
            <View key={index} style={styles.reasonRow}>
              <Text style={styles.bullet}>{isHighRisk ? '•' : '⚠'}</Text>
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
        </Card>

        {/* Transaction Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>
            Transfer Value: <Text style={styles.summaryValue}>₹{amount.toLocaleString('en-IN')}</Text>
          </Text>
          <Text style={styles.summaryLabel}>
            Target: <Text style={styles.summaryValue}>{recipientName}</Text>
          </Text>
        </View>
      </View>

      {/* Prevention Action Buttons / Cooling Timer */}
      <View style={styles.footer}>
        {timeLeft > 0 && (
          <View style={styles.timerBar}>
            <Text style={styles.timerText}>🛡️ Safe cooling lock active: {timeLeft}s remaining</Text>
          </View>
        )}

        {isHighRisk ? (
          <>
            <Button
              title="Cancel & Report scammer"
              onPress={handleCancelAndReport}
              variant="danger"
              style={styles.btn}
            />
            <Button
              title="Return to safety"
              onPress={handleCancel}
              variant="text"
              style={[styles.btn, styles.textBtn]}
              textStyle={styles.whiteText}
            />
          </>
        ) : (
          <>
            <Button
              title={timeLeft > 0 ? `Wait ${timeLeft}s to Override...` : "Override with Biometrics"}
              onPress={handleBiometricBypass}
              variant="primary"
              disabled={timeLeft > 0}
              style={[
                styles.btn, 
                styles.overrideBtn,
                timeLeft > 0 && { opacity: 0.5 }
              ]}
            />
            <Button
              title="Cancel Payment"
              onPress={handleCancel}
              variant="text"
              style={[styles.btn, styles.textBtn]}
              textStyle={styles.whiteText}
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
    paddingHorizontal: theme.spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 70 : 60,
    justifyContent: 'space-between',
    paddingBottom: 40,
    backgroundColor: theme.colors.background,
  },
  containerMedium: {
    backgroundColor: theme.colors.background,
  },
  containerHigh: {
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  alertIcon: {
    fontSize: 54,
    marginBottom: theme.spacing.md,
  },
  alertTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.heavy,
    color: '#FFFFFF',
  },
  alertSubtitle: {
    fontSize: theme.typography.sizes.xs + 1,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.xs,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: theme.spacing.xl,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },
  explanationCard: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  scoreLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  scoreValue: {
    fontSize: theme.typography.sizes.md + 1,
    fontWeight: theme.typography.weights.heavy,
  },
  scoreMedium: {
    color: theme.colors.riskMedium,
  },
  scoreHigh: {
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
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
  },
  reasonText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.xs,
    flex: 1,
  },
  summaryContainer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: theme.typography.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginVertical: 2,
  },
  summaryValue: {
    fontWeight: theme.typography.weights.bold,
    color: '#FFFFFF',
  },
  footer: {
    width: '100%',
  },
  btn: {
    width: '100%',
  },
  overrideBtn: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: 'transparent',
  },
  textBtn: {
    marginTop: theme.spacing.sm,
  },
  whiteText: {
    color: '#FFFFFF',
  },
  scamPatternBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  scamPatternText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  confidenceChip: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  confidenceText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  voiceBubble: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  voiceTitle: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  voiceSpeech: {
    color: '#ffffff',
    fontSize: 11,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineLink: {
    paddingVertical: 2,
  },
  timelineLinkText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  timerBar: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  timerText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
});
