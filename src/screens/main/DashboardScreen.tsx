import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, StatusBar,
  Pressable, Platform, Alert, Dimensions, TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import Animated, {
  FadeInDown, FadeInUp, SlideInDown,
  useSharedValue, withRepeat, withTiming,
  useAnimatedStyle, interpolate, withSpring,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// ── Colour tokens ────────────────────────────────────────────────
const C = {
  bg: '#F4F6FA',
  card: '#FFFFFF',
  primary: '#6C5CE7',
  primaryLight: '#EDE9FF',
  primaryDark: '#4A3AB5',
  accent: '#00C9A7',
  accentLight: '#E0FAF5',
  danger: '#FF4757',
  dangerLight: '#FFE8EB',
  warn: '#FFA502',
  warnLight: '#FFF3E0',
  text: '#1A1D2E',
  sub: '#8A8FA8',
  border: '#E8EBF4',
  white: '#FFFFFF',
  dark: '#12151E',
};

// ── Small SVG icon helpers ───────────────────────────────────────
const SendIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13" stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const ScanIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M3 7V5a2 2 0 012-2h2" stroke={C.white} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M17 3h2a2 2 0 012 2v2" stroke={C.white} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M21 17v2a2 2 0 01-2 2h-2" stroke={C.white} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M7 21H5a2 2 0 01-2-2v-2" stroke={C.white} strokeWidth="2" strokeLinecap="round"/>
    <Rect x="7" y="7" width="10" height="10" rx="1" stroke={C.white} strokeWidth="2"/>
  </Svg>
);
const ShieldIcon = ({ color = C.primary, size = 20 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const AlertTriIcon = ({ color = C.danger }: any) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </Svg>
);
const CheckIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={C.white} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const ArrowUpRight = ({ color = C.primary }: any) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M7 17L17 7M17 7H7M17 7v10" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const ArrowDownLeft = ({ color = C.accent }: any) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M17 7L7 17M7 17h10M7 17V7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// ── Quick-action tile ────────────────────────────────────────────
const QuickAction = ({ icon, label, color, onPress }: any) => (
  <TouchableOpacity style={s.qaWrap} onPress={onPress} activeOpacity={0.8}>
    <View style={[s.qaCircle, { backgroundColor: color }]}>{icon}</View>
    <Text style={s.qaLabel}>{label}</Text>
  </TouchableOpacity>
);

// ── Favourite contact chip ───────────────────────────────────────
const ContactChip = ({ initials, name, risk, onPress }: any) => {
  const ringColor = risk === 'HIGH' ? C.danger : risk === 'MEDIUM' ? C.warn : C.accent;
  return (
    <TouchableOpacity style={s.contactChip} onPress={onPress} activeOpacity={0.8}>
      <View style={[s.contactAvatar, { borderColor: ringColor }]}>
        <Text style={s.contactInitials}>{initials}</Text>
      </View>
      <Text style={s.contactName} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
};

// ── Risk badge ───────────────────────────────────────────────────
const RiskPill = ({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) => {
  const map = { LOW: [C.accent, C.accentLight], MEDIUM: [C.warn, C.warnLight], HIGH: [C.danger, C.dangerLight] } as any;
  const [fg, bg] = map[level];
  return (
    <View style={[s.riskPill, { backgroundColor: bg }]}>
      <Text style={[s.riskText, { color: fg }]}>{level}</Text>
    </View>
  );
};

// ── Main component ───────────────────────────────────────────────
export const DashboardScreen = ({ navigation }: any) => {
  const { user, deviceTrustScore, logout, activeCall } = useAuthStore();
  const isFocused = useIsFocused();
  const [hideBalance, setHideBalance] = useState(false);

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.5, { duration: 1100 }), -1, true);
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.5], [0.6, 0]),
  }));

  const handlePanic = () => {
    const msg = '🚨 PANIC FREEZE ACTIVATED\n\nAll UPI handles suspended. Bank & emergency contacts notified.';
    Platform.OS === 'web' ? alert(msg) : Alert.alert('🚨 PANIC FREEZE', msg, [{ text: 'Dismiss' }]);
  };

  const handleLogout = () => {
    logout();
    navigation.getParent()?.replace('Welcome');
  };

  const CONTACTS = [
    { id: '1', name: 'Rohit', upi: 'rohit45@okaxis', risk: 'LOW' as const },
    { id: '2', name: 'Alice', upi: 'alice@paytm', risk: 'LOW' as const },
    { id: '3', name: 'EB Board', upi: 'billpay.board@apco', risk: 'HIGH' as const },
    { id: '4', name: 'Priya', upi: 'priya@upi', risk: 'LOW' as const },
  ];

  const TXNS = [
    { id: '1', name: 'Rohit Sharma', upi: 'rohit45@okaxis', amount: 1500, time: 'Today, 2:14 PM', risk: 'LOW' as const, type: 'SEND' as const },
    { id: '2', name: 'Electricity Board', upi: 'billpay.board@apco', amount: 4250, time: 'Yesterday', risk: 'HIGH' as const, type: 'SEND' as const },
    { id: '3', name: 'Alice Rivera', upi: 'alice@paytm', amount: 750, time: 'July 9, 6:18 PM', risk: 'LOW' as const, type: 'RECEIVE' as const },
  ];

  const trustOk = deviceTrustScore > 80;

  return (
    <ScrollView
      key={isFocused ? 'active' : 'inactive'}
      style={s.root}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(60).duration(500)} style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.avatarRing}>
            <Text style={s.avatarText}>{user?.name ? user.name.slice(0, 2).toUpperCase() : 'JS'}</Text>
          </View>
          <View>
            <Text style={s.greet}>Good morning 👋</Text>
            <Text style={s.userName}>{user?.name || 'Jack Sparrow'}</Text>
          </View>
        </View>
        <Pressable onPress={handleLogout} style={s.logoutBtn}>
          <Text style={s.logoutText}>Logout</Text>
        </Pressable>
      </Animated.View>

      {/* ── BALANCE CARD (Visa-style) ────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(120).duration(600)}>
        <Pressable onPress={() => setHideBalance(v => !v)} style={s.balanceCard} activeOpacity={0.95}>
          {/* top row */}
          <View style={s.bcTopRow}>
            <Text style={s.bcBankLabel}>SentinelPay</Text>
            <View style={s.bcChipRow}>
              <View style={s.bcChip} />
              <Text style={s.bcVisa}>VISA</Text>
            </View>
          </View>
          {/* balance */}
          <Text style={s.bcBalanceLabel}>Total Balance</Text>
          <Text style={s.bcBalance}>{hideBalance ? '₹ ••••••••' : '₹1,12,340.00'}</Text>
          <View style={s.bcTrendRow}>
            <View style={[s.bcTrendBadge, { backgroundColor: 'rgba(0,201,167,0.25)' }]}>
              <Text style={[s.bcTrendText, { color: C.accent }]}>▲ 12.4%</Text>
            </View>
            <Text style={s.bcTrendSub}>vs last month</Text>
          </View>
          {/* bottom row */}
          <View style={s.bcBottomRow}>
            <View>
              <Text style={s.bcCardLabel}>UPI ID</Text>
              <Text style={s.bcCardNum}>{user?.name?.toLowerCase().replace(' ', '.') || 'user'}@sentinelpay</Text>
            </View>
            <Text style={s.bcEye}>{hideBalance ? '🙈' : '👁'}</Text>
          </View>
          {/* decorative circles */}
          <View style={s.bcCircle1} />
          <View style={s.bcCircle2} />
        </Pressable>
      </Animated.View>

      {/* ── QUICK ACTIONS ───────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(180).duration(600)} style={s.qaRow}>
        <QuickAction icon={<SendIcon />} label="Send" color={C.primary} onPress={() => navigation.navigate('SendMoney')} />
        <QuickAction icon={<ScanIcon />} label="Scan QR" color={C.primaryDark} onPress={() => navigation.navigate('QrScanner')} />
        <QuickAction icon={<ShieldIcon color={C.white} size={22} />} label="Security" color={C.accent} onPress={() => {}} />
        <QuickAction icon={<AlertTriIcon color={C.white} />} label="Report" color={C.warn} onPress={() => navigation.navigate('ReportMerchant')} />
      </Animated.View>

      {/* ── ACTIVE CALL WARNING ──────────────────────────────────── */}
      {activeCall && (
        <Animated.View entering={FadeInDown.duration(400)} style={s.callBanner}>
          <Text style={s.callBannerIcon}>📞</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.callBannerTitle}>LIVE CALL PROTECTION ACTIVE</Text>
            <Text style={s.callBannerSub}>Max verification enforced during active call</Text>
          </View>
        </Animated.View>
      )}

      {/* ── OTP GUARDIAN BANNER ─────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(220).duration(600)} style={s.guardianBanner}>
        <View style={s.guardianLeft}>
          <View style={[s.guardianDot, { backgroundColor: trustOk ? C.accent : C.warn }]} />
          <View style={{ flex: 1 }}>
            <Text style={s.guardianTitle}>OTP Guardian — Active</Text>
            <Text style={s.guardianSub}>Monitoring SMS for scam OTPs in real-time</Text>
          </View>
        </View>
        <Pressable onPress={() => navigation.navigate('OtpGuardian' as any)} style={s.guardianBtn}>
          <Text style={s.guardianBtnText}>Open →</Text>
        </Pressable>
      </Animated.View>

      {/* ── DEVICE TRUST CARDS ──────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(260).duration(600)} style={s.trustRow}>
        {/* System Integrity */}
        <View style={[s.trustCard, { borderLeftColor: trustOk ? C.accent : C.warn }]}>
          <View style={s.trustCardHeader}>
            <Text style={s.trustCardLabel}>System Integrity</Text>
            <View style={s.pulseWrap}>
              <Animated.View style={[s.pulseRing, pulseStyle, { borderColor: trustOk ? C.accent : C.warn }]} />
              <View style={[s.pulseDot, { backgroundColor: trustOk ? C.accent : C.warn }]} />
            </View>
          </View>
          <Text style={[s.trustScore, { color: trustOk ? C.accent : C.warn }]}>{deviceTrustScore}%</Text>
          <Text style={s.trustSub}>{trustOk ? 'Optimal' : 'Warning'}</Text>
        </View>
        {/* AI Behaviour */}
        <View style={[s.trustCard, { borderLeftColor: C.primary }]}>
          <Text style={s.trustCardLabel}>AI Behaviour</Text>
          <Text style={[s.trustScore, { color: C.primary }]}>98%</Text>
          <Text style={s.trustSub}>Biometric match</Text>
        </View>
        {/* Ecosystem Threats */}
        <View style={[s.trustCard, { borderLeftColor: C.danger }]}>
          <Text style={s.trustCardLabel}>Threats</Text>
          <Text style={[s.trustScore, { color: C.danger }]}>{activeCall ? '03' : '02'}</Text>
          <Text style={s.trustSub}>Active alerts</Text>
        </View>
      </Animated.View>

      {/* ── FAVOURITE CONTACTS ──────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(300).duration(600)}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Favourite Contacts</Text>
          <Pressable onPress={() => navigation.navigate('SendMoney')}>
            <Text style={s.sectionLink}>View all →</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.contactsRow} contentContainerStyle={{ paddingHorizontal: 4 }}>
          {/* Add new */}
          <TouchableOpacity
            style={s.contactChip}
            onPress={() => navigation.navigate('SendMoney')}
            activeOpacity={0.8}
          >
            <View style={[s.contactAvatar, { borderColor: C.border, backgroundColor: C.primaryLight }]}>
              <Text style={{ fontSize: 20, color: C.primary }}>+</Text>
            </View>
            <Text style={s.contactName}>New</Text>
          </TouchableOpacity>
          {CONTACTS.map(c => (
            <ContactChip
              key={c.id}
              initials={c.name.slice(0, 2).toUpperCase()}
              name={c.name}
              risk={c.risk}
              onPress={() => navigation.navigate('AmountEntry', { recipientName: c.name, recipientUpi: c.upi, recipientRisk: c.risk })}
            />
          ))}
        </ScrollView>
      </Animated.View>

      {/* ── PANIC FREEZE ────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(340).duration(600)}>
        <Pressable onPress={handlePanic} style={s.freezeBtn} activeOpacity={0.9}>
          <AlertTriIcon color={C.danger} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.freezeTitle}>PANIC FREEZE SUSPENSION</Text>
            <Text style={s.freezeSub}>Tap to instantly halt all payment routers</Text>
          </View>
          <View style={s.freezeArrow}>
            <Text style={{ color: C.danger, fontWeight: '800' }}>!</Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* ── RECENT TRANSACTIONS ─────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(380).duration(600)}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Recent Transactions</Text>
          <Pressable onPress={() => navigation.navigate('ReportMerchant')}>
            <Text style={s.sectionLink}>Report Scam →</Text>
          </Pressable>
        </View>
        <View style={s.txnCard}>
          {TXNS.map((txn, i) => (
            <View key={txn.id}>
              <View style={s.txnRow}>
                <View style={[s.txnIcon, { backgroundColor: txn.type === 'RECEIVE' ? C.accentLight : C.primaryLight }]}>
                  {txn.type === 'RECEIVE' ? <ArrowDownLeft color={C.accent} /> : <ArrowUpRight color={C.primary} />}
                </View>
                <View style={s.txnInfo}>
                  <Text style={s.txnName}>{txn.name}</Text>
                  <Text style={s.txnUpi}>{txn.upi}</Text>
                  <Text style={s.txnTime}>{txn.time}</Text>
                </View>
                <View style={s.txnRight}>
                  <Text style={[s.txnAmount, { color: txn.type === 'RECEIVE' ? C.accent : C.text }]}>
                    {txn.type === 'RECEIVE' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </Text>
                  <RiskPill level={txn.risk} />
                </View>
              </View>
              {i < TXNS.length - 1 && <View style={s.txnDivider} />}
            </View>
          ))}
        </View>
      </Animated.View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { paddingTop: Platform.OS === 'ios' ? 56 : 44, paddingHorizontal: 20, paddingBottom: 100 },

  // header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarRing: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: C.white, fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
  greet: { fontSize: 12, color: C.sub, fontWeight: '500' },
  userName: { fontSize: 16, color: C.text, fontWeight: '800' },
  logoutBtn: { backgroundColor: C.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: C.border },
  logoutText: { fontSize: 11, color: C.sub, fontWeight: '700' },

  // balance card
  balanceCard: {
    borderRadius: 24, padding: 22, marginBottom: 20, overflow: 'hidden',
    backgroundColor: C.primary,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10,
  },
  bcTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  bcBankLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  bcChipRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bcChip: { width: 30, height: 22, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  bcVisa: { color: C.white, fontWeight: '900', fontSize: 18, fontStyle: 'italic' },
  bcBalanceLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  bcBalance: { color: C.white, fontSize: 34, fontWeight: '900', letterSpacing: -1, marginBottom: 10 },
  bcTrendRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  bcTrendBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  bcTrendText: { fontSize: 11, fontWeight: '800' },
  bcTrendSub: { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
  bcBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  bcCardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '600', letterSpacing: 1, marginBottom: 4 },
  bcCardNum: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  bcEye: { fontSize: 18 },
  bcCircle1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -40 },
  bcCircle2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -30, right: 60 },

  // quick actions
  qaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  qaWrap: { alignItems: 'center', flex: 1 },
  qaCircle: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  qaLabel: { fontSize: 11, color: C.sub, fontWeight: '600' },

  // call banner
  callBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF1F1', borderRadius: 16, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: C.dangerLight, gap: 10 },
  callBannerIcon: { fontSize: 22 },
  callBannerTitle: { fontSize: 11, fontWeight: '800', color: C.danger, letterSpacing: 0.5 },
  callBannerSub: { fontSize: 10, color: C.sub, marginTop: 2 },

  // otp guardian
  guardianBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: C.border, gap: 10 },
  guardianLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  guardianDot: { width: 10, height: 10, borderRadius: 5 },
  guardianTitle: { fontSize: 13, fontWeight: '800', color: C.text },
  guardianSub: { fontSize: 10, color: C.sub, marginTop: 2 },
  guardianBtn: { backgroundColor: C.primaryLight, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  guardianBtnText: { fontSize: 12, fontWeight: '800', color: C.primary },

  // trust cards
  trustRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  trustCard: { flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border, borderLeftWidth: 4 },
  trustCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  trustCardLabel: { fontSize: 10, fontWeight: '700', color: C.sub, letterSpacing: 0.3 },
  pulseWrap: { width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  pulseRing: { position: 'absolute', width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  pulseDot: { width: 8, height: 8, borderRadius: 4 },
  trustScore: { fontSize: 22, fontWeight: '900' },
  trustSub: { fontSize: 10, color: C.sub, marginTop: 2 },

  // contacts
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  sectionLink: { fontSize: 12, color: C.primary, fontWeight: '700' },
  contactsRow: { marginBottom: 20 },
  contactChip: { alignItems: 'center', marginRight: 16, width: 60 },
  contactAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.primaryLight, justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, marginBottom: 6 },
  contactInitials: { fontSize: 16, fontWeight: '800', color: C.primary },
  contactName: { fontSize: 10, color: C.sub, fontWeight: '600', textAlign: 'center' },

  // panic freeze
  freezeBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1.5, borderColor: C.dangerLight },
  freezeTitle: { fontSize: 12, fontWeight: '800', color: C.danger, letterSpacing: 0.5 },
  freezeSub: { fontSize: 10, color: C.sub, marginTop: 2 },
  freezeArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.dangerLight, justifyContent: 'center', alignItems: 'center' },

  // transactions
  txnCard: { backgroundColor: C.card, borderRadius: 20, padding: 4, borderWidth: 1, borderColor: C.border, marginBottom: 10, overflow: 'hidden' },
  txnRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  txnDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 14 },
  txnIcon: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  txnInfo: { flex: 1 },
  txnName: { fontSize: 13, fontWeight: '700', color: C.text },
  txnUpi: { fontSize: 10, color: C.sub, marginTop: 2 },
  txnTime: { fontSize: 10, color: C.sub, marginTop: 2 },
  txnRight: { alignItems: 'flex-end', gap: 6 },
  txnAmount: { fontSize: 13, fontWeight: '800' },
  riskPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  riskText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  // balance card sub styles (needed by component but defined in card)
  balancePressable: { width: '100%' },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
