import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, StatusBar, Platform, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../theme';

export const PaymentSuccessScreen = ({ route, navigation }: any) => {
  const { recipientName, amount } = route.params;
  const [txnNumber, setTxnNumber] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Generate simulated reference and transaction numbers
    setTxnNumber(`#${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setRefNumber(`${Math.floor(100000000000 + Math.random() * 900000000000)}`);
    
    // Format current date & time
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    setFormattedDate(`${month} ${day}, ${year} | ${hours}:${minutes}:${seconds} ${ampm}`);
  }, []);

  const handleFinish = () => {
    navigation.popToTop();
  };

  const handleShare = () => {
    if (Platform.OS === 'web') {
      alert('Share Receipt: Receipt link copied to clipboard!');
    }
  };

  // Programmatic SVG path generation for the serrated tear edges
  const teeth = 25;
  const toothWidth = 14;
  
  const topJagPath = `M 0 8 ` + Array.from({ length: teeth }).map((_, i) => {
    const x1 = i * toothWidth + 7;
    const x2 = (i + 1) * toothWidth;
    return `L ${x1} 0 L ${x2} 8`;
  }).join(' ') + ` L 350 8 L 0 8 Z`;

  const bottomJagPath = `M 0 0 ` + Array.from({ length: teeth }).map((_, i) => {
    const x1 = i * toothWidth + 7;
    const x2 = (i + 1) * toothWidth;
    return `L ${x1} 8 L ${x2} 0`;
  }).join(' ') + ` L 350 0 L 0 0 Z`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>
          Sentinel<Text style={{ color: theme.colors.primary }}>Pay</Text>
        </Text>
        <View style={styles.infoCircle}>
          <Text style={styles.infoIconText}>i</Text>
        </View>
      </View>

      {/* Serrated Ticket Receipt Card */}
      <View style={styles.receiptContainer}>
        {/* Top Serrated Edge */}
        <Svg height="8" width="100%" viewBox="0 0 350 8" style={styles.jagSvg}>
          <Path d={topJagPath} fill="#ffffff" />
        </Svg>

        <View style={styles.receiptBody}>
          {/* Header Status */}
          <View style={styles.statusRow}>
            <View style={styles.successBadge}>
              <View style={styles.checkMarkCircle}>
                <Text style={styles.checkMarkText}>✓</Text>
              </View>
              <Text style={styles.statusText}>Transaction Success</Text>
            </View>
          </View>

          {/* Payee Details */}
          <Text style={styles.payeeName}>{recipientName.toUpperCase()}</Text>
          <Text style={styles.txnSub}>Transaction number {txnNumber}</Text>

          {/* Dashed Separator 1 with Ticket Notches */}
          <View style={styles.dividerWrapper}>
            <View style={styles.leftNotch} />
            <View style={styles.dashedDivider} />
            <View style={styles.rightNotch} />
          </View>

          {/* Metadata Parameters */}
          <View style={styles.detailsList}>
            <View style={styles.row}>
              <Text style={styles.label}>Date & time</Text>
              <Text style={styles.value}>{formattedDate}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Reference number</Text>
              <Text style={styles.value}>{refNumber}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Source of funds</Text>
              <Text style={styles.value}>SentinelPay Wallet</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Destination</Text>
              <Text style={styles.value}>{recipientName.toLowerCase().replace(/ /g, '')}@okaxis</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Recipient alias</Text>
              <Text style={styles.value}>{recipientName}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>AI Threat Audit</Text>
              <Text style={[styles.value, styles.greenText]}>Clean & Secured</Text>
            </View>
          </View>

          {/* Dashed Separator 2 with Ticket Notches */}
          <View style={styles.dividerWrapper}>
            <View style={styles.leftNotch} />
            <View style={styles.dashedDivider} />
            <View style={styles.rightNotch} />
          </View>

          {/* Total amount summary */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total transaction</Text>
            <Text style={styles.totalAmount}>
              ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Bottom Serrated Edge */}
        <Svg height="8" width="100%" viewBox="0 0 350 8" style={styles.jagSvg}>
          <Path d={bottomJagPath} fill="#ffffff" />
        </Svg>
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Pressable style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareText}>Share</Text>
          <Text style={styles.shareIconSymbol}> share</Text>
        </Pressable>

        <Pressable style={styles.transactionsBtn} onPress={handleFinish}>
          <Text style={styles.transactionsText}>Transactions →</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // Theme Slate background
    paddingHorizontal: theme.spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
  },
  infoCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#4b5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: 'bold',
  },
  receiptContainer: {
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  jagSvg: {
    width: '100%',
  },
  receiptBody: {
    backgroundColor: '#ffffff',
    paddingHorizontal: theme.spacing.lg + 4,
    paddingVertical: theme.spacing.md,
  },
  statusRow: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  checkMarkCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  checkMarkText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#1b4d3e',
    fontSize: 11,
    fontWeight: '700',
  },
  payeeName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  txnSub: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },
  dividerWrapper: {
    height: 20,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: theme.spacing.sm,
  },
  dashedDivider: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 1,
    width: '100%',
  },
  leftNotch: {
    position: 'absolute',
    left: -26, // punch into card body boundary
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.background, // Match outer dark theme background
  },
  rightNotch: {
    position: 'absolute',
    right: -26,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
  },
  detailsList: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  value: {
    fontSize: 11,
    color: '#111827',
    fontWeight: '700',
  },
  greenText: {
    color: '#22c55e',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: theme.spacing.lg,
  },
  shareBtn: {
    flexDirection: 'row',
    width: '38%',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  shareIconSymbol: {
    color: '#9ca3af',
    fontSize: 10,
    marginLeft: 6,
  },
  transactionsBtn: {
    width: '58%',
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.riskLow, // Emerald success green
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionsText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
