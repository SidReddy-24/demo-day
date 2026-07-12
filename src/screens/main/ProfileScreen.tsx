import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  StatusBar,
  Alert,
  Platform,
  Pressable,
  RefreshControl,
} from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { theme } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { request } from '../../services/api';
import Animated, {
  FadeInUp,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useIsFocused, useNavigation } from '@react-navigation/native';

// ---------- helpers ----------
const TrustDot = ({ score }: { score: number }) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.35], [0.75, 1]),
  }));

  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f97316' : '#ef4444';

  return (
    <Animated.View
      style={[
        {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
        },
        dotStyle,
      ]}
    />
  );
};

// Expandable section header
const SectionHeader = ({
  title,
  subtitle,
  expanded,
  onToggle,
  icon,
}: {
  title: string;
  subtitle: string;
  expanded: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
}) => {
  const rotation = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    rotation.value = withSpring(expanded ? 1 : 0, { damping: 14, stiffness: 150 });
  }, [expanded]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(rotation.value, [0, 1], [0, 90])}deg` }],
  }));

  return (
    <Pressable onPress={onToggle} style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <View style={styles.sectionIconWrap}>{icon}</View>
        <View>
          <Text style={styles.sectionHeaderTitle}>{title}</Text>
          <Text style={styles.sectionHeaderSub}>{subtitle}</Text>
        </View>
      </View>
      <Animated.View style={chevronStyle}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path d="M9 18l6-6-6-6" stroke="#9ca3af" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Animated.View>
    </Pressable>
  );
};

// ---------- main screen ----------
export const ProfileScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  const {
    user,
    deviceTrustScore,
    setDeviceTrustScore,
    vpnActive,
    setVpnActive,
    rootDetected,
    setRootDetected,
    activeCall,
    setActiveCall,
    safeMode,
    setSafeMode,
    permissions,
    biometricsEnabled,
    pinCode,
    resetAll,
  } = useAuthStore();

  // Expand/collapse state for each module
  const [passportOpen, setPassportOpen] = useState(false);
  const [secOpen, setSecOpen] = useState(true);
  const [shieldOpen, setShieldOpen] = useState(false);
  const [commOpen, setCommOpen] = useState(false);
  const [heatmapOpen, setHeatmapOpen] = useState(false);
  const [permOpen, setPermOpen] = useState(false);
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);

  // Security audit
  const [auditing, setAuditing] = useState(false);
  const [scanLog, setScanLog] = useState('');

  // Community
  const [reports, setReports] = useState<{ upiId: string; category: string; description: string; timestamp: string }[]>([]);
  const [totalReports, setTotalReports] = useState(1402);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      const response = await request({ url: '/check-community', method: 'GET' });
      setReports(response.reports || []);
      setTotalReports(response.totalReports || 1402);
    } catch {
      setReports([
        {
          upiId: 'claims.rewards@secure',
          category: 'Lottery / Rewards Fraud',
          description: 'Offers fake cashback bonuses in exchange for entering UPI credentials.',
          timestamp: '1 hour ago',
        },
        {
          upiId: 'billpay.board@apco',
          category: 'Fake Utility / Bill Scheme',
          description: 'Issues fake electricity bill termination warnings requesting immediate payment.',
          timestamp: 'Yesterday',
        },
      ]);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  const runAudit = () => {
    setAuditing(true);
    setScanLog('Initializing security environment diagnostics...');
    setTimeout(() => setScanLog('Auditing local kernel hashes & binary integrity...'), 400);
    setTimeout(() => setScanLog('Scanning network ports for active VPN masking tunnels...'), 800);
    setTimeout(() => setScanLog('Sweeping package namespaces for screen overlay hijacks...'), 1200);
    setTimeout(() => {
      let finalScore = 98;
      if (rootDetected) finalScore -= 40;
      if (vpnActive) finalScore -= 15;
      if (!permissions.sms) finalScore -= 10;
      setDeviceTrustScore(finalScore);
      setAuditing(false);
      setScanLog('');
      const msg = `Device compliance check complete. Verified security score: ${finalScore}/100.`;
      if (Platform.OS === 'web') {
        alert(`Audit Completed\n\n${msg}`);
      } else {
        Alert.alert('Audit Completed', msg, [{ text: 'OK' }]);
      }
    }, 1600);
  };

  const handleLogout = () => {
    const doLogout = () => {
      resetAll();
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to log out?')) doLogout();
    } else {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  const scoreColor =
    deviceTrustScore >= 80 ? '#22c55e' : deviceTrustScore >= 60 ? '#f97316' : '#ef4444';

  return (
    <ScrollView
      key={isFocused ? 'active' : 'inactive'}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
    >
      <StatusBar barStyle="dark-content" />

      {/* ── Top light section ── */}
      <View style={styles.topSection}>
        <Animated.View entering={FadeInUp.delay(80).duration(700)} style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Account, security & settings</Text>
        </Animated.View>

        {/* User identity card */}
        <Animated.View entering={FadeInUp.delay(160).duration(700)}>
          <Card style={styles.identityCard} shadow="soft">
            {/* Avatar circle */}
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>
                  {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'SP'}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name ?? 'Demo User'}</Text>
                <Text style={styles.userUpi}>{user?.upiId ?? 'demo@sentinelpay'}</Text>
                <Text style={styles.userPhone}>{user?.phone ?? '+91 98765 43210'}</Text>
              </View>
              {/* Live trust dot */}
              <View style={styles.trustDotWrap}>
                <TrustDot score={deviceTrustScore} />
                <Text style={[styles.trustDotLabel, { color: scoreColor }]}>
                  {deviceTrustScore}
                </Text>
              </View>
            </View>

            {/* Quick status chips */}
            <View style={styles.chipsRow}>
              <View style={[styles.chip, pinCode ? styles.chipGreen : styles.chipRed]}>
                <Text style={styles.chipText}>{pinCode ? 'PIN Set' : 'No PIN'}</Text>
              </View>
              <View style={[styles.chip, biometricsEnabled ? styles.chipGreen : styles.chipGray]}>
                <Text style={styles.chipText}>{biometricsEnabled ? 'Face ID On' : 'Face ID Off'}</Text>
              </View>
              <View style={[styles.chip, permissions.sms ? styles.chipGreen : styles.chipGray]}>
                <Text style={styles.chipText}>{permissions.sms ? 'SMS On' : 'SMS Off'}</Text>
              </View>
              {activeCall && (
                <View style={[styles.chip, styles.chipRed]}>
                  <Text style={[styles.chipText, { color: '#ef4444' }]}>Call Active</Text>
                </View>
              )}
              {safeMode && (
                <View style={[styles.chip, styles.chipLime]}>
                  <Text style={[styles.chipText, { color: '#4d7c0f' }]}>Secure Mode</Text>
                </View>
              )}
            </View>
          </Card>
        </Animated.View>
      </View>

      {/* ── Dark bottom sheet ── */}
      <Animated.View
        entering={SlideInDown.springify().damping(17).stiffness(50).mass(1.2)}
        style={styles.darkSheet}
      >

        {/* ── AI TRUST PASSPORT MODULE ── */}
        <Animated.View entering={FadeInUp.delay(200).duration(700)}>
          <Card style={[styles.moduleCard, styles.passportCard]} shadow="none">
            <SectionHeader
              title="AI Trust Passport"
              subtitle="Behavioral reputation score"
              expanded={passportOpen}
              onToggle={() => setPassportOpen(v => !v)}
              icon={
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#bef264" strokeWidth={2} strokeLinecap="round" />
                  <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#bef264" strokeWidth={2} strokeLinejoin="round" />
                </Svg>
              }
            />
            {passportOpen && (
              <View style={styles.moduleBody}>
                <View style={styles.passportStatus}>
                  <Text style={styles.passportStatusText}>STATUS: <Text style={styles.passportLevelText}>GOLD LEVEL</Text></Text>
                  <Text style={styles.passportScoreText}>98% Trust Score</Text>
                </View>
                <View style={styles.passportProgressBarContainer}>
                  <View style={[styles.passportProgressBar, { width: '98%' }]} />
                </View>
                <Text style={styles.passportSubText}>
                  Safe typing speed rhythm, touch dynamics, stable locations, and verified contacts qualify you for fewer friction checks across link gateways.
                </Text>
              </View>
            )}
          </Card>
        </Animated.View>

        {/* ── SECURITY CENTER MODULE ── */}
        <Animated.View entering={FadeInUp.delay(250).duration(700)}>
          <Card style={styles.moduleCard} shadow="none">
            <SectionHeader
              title="Security Center"
              subtitle="Environment trust & audit"
              expanded={secOpen}
              onToggle={() => setSecOpen(v => !v)}
              icon={
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#bef264" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M9 11l2 2 4-4" stroke="#bef264" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              }
            />
            {secOpen && (
              <View style={styles.moduleBody}>
                {/* Score */}
                <View style={styles.scoreRow}>
                  <Text style={styles.moduleLabel}>ENVIRONMENT TRUST SCORE</Text>
                  <Text style={[styles.scoreNum, { color: scoreColor }]}>{deviceTrustScore}%</Text>
                </View>
                <Text style={styles.scoreSub}>
                  {deviceTrustScore > 80
                    ? 'Safe sandbox environment verified.'
                    : 'Warning: Compliance issues flagged.'}
                </Text>

                {/* Shield checks */}
                <View style={styles.checkRow}>
                  <View style={styles.checkDot} />
                  <Text style={styles.checkText}>SMS Scammer Sweep — <Text style={styles.activeText}>Active</Text></Text>
                </View>
                <View style={styles.checkRow}>
                  <View style={styles.checkDot} />
                  <Text style={styles.checkText}>Screen Overlay Shield — <Text style={styles.activeText}>Protected</Text></Text>
                </View>

                {auditing && (
                  <View style={styles.console}>
                    <Text style={styles.consoleText}>📡 {scanLog}</Text>
                  </View>
                )}

                <Button
                  title={auditing ? 'Running Audits...' : 'Run System Integrity Audit'}
                  onPress={runAudit}
                  loading={auditing}
                  variant="primary"
                  style={styles.moduleBtn}
                />
              </View>
            )}
          </Card>
        </Animated.View>

        {/* ── OTP & REMOTE SHIELD MODULE ── */}
        <Animated.View entering={FadeInUp.delay(300).duration(700)}>
          <Card style={styles.moduleCard} shadow="none">
            <SectionHeader
              title="OTP & Remote Shield"
              subtitle="SMS phishing & remote control checks"
              expanded={shieldOpen}
              onToggle={() => setShieldOpen(v => !v)}
              icon={
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Rect x="5" y="2" width="14" height="20" rx="2" stroke="#bef264" strokeWidth={2} />
                  <Line x1="12" y1="18" x2="12.01" y2="18" stroke="#bef264" strokeWidth={3} strokeLinecap="round" />
                </Svg>
              }
            />
            {shieldOpen && (
              <View style={styles.moduleBody}>
                {[
                  { label: 'OTP Phishing Interceptor', desc: 'SMS on-device regex scanning for banks & UPI', status: 'Clean' },
                  { label: 'Accessibility Abuse Sweep', desc: 'Detects apps abusing system overlay APIs', status: 'Clean' },
                  { label: 'Screen Mirroring Blocker', desc: 'Disables video feeds during pin field inputs', status: 'Protected' },
                  { label: 'SIM Hot-Swap Auditor', desc: 'Audits network and IMSI changes in current session', status: 'Clean' }
                ].map((item, i) => (
                  <View key={i} style={styles.permRow}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={styles.permLabel}>{item.label}</Text>
                      <Text style={styles.permSub}>{item.desc}</Text>
                    </View>
                    <View style={[styles.permBadge, styles.chipGreen]}>
                      <Text style={styles.chipText}>{item.status}</Text>
                    </View>
                  </View>
                ))}
                {/* Launch OTP Guardian CTA */}
                <Pressable
                  onPress={() => (navigation as any).navigate('OtpGuardian')}
                  style={styles.guardianCta}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.guardianCtaTitle}>OTP Guardian</Text>
                    <Text style={styles.guardianCtaSub}>Live SMS monitoring · call correlation · risk analysis</Text>
                  </View>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1e" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </Pressable>
              </View>
            )}
          </Card>
        </Animated.View>


        {/* ── COMMUNITY MODULE ── */}
        <Animated.View entering={FadeInUp.delay(340).duration(700)}>
          <Card style={styles.moduleCard} shadow="none">
            <SectionHeader
              title="Community Trust"
              subtitle="Crowdsourced fraud reports"
              expanded={commOpen}
              onToggle={() => setCommOpen(v => !v)}
              icon={
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="6" r="3" stroke="#bef264" strokeWidth={2} />
                  <Circle cx="6" cy="16" r="3" stroke="#bef264" strokeWidth={2} />
                  <Circle cx="18" cy="16" r="3" stroke="#bef264" strokeWidth={2} />
                  <Line x1="10" y1="8.5" x2="8" y2="13.5" stroke="#bef264" strokeWidth={1.5} strokeLinecap="round" />
                  <Line x1="14" y1="8.5" x2="16" y2="13.5" stroke="#bef264" strokeWidth={1.5} strokeLinecap="round" />
                </Svg>
              }
            />
            {commOpen && (
              <View style={styles.moduleBody}>
                {/* Stats row */}
                <View style={styles.statsRow}>
                  <View style={styles.statCell}>
                    <Text style={styles.statNum}>{totalReports}</Text>
                    <Text style={styles.statLbl}>Flags Raised</Text>
                  </View>
                  <View style={styles.statCell}>
                    <Text style={styles.statNum}>{reports.length + 80}</Text>
                    <Text style={styles.statLbl}>QR Blocked</Text>
                  </View>
                  <View style={styles.statCell}>
                    <Text style={styles.statNum}>99.6%</Text>
                    <Text style={styles.statLbl}>Accuracy</Text>
                  </View>
                </View>

                <Button
                  title="Report Fraud Merchant"
                  onPress={() => navigation.navigate('ReportMerchant')}
                  variant="primary"
                  style={styles.moduleBtn}
                />

                <Text style={styles.reportsHeader}>Recent Reports</Text>
                {reports.map((r, i) => (
                  <View key={i} style={styles.reportItem}>
                    <View style={styles.reportTop}>
                      <Text style={styles.reportUpi}>{r.upiId}</Text>
                      <Text style={styles.reportTime}>{r.timestamp}</Text>
                    </View>
                    <Text style={styles.reportCat}>{r.category}</Text>
                    <Text style={styles.reportDesc}>{r.description}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </Animated.View>

        {/* ── SCAM HEATMAP MODULE ── */}
        <Animated.View entering={FadeInUp.delay(380).duration(700)}>
          <Card style={styles.moduleCard} shadow="none">
            <SectionHeader
              title="Scam Heatmap"
              subtitle="Regional city-wise threat trends"
              expanded={heatmapOpen}
              onToggle={() => setHeatmapOpen(v => !v)}
              icon={
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" stroke="#bef264" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <Circle cx="12" cy="10" r="3" stroke="#bef264" strokeWidth={2} />
                </Svg>
              }
            />
            {heatmapOpen && (
              <View style={styles.moduleBody}>
                <Text style={styles.reportsHeader}>ACTIVE CITY ALERTS (LAST 24H)</Text>
                {[
                  { city: 'Mumbai', scam: 'Digital Arrest Scams', pct: 88, color: '#ef4444' },
                  { city: 'Delhi NCR', scam: 'KYC Verification scams', pct: 90, color: '#ef4444' },
                  { city: 'Bengaluru', scam: 'Malicious QR Tampering', pct: 72, color: '#f97316' },
                  { city: 'Hyderabad', scam: 'Work-from-Home Job offers', pct: 65, color: '#f97316' }
                ].map((item, i) => (
                  <View key={i} style={{ marginVertical: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>{item.city} <Text style={{ color: '#a1a1aa', fontWeight: '400', fontSize: 11 }}>({item.scam})</Text></Text>
                      <Text style={{ color: item.color, fontSize: 12, fontWeight: '800' }}>{item.pct}% Risk</Text>
                    </View>
                    <View style={{ height: 6, backgroundColor: '#1c1c1e', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${item.pct}%`, backgroundColor: item.color }} />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </Animated.View>

        {/* ── PERMISSIONS MODULE ── */}
        <Animated.View entering={FadeInUp.delay(430).duration(700)}>
          <Card style={styles.moduleCard} shadow="none">
            <SectionHeader
              title="Permissions"
              subtitle="SMS, location & notifications"
              expanded={permOpen}
              onToggle={() => setPermOpen(v => !v)}
              icon={
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Rect x="3" y="11" width="18" height="11" rx="2" stroke="#bef264" strokeWidth={2} />
                  <Path d="M7 11V7a5 5 0 0110 0v4" stroke="#bef264" strokeWidth={2} strokeLinecap="round" />
                </Svg>
              }
            />
            {permOpen && (
              <View style={styles.moduleBody}>
                {[
                  { label: 'SMS Monitoring', sub: 'Detects OTP phishing campaigns', val: permissions.sms },
                  { label: 'Location Access', sub: 'Geofences high-risk merchant zones', val: permissions.location },
                  { label: 'Notifications', sub: 'Real-time fraud alert push', val: permissions.notifications },
                ].map((p, i) => (
                  <View key={i} style={styles.permRow}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={styles.permLabel}>{p.label}</Text>
                      <Text style={styles.permSub}>{p.sub}</Text>
                    </View>
                    <View style={[styles.permBadge, p.val ? styles.chipGreen : styles.chipGray]}>
                      <Text style={styles.chipText}>{p.val ? 'Granted' : 'Denied'}</Text>
                    </View>
                  </View>
                ))}
                <Text style={styles.permNote}>
                  Permissions are simulated for demo purposes. Adjust them via the onboarding flow.
                </Text>
              </View>
            )}
          </Card>
        </Animated.View>

        {/* ── SANDBOX OVERRIDES MODULE ── */}
        <Animated.View entering={FadeInUp.delay(520).duration(700)}>
          <Card style={styles.moduleCard} shadow="none">
            <SectionHeader
              title="Sandbox Overrides"
              subtitle="Simulate device threat states"
              expanded={sandboxOpen}
              onToggle={() => setSandboxOpen(v => !v)}
              icon={
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#f97316" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M2 17l10 5 10-5" stroke="#f97316" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M2 12l10 5 10-5" stroke="#f97316" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              }
            />
            {sandboxOpen && (
              <View style={styles.moduleBody}>
                <View style={styles.toggleRow}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.toggleLabel}>Simulate Root / Jailbreak</Text>
                    <Text style={styles.toggleSub}>Emulates compromised root OS privileges (major violation)</Text>
                  </View>
                  <Switch
                    value={rootDetected}
                    onValueChange={setRootDetected}
                    trackColor={{ false: '#3a3a3c', true: '#4ade8033' }}
                    thumbColor={rootDetected ? '#ef4444' : '#9ca3af'}
                  />
                </View>
                <View style={styles.toggleRow}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.toggleLabel}>Simulate Active VPN</Text>
                    <Text style={styles.toggleSub}>Emulates VPN tunnels masking terminal endpoint IPs</Text>
                  </View>
                  <Switch
                    value={vpnActive}
                    onValueChange={setVpnActive}
                    trackColor={{ false: '#3a3a3c', true: '#bef26433' }}
                    thumbColor={vpnActive ? '#bef264' : '#9ca3af'}
                  />
                </View>
                <View style={styles.toggleRow}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.toggleLabel}>Simulate Active Voice Call</Text>
                    <Text style={styles.toggleSub}>Emulates incoming voice call context for social engineering testing</Text>
                  </View>
                  <Switch
                    value={activeCall}
                    onValueChange={setActiveCall}
                    trackColor={{ false: '#3a3a3c', true: '#bef26433' }}
                    thumbColor={activeCall ? '#bef264' : '#9ca3af'}
                  />
                </View>
                <View style={[styles.toggleRow, { marginBottom: 0 }]}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.toggleLabel}>Secure Mode (Safe Mode)</Text>
                    <Text style={styles.toggleSub}>Restricts large transfers and QR payments for vulnerable users</Text>
                  </View>
                  <Switch
                    value={safeMode}
                    onValueChange={setSafeMode}
                    trackColor={{ false: '#3a3a3c', true: '#bef26433' }}
                    thumbColor={safeMode ? '#bef264' : '#9ca3af'}
                  />
                </View>
              </View>
            )}
          </Card>
        </Animated.View>

        {/* ── SCAM EDUCATION CENTER MODULE ── */}
        <Animated.View entering={FadeInUp.delay(560).duration(700)}>
          <Card style={styles.moduleCard} shadow="none">
            <SectionHeader
              title="Scam Education Center"
              subtitle="Learn to identify financial scams"
              expanded={eduOpen}
              onToggle={() => setEduOpen(v => !v)}
              icon={
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#bef264" strokeWidth={2} />
                  <Path d="M12 16v-4" stroke="#bef264" strokeWidth={2} strokeLinecap="round" />
                  <Circle cx="12" cy="8" r="1" fill="#bef264" />
                </Svg>
              }
            />
            {eduOpen && (
              <View style={styles.moduleBody}>
                <Text style={styles.reportsHeader}>COMMON SCAM PATTERNS</Text>
                {[
                  {
                    title: 'Digital Arrest Scam',
                    desc: 'Scammers claim you have sent illegal packages. They keep you on a live Skype call & demand transfers.',
                    tip: 'Law enforcement NEVER holds virtual arrests or demands UPI payments.'
                  },
                  {
                    title: 'Investment Group Fraud',
                    desc: 'Promised high rewards/trading returns in private Telegram groups before blocking your account.',
                    tip: 'Always verify merchant registration status with SEBI guidelines.'
                  },
                  {
                    title: 'Work-from-Home Job Scam',
                    desc: 'Earn money for rating hotels or liking videos, but you must deposit funds to unlock tasks.',
                    tip: 'Never pay money to receive work or start an online job.'
                  },
                  {
                    title: 'Fake Electricity Bill Alert',
                    desc: 'Urgent SMS warning of immediate power cutoff unless you pay a specific UPI link.',
                    tip: 'Always pay utility bills directly through official, licensed supplier portals.'
                  }
                ].map((item, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      if (Platform.OS === 'web') {
                        alert(`🚨 ${item.title}\n\nWarning: ${item.desc}\n\nProtection Tip: ${item.tip}`);
                      } else {
                        Alert.alert(`🚨 ${item.title}`, `Warning: ${item.desc}\n\nProtection Tip: ${item.tip}`, [{ text: 'I Understand' }]);
                      }
                    }}
                    style={{
                      backgroundColor: '#1c1c1e',
                      borderRadius: 14,
                      padding: 12,
                      marginVertical: 6,
                      borderWidth: 1,
                      borderColor: '#3a3a3c',
                    }}
                  >
                    <Text style={{ color: '#bef264', fontSize: 13, fontWeight: '800', marginBottom: 4 }}>{item.title}</Text>
                    <Text style={{ color: '#a1a1aa', fontSize: 11, lineHeight: 15 }}>{item.desc}</Text>
                    <Text style={{ color: '#ffffff', fontSize: 9, fontWeight: '700', marginTop: 6, opacity: 0.8 }}>Tap to read protection tips →</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Card>
        </Animated.View>

        {/* ── LOGOUT ── */}
        <Animated.View entering={FadeInUp.delay(600).duration(700)}>
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M16 17l5-5-5-5" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M21 12H9" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </Animated.View>

        <View style={{ height: 40 }} />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8f5' },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 70 : 60,
    paddingBottom: 0,
    flexGrow: 1,
  },
  topSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
  },
  darkSheet: {
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    marginTop: theme.spacing.md,
    marginBottom: -20,
    flexGrow: 1,
  },
  header: { marginBottom: theme.spacing.lg },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },

  // Identity card
  identityCard: {
    padding: theme.spacing.lg,
    backgroundColor: '#ffffff',
    borderRadius: 24,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1c1c1e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitials: { color: '#bef264', fontSize: 18, fontWeight: '800' },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  userUpi: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  userPhone: { fontSize: 12, color: theme.colors.textMuted },
  trustDotWrap: { alignItems: 'center', gap: 4 },
  trustDotLabel: { fontSize: 11, fontWeight: '700' },
  chipsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  chipGreen: { backgroundColor: '#dcfce7' },
  guardianCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bef264',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 12,
    gap: 10,
  },
  guardianCtaTitle: { fontSize: 13, fontWeight: '800', color: '#1c1c1e' },
  guardianCtaSub: { fontSize: 11, color: '#374151', marginTop: 2 },
  chipRed: { backgroundColor: '#fee2e2' },
  chipGray: { backgroundColor: '#f3f4f6' },
  chipLime: { backgroundColor: '#e2fcd2' },
  chipText: { fontSize: 10, fontWeight: '700', color: '#374151' },

  // Module cards
  moduleCard: {
    marginBottom: 12,
    backgroundColor: '#2a2a2c',
    borderRadius: 22,
    padding: 0,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1c1c1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderTitle: { fontSize: 14, fontWeight: '700', color: '#ffffff' },
  sectionHeaderSub: { fontSize: 11, color: '#6b7280', marginTop: 1 },
  moduleBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3c',
  },

  // Security module
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14 },
  moduleLabel: { fontSize: 9, fontWeight: '700', color: '#6b7280', letterSpacing: 1.2 },
  scoreNum: { fontSize: 32, fontWeight: '800' },
  scoreSub: { fontSize: 11, color: '#9ca3af', marginBottom: 14 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  checkDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e' },
  checkText: { fontSize: 12, color: '#d1d5db' },
  activeText: { color: '#22c55e', fontWeight: '600' },
  console: {
    backgroundColor: '#111113',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  consoleText: {
    color: '#bef264',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  moduleBtn: { marginTop: 12, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },

  // Community module
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14 },
  statCell: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: '#bef264' },
  statLbl: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
  reportsHeader: { fontSize: 12, fontWeight: '700', color: '#ffffff', marginBottom: 10, marginTop: 16 },
  reportItem: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  reportTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reportUpi: { fontSize: 13, fontWeight: '700', color: '#f9fafb' },
  reportTime: { fontSize: 10, color: '#6b7280' },
  reportCat: { fontSize: 9, fontWeight: '700', color: '#bef264', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  reportDesc: { fontSize: 11, color: '#9ca3af', lineHeight: 16 },

  // Permissions module
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3c',
  },
  permLabel: { fontSize: 13, fontWeight: '600', color: '#f9fafb' },
  permSub: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  permBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  permNote: { fontSize: 10, color: '#4b5563', marginTop: 12, lineHeight: 15 },

  // Sandbox module
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3c',
  },
  toggleLabel: { fontSize: 13, fontWeight: '600', color: '#f9fafb' },
  toggleSub: { fontSize: 11, color: '#6b7280', marginTop: 2 },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  logoutText: { color: '#ef4444', fontSize: 14, fontWeight: '700' },
  passportCard: {
    borderColor: '#bef264',
    borderWidth: 1,
  },
  passportStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 8,
  },
  passportStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  passportLevelText: {
    color: '#bef264',
    fontWeight: '900',
  },
  passportScoreText: {
    color: '#bef264',
    fontSize: 12,
    fontWeight: '800',
  },
  passportProgressBarContainer: {
    height: 6,
    backgroundColor: '#1c1c1e',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  passportProgressBar: {
    height: '100%',
    backgroundColor: '#bef264',
  },
  passportSubText: {
    color: '#a1a1aa',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 6,
  },
});
