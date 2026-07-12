import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, RefreshControl, Platform } from 'react-native';
import { theme } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { request } from '../../services/api';
import Animated, { FadeInUp, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

interface Report {
  upiId: string;
  category: string;
  description: string;
  timestamp: string;
}

export const CommunityScreen = ({ navigation }: any) => {
  const isFocused = useIsFocused();
  const [reports, setReports] = useState<Report[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalReports, setTotalReports] = useState(1402);

  const fetchReports = async () => {
    try {
      const response = await request({
        url: '/check-community',
        method: 'GET',
      });
      setReports(response.reports || []);
      setTotalReports(response.totalReports || 1402);
    } catch (err) {
      // Fallback local mock in case backend fails
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <ScrollView
      key={isFocused ? 'active' : 'inactive'}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
      }
    >
      <StatusBar barStyle="dark-content" />

      {/* Light Top Section */}
      <View style={styles.topSection}>
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.header}>
          <Text style={styles.title}>Community Trust</Text>
          <Text style={styles.subtitle}>Crowdsourced threat reports and spam registry</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
          <Card style={styles.statsCard} shadow="soft">
            <Text style={styles.cardHeader}>COMMUNITY METRICS</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statNum}>{totalReports}</Text>
                <Text style={styles.statLabel}>Flags Raised</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={styles.statNum}>{reports.length + 80}</Text>
                <Text style={styles.statLabel}>QR Blocked</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={styles.statNum}>99.6%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </View>

      {/* Dark Rounded Bottom Section */}
      <Animated.View entering={SlideInDown.springify().damping(17).stiffness(50).mass(1.2)} style={styles.blackSection}>
        <Animated.View entering={FadeInUp.delay(300).duration(800)}>
          <Card style={styles.actionCard} shadow="none">
            <Text style={styles.actionTitle}>Spotted a Scam?</Text>
            <Text style={styles.actionDesc}>
              Report suspicious UPI IDs, malicious QR codes, or fraudulent merchant messages immediately to safeguard other simulation profiles.
            </Text>
            <Button
              title="Report Fraud Merchant"
              onPress={() => navigation.navigate('ReportMerchant')}
              variant="primary"
              style={styles.reportBtn}
            />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(450).duration(800)}>
          <Text style={styles.sectionTitle}>Recent Ecosystem Reports</Text>

          {reports.map((report, index) => (
            <Card key={index} style={styles.reportCard} shadow="none">
              <View style={styles.reportHeader}>
                <Text style={styles.reportTarget}>{report.upiId}</Text>
                <Text style={styles.reportTime}>{report.timestamp}</Text>
              </View>
              <Text style={styles.categoryTag}>{report.category}</Text>
              <Text style={styles.reportReason}>{report.description}</Text>
            </Card>
          ))}
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f5', // Warm light pinkish background
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
    paddingBottom: 100, // Increased to account for bottom overlap
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
  statsCard: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.lg,
    backgroundColor: '#ffffff',
    borderRadius: 24,
  },
  cardHeader: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCol: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  actionCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: '#1c1c1e', // Dark Card inside black section
    borderColor: '#2e2e30',
    borderWidth: 1,
    borderRadius: 24,
    padding: theme.spacing.lg,
  },
  actionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: '#ffffff',
    marginBottom: theme.spacing.xs,
  },
  actionDesc: {
    fontSize: theme.typography.sizes.xs,
    color: '#a1a1aa',
    lineHeight: theme.typography.lineHeights.xs,
    marginBottom: theme.spacing.md,
  },
  reportBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.sm + 1,
    fontWeight: theme.typography.weights.bold,
    color: '#ffffff', // White section headers inside dark section
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  reportCard: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: '#f7f6f2', // Soft warm off-white card background
    borderRadius: 20,
    borderWidth: 0,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reportTarget: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  reportTime: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  categoryTag: {
    fontSize: 8,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  reportReason: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.xs,
  },
});
