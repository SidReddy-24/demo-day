import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeIn,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { useAuthStore } from '../../store/authStore';

// ─── Types ───────────────────────────────────────────────────────────────────

type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'CRITICAL';

interface OtpEvent {
  id: string;
  timestamp: string;
  sender: string;
  maskedOtp: string;
  body: string;
  risk: RiskLevel;
  duringCall: boolean;
  bankName: string;
  reasons: string[];
  blocked: boolean;
}

// ─── Simulated OTP Feed ───────────────────────────────────────────────────────

const MOCK_EVENTS: OtpEvent[] = [
  {
    id: 'otp_1',
    timestamp: '02:28 AM',
    sender: 'VM-SBIINB',
    maskedOtp: '••• 847',
    body: 'Your OTP for SBI NetBanking login is 847XXX. Do not share with anyone.',
    risk: 'SAFE',
    duringCall: false,
    bankName: 'State Bank of India',
    reasons: ['Sender verified carrier ID', 'No suspicious payload patterns', 'No active call detected'],
    blocked: false,
  },
  {
    id: 'otp_2',
    timestamp: '02:19 AM',
    sender: 'AX-HDFCBK',
    maskedOtp: '••• 391',
    body: 'Rs 49,500 will be debited. OTP: 391XXX. If not initiated by you, call 1800-XXX.',
    risk: 'CRITICAL',
    duringCall: true,
    bankName: 'HDFC Bank',
    reasons: [
      'Active phone call detected at time of OTP',
      'Transaction amount ₹49,500 — unusually large',
      'Social engineering pattern: "call us if not you"',
      'Device idle for 40 min before SMS — user unaware',
    ],
    blocked: true,
  },
  {
    id: 'otp_3',
    timestamp: '01:54 AM',
    sender: 'TM-PAYTM1',
    maskedOtp: '••• 012',
    body: 'Your Paytm Wallet OTP is 012XXX. Valid 10 mins. NEVER share this OTP.',
    risk: 'SUSPICIOUS',
    duringCall: false,
    bankName: 'Paytm Payments Bank',
    reasons: [
      'OTP not triggered by in-app action',
      'Location mismatch — last login was Delhi, device now Mumbai',
      'Second OTP request within 3 minutes',
    ],
    blocked: false,
  },
  {
    id: 'otp_4',
    timestamp: '01:41 AM',
    sender: 'DM-GPAY02',
    maskedOtp: '••• 556',
    body: 'Google Pay: Use OTP 556XXX to add new bank account. Do not share.',
    risk: 'SAFE',
    duringCall: false,
    bankName: 'Google Pay / Axis Bank',
    reasons: ['In-app session token matched', 'User-initiated action confirmed', 'No anomalies detected'],
    blocked: false,
  },
];

// ─── Protection Status Tiles ──────────────────────────────────────────────────

const SHIELDS = [
  { label: 'SMS Regex Engine', sub: 'Bank/UPI OTP pattern matching', active: true },
  { label: 'Call Correlator', sub: 'OTP during active call detection', active: true },
  { label: 'Sender Spoof Guard', sub: 'Carrier ID & alpha-tag verification', active: true },
  { label: 'Location Auditor', sub: 'Geographic anomaly on OTP trigger', active: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const PulsingDot = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 900, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.in(Easing.ease) }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: 900 }),
        withTiming(0.6, { duration: 900 }),
      ),
      -1,
      false,
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={dot.wrap}>
      <Animated.View style={[dot.ring, ringStyle]} />
      <View style={dot.core} />
    </View>
  );
};

const dot = StyleSheet.create({
  wrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#22c55e', opacity: 0.4 },
  core: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e' },
});

const RISK_META: Record<RiskLevel, { color: string; bg: string; label: string }> = {
  SAFE:       { color: '#16a34a', bg: '#dcfce7', label: 'SAFE' },
  SUSPICIOUS: { color: '#d97706', bg: '#fef3c7', label: 'SUSPICIOUS' },
  CRITICAL:   { color: '#dc2626', bg: '#fee2e2', label: 'CRITICAL' },
};

// ─── OTP Event Card ───────────────────────────────────────────────────────────

const OtpCard = ({ event, index, onPress }: { event: OtpEvent; index: number; onPress: () => void }) => {
  const meta = RISK_META[event.risk];
  const pressBg = useSharedValue(0);
  const pressStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolate(pressBg.value, [0, 1], [0, 1]) > 0.5 ? '#f0f0f0' : '#f7f6f2',
  }));

  return (
    <Animated.View entering={FadeInUp.delay(index * 80).duration(500)}>
      <Pressable
        onPressIn={() => { pressBg.value = withTiming(1, { duration: 80 }); }}
        onPressOut={() => { pressBg.value = withTiming(0, { duration: 200 }); }}
        onPress={onPress}
        style={styles.otpCard}
      >
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: meta.color }]} />

        <View style={styles.otpCardInner}>
          {/* Top row */}
          <View style={styles.otpTopRow}>
            <View style={styles.senderRow}>
              {/* Shield icon */}
              <View style={[styles.senderIcon, event.risk === 'CRITICAL' && { backgroundColor: '#fee2e2' }]}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 2L4 6v6c0 5.5 3.6 10.7 8 12 4.4-1.3 8-6.5 8-12V6L12 2z"
                    fill={meta.color}
                    opacity={0.2}
                  />
                  <Path
                    d="M12 2L4 6v6c0 5.5 3.6 10.7 8 12 4.4-1.3 8-6.5 8-12V6L12 2z"
                    stroke={meta.color}
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                  {event.risk === 'CRITICAL' && (
                    <>
                      <Line x1="12" y1="9" x2="12" y2="13" stroke={meta.color} strokeWidth={2} strokeLinecap="round" />
                      <Circle cx="12" cy="16" r="1" fill={meta.color} />
                    </>
                  )}
                  {event.risk === 'SAFE' && (
                    <Polyline points="8,12 11,15 16,10" stroke={meta.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </Svg>
              </View>
              <View>
                <Text style={styles.senderText}>{event.sender}</Text>
                <Text style={styles.bankText}>{event.bankName}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <View style={[styles.riskChip, { backgroundColor: meta.bg }]}>
                <Text style={[styles.riskChipText, { color: meta.color }]}>{meta.label}</Text>
              </View>
              {event.blocked && (
                <View style={styles.blockedChip}>
                  <Text style={styles.blockedChipText}>BLOCKED</Text>
                </View>
              )}
            </View>
          </View>

          {/* OTP row */}
          <View style={styles.otpRow}>
            <Text style={styles.otpMasked}>{event.maskedOtp}</Text>
            <Text style={styles.otpTime}>{event.timestamp}</Text>
          </View>

          {/* Body preview */}
          <Text style={styles.otpBody} numberOfLines={1}>{event.body}</Text>

          {/* Flags */}
          {event.duringCall && (
            <View style={styles.callFlag}>
              <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                <Path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2.1l-1.3 1.3a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c1 .3 2 .6 3 .7a2 2 0 011.6 2z" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.callFlagText}>OTP RECEIVED DURING ACTIVE CALL</Text>
            </View>
          )}
        </View>

        {/* Chevron */}
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
          <Path d="M9 18l6-6-6-6" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
    </Animated.View>
  );
};

// ─── Risk Detail Modal ────────────────────────────────────────────────────────

const RiskModal = ({ event, onClose }: { event: OtpEvent; onClose: () => void }) => {
  const meta = RISK_META[event.risk];
  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <Pressable style={modal.overlay} onPress={onClose}>
        <Animated.View entering={SlideInDown.springify().damping(18)} style={modal.sheet}>
          <View style={modal.handle} />

          {/* Header */}
          <View style={[modal.banner, { backgroundColor: meta.bg }]}>
            <Text style={[modal.bannerTitle, { color: meta.color }]}>{meta.label} OTP EVENT</Text>
            <Text style={[modal.bannerSub, { color: meta.color }]}>{event.sender} · {event.timestamp}</Text>
          </View>

          {event.blocked && (
            <View style={modal.blockedBanner}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth={2} />
                <Line x1="4.9" y1="4.9" x2="19.1" y2="19.1" stroke="#dc2626" strokeWidth={2} />
              </Svg>
              <Text style={modal.blockedBannerText}>OTP Guardian blocked this OTP from being auto-filled or shared</Text>
            </View>
          )}

          {/* Message */}
          <View style={modal.msgBox}>
            <Text style={modal.msgLabel}>ORIGINAL SMS</Text>
            <Text style={modal.msgBody}>{event.body}</Text>
          </View>

          {/* Why flagged */}
          <Text style={modal.reasonsTitle}>WHY WAS THIS FLAGGED?</Text>
          {event.reasons.map((r, i) => (
            <View key={i} style={modal.reasonRow}>
              <View style={[modal.reasonDot, { backgroundColor: meta.color }]} />
              <Text style={modal.reasonText}>{r}</Text>
            </View>
          ))}

          {/* Call warning */}
          {event.duringCall && (
            <View style={modal.callWarn}>
              <Text style={modal.callWarnTitle}>⚠ ACTIVE CALL CORRELATION</Text>
              <Text style={modal.callWarnBody}>
                This OTP arrived while you were on a phone call. This is the #1 social engineering vector — 
                scammers call posing as bank officers and ask you to read the OTP aloud. 
                Never share an OTP during or immediately after an unsolicited call.
              </Text>
            </View>
          )}

          <Pressable style={modal.closeBtn} onPress={onClose}>
            <Text style={modal.closeBtnText}>Dismiss</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  banner: { borderRadius: 14, padding: 16, marginBottom: 14 },
  bannerTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1.2 },
  bannerSub: { fontSize: 12, marginTop: 2, opacity: 0.75 },
  blockedBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#fee2e2', borderRadius: 10, padding: 12, marginBottom: 14 },
  blockedBannerText: { flex: 1, fontSize: 12, color: '#dc2626', lineHeight: 18, fontWeight: '600' },
  msgBox: { backgroundColor: '#f7f6f2', borderRadius: 10, padding: 14, marginBottom: 18 },
  msgLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.2, color: '#9ca3af', marginBottom: 6 },
  msgBody: { fontSize: 13, color: '#374151', lineHeight: 20 },
  reasonsTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: '#6b7280', marginBottom: 10 },
  reasonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  reasonDot: { width: 7, height: 7, borderRadius: 3.5, marginTop: 5 },
  reasonText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 19 },
  callWarn: { backgroundColor: '#fff7ed', borderRadius: 12, padding: 14, marginTop: 16, borderLeftWidth: 3, borderLeftColor: '#f97316' },
  callWarnTitle: { fontSize: 11, fontWeight: '800', color: '#c2410c', letterSpacing: 0.8, marginBottom: 6 },
  callWarnBody: { fontSize: 12, color: '#9a3412', lineHeight: 19 },
  closeBtn: { marginTop: 20, backgroundColor: '#1c1c1e', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

// ─── Live Ticker ──────────────────────────────────────────────────────────────

const TICKER_LINES = [
  'REGEX ENGINE — scanning incoming SMS payloads...',
  'BANK ALPHA-TAG DB — 2,847 verified sender IDs loaded',
  'CALL CORRELATOR — telephony state: monitoring',
  'OTP INTERCEPTOR — last scan: 0.3ms ago',
  'NO NEW THREATS — all channels nominal',
  'LOCATION AUDITOR — geo-hash stable',
];

const LiveTicker = () => {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLineIdx(i => (i + 1) % TICKER_LINES.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.ticker}>
      <PulsingDot />
      <Text style={styles.tickerText} numberOfLines={1}>{TICKER_LINES[lineIdx]}</Text>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export const OtpGuardianScreen = () => {
  const navigation = useNavigation();
  const { activeCall } = useAuthStore();
  const [events, setEvents] = useState<OtpEvent[]>(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<OtpEvent | null>(null);
  const [guardianActive, setGuardianActive] = useState(true);

  // Header shield wave
  const shieldScale = useSharedValue(1);
  useEffect(() => {
    shieldScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);
  const shieldStyle = useAnimatedStyle(() => ({ transform: [{ scale: shieldScale.value }] }));

  // Simulate a new critical OTP if active call is on
  const injectCallOtp = useCallback(() => {
    const newEvt: OtpEvent = {
      id: `otp_live_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      sender: 'AD-ICICIB1',
      maskedOtp: '••• 773',
      body: 'ICICI Bank: OTP 773XXX to authorise transfer of Rs 75,000. NEVER share OTP with anyone.',
      risk: 'CRITICAL',
      duringCall: true,
      bankName: 'ICICI Bank',
      reasons: [
        'Active phone call detected — HIGH RISK',
        'Transfer amount ₹75,000 exceeds normal range',
        'New beneficiary — not seen in past 90 days',
        'OTP triggered without app interaction',
      ],
      blocked: true,
    };
    setEvents(prev => [newEvt, ...prev]);
    Alert.alert(
      '🚨 CRITICAL OTP ALERT',
      'An OTP for ₹75,000 arrived while you are on a call. OTP Guardian has blocked auto-fill. DO NOT share this OTP.',
      [{ text: 'View Details', onPress: () => setSelectedEvent(newEvt) }, { text: 'Dismiss' }],
    );
  }, []);

  const stats = {
    total: events.length,
    blocked: events.filter(e => e.blocked).length,
    critical: events.filter(e => e.risk === 'CRITICAL').length,
    safe: events.filter(e => e.risk === 'SAFE').length,
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff8f5" />

      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M19 12H5M12 19l-7-7 7-7" stroke="#1c1c1e" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
        <View>
          <Text style={styles.topTitle}>OTP Guardian</Text>
          <Text style={styles.topSub}>AI-powered OTP scam interceptor</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: guardianActive ? '#dcfce7' : '#f3f4f6' }]}>
          <View style={[styles.statusDot, { backgroundColor: guardianActive ? '#22c55e' : '#9ca3af' }]} />
          <Text style={[styles.statusPillText, { color: guardianActive ? '#16a34a' : '#6b7280' }]}>
            {guardianActive ? 'ON' : 'OFF'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── HERO SHIELD ─────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(100).duration(700)} style={styles.heroCard}>
          <Animated.View style={[styles.shieldCircle, shieldStyle]}>
            <Svg width={52} height={52} viewBox="0 0 24 24" fill="none">
              <Path d="M12 2L4 6v6c0 5.5 3.6 10.7 8 12 4.4-1.3 8-6.5 8-12V6L12 2z" fill="rgba(190,242,100,0.18)" />
              <Path d="M12 2L4 6v6c0 5.5 3.6 10.7 8 12 4.4-1.3 8-6.5 8-12V6L12 2z" stroke="#bef264" strokeWidth={2} strokeLinejoin="round" />
              <Polyline points="8,12 11,15 16,10" stroke="#bef264" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Animated.View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Guardian Active</Text>
            <Text style={styles.heroSub}>Monitoring SMS inbox for OTP-based scam patterns in real time</Text>
          </View>
        </Animated.View>

        {/* ── LIVE TICKER ─────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(160).duration(600)}>
          <LiveTicker />
        </Animated.View>

        {/* ── STATS ROW ───────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(220).duration(600)} style={styles.statsRow}>
          {[
            { val: stats.total, label: 'OTPs Scanned', color: '#1c1c1e' },
            { val: stats.blocked, label: 'Blocked', color: '#dc2626' },
            { val: stats.critical, label: 'Critical', color: '#f97316' },
            { val: stats.safe, label: 'Safe', color: '#16a34a' },
          ].map((s, i) => (
            <View key={i} style={styles.statTile}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* ── ACTIVE CALL WARNING ──────────────────────────────── */}
        {activeCall && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.callWarnBanner}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2.1l-1.3 1.3a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c1 .3 2 .6 3 .7a2 2 0 011.6 2z" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <View style={{ flex: 1 }}>
              <Text style={styles.callWarnTitle}>ACTIVE CALL DETECTED</Text>
              <Text style={styles.callWarnSub}>Any OTP arriving now will be treated as CRITICAL and blocked from auto-fill.</Text>
            </View>
            <Pressable style={styles.simulateBtn} onPress={injectCallOtp}>
              <Text style={styles.simulateBtnText}>Simulate OTP</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* ── OTP EVENT FEED ──────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(280).duration(600)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>OTP Event Log</Text>
            <Text style={styles.sectionSub}>Tap any event to view risk analysis</Text>
          </View>

          {events.map((evt, i) => (
            <OtpCard key={evt.id} event={evt} index={i} onPress={() => setSelectedEvent(evt)} />
          ))}
        </Animated.View>

        {/* ── PROTECTION STATUS ───────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(360).duration(600)} style={styles.shieldSection}>
          <Text style={styles.sectionTitle}>Protection Modules</Text>
          <Text style={styles.sectionSub}>All engines running on-device · zero data leaves your phone</Text>
          <View style={styles.shieldGrid}>
            {SHIELDS.map((s, i) => (
              <Animated.View key={i} entering={FadeInUp.delay(380 + i * 60).duration(500)} style={styles.shieldTile}>
                <View style={styles.shieldTileTop}>
                  <View style={styles.shieldIconWrap}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path d="M12 2L4 6v6c0 5.5 3.6 10.7 8 12 4.4-1.3 8-6.5 8-12V6L12 2z" stroke="#1c1c1e" strokeWidth={2} strokeLinejoin="round" />
                    </Svg>
                  </View>
                  <View style={[styles.activeDot, { backgroundColor: s.active ? '#22c55e' : '#9ca3af' }]} />
                </View>
                <Text style={styles.shieldLabel}>{s.label}</Text>
                <Text style={styles.shieldSub}>{s.sub}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* ── EDUCATION BANNER ────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(500).duration(600)} style={styles.eduBanner}>
          <View style={styles.eduIcon}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#1c1c1e" strokeWidth={2} strokeLinejoin="round" />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.eduTitle}>Golden Rule of OTP Safety</Text>
            <Text style={styles.eduBody}>No bank, government agency, or payment app will EVER ask you to share an OTP over the phone. If anyone asks — it is a scam.</Text>
          </View>
        </Animated.View>

      </ScrollView>

      {/* ── RISK DETAIL MODAL ───────────────────────────────────── */}
      {selectedEvent && (
        <RiskModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff8f5' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#fff8f5',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f0ede8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { fontSize: 18, fontWeight: '800', color: '#1c1c1e' },
  topSub: { fontSize: 11, color: '#6b7280', marginTop: 1 },
  statusPill: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  statusPillText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  // Hero
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  shieldCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(190,242,100,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { flex: 1 },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#bef264' },
  heroSub: { fontSize: 12, color: '#9ca3af', lineHeight: 18, marginTop: 4 },

  // Ticker
  ticker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  tickerText: { flex: 1, fontSize: 10, fontFamily: 'Courier New', color: '#22c55e', letterSpacing: 0.5 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statTile: {
    flex: 1,
    backgroundColor: '#f7f6f2',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 2,
  },
  statVal: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 9, color: '#6b7280', fontWeight: '600', textAlign: 'center' },

  // Call warning
  callWarnBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#fca5a5',
  },
  callWarnTitle: { fontSize: 11, fontWeight: '800', color: '#dc2626', letterSpacing: 0.8 },
  callWarnSub: { fontSize: 11, color: '#9a3412', lineHeight: 16, marginTop: 2 },
  simulateBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 6,
  },
  simulateBtnText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  // Section header
  sectionHeader: { marginBottom: 10, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1c1c1e' },
  sectionSub: { fontSize: 11, color: '#6b7280', marginTop: 2 },

  // OTP Card
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f6f2',
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  accentBar: { width: 4, alignSelf: 'stretch' },
  otpCardInner: { flex: 1, padding: 14, gap: 6 },
  otpTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  senderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  senderIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f0ede8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderText: { fontSize: 12, fontWeight: '800', color: '#1c1c1e' },
  bankText: { fontSize: 10, color: '#6b7280', marginTop: 1 },
  riskChip: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  riskChipText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  blockedChip: { backgroundColor: '#1c1c1e', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  blockedChipText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.6 },
  otpRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  otpMasked: { fontSize: 20, fontWeight: '800', color: '#1c1c1e', letterSpacing: 4 },
  otpTime: { fontSize: 11, color: '#9ca3af' },
  otpBody: { fontSize: 11, color: '#6b7280', lineHeight: 16 },
  callFlag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  callFlagText: { fontSize: 9, fontWeight: '700', color: '#dc2626', letterSpacing: 0.6 },

  // Shield grid
  shieldSection: { marginTop: 20, marginBottom: 14 },
  shieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  shieldTile: {
    width: '47.5%',
    backgroundColor: '#f7f6f2',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  shieldTileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shieldIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#e8e5de',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  shieldLabel: { fontSize: 12, fontWeight: '800', color: '#1c1c1e' },
  shieldSub: { fontSize: 10, color: '#6b7280', lineHeight: 14 },

  // Edu banner
  eduBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#bef264',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  eduIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eduTitle: { fontSize: 13, fontWeight: '800', color: '#1c1c1e', marginBottom: 4 },
  eduBody: { fontSize: 12, color: '#1c1c1e', lineHeight: 18, opacity: 0.8 },
});
