import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { request } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginStore = useAuthStore((state) => state.login);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Please enter a valid email';
    
    if (!password) tempErrors.password = 'Password is required';
    else if (password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await request({
        url: '/login',
        method: 'POST',
        data: { email, password },
      });

      if (response.status === 'success') {
        loginStore(response.user, response.token);
        navigation.replace('Permissions');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials, please try again.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to access your secure UPI dashboard</Text>
        </View>

        <Card style={styles.formCard} shadow="soft">
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
            label="Security Password"
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
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            style={styles.submitBtn}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have a profile? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Create Simulation Profile</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f5', // Light pinkish ivory background
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 40,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 70 : 60,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
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
  formCard: {
    padding: theme.spacing.xl,
    borderRadius: 24, // Highly rounded
    backgroundColor: '#ffffff',
  },
  submitBtn: {
    marginTop: theme.spacing.lg,
    height: 54,
    borderRadius: 27, // Capsule button
    justifyContent: 'center',
    alignItems: 'center',
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
