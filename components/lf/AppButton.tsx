import { AppTheme } from '@/constants/appTheme';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary && { backgroundColor: isDanger ? AppTheme.danger : AppTheme.primary },
        variant === 'outline' && styles.outline,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? AppTheme.primary : '#fff'} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'outline' && { color: AppTheme.primary },
            isPrimary && !isDanger && { color: '#fff' },
            isDanger && { color: '#fff' },
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: AppTheme.primary,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});
