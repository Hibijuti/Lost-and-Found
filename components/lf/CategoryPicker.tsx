import { AppTheme } from '@/constants/appTheme';
import { ITEM_CATEGORIES } from '@/constants/categories';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  label?: string;
  value: string;
  onChange: (category: string) => void;
  /** When true, user can clear selection (for filters). Shows "Any category". */
  allowEmpty?: boolean;
  required?: boolean;
};

export function CategoryPicker({
  label = 'Category',
  value,
  onChange,
  allowEmpty = false,
  required = false,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  }

  function select(cat: string) {
    onChange(cat);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(false);
  }

  const display =
    value ||
    (allowEmpty ? 'Any category' : required ? 'Select a category' : 'Tap to choose');

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={toggle}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
        accessibilityRole="button"
        accessibilityState={{ expanded }}>
        <Text style={[styles.triggerText, !value && styles.triggerPlaceholder]} numberOfLines={1}>
          {display}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={AppTheme.primary}
        />
      </Pressable>

      {expanded ? (
        <View style={styles.panel}>
          {allowEmpty ? (
            <Pressable
              onPress={() => select('')}
              style={[styles.pill, !value && styles.pillSelected]}>
              <Text style={[styles.pillText, !value && styles.pillTextSelected]}>Any category</Text>
            </Pressable>
          ) : null}
          {ITEM_CATEGORIES.map((cat) => {
            const selected = value === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => select(cat)}
                style={[styles.pill, selected && styles.pillSelected]}>
                <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{cat}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppTheme.surfaceCard,
    borderWidth: 1.5,
    borderColor: AppTheme.border,
    borderRadius: AppTheme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    ...AppTheme.softShadow,
  },
  triggerPressed: { opacity: 0.92 },
  triggerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.inputText,
  },
  triggerPlaceholder: {
    color: AppTheme.inputPlaceholder,
    fontWeight: '500',
  },
  panel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.surfaceCard,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    borderColor: AppTheme.border,
    ...AppTheme.softShadow,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: AppTheme.radius.full,
    backgroundColor: AppTheme.surface,
    borderWidth: 1.5,
    borderColor: AppTheme.border,
  },
  pillSelected: {
    backgroundColor: AppTheme.primary,
    borderColor: AppTheme.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppTheme.textSecondary,
  },
  pillTextSelected: {
    color: AppTheme.textOnPrimary,
  },
});
