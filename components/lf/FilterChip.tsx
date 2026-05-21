import { AppTheme } from '@/constants/appTheme';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterChip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipOn,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.text, selected && styles.textOn]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: AppTheme.radius.full,
    backgroundColor: AppTheme.surfaceCard,
    borderWidth: 1.5,
    borderColor: AppTheme.border,
    ...AppTheme.softShadow,
  },
  chipOn: {
    backgroundColor: AppTheme.primary,
    borderColor: AppTheme.primary,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  text: { fontWeight: '600', fontSize: 14, color: AppTheme.textSecondary },
  textOn: { color: AppTheme.textOnPrimary },
});
