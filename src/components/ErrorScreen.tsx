import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../theme';
import { Button } from './Button';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryTitle?: string;
  style?: StyleProp<ViewStyle>;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while communicating with the SentinelPay fraud engines.',
  onRetry,
  retryTitle = 'Try Again',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Text style={styles.errorIcon}>⚠️</Text>
          </View>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title={retryTitle}
          onPress={onRetry}
          variant="outline"
          size="md"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  outerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFCDD2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  button: {
    width: '60%',
  },
});
