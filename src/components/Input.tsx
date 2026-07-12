import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import { theme } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          leftIcon ? styles.hasLeftIcon : undefined,
          rightIcon ? styles.hasRightIcon : undefined,
          isFocused ? styles.focused : undefined,
          !!error ? styles.errorBorder : undefined,
          style as any,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          placeholderTextColor={theme.colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          {...props}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.iconRight}>
            {rightIcon}
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    width: '100%',
  },
  label: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.md,
    backgroundColor: theme.colors.background,
    height: 52,
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.text,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    padding: 0,
  },
  hasLeftIcon: {
    paddingLeft: theme.spacing.sm,
  },
  hasRightIcon: {
    paddingRight: theme.spacing.sm,
  },
  iconLeft: {
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRight: {
    marginLeft: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xs,
  },
  focused: {
    borderColor: theme.colors.primary,
  },
  errorBorder: {
    borderColor: theme.colors.riskHigh,
  },
  errorText: {
    color: theme.colors.riskHigh,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    marginTop: theme.spacing.xs,
  },
});
