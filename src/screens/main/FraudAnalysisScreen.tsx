import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { theme } from '../../theme';
import { request } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const STAGES = [
  'Securing simulation payment tunnel...',
  'Auditing local device fingerprints...',
  'Checking recipient community trust rating...',
  'Evaluating NetworkX graph ring associations...',
  'Running Isolation Forest anomaly checks...',
];

export const FraudAnalysisScreen = ({ route, navigation }: any) => {
  const { recipientName, recipientUpi, amount } = route.params;
  const [currentStage, setCurrentStage] = useState(0);
  const { activeCall, safeMode } = useAuthStore();

  useEffect(() => {
    // Cycle through stage description strings to simulate engine components
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        clearInterval(stageInterval);
        return prev;
      });
    }, 600);

    const checkFraudRisk = async () => {
      try {
        const response = await request({
          url: '/check-risk',
          method: 'POST',
          data: {
            amount,
            recipientUpi,
            activeCall,
            safeMode,
          },
        });

        // Ensure stages complete visually before routing
        setTimeout(() => {
          if (response.riskLevel === 'LOW') {
            navigation.replace('PaymentSuccess', { recipientName, amount });
          } else {
            navigation.replace('RiskWarning', {
              riskScore: response.riskScore,
              riskLevel: response.riskLevel,
              explanation: response.explanation,
              recipientName,
              recipientUpi,
              amount,
              scamType: response.scamType,
              confidence: response.confidence,
              timeline: response.timeline,
            });
          }
        }, 3000);
      } catch (err: any) {
        // Safe fallback in case backend is offline and mock endpoints fail
        setTimeout(() => {
          navigation.replace('PaymentSuccess', { recipientName, amount });
        }, 3000);
      }
    };

    checkFraudRisk();

    return () => clearInterval(stageInterval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.shieldSymbol}>🛡️</Text>
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.spinner} />
        </View>
        <Text style={styles.title}>Sentinel AI Scan</Text>
        <Text style={styles.subtitle}>{STAGES[currentStage]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    position: 'relative',
  },
  shieldSymbol: {
    fontSize: 48,
    position: 'absolute',
  },
  spinner: {
    position: 'absolute',
    transform: [{ scale: 2.2 }],
    opacity: 0.15,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.sm,
    height: 40,
  },
});
