import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, Pressable, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { theme } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { request } from '../../services/api';

const CATEGORIES = [
  'Fake Utility / Bill Scheme',
  'Phishing / Impersonation',
  'Lottery / Rewards Fraud',
  'Malicious QR Placement',
];

export const ReportMerchantScreen = ({ route, navigation }: any) => {
  const prefilledUpi = route.params?.prefilledUpi || '';
  
  const [upi, setUpi] = useState(prefilledUpi);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAttachScreenshot = () => {
    // Simulates picking a screenshot
    setScreenshot('payment_proof_ocr_extracted.png');
    Alert.alert('Screenshot Attached', 'Mock AI scanner ready to run OCR text extraction.');
  };

  const validate = () => {
    setError('');
    const cleanUpi = upi.trim().toLowerCase();
    
    if (!cleanUpi) {
      setError('UPI ID is required');
      return false;
    }
    
    if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(cleanUpi)) {
      setError('Enter a valid UPI ID (e.g. name@bank)');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      await request({
        url: '/report-merchant',
        method: 'POST',
        data: {
          upiId: upi.trim().toLowerCase(),
          category,
          description,
          screenshotAttached: !!screenshot,
        },
      });

      Alert.alert(
        'Report Filed',
        'Your threat report has been verified by mock AI models and saved to the ecosystem registry.',
        [
          {
            text: 'OK',
            onPress: () => navigation.popToTop(),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Submission Failed', err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.title}>Report Scammer</Text>
          <Text style={styles.subtitle}>Report malicious UPI profiles to protect the sandbox network</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Accused UPI Address"
            placeholder="scammer@upi"
            value={upi}
            onChangeText={(text) => {
              setUpi(text);
              if (error) setError('');
            }}
            error={error}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>SCAM CLASSIFICATION</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat, idx) => (
              <Pressable
                key={idx}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>

          <Input
            label="Scam Details / Description"
            placeholder="Explain how the merchant attempted to extract funds or spoof credentials..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          {/* Screenshot proof */}
          <Text style={styles.label}>PROOF ATTACHMENTS</Text>
          <Card style={styles.proofCard} shadow="none">
            <Text style={styles.proofText}>
              {screenshot ? `✅ ${screenshot}` : 'Attach chat message screenshot or payment requests'}
            </Text>
            <Button
              title={screenshot ? 'Change Screenshot' : 'Upload Proof Screenshot'}
              onPress={handleAttachScreenshot}
              variant="outline"
              size="sm"
              style={styles.uploadBtn}
            />
          </Card>

          <Button
            title={submitting ? 'Running Verification Scan...' : 'Submit Report'}
            onPress={handleSubmit}
            loading={submitting}
            variant="danger"
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 40,
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
  form: {
    flex: 1,
  },
  label: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
  },
  categoryChip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.roundness.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    marginRight: 6,
    marginBottom: 8,
    backgroundColor: theme.colors.background,
  },
  categoryChipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  categoryText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.semibold,
  },
  categoryTextSelected: {
    color: theme.colors.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.sm,
  },
  proofCard: {
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderStyle: 'dashed',
    borderColor: theme.colors.borderDark,
    borderWidth: 1.5,
  },
  proofText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  uploadBtn: {
    width: '80%',
  },
  submitBtn: {
    marginTop: theme.spacing.sm,
  },
});
