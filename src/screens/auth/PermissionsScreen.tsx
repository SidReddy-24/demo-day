import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, StatusBar, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

type PermissionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Permissions'>;

interface Props {
  navigation: PermissionsScreenNavigationProp;
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
};

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
    <ScrollView style={s.container} contentContainerStyle={s.contentContainer} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      
      <Animated.View entering={FadeInDown.delay(50).duration(500)} style={s.header}>
        <View style={s.badge}>
          <Text style={s.badgeText}>STEP 1 OF 4</Text>
        </View>
        <Text style={s.title}>Security Permissions</Text>
        <Text style={s.subtitle}>
          SentinelPay AI requires permissions to monitor and prevent UPI fraud in real time.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={s.list}>
        {/* SMS Card */}
        <View style={s.card}>
          <View style={s.cardInfo}>
            <View style={[s.iconBox, { backgroundColor: '#E8FDFA' }]}>
              <Text style={s.cardIcon}>💬</Text>
            </View>
            <View style={s.cardTextWrapper}>
              <Text style={s.cardTitle}>SMS Monitoring</Text>
              <Text style={s.cardDescription}>
                Inspects OTPs and payment requests to block SMS spoofing and social engineering scams.
              </Text>
            </View>
          </View>
          <Switch
            value={sms}
            onValueChange={setSms}
            trackColor={{ false: C.border, true: C.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Location Card */}
        <View style={s.card}>
          <View style={s.cardInfo}>
            <View style={[s.iconBox, { backgroundColor: '#EDE9FF' }]}>
              <Text style={s.cardIcon}>📍</Text>
            </View>
            <View style={s.cardTextWrapper}>
              <Text style={s.cardTitle}>Real-time Location</Text>
              <Text style={s.cardDescription}>
                Verifies your physical location during transaction times to prevent remote takeover attempts.
              </Text>
            </View>
          </View>
          <Switch
            value={location}
            onValueChange={setLocation}
            trackColor={{ false: C.border, true: C.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Notifications Card */}
        <View style={s.card}>
          <View style={s.cardInfo}>
            <View style={[s.iconBox, { backgroundColor: '#FFF3E0' }]}>
              <Text style={s.cardIcon}>🔔</Text>
            </View>
            <View style={s.cardTextWrapper}>
              <Text style={s.cardTitle}>Critical Alerts</Text>
              <Text style={s.cardDescription}>
                Issues immediate push notifications when our AI engine identifies high-risk UPI accounts.
              </Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: C.border, true: C.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(500)} style={s.footer}>
        <TouchableOpacity style={s.primaryBtn} onPress={handleGrantAll} activeOpacity={0.85}>
          <Text style={s.primaryBtnText}>Grant All Permissions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondaryBtn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={s.secondaryBtnText}>Continue with Selected</Text>
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
    justifyContent: 'space-between',
    minHeight: '100%',
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
  list: {
    flex: 1,
    marginVertical: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.text,
  },
  cardDescription: {
    fontSize: 11,
    color: C.sub,
    lineHeight: 15,
    marginTop: 4,
  },
  footer: {
    marginTop: 20,
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
