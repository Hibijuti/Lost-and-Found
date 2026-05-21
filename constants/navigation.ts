import { AppTheme } from '@/constants/appTheme';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/** Shared stack styling + screen transition presets */
export const stackScreenDefaults: NativeStackNavigationOptions = {
  animation: 'slide_from_right',
  animationDuration: 280,
  contentStyle: { backgroundColor: AppTheme.surface },
  headerStyle: { backgroundColor: AppTheme.primary },
  headerTintColor: AppTheme.textOnPrimary,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 17,
    color: AppTheme.textOnPrimary,
  },
  headerShadowVisible: false,
  headerBackVisible: true,
};

export const modalScreenOptions: NativeStackNavigationOptions = {
  ...stackScreenDefaults,
  presentation: 'modal',
  animation: 'slide_from_bottom',
  animationDuration: 320,
  headerStyle: { backgroundColor: AppTheme.primary },
};

export const authStackOptions: NativeStackNavigationOptions = {
  animation: 'slide_from_right',
  animationDuration: 260,
  contentStyle: { backgroundColor: AppTheme.surface },
  headerShown: false,
};

/** Forgot password — native back arrow + title */
export const authHeaderOptions: NativeStackNavigationOptions = {
  ...stackScreenDefaults,
  headerShown: true,
  headerStyle: { backgroundColor: AppTheme.primary },
  headerTintColor: AppTheme.textOnPrimary,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 17,
    color: AppTheme.textOnPrimary,
  },
};

export const tabsEnterOptions: NativeStackNavigationOptions = {
  animation: 'fade_from_bottom',
  animationDuration: 350,
  headerShown: false,
};
