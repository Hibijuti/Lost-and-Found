import { AppButton } from '@/components/lf/AppButton';
import { AppTextField } from '@/components/lf/AppTextField';
import { AuthHero } from '@/components/lf/AuthHero';
import { AppTheme } from '@/constants/appTheme';
import { useAuth } from '@/context/AuthContext';
import type { Href } from 'expo-router';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)' as Href);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign in failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <AuthHero title="Lost & Found" subtitle="Sign in with your school email to browse and post items." />

        <View style={styles.form}>
          <AppTextField
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@usc.edu.ph"
          />
          <AppTextField
            label="Password"
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
          />

          {error ? <Text style={styles.err}>{error}</Text> : null}

          <AppButton title="Sign in" onPress={onSubmit} loading={loading} />

          <Link href={'/(auth)/forgot-password' as Href} style={styles.linkCenter}>
            <Text style={styles.link}>Forgot password?</Text>
          </Link>

          <View style={styles.row}>
            <Text style={styles.muted}>No account? </Text>
            <Link href={'/(auth)/register' as Href}>
              <Text style={styles.link}>Register</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: AppTheme.surface },
  form: {
    paddingHorizontal: AppTheme.spacing.lg,
    backgroundColor: AppTheme.surfaceCard,
    marginHorizontal: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.lg,
    ...AppTheme.cardShadow,
  },
  err: { color: AppTheme.danger, marginBottom: 12 },
  link: { color: AppTheme.primary, fontWeight: '700', fontSize: 15 },
  linkCenter: { alignSelf: 'center', marginTop: 16, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  muted: { fontSize: 15, color: AppTheme.textSecondary },
});
