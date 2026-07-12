import React, { useState } from 'react';
import {
  StyleSheet, View, Text, StatusBar, Pressable, FlatList,
  KeyboardAvoidingView, Platform, TextInput, TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const C = {
  bg: '#F4F6FA',
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
  white: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E8EBF4',
};

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface Contact {
  id: string;
  name: string;
  upiId: string;
  riskLevel: RiskLevel;
  emoji: string;
  lastTxn?: string;
}

const RECENT_CONTACTS: Contact[] = [
  { id: '1', name: 'Rohit Sharma', upiId: 'rohit45@okaxis', riskLevel: 'LOW', emoji: '🏏', lastTxn: '₹1,500 · Today' },
  { id: '2', name: 'Electricity Board', upiId: 'billpay.board@apco', riskLevel: 'HIGH', emoji: '⚡', lastTxn: '₹4,250 · Yesterday' },
  { id: '3', name: 'Alice Rivera', upiId: 'alice@paytm', riskLevel: 'LOW', emoji: '👩‍💻', lastTxn: '₹750 · July 9' },
  { id: '4', name: 'Unknown Merchant', upiId: 'claims.rewards@secure', riskLevel: 'HIGH', emoji: '🎁', lastTxn: 'First time' },
];

const riskMap: Record<RiskLevel, [string, string]> = {
  LOW: [C.accent, C.accentLight],
  MEDIUM: [C.warn, C.warnLight],
  HIGH: [C.danger, C.dangerLight],
};

const RiskPill = ({ level }: { level: RiskLevel }) => {
  const [fg, bg] = riskMap[level];
  return (
    <View style={[rp.pill, { backgroundColor: bg }]}>
      <View style={[rp.dot, { backgroundColor: fg }]} />
      <Text style={[rp.text, { color: fg }]}>{level}</Text>
    </View>
  );
};
const rp = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 10, fontWeight: '800' },
});

export const SendMoneyScreen = ({ navigation }: any) => {
  const [upiInput, setUpiInput] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const handleVerify = () => {
    setError('');
    const clean = upiInput.trim().toLowerCase();
    if (!clean) { setError('UPI ID cannot be empty'); return; }
    if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(clean)) {
      setError('Enter a valid UPI ID (e.g. name@bank)');
      return;
    }
    let risk: RiskLevel = 'LOW';
    if (clean.includes('scam') || clean.includes('reward') || clean.includes('support')) risk = 'HIGH';
    else if (clean.includes('unknown') || clean.length > 25) risk = 'MEDIUM';

    navigation.navigate('AmountEntry', {
      recipientName: clean.split('@')[0].toUpperCase(),
      recipientUpi: clean,
      recipientRisk: risk,
    });
  };

  const handleSelect = (c: Contact) => {
    navigation.navigate('AmountEntry', {
      recipientName: c.name,
      recipientUpi: c.upiId,
      recipientRisk: c.riskLevel,
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(40).duration(400)} style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Send Money</Text>
          <Text style={s.subtitle}>Enter a UPI ID or pick a contact</Text>
        </View>
      </Animated.View>

      {/* UPI Input Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={s.inputCard}>
        <Text style={s.inputLabel}>UPI ID / VPA</Text>
        <View style={[s.inputRow, focused && s.inputRowFocused, error ? s.inputRowError : null]}>
          <Text style={s.atSign}>@</Text>
          <TextInput
            style={s.textInput}
            placeholder="username@bankname"
            placeholderTextColor={C.sub}
            value={upiInput}
            onChangeText={t => { setUpiInput(t); if (error) setError(''); }}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <TouchableOpacity style={s.verifyBtn} onPress={handleVerify} activeOpacity={0.85}>
            <Text style={s.verifyText}>Verify →</Text>
          </TouchableOpacity>
        </View>
        {error ? <Text style={s.errorText}>{error}</Text> : null}

        {/* Quick UPI suggestions */}
        <View style={s.suggestions}>
          {['@okaxis', '@paytm', '@upi', '@ybl'].map(s2 => (
            <TouchableOpacity
              key={s2}
              style={s.suggestionChip}
              onPress={() => setUpiInput(t => t.includes('@') ? t : t + s2)}
            >
              <Text style={s.suggestionText}>{s2}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Recent contacts list */}
      <Animated.View entering={FadeInDown.delay(160).duration(500)} style={{ flex: 1 }}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Recent Contacts</Text>
          <View style={s.fraudBadge}>
            <Text style={s.fraudText}>🛡 AI Verified</Text>
          </View>
        </View>
        <FlatList
          data={RECENT_CONTACTS}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.contactRow} onPress={() => handleSelect(item)} activeOpacity={0.8}>
              <View style={[s.avatar, { backgroundColor: item.riskLevel === 'HIGH' ? C.dangerLight : C.primaryLight }]}>
                <Text style={s.avatarEmoji}>{item.emoji}</Text>
              </View>
              <View style={s.contactInfo}>
                <Text style={s.contactName}>{item.name}</Text>
                <Text style={s.contactUpi}>{item.upiId}</Text>
                {item.lastTxn && <Text style={s.contactLast}>{item.lastTxn}</Text>}
              </View>
              <View style={s.contactRight}>
                <RiskPill level={item.riskLevel} />
                <Text style={s.arrowIcon}>›</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={s.separator} />}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'ios' ? 56 : 44 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 24, marginBottom: 22 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  backArrow: { fontSize: 18, fontWeight: '700', color: C.text },
  title: { fontSize: 22, fontWeight: '900', color: C.text },
  subtitle: { fontSize: 12, color: C.sub, marginTop: 2 },

  inputCard: { backgroundColor: C.card, borderRadius: 20, padding: 20, marginHorizontal: 20, marginBottom: 22, borderWidth: 1, borderColor: C.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: C.sub, marginBottom: 10, letterSpacing: 0.3 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 14, paddingHorizontal: 14, height: 52, borderWidth: 1.5, borderColor: C.border },
  inputRowFocused: { borderColor: C.primary, backgroundColor: '#F9F8FF' },
  inputRowError: { borderColor: C.danger },
  atSign: { fontSize: 18, color: C.primary, fontWeight: '800', marginRight: 6 },
  textInput: { flex: 1, fontSize: 15, color: C.text },
  verifyBtn: { backgroundColor: C.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  verifyText: { color: C.white, fontSize: 12, fontWeight: '800' },
  errorText: { fontSize: 11, color: C.danger, marginTop: 8 },
  suggestions: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  suggestionChip: { backgroundColor: C.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  suggestionText: { fontSize: 11, fontWeight: '700', color: C.primary },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: C.text },
  fraudBadge: { backgroundColor: C.accentLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  fraudText: { fontSize: 10, fontWeight: '700', color: C.accent },

  contactRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: C.card, gap: 14 },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  avatarEmoji: { fontSize: 22 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 14, fontWeight: '700', color: C.text },
  contactUpi: { fontSize: 11, color: C.sub, marginTop: 2 },
  contactLast: { fontSize: 10, color: C.sub, marginTop: 2 },
  contactRight: { alignItems: 'flex-end', gap: 6 },
  arrowIcon: { fontSize: 20, color: C.sub, fontWeight: '300' },
  separator: { height: 1, backgroundColor: C.border, marginHorizontal: 20 },
});
