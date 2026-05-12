import { AppButton } from '@/components/lf/AppButton';
import { AppTextField } from '@/components/lf/AppTextField';
import { AppTheme } from '@/constants/appTheme';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!email.trim()) {
      Alert.alert('Email required', 'Enter the email for your account.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      Alert.alert('Check your inbox', 'If an account exists, a reset link was sent.');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not send reset email.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.sub}>
          We will email you a link to reset your password (Firebase Auth handles delivery).
        </Text>
        <AppTextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <AppButton title="Send reset link" onPress={onSubmit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: AppTheme.surface },
  scroll: { paddingHorizontal: 24, paddingTop: 16 },
  sub: { fontSize: 15, color: AppTheme.textMuted, marginBottom: 20, lineHeight: 22 },
});
