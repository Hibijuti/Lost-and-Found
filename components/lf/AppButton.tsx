import { AppTheme } from '@/constants/appTheme';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'accent';
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
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isAccent = variant === 'accent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        !isOutline && !isDanger && !isAccent && styles.primary,
        isAccent && styles.accent,
        isDanger && styles.danger,
        isOutline && styles.outline,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={isOutline ? AppTheme.primary : isAccent ? AppTheme.primaryDark : '#fff'}
        />
      ) : (
        <Text
          style={[
            styles.label,
            isOutline && { color: AppTheme.primary },
            isAccent && { color: AppTheme.primaryDark },
            !isOutline && !isAccent && { color: AppTheme.textOnPrimary },
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: AppTheme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...AppTheme.softShadow,
  },
  primary: { backgroundColor: AppTheme.primary },
  accent: { backgroundColor: AppTheme.accent },
  danger: { backgroundColor: AppTheme.danger },
  outline: {
    backgroundColor: AppTheme.surfaceCard,
    borderWidth: 2,
    borderColor: AppTheme.primary,
  },
  label: { fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});
