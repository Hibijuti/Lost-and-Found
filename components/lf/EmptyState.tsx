import { AppTheme } from '@/constants/appTheme';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  hint?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
};

export function EmptyState({ title, hint, icon = 'file-tray-outline' }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={48} color={AppTheme.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 8,
  },
  title: { fontSize: 17, fontWeight: '600', color: AppTheme.primaryDark, textAlign: 'center' },
  hint: { fontSize: 14, color: AppTheme.textMuted, textAlign: 'center' },
});
