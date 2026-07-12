import React from 'react';
import { StyleSheet, View, Text, ScrollView, StatusBar, Pressable, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { theme } from '../../theme';

interface TimelineEvent {
  time: string;
  event: string;
  type: 'CALL' | 'SMS' | 'APP' | 'PAYMENT' | 'SECURITY' | 'BIOMETRIC';
}

export const ScamTimelineScreen = ({ route, navigation }: any) => {
  const { timeline = [], scamType = 'Social Engineering' } = route.params || {};

  const getIcon = (type: string) => {
    switch (type) {
      case 'CALL':
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </Svg>
        );
      case 'SMS':
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </Svg>
        );
      case 'APP':
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <Path d="M9 2h6v4H9z" />
          </Svg>
        );
      case 'SECURITY':
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </Svg>
        );
      case 'PAYMENT':
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </Svg>
        );
      default:
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
          </Svg>
        );
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'CALL': return '#ef4444';
      case 'SMS': return '#bef264';
      case 'APP': return '#3b82f6';
      case 'SECURITY': return '#a855f7';
      case 'PAYMENT': return '#eab308';
      default: return '#9ca3af';
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
        <View>
          <Text style={styles.title}>Scam Timeline</Text>
          <Text style={styles.subtitle}>AI Forensic Journey Reconstruction</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={styles.introCard}>
          <Text style={styles.scamLabel}>DETECTED PATTERN</Text>
          <Text style={styles.scamTitle}>{scamType}</Text>
          <Text style={styles.scamDesc}>
            Our Behaviour and Context models compiled this chronological map of triggers preceding this transaction.
          </Text>
        </View>

        {/* Timeline Stepper */}
        <View style={styles.timelineContainer}>
          {timeline.map((item: TimelineEvent, index: number) => {
            const isLast = index === timeline.length - 1;
            const markerColor = getMarkerColor(item.type);

            return (
              <View key={index} style={styles.stepRow}>
                {/* Visual line and indicator column */}
                <View style={styles.leftCol}>
                  <View style={[styles.marker, { borderColor: markerColor }]}>
                    <View style={[styles.markerInner, { backgroundColor: markerColor }]} />
                  </View>
                  {!isLast && <View style={[styles.connectorLine, { backgroundColor: markerColor }]} />}
                </View>

                {/* Event details card */}
                <View style={styles.rightCol}>
                  <View style={styles.eventCard}>
                    <View style={styles.eventHeader}>
                      <View style={styles.iconContainer}>{getIcon(item.type)}</View>
                      <Text style={[styles.eventTime, { color: markerColor }]}>{item.time}</Text>
                    </View>
                    <Text style={styles.eventText}>{item.event}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer action */}
      <View style={styles.footer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.dismissBtn}>
          <Text style={styles.dismissText}>Back to Analysis</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e', // Dark theme consistent with bottom sheets
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2e2e30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  backArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: '#2c2c2e',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  scamLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  scamTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  scamDesc: {
    fontSize: 12,
    color: '#d1d5db',
    lineHeight: 18,
  },
  timelineContainer: {
    paddingLeft: 10,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 90,
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 16,
    width: 24,
  },
  marker: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1c1e',
    zIndex: 1,
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectorLine: {
    width: 2.5,
    flex: 1,
    opacity: 0.5,
    marginVertical: 4,
  },
  rightCol: {
    flex: 1,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: '#2a2a2c',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#1c1c1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTime: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  eventText: {
    fontSize: 12,
    color: '#e5e7eb',
    lineHeight: 18,
  },
  footer: {
    paddingVertical: 20,
    backgroundColor: '#1c1c1e',
  },
  dismissBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1c1c1e',
  },
});
