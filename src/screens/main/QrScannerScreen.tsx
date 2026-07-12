import React, { useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, Pressable, Platform, Alert, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

const C = {
  bg: '#12151E', // Pitch dark overlay context is better for camera viewfinder
  primary: '#6C5CE7',
  primaryLight: '#EDE9FF',
  white: '#FFFFFF',
  card: '#1D212E',
  border: '#2E3547',
  sub: '#8A8FA8',
  danger: '#FF4757',
  accent: '#00C9A7',
};

export const QrScannerScreen = ({ navigation }: any) => {
  const scanLineY = useSharedValue(0);

  useEffect(() => {
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
      // Simulate direct navigation to details using the API check-qr
      navigation.replace('QrDetails', {
        qrData: upiTarget,
        riskScore: upiTarget.includes('board') ? 95 : 12,
        riskLevel: upiTarget.includes('board') ? 'HIGH' : 'LOW',
        explanation: upiTarget.includes('board') 
          ? 'This merchant account has been flagged 24 times for fake electricity bill collections in the last 48 hours.'
          : 'Verified safe recipient.',
        recipientName: upiTarget.includes('board') ? 'Electricity Board Support' : 'Rohit Sharma',
      });
    } catch (err: any) {
      Alert.alert('Scan Error', 'Could not parse the scanned UPI data.');
    }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </Pressable>
        <Text style={s.title}>Scan QR Code</Text>
      </View>

      {/* Viewfinder */}
      <View style={s.viewfinderContainer}>
        <View style={s.viewfinder}>
          <View style={[s.corner, s.topLeft]} />
          <View style={[s.corner, s.topRight]} />
          <View style={[s.corner, s.bottomLeft]} />
          <View style={[s.corner, s.bottomRight]} />
          <Animated.View style={[s.scanLine, animatedLineStyle]} />
        </View>
        <Text style={s.infoText}>Position the simulated QR code inside the frame</Text>
      </View>

      {/* Simulator Shortcut Panel */}
      <View style={s.simulatorPanel}>
        <Text style={s.panelTitle}>SANDBOX SIMULATOR CONTROLS</Text>
        
        <TouchableOpacity 
          style={[s.btn, { backgroundColor: C.primary }]} 
          onPress={() => handleScanSimulate('rohit45@okaxis')}
          activeOpacity={0.85}
        >
          <Text style={s.btnText}>Scan Safe QR (Rohit Sharma)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[s.btn, { backgroundColor: C.danger }]} 
          onPress={() => handleScanSimulate('billpay.board@apco')}
          activeOpacity={0.85}
        >
          <Text style={s.btnText}>Scan Scam QR (Electricity Board)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  backArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: C.white,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: C.white,
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
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: C.primary,
  },
  topLeft: { top: -1, left: -1, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: -1, right: -1, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: -1, left: -1, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: -1, right: -1, borderBottomWidth: 4, borderRightWidth: 4 },
  scanLine: {
    height: 3,
    backgroundColor: C.primary,
    width: '100%',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  infoText: {
    color: C.sub,
    fontSize: 12,
    marginTop: 24,
    textAlign: 'center',
  },
  simulatorPanel: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 18,
    width: '100%',
    borderWidth: 1.5,
    borderColor: C.border,
    gap: 10,
  },
  panelTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: C.white,
    letterSpacing: 1.5,
    marginBottom: 6,
    textAlign: 'center',
    opacity: 0.6,
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
