import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAuthStore } from '../../store/authStore';

type DashboardStubNavigationProp = StackNavigationProp<RootStackParamList, 'DashboardStub'>;

interface Props {
  navigation: DashboardStubNavigationProp;
}

export const DashboardStub: React.FC<Props> = ({ navigation }) => {
  const { user, resetAll, deviceTrustScore } = useAuthStore();

  const handleResetDemo = () => {
    resetAll();
    navigation.replace('Splash');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>SentinelPay AI</Text>
        <Text style={styles.subtitle}>Demo Sandbox Dashboard</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.cardHeader}>SIMULATED ACCOUNT</Text>
          <Text style={styles.userName}>{user?.name || 'Demo User'}</Text>
          <Text style={styles.detail}>Email: {user?.email}</Text>
          <Text style={styles.detail}>Phone: {user?.phone}</Text>
          <Text style={styles.detail}>UPI ID: {user?.upiId}</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardHeader}>SECURITY HEALTH</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Device Trust Score:</Text>
            <Text style={[styles.metricValue, { color: theme.colors.riskLow }]}>
              {deviceTrustScore}/100
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Community Integrity:</Text>
            <Text style={[styles.metricValue, { color: theme.colors.riskLow }]}>
              Verified
            </Text>
          </View>
        </Card>

        <View style={styles.demoBanner}>
          <Text style={styles.bannerText}>
            🔒 Phase 1 & 2 Complete: Project Foundation, Core Navigation, Zustand Stores, Axios Layers, and secure authentication setups are operational.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Reset Simulation Flow"
          onPress={handleResetDemo}
          variant="outline"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.xxl - 4,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.semibold,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },
  userName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  detail: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.sm,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  metricLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text,
  },
  metricValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
  },
  demoBanner: {
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    marginTop: theme.spacing.md,
  },
  bannerText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    lineHeight: theme.typography.lineHeights.xs,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 20,
  },
  button: {
    width: '100%',
  },
});
