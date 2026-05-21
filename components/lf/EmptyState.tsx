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
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={40} color={AppTheme.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 28,
    gap: 10,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppTheme.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: AppTheme.border,
    ...AppTheme.softShadow,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: AppTheme.primaryDark,
    textAlign: 'center',
  },
  hint: { fontSize: 14, color: AppTheme.textSecondary, textAlign: 'center', lineHeight: 21 },
});
