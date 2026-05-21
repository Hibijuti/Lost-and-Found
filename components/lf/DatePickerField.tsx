import { AppTheme } from '@/constants/appTheme';
import { formatDateDisplay, formatDateISO, parseDateISO } from '@/lib/dateFormat';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label?: string;
  value: string;
  onChange: (isoDate: string) => void;
  maximumDate?: Date;
  minimumDate?: Date;
};

export function DatePickerField({
  label = 'Date (when lost/found)',
  value,
  onChange,
  maximumDate = new Date(),
  minimumDate,
}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [iosPending, setIosPending] = useState(new Date());

  const parsed = value ? parseDateISO(value) : null;
  const pickerDate = parsed ?? new Date();

  useEffect(() => {
    if (showPicker && Platform.OS === 'ios') {
      setIosPending(parsed ?? new Date());
    }
  }, [showPicker, parsed]);

  function onAndroidChange(event: DateTimePickerEvent, selected?: Date) {
    setShowPicker(false);
    if (event.type === 'set' && selected) {
      onChange(formatDateISO(selected));
    }
  }

  const display = value ? formatDateDisplay(value) : 'Tap to choose a date';
  const isEmpty = !value;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setShowPicker(true)}
        style={({ pressed }) => [styles.field, pressed && styles.fieldPressed]}
        accessibilityRole="button"
        accessibilityLabel={label}>
        <View style={styles.textCol}>
          <Text style={[styles.value, isEmpty && styles.placeholder]}>{display}</Text>
          {value ? <Text style={styles.isoHint}>Format: {value}</Text> : null}
        </View>
        <Ionicons name="calendar-outline" size={24} color={AppTheme.primary} />
      </Pressable>

      {Platform.OS === 'android' && showPicker ? (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={onAndroidChange}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowPicker(false)}>
            <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Pressable onPress={() => setShowPicker(false)} hitSlop={12}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </Pressable>
                <Text style={styles.modalTitle}>Pick a date</Text>
                <Pressable
                  onPress={() => {
                    onChange(formatDateISO(iosPending));
                    setShowPicker(false);
                  }}
                  hitSlop={12}>
                  <Text style={styles.modalDone}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={iosPending}
                mode="date"
                display="spinner"
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={(_, selected) => {
                  if (selected) setIosPending(selected);
                }}
                style={styles.iosPicker}
              />
            </Pressable>
          </Pressable>
        </Modal>
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
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: AppTheme.border,
    borderRadius: AppTheme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: AppTheme.surfaceCard,
    ...AppTheme.softShadow,
  },
  fieldPressed: { opacity: 0.92 },
  textCol: { flex: 1 },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.inputText,
  },
  placeholder: {
    color: AppTheme.inputPlaceholder,
  },
  isoHint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: AppTheme.textSecondary,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    backgroundColor: AppTheme.surfaceCard,
    borderTopLeftRadius: AppTheme.radius.xl,
    borderTopRightRadius: AppTheme.radius.xl,
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.border,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: AppTheme.inputText },
  modalCancel: { fontSize: 16, color: AppTheme.textSecondary, fontWeight: '600' },
  modalDone: { fontSize: 16, color: AppTheme.primary, fontWeight: '700' },
  iosPicker: { height: 220 },
});
