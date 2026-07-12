import React, { useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, Pressable, Platform, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { request } from '../../services/api';

export const QrScannerScreen = ({ navigation }: any) => {
  const scanLineY = useSharedValue(0);

  useEffect(() => {
    // Animate scan bar line up and down inside the viewfinder
    scanLineY.value = withRepeat(
      withSequence(
        withTiming(180, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLineY.value }],
    };
  });

  const handleScanSimulate = async (upiTarget: string) => {
    try {
      const response = await request({
        url: '/check-qr',
        method: 'POST',
        data: { qrData: upiTarget },
      });

      navigation.replace('QrDetails', {
        qrData: upiTarget,
        riskScore: response.riskScore,
        riskLevel: response.riskLevel,
        explanation: response.explanation,
        recipientName: response.recipientName,
      });
    } catch (err: any) {
      Alert.alert('Scan Error', 'Could not parse the scanned UPI data.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Scan QR Code</Text>
      </View>

      {/* Viewfinder */}
      <View style={styles.viewfinderContainer}>
        <View style={styles.viewfinder}>
          {/* Top-left corner */}
          <View style={[styles.corner, styles.topLeft]} />
          {/* Top-right corner */}
          <View style={[styles.corner, styles.topRight]} />
          {/* Bottom-left corner */}
          <View style={[styles.corner, styles.bottomLeft]} />
          {/* Bottom-right corner */}
          <View style={[styles.corner, styles.bottomRight]} />
          
          {/* Animated scanning bar */}
          <Animated.View style={[styles.scanLine, animatedLineStyle]} />
        </View>
        <Text style={styles.infoText}>Position the simulated QR code inside the frame</Text>
      </View>

      {/* Simulator Shortcut Panel */}
      <View style={styles.simulatorPanel}>
        <Text style={styles.panelTitle}>SANDBOX SIMULATOR CONTROLS</Text>
        <Button
          title="Scan Safe QR (Rohit Sharma)"
          onPress={() => handleScanSimulate('rohit45@okaxis')}
          variant="secondary"
          style={styles.simulateBtn}
        />
        <Button
          title="Scan Scam QR (Electricity Board)"
          onPress={() => handleScanSimulate('billpay.board@apco')}
          variant="danger"
          style={styles.simulateBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Dark screen for scanner environment
    paddingHorizontal: theme.spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    justifyContent: 'space-between',
    paddingBottom: 45,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  backArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    fontSize: theme.typography.sizes.xl - 4,
    fontWeight: theme.typography.weights.heavy,
    color: '#FFFFFF',
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinder: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: theme.colors.primary,
  },
  topLeft: {
    top: -1,
    left: -1,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: -1,
    right: -1,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanLine: {
    height: 3,
    backgroundColor: theme.colors.primary,
    width: '100%',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  infoText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: theme.typography.sizes.xs,
    marginTop: theme.spacing.xl,
    textAlign: 'center',
  },
  simulatorPanel: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  panelTitle: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    opacity: 0.6,
  },
  simulateBtn: {
    marginVertical: 4,
  },
});
