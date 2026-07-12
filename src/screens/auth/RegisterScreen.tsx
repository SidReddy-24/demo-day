import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Pressable, KeyboardAvoidingView,
  Platform, ScrollView, Alert, TextInput, TouchableOpacity, StatusBar,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { request } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const C = {
  bg: '#F4F6FA',
  primary: '#6C5CE7',
  primaryLight: '#EDE9FF',
  text: '#1A1D2E',
  sub: '#8A8FA8',
  white: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E8EBF4',
  danger: '#FF4757',
  accent: '#00C9A7',
  accentLight: '#E0FAF5',
};

const FieldInput = ({
  label, placeholder, value, onChange, secureTextEntry = false, keyboardType = 'default', error, autoCapitalize = 'sentences',
}: any) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fi.wrap}>
      <Text style={fi.label}>{label}</Text>
      <TextInput
        style={[fi.input, focused && fi.inputFocused, error && fi.inputError]}
        placeholder={placeholder}
        placeholderTextColor={C.sub}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize as any}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error ? <Text style={fi.error}>{error}</Text> : null}
    </View>
  );
};

const fi = StyleSheet.create({
  wrap: { marginBottom: 18 },
  label: { fontSize: 12, fontWeight: '700', color: C.sub, marginBottom: 8, letterSpacing: 0.3 },
  input: {
    height: 52, borderRadius: 14, paddingHorizontal: 16, fontSize: 15,
    backgroundColor: C.card, color: C.text, borderWidth: 1.5, borderColor: C.border,
  },
  inputFocused: { borderColor: C.primary, backgroundColor: '#F9F8FF' },
  inputError: { borderColor: C.danger },
  error: { fontSize: 11, color: C.danger, marginTop: 4 },
});

export const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const loginStore = useAuthStore(s => s.login);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name) e.name = 'Full name is required';
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!phone) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(phone.replace(/\s+/g, ''))) e.phone = 'Enter a valid 10-digit number';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await request({ url: '/register', method: 'POST', data: { name, email, phone, password } });
      if (res.status === 'success') {
        loginStore(res.user, res.token);
        navigation.replace('Permissions');
      } else {
        Alert.alert('Registration Failed', 'Could not complete registration.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)} style={s.header}>
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </Pressable>
          <View style={s.headerLogoRow}>
            <View style={s.logoMark}><Text style={{ fontSize: 16 }}>⚡</Text></View>
            <Text style={s.logoText}>SentinelPay</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={s.titleBlock}>
          <Text style={s.title}>Create Account</Text>
          <Text style={s.subtitle}>Set up your secure UPI simulation profile</Text>
        </Animated.View>

        {/* Feature pills */}
        <Animated.View entering={FadeInDown.delay(140).duration(500)} style={s.featurePills}>
          {['🧠 AI Fraud Detection', '🔒 Zero Trust', '👥 Community Shield'].map(f => (
            <View key={f} style={s.pill}>
              <Text style={s.pillText}>{f}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Form */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={s.formCard}>
          <FieldInput
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(t: string) => { setName(t); if (errors.name) setErrors({ ...errors, name: '' }); }}
            autoCapitalize="words"
            error={errors.name}
          />
          <FieldInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={(t: string) => { setEmail(t); if (errors.email) setErrors({ ...errors, email: '' }); }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <FieldInput
            label="Mobile Number"
            placeholder="9876543210"
            value={phone}
            onChange={(t: string) => { setPhone(t); if (errors.phone) setErrors({ ...errors, phone: '' }); }}
            keyboardType="phone-pad"
            error={errors.phone}
          />
          <FieldInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(t: string) => { setPassword(t); if (errors.password) setErrors({ ...errors, password: '' }); }}
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />

          <TouchableOpacity style={[s.submitBtn, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
            <Text style={s.submitText}>{loading ? 'Creating account…' : 'Create Account'}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.delay(260).duration(500)} style={s.footer}>
          <Text style={s.footerText}>Already registered?{' '}</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={s.link}>Log In</Text>
          </Pressable>
        </Animated.View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, paddingBottom: 60 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: Platform.OS === 'ios' ? 56 : 44, marginBottom: 28 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  backArrow: { fontSize: 18, fontWeight: '700', color: C.text },
  headerLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: { width: 32, height: 32, borderRadius: 10, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 16, fontWeight: '900', color: C.text },

  titleBlock: { marginBottom: 20 },
  title: { fontSize: 30, fontWeight: '900', color: C.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: C.sub },

  featurePills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  pill: { backgroundColor: C.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pillText: { fontSize: 11, fontWeight: '700', color: C.primary },

  formCard: { backgroundColor: C.card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: C.border, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4 },

  submitBtn: { width: '100%', height: 54, borderRadius: 27, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', marginTop: 8, shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 6 },
  submitText: { color: C.white, fontSize: 15, fontWeight: '800' },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14, color: C.sub },
  link: { fontSize: 14, fontWeight: '800', color: C.primary },
});
