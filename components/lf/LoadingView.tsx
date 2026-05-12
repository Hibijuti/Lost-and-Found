import { AppTheme } from '@/constants/appTheme';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function LoadingView({ message = 'Loading…' }: { message?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={AppTheme.primary} />
      <Text style={styles.msg}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  msg: { fontSize: 15, color: AppTheme.textMuted },
});
