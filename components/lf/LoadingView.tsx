import { AppTheme } from '@/constants/appTheme';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function LoadingView({ message = 'Loading…' }: { message?: string }) {
  return (
    <View style={styles.center}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color={AppTheme.primary} />
        <Text style={styles.msg}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: AppTheme.surface,
  },
  box: {
    backgroundColor: AppTheme.surfaceCard,
    paddingVertical: 32,
    paddingHorizontal: 40,
    borderRadius: AppTheme.radius.lg,
    alignItems: 'center',
    gap: 14,
    ...AppTheme.cardShadow,
  },
  msg: { fontSize: 15, color: AppTheme.textSecondary, fontWeight: '500' },
});
