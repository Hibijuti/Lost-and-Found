import { AppTheme } from '@/constants/appTheme';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label?: string;
  href?: Href;
};

/** Visible back control for auth screens */
export function AuthBackButton({ label = 'Back to sign in', href = '/(auth)/login' as Href }: Props) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.replace(href)}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Ionicons name="arrow-back" size={22} color={AppTheme.primary} />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  pressed: { opacity: 0.75 },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: AppTheme.primary,
  },
});
