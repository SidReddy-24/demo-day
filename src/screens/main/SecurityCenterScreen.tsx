import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, StatusBar, Alert, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

export const SecurityCenterScreen = () => {
  const isFocused = useIsFocused();
  const {
    deviceTrustScore,
    setDeviceTrustScore,
    vpnActive,
    setVpnActive,
    rootDetected,
    setRootDetected,
    permissions,
  } = useAuthStore();

  const [auditing, setAuditing] = useState(false);
  const [scanLog, setScanLog] = useState('');

  const runAudit = () => {
    setAuditing(true);
    setScanLog('Initializing security environment diagnostics...');
    
    // Simulate real-time file hash auditing and network sweeps
    setTimeout(() => {
      setScanLog('Auditing local kernel hashes & binary integrity...');
    }, 400);

    setTimeout(() => {
      setScanLog('Scanning network ports for active VPN masking tunnels...');
    }, 800);

    setTimeout(() => {
      setScanLog('Sweeping package namespaces for screen overlay hijacks...');
    }, 1200);

    setTimeout(() => {
      let finalScore = 98;
      
      if (rootDetected) {
        finalScore -= 40;
      }
      if (vpnActive) {
        finalScore -= 15;
      }
      if (!permissions.sms) {
        finalScore -= 10;
      }

      setDeviceTrustScore(finalScore);
      setAuditing(false);
      setScanLog('');
      
      if (Platform.OS === 'web') {
        alert(`Audit Completed\n\nDevice compliance check complete. Verified security score: ${finalScore}/100.`);
      } else {
        Alert.alert(
          'Audit Completed',
          `Device compliance check complete. Verified security score: ${finalScore}/100.`,
          [{ text: 'OK' }]
        );
      }
    }, 1600);
  };

  return (
    <ScrollView key={isFocused ? 'active' : 'inactive'} style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />

      {/* Light Upper Section */}
      <View style={styles.topSection}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.header}>
          <Text style={styles.title}>Security Center</Text>
          <Text style={styles.subtitle}>Audit device trust levels and modify simulated variables</Text>
        </Animated.View>

        {/* Score gauge */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
          <Card style={styles.scoreCard} shadow="soft">
            <Text style={styles.gaugeLabel}>ENVIRONMENT TRUST SCORE</Text>
            <Text style={[
              styles.scoreNumber,
              deviceTrustScore > 80 ? styles.scoreGreen : deviceTrustScore > 60 ? styles.scoreOrange : styles.scoreRed
            ]}>
              {deviceTrustScore}%
            </Text>
            <Text style={styles.gaugeDesc}>
              {deviceTrustScore > 80 
                ? 'Safe sandbox environment configuration verified.' 
                : 'Warning: Compliance issues flagged. Payments may require additional overrides.'}
            </Text>
          </Card>
        </Animated.View>
      </View>

      {/* Dark Bottom Section */}
      <Animated.View entering={SlideInDown.springify().damping(17).stiffness(50).mass(1.2)} style={styles.blackSection}>
        <Animated.View entering={FadeInUp.delay(300).duration(800)}>
          <Text style={styles.sectionTitle}>Sandbox Device Overrides</Text>

          {/* Override toggles */}
          <Card style={styles.settingCard} shadow="none">
            <View style={styles.row}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Simulate Root / Jailbreak</Text>
                <Text style={styles.settingDesc}>Emulates compromised root OS privileges (major violation)</Text>
              </View>
              <Switch
                value={rootDetected}
                onValueChange={setRootDetected}
                trackColor={{ false: '#E0E0E0', true: '#bfdbfe' }}
                thumbColor={rootDetected ? theme.colors.primary : '#F5F5F5'}
              />
            </View>
          </Card>

          <Card style={styles.settingCard} shadow="none">
            <View style={styles.row}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Simulate Active VPN</Text>
                <Text style={styles.settingDesc}>Emulates VPN tunnels masking terminal endpoint IPs</Text>
              </View>
              <Switch
                value={vpnActive}
                onValueChange={setVpnActive}
                trackColor={{ false: '#E0E0E0', true: '#bfdbfe' }}
                thumbColor={vpnActive ? theme.colors.primary : '#F5F5F5'}
              />
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(450).duration(800)}>
          <Text style={styles.sectionTitle}>Ecosystem Shield Checks</Text>

          {/* Diagnostics Read-Only Checkers */}
          <Card style={styles.checkCard} shadow="none">
            <View style={styles.checkRow}>
              <View style={styles.svgIconWrapper}>
                <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <Path d="m22 6-10 7L2 6" />
                </Svg>
              </View>
              <View style={styles.checkInfo}>
                <Text style={styles.checkLabel}>SMS Scammer Sweep</Text>
                <Text style={styles.checkSub}>Monitoring active UPI OTP phishing spam campaigns</Text>
              </View>
              <Text style={styles.activeBadge}>Active</Text>
            </View>
          </Card>

          <Card style={styles.checkCard} shadow="none">
            <View style={styles.checkRow}>
              <View style={styles.svgIconWrapper}>
                <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </Svg>
              </View>
              <View style={styles.checkInfo}>
                <Text style={styles.checkLabel}>Screen Overlay Shield</Text>
                <Text style={styles.checkSub}>Preventing remote screen mirroring overlays</Text>
              </View>
              <Text style={styles.activeBadge}>Protected</Text>
            </View>
          </Card>

          {auditing && (
            <View style={styles.consoleLogContainer}>
              <Text style={styles.consoleLogText}>📡 {scanLog}</Text>
            </View>
          )}

          <Button
            title={auditing ? 'Running Audits...' : 'Run System Integrity Audit'}
            onPress={runAudit}
            loading={auditing}
            variant="primary"
            style={styles.auditBtn}
          />
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f5', // Light pinkish ivory background
  },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 70 : 60,
    paddingBottom: 0,
    flexGrow: 1, // Fill vertical space
  },
  topSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
  },
  blackSection: {
    backgroundColor: '#1c1c1e', // Soft charcoal dark container
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: 50, // Reduced padding to tighten layout below button
    marginTop: theme.spacing.md,
    marginBottom: -20, // Overlap under bottom tab bar to cover subpixel line gaps
    flexGrow: 1, // Stretch to the bottom
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xxl - 4,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  scoreCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: '#ffffff',
    borderRadius: 24,
  },
  gaugeLabel: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },
  scoreNumber: {
    fontSize: theme.typography.sizes.xxxl + 12,
    fontWeight: theme.typography.weights.heavy,
  },
  scoreGreen: {
    color: theme.colors.riskLow,
  },
  scoreOrange: {
    color: theme.colors.riskMedium,
  },
  scoreRed: {
    color: theme.colors.riskHigh,
  },
  gaugeDesc: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: theme.typography.lineHeights.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.sm + 1,
    fontWeight: theme.typography.weights.bold,
    color: '#ffffff', // White headers inside dark layout
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  settingCard: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: '#f7f6f2', // Soft warm off-white card
    borderRadius: 20,
    borderWidth: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  settingDesc: {
    fontSize: theme.typography.sizes.xs - 1,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  checkCard: {
    marginBottom: theme.spacing.xs,
    padding: theme.spacing.md,
    backgroundColor: '#f7f6f2', // Soft warm off-white card
    borderRadius: 20,
    borderWidth: 0,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  svgIconWrapper: {
    marginRight: theme.spacing.md,
  },
  checkInfo: {
    flex: 1,
  },
  checkLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  checkSub: {
    fontSize: theme.typography.sizes.xs - 1,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  activeBadge: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.riskLow,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  auditBtn: {
    marginTop: theme.spacing.md,
    height: 54,
    borderRadius: 27, // Capsule button
    justifyContent: 'center',
    alignItems: 'center',
  },
  consoleLogContainer: {
    backgroundColor: '#2e2e30',
    padding: theme.spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3a3a3c',
    marginTop: theme.spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  consoleLogText: {
    color: '#bef264', // Pulse Lime Green console text
    fontSize: theme.typography.sizes.xs,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: theme.typography.weights.semibold,
  },
});
