import { AppTheme } from '@/constants/appTheme';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  hint?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
};

/** Non-editable profile field (email, student ID). */
export function ReadOnlyField({ label, value, hint, icon = 'lock-closed-outline' }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <Ionicons name={icon} size={18} color={AppTheme.textMuted} />
        <View style={styles.body}>
          <Text style={styles.value}>{value}</Text>
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: AppTheme.spacing.md },
  label: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    color: AppTheme.inputLabel,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.surface,
    borderWidth: 1.5,
    borderColor: AppTheme.border,
  },
  body: { flex: 1 },
  value: { fontSize: 16, fontWeight: '600', color: AppTheme.inputText },
  hint: { marginTop: 4, fontSize: 12, color: AppTheme.textMuted, fontStyle: 'italic' },
});
