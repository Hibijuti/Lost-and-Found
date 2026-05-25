import { AppButton } from '@/components/lf/AppButton';
import { AppTextField } from '@/components/lf/AppTextField';
import { AppTheme } from '@/constants/appTheme';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.sub}>
          Enter your school email and we will send you a link to reset your password.
        </Text>

        <View style={styles.form}>
          <AppTextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholder="your.email@school.edu"
          />
          <AppButton title="Send reset link" onPress={onSubmit} loading={loading} variant="accent" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: AppTheme.surface },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: AppTheme.inputText,
    marginHorizontal: AppTheme.spacing.lg,
    marginTop: AppTheme.spacing.sm,
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    lineHeight: 22,
    color: AppTheme.textSecondary,
    marginHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.lg,
  },
  form: {
    marginHorizontal: AppTheme.spacing.md,
    padding: AppTheme.spacing.lg,
    backgroundColor: AppTheme.surfaceCard,
    borderRadius: AppTheme.radius.lg,
    ...AppTheme.cardShadow,
  },
});
