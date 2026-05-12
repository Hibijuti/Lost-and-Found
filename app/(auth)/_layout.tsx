import { AppTheme } from '@/constants/appTheme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: AppTheme.surfaceCard },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700', color: AppTheme.primaryDark },
        headerTintColor: AppTheme.primary,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="login" options={{ title: 'Sign in' }} />
      <Stack.Screen name="register" options={{ title: 'Create account' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Reset password' }} />
    </Stack>
  );
}
