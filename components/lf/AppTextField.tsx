import { AppTheme } from '@/constants/appTheme';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

/**
 * High-contrast text fields — always uses light-theme colors so labels stay
 * readable on white cards (avoids washed-out text when device is in dark mode).
 */
export function AppTextField({ label, error, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={AppTheme.inputPlaceholder}
        style={[styles.input, error && styles.inputError, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: AppTheme.spacing.md },
  label: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    color: AppTheme.inputLabel,
  },
  input: {
    borderWidth: 1.5,
    borderColor: AppTheme.border,
    borderRadius: AppTheme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: AppTheme.surfaceCard,
    color: AppTheme.inputText,
    ...AppTheme.softShadow,
  },
  inputError: { borderColor: AppTheme.danger },
  error: { marginTop: 6, fontSize: 13, color: AppTheme.danger, fontWeight: '600' },
});
