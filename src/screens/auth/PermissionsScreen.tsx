import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, StatusBar, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';

type PermissionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Permissions'>;

interface Props {
  navigation: PermissionsScreenNavigationProp;
}

export const PermissionsScreen: React.FC<Props> = ({ navigation }) => {
  const { permissions, setPermissions } = useAuthStore();
  const [sms, setSms] = useState(permissions.sms);
  const [location, setLocation] = useState(permissions.location);
  const [notifications, setNotifications] = useState(permissions.notifications);

  const handleGrantAll = () => {
    setSms(true);
    setLocation(true);
    setNotifications(true);
    setPermissions(true, true, true);
    setTimeout(() => {
      navigation.navigate('Accessibility');
    }, 300);
  };

  const handleContinue = () => {
    setPermissions(sms, location, notifications);
    navigation.navigate('Accessibility');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>STEP 1 OF 4</Text>
        </View>
        <Text style={styles.title}>Security Permissions</Text>
        <Text style={styles.subtitle}>
          SentinelPay AI requires permissions to monitor and prevent UPI fraud in real time.
        </Text>
      </View>

      <View style={styles.list}>
        {/* SMS Card */}
        <View style={styles.card}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardIcon}>💬</Text>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>SMS Monitoring</Text>
              <Text style={styles.cardDescription}>
                Inspects OTPs and payment requests to block SMS spoofing and social engineering scams.
              </Text>
            </View>
          </View>
          <Switch
            value={sms}
            onValueChange={setSms}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardIcon}>📍</Text>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Real-time Location</Text>
              <Text style={styles.cardDescription}>
                Verifies your physical location during transaction times to prevent remote takeover attempts.
              </Text>
            </View>
          </View>
          <Switch
            value={location}
            onValueChange={setLocation}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Notifications Card */}
        <View style={styles.card}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardIcon}>🔔</Text>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Critical Alerts</Text>
              <Text style={styles.cardDescription}>
                Issues immediate push notifications when our AI engine identifies high-risk UPI accounts.
              </Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Grant All Permissions"
          onPress={handleGrantAll}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="Continue with Selected"
          onPress={handleContinue}
          variant="secondary"
          style={[styles.button, styles.continueBtn]}
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
    justifyContent: 'space-between',
    minHeight: '90%',
  },
  header: {
    marginBottom: theme.spacing.xxl,
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
  list: {
    flex: 1,
    marginVertical: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  cardDescription: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    lineHeight: theme.typography.lineHeights.xs,
    marginTop: 4,
  },
  footer: {
    marginTop: theme.spacing.xl,
  },
  button: {
    width: '100%',
  },
  continueBtn: {
    marginTop: theme.spacing.md,
  },
});
