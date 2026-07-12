import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, ActivityIndicator, Pressable, Platform } from 'react-native';
import Svg, { Circle, Line, Rect, Text as SvgText } from 'react-native-svg';
import { theme } from '../../theme';
import { Card } from '../../components/Card';
import { request } from '../../services/api';
import Animated, { FadeInUp, FadeInDown, SlideInDown, useSharedValue, withRepeat, withTiming, useAnimatedProps, Easing } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

interface GraphNode {
  id: string;
  label: string;
  status: 'SAFE' | 'WARNING' | 'DANGER';
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Custom sub-component to animate Svg Circle radius dynamically (breathing/pulsing effect)
const PulsingNode = ({ node, isSelected, onPress, pulseVal, getNodeColor, packetProgress }: any) => {
  const animatedProps = useAnimatedProps(() => {
    const baseRadius = isSelected ? 18 : 14;
    
    // Dynamic color shifting: left mid node turns red during active transmission (Phase 2: progress >= 0.5)
    let fillColor = getNodeColor(node.status);
    const isMidLeft = (node.y >= 100 && node.y < 200) && node.x < 170;
    
    if (isMidLeft && packetProgress.value >= 0.5) {
      fillColor = '#ef4444'; // Red alert warning
    }

    return {
      r: baseRadius * pulseVal.value,
      fill: fillColor,
    };
  });

  return (
    <AnimatedCircle
      cx={node.x}
      cy={node.y}
      animatedProps={animatedProps}
      stroke={isSelected ? "#ffffff" : "#1c1c1e"}
      strokeWidth={isSelected ? 3 : 2}
      {...(Platform.OS === 'web'
        ? { onClick: onPress }
        : { onPress }
      )}
    />
  );
};

// Custom sub-component to draw a traveling data packet along graph edges with staged wave transitions
const TravelingPacket = ({ edge, nodes, progress }: any) => {
  const source = nodes.find((n: any) => n.id === edge.from);
  const target = nodes.find((n: any) => n.id === edge.to);
  if (!source || !target) return null;

  const isPhase1 = source.y < 100;

  const animatedProps = useAnimatedProps(() => {
    let t = 0;
    let opacity = 0;
    const p = progress.value;

    if (isPhase1) {
      // Phase 1: Top to Mid (0.0 -> 0.5)
      if (p < 0.5) {
        t = p * 2;
        opacity = 1;
      } else {
        t = 1;
        opacity = 0; // Hide once reached mid
      }
    } else {
      // Phase 2: Mid to Bottom (0.5 -> 1.0)
      if (p >= 0.5) {
        t = (p - 0.5) * 2;
        opacity = 1;
      } else {
        t = 0;
        opacity = 0; // Hide before starting mid-to-bottom
      }
    }

    const x = source.x + t * (target.x - source.x);
    const y = source.y + t * (target.y - source.y);

    return {
      cx: x,
      cy: y,
      opacity: opacity,
    };
  });

  // Left path packets turn red during Phase 2 to indicate active threat transfer
  const isLeftPath = source.x < 170 || target.x < 170;
  const packetColor = (isLeftPath && !isPhase1) ? '#ef4444' : '#bef264';

  return (
    <AnimatedCircle
      animatedProps={animatedProps}
      r="4.5"
      fill={packetColor}
    />
  );
};

export const AnalyticsScreen = () => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [feedIndex, setFeedIndex] = useState(0);

  const intelFeeds = [
    'AI Engine sweeping UPI routers for cashier mule nodes...',
    'Ecosystem Alert: claims.rewards@secure flagged as Lottery Fraud.',
    'Graph Analysis: detected 12 hops Cash-out path from Terminal.',
    'System status: 99.6% Threat scoring model confidence established.',
    'API Intercept: Verified TLS signature for routing ledger...',
  ];

  // Breathing pulse shared value (more prominent breathing scale)
  const pulseVal = useSharedValue(1);
  // Packet traveling progress shared value
  const packetProgress = useSharedValue(0);

  useEffect(() => {
    // Pulse animation (1.0 to 1.20 breathing scale)
    pulseVal.value = withRepeat(withTiming(1.20, { duration: 1200 }), -1, true);
    
    // Packet traveling animation looping from 0 to 1 (slower, smoother 3.2 seconds duration)
    packetProgress.value = withRepeat(
      withTiming(1, { duration: 3200, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeedIndex((prev) => (prev + 1) % intelFeeds.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const fetchGraph = async () => {
    try {
      const response = await request({
        url: '/check-graph',
        method: 'GET',
      });
      if (response.nodes && response.edges) {
        setNodes(response.nodes);
        setEdges(response.edges);
      }
    } catch (err) {
      // Local fallback graph setup matching mock nodes
      setNodes([
        { id: 'user', label: 'My Terminal', status: 'SAFE', x: 75, y: 220 },
        { id: 'inter1', label: 'UPI Router A', status: 'SAFE', x: 175, y: 120 },
        { id: 'inter2', label: 'Merchant Agg', status: 'WARNING', x: 175, y: 320 },
        { id: 'mule', label: 'Mule Node X', status: 'DANGER', x: 275, y: 220 },
      ]);
      setEdges([
        { from: 'user', to: 'inter1' },
        { from: 'user', to: 'inter2' },
        { from: 'inter1', to: 'mule' },
        { from: 'inter2', to: 'mule' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'SAFE':
        return theme.colors.riskLow;
      case 'WARNING':
        return theme.colors.riskMedium;
      case 'DANGER':
        return theme.colors.riskHigh;
      default:
        return theme.colors.textMuted;
    }
  };

  return (
    <ScrollView key={isFocused ? 'active' : 'inactive'} style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />

      {/* Light Upper Section */}
      <View style={styles.topSection}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.header}>
          <Text style={styles.title}>Fraud Analytics</Text>
          <Text style={styles.subtitle}>AI Risk scoring profiles and scam ring network models</Text>
        </Animated.View>

        {/* Threat Distribution Chart (Custom SVG) */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
          <Card style={styles.chartCard} shadow="soft">
            <Text style={styles.cardLabel}>WEEKLY TRANSACTIONS BY THREAT LEVEL</Text>
            <View style={styles.chartContainer}>
              <Svg height="140" width="100%">
                {/* Grid Lines */}
                <Line x1="0" y1="20" x2="300" y2="20" stroke="#ECEFF1" strokeWidth="1" />
                <Line x1="0" y1="60" x2="300" y2="60" stroke="#ECEFF1" strokeWidth="1" />
                <Line x1="0" y1="100" x2="300" y2="100" stroke="#ECEFF1" strokeWidth="1" />
                <Line x1="0" y1="120" x2="300" y2="120" stroke="#CFD8DC" strokeWidth="1.5" />

                {/* Bar 1: Safe */}
                <Rect x="40" y="40" width="30" height="80" rx="4" fill={theme.colors.riskLow} />
                <SvgText x="55" y="135" fontSize="10" fill={theme.colors.text} fontWeight="bold" textAnchor="middle">
                  Safe
                </SvgText>

                {/* Bar 2: Warnings */}
                <Rect x="135" y="90" width="30" height="30" rx="4" fill={theme.colors.riskMedium} />
                <SvgText x="150" y="135" fontSize="10" fill={theme.colors.text} fontWeight="bold" textAnchor="middle">
                  Warn
                </SvgText>

                {/* Bar 3: Dangerous */}
                <Rect x="230" y="110" width="30" height="10" rx="4" fill={theme.colors.riskHigh} />
                <SvgText x="245" y="135" fontSize="10" fill={theme.colors.text} fontWeight="bold" textAnchor="middle">
                  Danger
                </SvgText>
              </Svg>
            </View>
          </Card>
        </Animated.View>
      </View>

      {/* Dark Lower Section */}
      <Animated.View entering={SlideInDown.springify().damping(17).stiffness(50).mass(1.2)} style={styles.blackSection}>
        <Animated.View entering={FadeInUp.delay(300).duration(800)}>
          <Text style={styles.sectionTitle}>Ecosystem Threat Graph</Text>
          <Text style={styles.sectionSubtitle}>Tap nodes to audit scam ring connections</Text>

          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loaderText}>Mapping Network Clusters...</Text>
            </View>
          ) : (
            <View style={styles.graphContainer}>
              <View style={styles.graphArea}>
                <Svg height="350" width="340">
                  {/* Draw Edges */}
                  {edges.map((edge, idx) => {
                    const source = nodes.find((n) => n.id === edge.from);
                    const target = nodes.find((n) => n.id === edge.to);
                    if (!source || !target) return null;
                    return (
                      <Line
                        key={idx}
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke="#555555" // Darker lines for black background
                        strokeWidth="2.5"
                        strokeDasharray="4,4"
                      />
                    );
                  })}

                  {/* Draw Traveling Data Packets */}
                  {edges.map((edge, idx) => (
                    <TravelingPacket
                      key={`packet-${idx}`}
                      edge={edge}
                      nodes={nodes}
                      progress={packetProgress}
                    />
                  ))}

                  {/* Draw Pulsing Animated Nodes */}
                  {nodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <PulsingNode
                        key={node.id}
                        node={node}
                        isSelected={isSelected}
                        pulseVal={pulseVal}
                        getNodeColor={getNodeColor}
                        packetProgress={packetProgress}
                        onPress={() => setSelectedNode(node)}
                      />
                    );
                  })}

                  {/* Node Labels */}
                  {nodes.map((node) => (
                    <SvgText
                      key={`label-${node.id}`}
                      x={node.x}
                      y={node.y - 24}
                      fontSize="12" // Increased from 10 to 12 for high legibility
                      fontWeight="bold"
                      fill="#ffffff" // White text for labels on black background
                      textAnchor="middle"
                    >
                      {node.label}
                    </SvgText>
                  ))}
                </Svg>

                {/* Node metadata info sheet */}
                {selectedNode && (
                  <Animated.View entering={FadeInDown.duration(300)} style={styles.nodeMeta}>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Selected Entity:</Text>
                      <Text style={styles.metaValue}>{selectedNode.label}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Ecosystem Status:</Text>
                      <Text style={[
                        styles.metaValue,
                        selectedNode.status === 'SAFE' ? styles.greenText : selectedNode.status === 'WARNING' ? styles.orangeText : styles.redText
                      ]}>
                        {selectedNode.status}
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Confidence Index:</Text>
                      <Text style={styles.metaValue}>
                        {selectedNode.status === 'SAFE' ? '98.4%' : selectedNode.status === 'WARNING' ? '82.1%' : '99.9%'}
                      </Text>
                    </View>
                  </Animated.View>
                )}

                <View style={styles.intelFeedContainer}>
                  <Text style={styles.intelFeedTitle}>LIVE Threat FEED</Text>
                  <Text style={styles.intelFeedText}>📡 {intelFeeds[feedIndex]}</Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f5', // Light pinkish ivory background
  },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 70 : 60,
    paddingBottom: 0,
    flexGrow: 1, // Fill vertical space
  },
  topSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
  },
  blackSection: {
    backgroundColor: '#1c1c1e', // Soft charcoal dark container
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: 100, // Increased to account for bottom overlap
    marginTop: theme.spacing.md,
    marginBottom: -20, // Overlap under bottom tab bar to cover subpixel line gaps
    flexGrow: 1, // Stretch to the bottom of ScrollView
  },
  header: {
    marginBottom: theme.spacing.lg,
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
  chartCard: {
    padding: theme.spacing.lg,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: theme.spacing.sm,
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.sm + 1,
    fontWeight: theme.typography.weights.bold,
    color: '#ffffff', // White section headers inside dark section
    marginTop: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: theme.typography.sizes.xs - 1,
    color: '#a1a1aa',
    marginBottom: theme.spacing.md,
    marginTop: 2,
  },
  loader: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#ffffff',
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.sm,
  },
  graphContainer: {
    backgroundColor: '#2e2e30', // Softer layered dark wrapper
    borderRadius: 24,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    alignItems: 'center', // Center child elements
  },
  graphArea: {
    width: 340,
    alignSelf: 'center', // Center the fixed Svg canvas horizontally
  },
  nodeMeta: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#1c1c1e', // Soft charcoal inner panel matching container
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2e2e30',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metaLabel: {
    fontSize: theme.typography.sizes.xs,
    color: '#a1a1aa',
  },
  metaValue: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    color: '#ffffff',
  },
  greenText: {
    color: theme.colors.riskLow,
  },
  orangeText: {
    color: theme.colors.riskMedium,
  },
  redText: {
    color: theme.colors.riskHigh,
  },
  intelFeedContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#121212', // Pure dark background
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2e2e30',
    minHeight: 60,
    justifyContent: 'center',
  },
  intelFeedTitle: {
    fontSize: 8,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.riskMedium,
    letterSpacing: 1,
    marginBottom: 4,
  },
  intelFeedText: {
    color: '#bef264', // Lime Green high-tech text color
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: theme.typography.weights.semibold,
  },
});
