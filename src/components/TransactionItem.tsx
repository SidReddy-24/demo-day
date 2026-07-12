import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { RiskBadge, RiskLevel } from './RiskBadge';
import { ArrowSendIcon, ArrowReceiveIcon } from './Icons';

interface TransactionItemProps {
  name: string;
  upiId: string;
  amount: number;
  timestamp: string;
  riskLevel: RiskLevel;
  type?: 'SEND' | 'RECEIVE';
  style?: StyleProp<ViewStyle>;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  name,
  upiId,
  amount,
  timestamp,
  riskLevel,
  type = 'SEND',
  style,
}) => {
  const isSend = type === 'SEND';

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftCol}>
        <View style={[styles.avatar, isSend ? styles.avatarSend : styles.avatarReceive]}>
          {isSend ? (
            <ArrowSendIcon color="#1f1b17" size={16} />
          ) : (
            <ArrowReceiveIcon color="#006c49" size={16} />
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.upiId} numberOfLines={1}>
            {upiId}
          </Text>
          <Text style={styles.time}>{timestamp}</Text>
        </View>
      </View>
      <View style={styles.rightCol}>
        <Text style={[styles.amount, isSend ? styles.amountSend : styles.amountReceive]}>
          {isSend ? '-' : '+'}₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
        <RiskBadge level={riskLevel} style={styles.badge} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.soft,
  },
  avatarSend: {
    backgroundColor: '#ECEFF1',
  },
  avatarReceive: {
    backgroundColor: '#E8F5E9',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f1b17',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  upiId: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  time: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: theme.typography.sizes.sm + 1,
    fontWeight: theme.typography.weights.bold,
    marginBottom: 4,
  },
  amountSend: {
    color: theme.colors.text,
  },
  amountReceive: {
    color: theme.colors.riskLow,
  },
  badge: {
    transform: [{ scale: 0.85 }],
    marginRight: -4,
    marginTop: 2,
  },
});
