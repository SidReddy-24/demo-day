import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { request } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginStore = useAuthStore((state) => state.login);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name) tempErrors.name = 'Full name is required';
    
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Please enter a valid email';
    
    if (!phone) tempErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(phone.replace(/\s+/g, ''))) tempErrors.phone = 'Please enter a valid 10-digit number';

    if (!password) tempErrors.password = 'Password is required';
    else if (password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await request({
        url: '/register',
        method: 'POST',
        data: { name, email, phone, password },
      });

      if (response.status === 'success') {
        loginStore(response.user, response.token);
        // Navigate to the next step of the onboarding slice: Permissions request
        navigation.replace('Permissions');
      } else {
        Alert.alert('Registration Failed', 'Could not complete registration. Try again.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.title}>Create Profile</Text>
          <Text style={styles.subtitle}>Register to simulate secure UPI threat monitoring</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
            autoCapitalize="words"
          />

          <Input
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Mobile Number"
            placeholder="9876543210"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) setErrors({ ...errors, phone: '' });
            }}
            error={errors.phone}
            keyboardType="phone-pad"
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            title="Create Simulation Profile"
            onPress={handleRegister}
            loading={loading}
            variant="primary"
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already registered? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Log In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 40,
  },
  header: {
    marginTop: 60,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  backArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
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
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  submitBtn: {
    marginTop: theme.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xxl,
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
  },
  link: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
  },
});
