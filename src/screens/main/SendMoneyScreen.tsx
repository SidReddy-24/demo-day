import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, Pressable, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { RiskBadge, RiskLevel } from '../../components/RiskBadge';

interface Contact {
  id: string;
  name: string;
  upiId: string;
  riskLevel: RiskLevel;
  avatar: string;
}

const RECENT_CONTACTS: Contact[] = [
  { id: '1', name: 'Rohit Sharma', upiId: 'rohit45@okaxis', riskLevel: 'LOW', avatar: '🏏' },
  { id: '2', name: 'Electricity Board Support', upiId: 'billpay.board@apco', riskLevel: 'HIGH', avatar: '⚡' },
  { id: '3', name: 'Alice Rivera', upiId: 'alice@paytm', riskLevel: 'LOW', avatar: '👩‍💻' },
  { id: '4', name: 'Unknown Merchant', upiId: 'claims.rewards@secure', riskLevel: 'HIGH', avatar: '🎁' },
];

export const SendMoneyScreen = ({ navigation }: any) => {
  const [upiInput, setUpiInput] = useState('');
  const [error, setError] = useState('');

  const handleManualVerify = () => {
    setError('');
    const cleanUpi = upiInput.trim().toLowerCase();
    
    if (!cleanUpi) {
      setError('UPI ID cannot be empty');
      return;
    }
    
    // Basic UPI validation: text@bank
    if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(cleanUpi)) {
      setError('Enter a valid UPI ID (e.g. name@bank)');
      return;
    }

    // Determine mock risk level for manual UPI entries
    let riskLevel: RiskLevel = 'LOW';
    if (cleanUpi.includes('scam') || cleanUpi.includes('reward') || cleanUpi.includes('support')) {
      riskLevel = 'HIGH';
    } else if (cleanUpi.includes('unknown') || cleanUpi.length > 25) {
      riskLevel = 'MEDIUM';
    }

    navigation.navigate('AmountEntry', {
      recipientName: cleanUpi.split('@')[0].toUpperCase(),
      recipientUpi: cleanUpi,
      recipientRisk: riskLevel,
    });
  };

  const handleSelectContact = (contact: Contact) => {
    navigation.navigate('AmountEntry', {
      recipientName: contact.name,
      recipientUpi: contact.upiId,
      recipientRisk: contact.riskLevel,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Send Money</Text>
        <Text style={styles.subtitle}>Enter a UPI address or select a simulation profile</Text>
      </View>

      {/* Manual Input */}
      <View style={styles.inputSection}>
        <Input
          placeholder="Enter UPI ID (e.g. username@bank)"
          value={upiInput}
          onChangeText={(text) => {
            setUpiInput(text);
            if (error) setError('');
          }}
          error={error}
          autoCapitalize="none"
          autoCorrect={false}
          rightIcon={
            <Button
              title="Verify"
              onPress={handleManualVerify}
              variant="primary"
              size="sm"
              style={styles.verifyBtn}
            />
          }
        />
      </View>

      {/* Recents list */}
      <View style={styles.recentsSection}>
        <Text style={styles.sectionTitle}>Recent Profiles</Text>
        <FlatList
          data={RECENT_CONTACTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              onPress={() => handleSelectContact(item)}
              style={styles.contactCard}
              contentStyle={styles.cardContent}
              shadow="none"
            >
              <View style={styles.leftCol}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.avatar}</Text>
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.upi}>{item.upiId}</Text>
                </View>
              </View>
              <RiskBadge level={item.riskLevel} />
            </Card>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
  },
  header: {
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
  inputSection: {
    marginBottom: theme.spacing.xl,
  },
  verifyBtn: {
    height: 36,
    paddingVertical: 0,
    paddingHorizontal: theme.spacing.md,
  },
  recentsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.sm + 1,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  contactCard: {
    marginBottom: theme.spacing.sm,
    borderWidth: 1.2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    fontSize: 18,
  },
  contactDetails: {
    justifyContent: 'center',
  },
  name: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  upi: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});
