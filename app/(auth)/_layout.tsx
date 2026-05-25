import { authHeaderOptions, authStackOptions } from '@/constants/navigation';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={authStackOptions}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="register" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen
        name="forgot-password"
        options={{
          ...authHeaderOptions,
          title: 'Reset password',
          headerBackTitle: 'Sign in',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
