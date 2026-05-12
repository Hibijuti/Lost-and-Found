import { AppTheme } from '@/constants/appTheme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function AppTextField({ label, error, style, ...rest }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, isDark && { color: '#E2E8F0' }]}>{label}</Text>
      <TextInput
        placeholderTextColor={isDark ? AppTheme.textMutedDark : AppTheme.textMuted}
        style={[
          styles.input,
          isDark && { backgroundColor: AppTheme.surfaceDark, color: '#F1F5F9', borderColor: AppTheme.borderDark },
          error && styles.inputError,
          style,
        ]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#334155' },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: AppTheme.surfaceCard,
    color: AppTheme.primaryDark,
  },
  inputError: { borderColor: AppTheme.danger },
  error: { marginTop: 4, fontSize: 13, color: AppTheme.danger },
});
