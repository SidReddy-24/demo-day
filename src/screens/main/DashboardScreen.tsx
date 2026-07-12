import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, Pressable, Platform, Alert } from 'react-native';
import { theme } from '../../theme';
import { Card } from '../../components/Card';
import { TransactionItem } from '../../components/TransactionItem';
import { useAuthStore } from '../../store/authStore';
import Animated, { FadeInDown, FadeInUp, SlideInDown, useSharedValue, withRepeat, withTiming, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import Svg, { Path, Line } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';

export const DashboardScreen = ({ navigation }: any) => {
  const { user, deviceTrustScore, logout, activeCall } = useAuthStore();
  const isFocused = useIsFocused();
  const [hideBalance, setHideBalance] = useState(false);

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.4, { duration: 1200 }), -1, true);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.4], [1, 0]),
  }));

  const handlePanic = () => {
    if (Platform.OS === 'web') {
      alert(
        '🚨 PANIC FREEZE ACTIVATED\n\nEcosystem status: Payments frozen. All UPI IDs linked to this terminal are suspended. Emergency contacts and your bank have been notified. An automated incident report has been compiled.'
      );
    } else {
      Alert.alert(
        '🚨 PANIC FREEZE ACTIVATED',
        'Ecosystem status: Payments frozen. All UPI IDs linked to this terminal are suspended. Emergency contacts and your bank have been notified. An automated incident report has been compiled.',
        [{ text: 'Dismiss', style: 'cancel' }]
      );
    }
  };

  const handleLogout = () => {
    logout();
    if (navigation) {
      navigation.getParent()?.replace('Welcome');
    }
  };

  const handleQuickSend = () => {
    navigation.navigate('SendMoney');
  };

  const handleQuickScan = () => {
    navigation.navigate('QrScanner');
  };

  const handleReportScam = () => {
    navigation.navigate('ReportMerchant');
  };

  return (
    <ScrollView key={isFocused ? 'active' : 'inactive'} style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.topSection}>
        {/* Apple Dribbble Header */}
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>{user?.name ? user.name.slice(0,2).toUpperCase() : 'JS'}</Text>
            </View>
            <View style={styles.userText}>
              <Text style={styles.greeting}>Hello, good morning!</Text>
              <Text style={styles.userName}>{user?.name || 'Jack Sparrow'}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable onPress={handleLogout} style={styles.iconBtn}>
              <Text style={styles.logoutBtnText}>LOGOUT</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Available Balance Panel */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.balanceContainer}>
          <Pressable onPress={() => setHideBalance(!hideBalance)} style={styles.balancePressable}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.eyeIcon}>{hideBalance ? '👁️' : '👁️‍🗨️'}</Text>
            </View>
            <Text style={styles.balanceAmount}>
              {hideBalance ? '₹ ••••••••' : '₹1,12,340.00'}
            </Text>
            <Text style={styles.balanceTrend}>₹10,240.00 <Text style={styles.greenText}>+12.4%</Text></Text>
          </Pressable>
        </Animated.View>

        {/* Capsule Action Buttons */}
        <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.pillActionContainer}>
          <Pressable onPress={handleQuickSend} style={[styles.pillBtn, styles.limeBtn]}>
            <View style={styles.pillBtnContent}>
              <View style={styles.pillCircleIconLime}>
                <Text style={styles.pillArrowLime}>↙</Text>
              </View>
              <Text style={styles.pillBtnTextLime}>Send Money</Text>
            </View>
          </Pressable>
          <Pressable onPress={handleQuickScan} style={[styles.pillBtn, styles.whiteBtn]}>
            <View style={styles.pillBtnContent}>
              <View style={styles.pillCircleIconWhite}>
                <Text style={styles.pillArrowWhite}>↗</Text>
              </View>
              <Text style={styles.pillBtnTextWhite}>Scan QR</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      {/* ── OTP GUARDIAN SHORTCUT ─────────────────────────────────── */}
      <Animated.View entering={FadeInUp.delay(350).duration(600)} style={styles.guardianBanner}>
        <View style={styles.guardianBannerLeft}>
          <View style={styles.guardianBannerDot} />
          <View>
            <Text style={styles.guardianBannerTitle}>OTP Guardian — Active</Text>
            <Text style={styles.guardianBannerSub}>Monitoring SMS inbox for OTP scams in real time</Text>
          </View>
        </View>
        <Pressable onPress={() => navigation.navigate('OtpGuardian' as any)} style={styles.guardianBannerBtn}>
          <Text style={styles.guardianBannerBtnText}>Open</Text>
        </Pressable>
      </Animated.View>

      {/* Black Box Covering Everything Below */}
      <Animated.View entering={SlideInDown.springify().damping(17).stiffness(50).mass(1.2)} style={styles.blackSection}>
        {/* Skewomorphic Grid Indicators */}
        <Animated.View entering={FadeInUp.delay(400).duration(800)} style={styles.gridContainer}>
          {/* Left Block (System Integrity - Green Theme) */}
          <Card style={[styles.gridCard, styles.greenCard]} shadow="none">
            <View style={styles.gridCardHeader}>
              <View>
                <Text style={styles.gridCardTitle}>System</Text>
                <Text style={styles.gridCardSubtitle}>Integrity</Text>
              </View>
              <View style={styles.statusIndicatorWrapper}>
                <Animated.View style={[styles.pulseDot, pulseStyle, { backgroundColor: deviceTrustScore > 80 ? '#22c55e' : '#f97316' }]} />
                <View style={[styles.pulseDotCore, { backgroundColor: deviceTrustScore > 80 ? '#22c55e' : '#f97316' }]} />
              </View>
            </View>
            <Text style={styles.gridScore}>{deviceTrustScore}</Text>
            <Text style={styles.gridPercent}>+1.80 (+1.32%)</Text>
          </Card>

          {/* Right Block (Active Alerts - Purple Theme) */}
          <Card style={[styles.gridCard, styles.purpleCard]} shadow="none">
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardTitle}>Ecosystem</Text>
              <Text style={styles.gridCardSubtitle}>Threats</Text>
            </View>
            <Text style={styles.gridScore}>{activeCall ? '03' : '02'}</Text>
            <Text style={styles.gridPercent}>-2.85 (0.32%)</Text>
          </Card>
        </Animated.View>

        {/* Behavioural Trust Score Panel */}
        <Animated.View entering={FadeInUp.delay(450).duration(800)}>
          <Card style={styles.behaviourCard} shadow="none">
            <View style={styles.behaviourRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.behaviourLabel}>AI BEHAVIOURAL TRUST</Text>
                <Text style={styles.behaviourDesc}>Typing rhythm, touch pressure & timing profile: <Text style={styles.behaviourBold}>98% Optimal</Text></Text>
              </View>
              <Text style={styles.behaviourScore}>98</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Active Call Protection Warning Banner */}
        {activeCall && (
          <Animated.View entering={FadeInUp.duration(600)}>
            <View style={styles.callWarningBanner}>
              <Text style={styles.callWarningIcon}>📞</Text>
              <View style={styles.callWarningContent}>
                <Text style={styles.callWarningTitle}>LIVE CALL PROTECTION ACTIVE</Text>
                <Text style={styles.callWarningDesc}>You are currently in an active voice call. SentinelPay has enforced maximum verification checks.</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Emergency Freeze Alert Banner */}
        <Animated.View entering={FadeInUp.delay(500).duration(800)}>
          <Pressable onPress={handlePanic} style={styles.freezeBanner}>
            <View style={styles.svgIconWrapper}>
              <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <Path d="m10.29 3.86-8.47 14.14A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <Line x1="12" y1="9" x2="12" y2="13" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="12" y1="17" x2="12.01" y2="17" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              </Svg>
            </View>
            <View style={styles.freezeContent}>
              <Text style={styles.freezeTitle}>PANIC FREEZE SUSPENSION</Text>
              <Text style={styles.freezeDesc}>Tap to instantly halt all payment routers in case of threat.</Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* Recent Payments Section */}
        <Animated.View entering={FadeInDown.delay(600).duration(800)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Payments</Text>
              <Pressable onPress={handleReportScam}>
                <Text style={styles.viewAllText}>Report Scammer</Text>
              </Pressable>
            </View>
            <Card style={styles.listCard} shadow="soft">
              <TransactionItem
                name="Rohit Sharma"
                upiId="rohit45@okaxis"
                amount={1500.0}
                timestamp="Today, 2:14 PM"
                riskLevel="LOW"
                type="SEND"
              />
              <TransactionItem
                name="Electricity Board Support"
                upiId="billpay.board@apco"
                amount={4250.0}
                timestamp="Yesterday, 10:45 AM"
                riskLevel="HIGH"
                type="SEND"
              />
              <TransactionItem
                name="Alice Rivera"
                upiId="alice@paytm"
                amount={750.0}
                timestamp="July 9, 6:18 PM"
                riskLevel="LOW"
                type="RECEIVE"
              />
            </Card>
          </View>
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
    backgroundColor: '#1c1c1e', // Soft charcoal dark background
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: 100, // Increased to account for bottom overlap
    marginTop: theme.spacing.md,
    marginBottom: -20, // Overlap under bottom tab bar to cover subpixel line gaps
    flexGrow: 1, // Stretch to the bottom
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.soft,
  },
  avatarEmoji: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  userText: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: theme.typography.sizes.xs - 1,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.medium,
  },
  userName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  logoutBtnText: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
  },
  balanceContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  balanceLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.medium,
  },
  balanceAmount: {
    fontSize: theme.typography.sizes.xxxl + 8,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
    marginVertical: 4,
  },
  balanceTrend: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.semibold,
  },
  greenText: {
    color: '#10b981',
  },
  pillActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.md,
  },
  guardianBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f6f2',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 10,
  },
  guardianBannerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  guardianBannerDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#22c55e',
  },
  guardianBannerTitle: { fontSize: 12, fontWeight: '800', color: '#1c1c1e' },
  guardianBannerSub: { fontSize: 10, color: '#6b7280', marginTop: 1 },
  guardianBannerBtn: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  guardianBannerBtnText: { fontSize: 11, fontWeight: '700', color: '#bef264' },
  pillBtn: {

    flex: 1,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    ...theme.shadows.soft,
  },
  limeBtn: {
    backgroundColor: '#bef264', // Neon lime-green
  },
  whiteBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  pillBtnTextLime: {
    color: '#1c1c1e',
    fontWeight: theme.typography.weights.heavy,
    fontSize: theme.typography.sizes.sm,
  },
  pillBtnTextWhite: {
    color: '#1c1c1e',
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.sm,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.md,
  },
  gridCard: {
    flex: 1,
    height: 150,
    borderRadius: 24,
    padding: theme.spacing.lg,
    marginHorizontal: 6,
    justifyContent: 'space-between',
  },
  greenCard: {
    backgroundColor: '#dcfce7', // Soft green pastel
  },
  purpleCard: {
    backgroundColor: '#e0e7ff', // Soft purple pastel
  },
  gridCardHeader: {
    justifyContent: 'flex-start',
  },
  gridCardTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.heavy,
    color: '#1c1c1e',
  },
  gridCardSubtitle: {
    fontSize: theme.typography.sizes.xs - 1,
    color: '#4b5563',
    marginTop: 1,
  },
  gridScore: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.heavy,
    color: '#1c1c1e',
  },
  gridPercent: {
    fontSize: 9,
    color: '#4b5563',
    fontWeight: theme.typography.weights.semibold,
  },
  freezeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff', // High-contrast White background
    borderColor: '#fca5a5', // Soft red border
    borderWidth: 1.2,
    borderRadius: 20,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.soft,
  },
  svgIconWrapper: {
    marginRight: theme.spacing.md,
  },
  freezeContent: {
    flex: 1,
  },
  freezeTitle: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    color: '#ef4444',
    letterSpacing: 1,
  },
  freezeDesc: {
    fontSize: theme.typography.sizes.xs - 1,
    color: theme.colors.textMuted, // Reset description text color
    marginTop: 2,
  },
  section: {
    marginVertical: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.sm + 1,
    fontWeight: theme.typography.weights.heavy,
    color: '#ffffff', // White section title
  },
  viewAllText: {
    fontSize: theme.typography.sizes.xs,
    color: '#bef264', // Lime green highlight link
    fontWeight: theme.typography.weights.bold,
  },
  listCard: {
    padding: theme.spacing.md,
    borderRadius: 24,
    backgroundColor: '#f7f6f2', // Soft warm off-white card background
  },
  pillBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillCircleIconLime: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  pillCircleIconWhite: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  pillArrowLime: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  pillArrowWhite: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  balancePressable: {
    width: '100%',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  statusIndicatorWrapper: {
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
    top: 8,
  },
  pulseDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute',
  },
  pulseDotCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
  behaviourCard: {
    backgroundColor: '#2a2a2c',
    borderRadius: 24,
    padding: theme.spacing.lg,
    marginHorizontal: 6,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  behaviourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  behaviourLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#bef264',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  behaviourDesc: {
    fontSize: 11,
    color: '#a1a1aa',
    lineHeight: 15,
  },
  behaviourBold: {
    color: '#ffffff',
    fontWeight: '700',
  },
  behaviourScore: {
    fontSize: 28,
    fontWeight: '800',
    color: '#bef264',
    marginLeft: 12,
  },
  callWarningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef444415',
    borderColor: '#ef4444',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: theme.spacing.md,
    marginHorizontal: 6,
    marginVertical: theme.spacing.sm,
  },
  callWarningIcon: {
    fontSize: 20,
    marginRight: theme.spacing.md,
  },
  callWarningContent: {
    flex: 1,
  },
  callWarningTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: 1.2,
  },
  callWarningDesc: {
    fontSize: 10,
    color: '#fca5a5',
    marginTop: 2,
    lineHeight: 14,
  },
});
