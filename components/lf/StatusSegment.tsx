import { AppTheme } from '@/constants/appTheme';
import type { ItemStatus } from '@/lib/items';
import { StyleSheet, Text, View, Pressable } from 'react-native';

type Props = {
  label?: string;
  value: ItemStatus;
  onChange: (status: ItemStatus) => void;
};

const OPTIONS: { key: ItemStatus; label: string }[] = [
  { key: 'lost', label: 'Lost' },
  { key: 'found', label: 'Found' },
];

export function StatusSegment({ label = 'Status', value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {OPTIONS.map((opt) => {
          const selected = value === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => onChange(opt.key)}
              style={({ pressed }) => [
                styles.segment,
                selected && styles.segmentOn,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected }}>
              <Text style={[styles.segmentText, selected && styles.segmentTextOn]}>{opt.label}</Text>
            </Pressable>
          );
        })}
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
  row: {
    flexDirection: 'row',
    backgroundColor: AppTheme.surfaceCard,
    borderRadius: AppTheme.radius.md,
    padding: 4,
    borderWidth: 1.5,
    borderColor: AppTheme.border,
    gap: 4,
    ...AppTheme.softShadow,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: AppTheme.radius.sm,
    alignItems: 'center',
  },
  segmentOn: {
    backgroundColor: AppTheme.primary,
  },
  pressed: { opacity: 0.9 },
  segmentText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppTheme.inputText,
  },
  segmentTextOn: {
    color: AppTheme.textOnPrimary,
  },
});
