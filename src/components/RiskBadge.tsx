import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface RiskBadgeProps {
  level: RiskLevel;
  style?: ViewStyle;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, style }) => {
  const getBadgeStyles = () => {
    switch (level) {
      case 'LOW':
        return {
          bg: { backgroundColor: '#E8F5E9' },
          text: { color: theme.colors.riskLow },
        };
      case 'MEDIUM':
        return {
          bg: { backgroundColor: '#FFF3E0' },
          text: { color: theme.colors.riskMedium },
        };
      case 'HIGH':
        return {
          bg: { backgroundColor: '#FFEBEE' },
          text: { color: theme.colors.riskHigh },
        };
    }
  };

  const { bg, text } = getBadgeStyles();

  return (
    <View style={[styles.badge, bg, style]}>
      <View style={[styles.dot, { backgroundColor: text.color }]} />
      <Text style={[styles.text, text]}>{level}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.roundness.full,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.spacing.xs,
  },
  text: {
    fontSize: theme.typography.sizes.xs - 1,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
