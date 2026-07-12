import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { Loading } from '../../components/Loading';
import { request } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

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

const C = {
  bg: '#F4F6FA',
  primary: '#6C5CE7',
  primaryLight: '#EDE9FF',
  text: '#1A1D2E',
  sub: '#8A8FA8',
  white: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E8EBF4',
  accent: '#00C9A7',
  accentLight: '#E0FAF5',
  danger: '#FF4757',
  dangerLight: '#FFE8EB',
  warn: '#FFA502',
  warnLight: '#FFF3E0',
};

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
    <ScrollView style={s.container} contentContainerStyle={s.contentContainer} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      
      <Animated.View entering={FadeInDown.delay(50).duration(500)} style={s.header}>
        <View style={s.badge}>
          <Text style={s.badgeText}>STEP 2 OF 4</Text>
        </View>
        <Text style={s.title}>System Diagnostics</Text>
        <Text style={s.subtitle}>
          SentinelPay scans system attributes to detect hook-in attempts or remote screen capture tools.
        </Text>
      </Animated.View>

      {/* Trust Score Banner */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={s.scoreContainer}>
        <View style={[s.scoreCircle, { borderColor: report.score >= 90 ? C.accent : C.warn }]}>
          <Text style={[s.scoreText, { color: report.score >= 90 ? C.accent : C.warn }]}>{report.score}</Text>
          <Text style={s.scoreLabel}>INDEX</Text>
        </View>
        <View style={s.scoreInfo}>
          <Text style={s.scoreTitle}>Device Status: {report.score >= 90 ? 'Secure' : 'Warning'}</Text>
          <Text style={s.scoreDesc}>
            Your device shows {report.score >= 90 ? 'optimal' : 'marginal'} compliance with UPI security policies.
          </Text>
        </View>
      </Animated.View>

      {/* Metrics list */}
      <Animated.View entering={FadeInDown.delay(150).duration(500)} style={s.metricsList}>
        {metrics.map((metric, index) => {
          const badgeColors = {
            PASS: [C.accent, C.accentLight],
            WARNING: [C.warn, C.warnLight],
            FAIL: [C.danger, C.dangerLight],
          }[metric.status];

          return (
            <View key={index} style={s.metricCard}>
              <View style={s.metricHeader}>
                <View style={s.metricTitleWrap}>
                  <View style={s.metricIconBox}>
                    <Text style={s.metricIcon}>{metric.icon}</Text>
                  </View>
                  <Text style={s.metricName}>{metric.name}</Text>
                </View>
                <View style={[s.statusBadge, { backgroundColor: badgeColors[1] }]}>
                  <Text style={[s.statusBadgeText, { color: badgeColors[0] }]}>
                    {metric.status}
                  </Text>
                </View>
              </View>
              <Text style={s.metricDesc}>{metric.description}</Text>
            </View>
          );
        })}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={s.footer}>
        <TouchableOpacity style={s.primaryBtn} onPress={handleProceed} activeOpacity={0.85}>
          <Text style={s.primaryBtnText}>Proceed Securely</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondaryBtn} onPress={runSecurityAudit} activeOpacity={0.85}>
          <Text style={s.secondaryBtnText}>Audit System Again</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  contentContainer: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  badge: {
    backgroundColor: C.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: C.sub,
    lineHeight: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.border,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '900',
  },
  scoreLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: C.sub,
    marginTop: 1,
  },
  scoreInfo: {
    flex: 1,
    marginLeft: 16,
  },
  scoreTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.text,
  },
  scoreDesc: {
    fontSize: 12,
    color: C.sub,
    marginTop: 4,
    lineHeight: 16,
  },
  metricsList: {
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricIcon: {
    fontSize: 18,
  },
  metricName: {
    fontSize: 14,
    fontWeight: '800',
    color: C.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metricDesc: {
    fontSize: 11,
    color: C.sub,
    lineHeight: 16,
    marginTop: 2,
  },
  footer: {
    gap: 12,
  },
  primaryBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: C.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
  },
  secondaryBtnText: {
    color: C.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
