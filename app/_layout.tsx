import { AuthProvider } from '@/context/AuthContext';
import {
  modalScreenOptions,
  stackScreenDefaults,
  tabsEnterOptions,
} from '@/constants/navigation';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  initialRouteName: 'index',
} as const;

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={stackScreenDefaults}>
              <Stack.Screen name="index" options={{ headerShown: false, animation: 'fade' }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'fade' }} />
              <Stack.Screen name="(tabs)" options={tabsEnterOptions} />
              <Stack.Screen
                name="item/[id]"
                options={{
                  ...modalScreenOptions,
                  title: 'Item details',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="edit-profile"
                options={{
                  title: 'Edit profile',
                  animation: 'slide_from_right',
                  animationDuration: 280,
                }}
              />
              <Stack.Screen
                name="admin"
                options={{
                  title: 'Admin panel',
                  animation: 'slide_from_right',
                  animationDuration: 280,
                }}
              />
            </Stack>
            <StatusBar style="light" />
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
