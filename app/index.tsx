import { useAuth } from '@/context/AuthContext';
import { AppTheme } from '@/constants/appTheme';
import type { Href } from 'expo-router';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

/**
 * Entry redirect: signed-in users go to the main tabs; others go to login.
 */
export default function Index() {
  const { firebaseUser, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={AppTheme.primary} />
      </View>
    );
  }

  if (firebaseUser) {
    return <Redirect href={'/(tabs)' as Href} />;
  }

  return <Redirect href={'/(auth)/login' as Href} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.surface,
  },
});
