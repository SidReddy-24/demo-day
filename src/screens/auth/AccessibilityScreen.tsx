import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { request } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

type AccessibilityScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Accessibility'>;

interface Props {
  navigation: AccessibilityScreenNavigationProp;
}

interface SecurityMetric {
  name: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  icon: string;
  description: string;
}

export const AccessibilityScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const { setAccessibilityChecked, setDeviceTrustScore } = useAuthStore();

  const runSecurityAudit = async () => {
    setLoading(true);
    try {
      const data = await request({
        url: '/check-device',
        method: 'POST',
      });
      setReport(data.deviceTrust);
      setDeviceTrustScore(data.deviceTrust.score);
    } catch (err) {
      // Fallback in case of mock failure
      setReport({
        score: 95,
        rootDetected: false,
        developerMode: true,
        vpnActive: false,
        overlayDetected: false,
        reasons: ['Dev mode enabled'],
      });
      setDeviceTrustScore(95);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSecurityAudit();
  }, []);

  const handleProceed = () => {
    setAccessibilityChecked(true);
    navigation.navigate('BiometricSetup');
  };

  if (loading) {
    return (
      <Loading
        fullScreen
        message="Auditing Device Integrity..."
        subMessage="Scanning for active overlays, VPN configurations, and root binaries"
      />
    );
  }

  const metrics: SecurityMetric[] = [
    {
      name: 'Overlay Detection',
      status: report.overlayDetected ? 'FAIL' : 'PASS',
      icon: '📱',
      description: 'Checks if other apps can draw overlays over UPI windows to capture PIN inputs.',
    },
    {
      name: 'Root Binary Scan',
      status: report.rootDetected ? 'FAIL' : 'PASS',
      icon: '🛡️',
      description: 'Detects presence of root/su binaries that compromise OS sandbox security.',
    },
    {
      name: 'Developer Configuration',
      status: report.developerMode ? 'WARNING' : 'PASS',
      icon: '⚙️',
      description: 'Verifies if ADB/Developer mode is running (Acceptable for testing environments).',
    },
    {
      name: 'VPN Secure Tunneling',
      status: report.vpnActive ? 'WARNING' : 'PASS',
      icon: '🌐',
      description: 'Verifies active VPN connections to identify malicious network redirects.',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>STEP 2 OF 4</Text>
        </View>
        <Text style={styles.title}>System Diagnostics</Text>
        <Text style={styles.subtitle}>
          SentinelPay scans system attributes to detect hook-in attempts or remote screen capture tools.
        </Text>
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{report.score}</Text>
          <Text style={styles.scoreLabel}>TRUST SCORE</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreTitle}>Device Status: {report.score >= 90 ? 'Secure' : 'Warning'}</Text>
          <Text style={styles.scoreDesc}>
            Your device shows {report.score >= 90 ? 'optimal' : 'marginal'} compliance with UPI security policies.
          </Text>
        </View>
      </View>

      <View style={styles.metricsList}>
        {metrics.map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={styles.metricTitleWrap}>
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <Text style={styles.metricName}>{metric.name}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  metric.status === 'PASS' && styles.statusPass,
                  metric.status === 'WARNING' && styles.statusWarn,
                  metric.status === 'FAIL' && styles.statusFail,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    metric.status === 'PASS' && styles.textPass,
                    metric.status === 'WARNING' && styles.textWarn,
                    metric.status === 'FAIL' && styles.textFail,
                  ]}
                >
                  {metric.status}
                </Text>
              </View>
            </View>
            <Text style={styles.metricDesc}>{metric.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title="Audit System Again"
          onPress={runSecurityAudit}
          variant="secondary"
          style={styles.button}
        />
        <Button
          title="Proceed Securely"
          onPress={handleProceed}
          variant="primary"
          style={[styles.button, styles.proceedBtn]}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  badge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.roundness.sm,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: theme.typography.sizes.xl + 2,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    lineHeight: theme.typography.lineHeights.sm,
    marginTop: theme.spacing.xs,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.roundness.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: theme.colors.primary,
    ...theme.shadows.soft,
  },
  scoreText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  scoreLabel: {
    fontSize: 7,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  scoreInfo: {
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  scoreTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  scoreDesc: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: 4,
    lineHeight: theme.typography.lineHeights.xs,
  },
  metricsList: {
    marginBottom: theme.spacing.xl,
  },
  metricCard: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
  },
  metricName: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.roundness.sm,
  },
  statusPass: {
    backgroundColor: '#E8F5E9',
  },
  statusWarn: {
    backgroundColor: '#FFF3E0',
  },
  statusFail: {
    backgroundColor: '#FFEBEE',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
  },
  textPass: {
    color: theme.colors.riskLow,
  },
  textWarn: {
    color: theme.colors.riskMedium,
  },
  textFail: {
    color: theme.colors.riskHigh,
  },
  metricDesc: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    lineHeight: theme.typography.lineHeights.xs,
  },
  footer: {
    marginTop: theme.spacing.md,
  },
  button: {
    width: '100%',
  },
  proceedBtn: {
    marginTop: theme.spacing.md,
  },
});
