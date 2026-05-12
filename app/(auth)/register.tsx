import { AppButton } from '@/components/lf/AppButton';
import { AppTextField } from '@/components/lf/AppTextField';
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

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    if (!name.trim() || !studentId.trim() || !email.trim() || !password || password.length < 6) {
      setError('Fill all fields. Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUp({ email: email.trim(), password, name, studentId, phone, socialLink });
      router.replace('/(tabs)' as Href);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Registration failed.';
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
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.lead}>Create your student profile. Default role is student; admins are assigned in Firebase.</Text>

        <AppTextField label="Full name" value={name} onChangeText={setName} autoCapitalize="words" />
        <AppTextField label="Student ID" value={studentId} onChangeText={setStudentId} />
        <AppTextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <AppTextField label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <AppTextField
          label="Social link (optional)"
          value={socialLink}
          onChangeText={setSocialLink}
          autoCapitalize="none"
          placeholder="https://"
        />
        <AppTextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password-new"
        />

        {error ? <Text style={styles.err}>{error}</Text> : null}

        <AppButton title="Register" onPress={onSubmit} loading={loading} />

        <View style={styles.row}>
          <Text style={styles.muted}>Already have an account? </Text>
          <Link href={'/(auth)/login' as Href}>
            <Text style={styles.link}>Sign in</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: AppTheme.surface },
  scroll: { paddingHorizontal: 24, paddingTop: 16 },
  lead: { fontSize: 14, color: AppTheme.textMuted, marginBottom: 16, lineHeight: 20 },
  err: { color: AppTheme.danger, marginBottom: 12 },
  link: { color: AppTheme.primary, fontWeight: '600', fontSize: 15 },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  muted: { fontSize: 15, color: AppTheme.textMuted },
});
