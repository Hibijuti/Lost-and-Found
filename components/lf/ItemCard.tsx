import { AppTheme } from '@/constants/appTheme';
import type { LostFoundItem } from '@/lib/items';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  item: LostFoundItem;
  onPress: () => void;
};

export function ItemCard({ item, onPress }: Props) {
  const isLost = item.status === 'lost';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, AppTheme.cardShadow, pressed && styles.pressed]}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name="image-outline" size={40} color={AppTheme.textMuted} />
        </View>
      )}
      <View style={styles.accentBar} />
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>
            {item.itemName}
          </Text>
          <View style={[styles.badge, isLost ? styles.badgeLost : styles.badgeFound]}>
            <Ionicons
              name={isLost ? 'help-circle' : 'checkmark-circle'}
              size={14}
              color={AppTheme.primaryDark}
            />
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={AppTheme.textMuted} />
          <Text style={styles.meta} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppTheme.surfaceCard,
    borderRadius: AppTheme.radius.lg,
    overflow: 'hidden',
    marginBottom: AppTheme.spacing.md,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  pressed: { opacity: 0.94, transform: [{ scale: 0.99 }] },
  image: { width: '100%', height: 152 },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.accent + '44',
  },
  accentBar: {
    height: 4,
    backgroundColor: AppTheme.accent,
  },
  body: { padding: AppTheme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: AppTheme.primaryDark },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  meta: { flex: 1, fontSize: 13, color: AppTheme.textSecondary },
  category: { marginTop: 4, fontSize: 12, fontWeight: '600', color: AppTheme.primary, opacity: 0.85 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: AppTheme.radius.full,
  },
  badgeLost: { backgroundColor: AppTheme.badgeLostBg },
  badgeFound: { backgroundColor: AppTheme.badgeFoundBg },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
    color: AppTheme.primaryDark,
  },
});
