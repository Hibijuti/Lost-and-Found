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
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, AppTheme.cardShadow, pressed && { opacity: 0.92 }]}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name="image-outline" size={40} color={AppTheme.textMuted} />
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>
            {item.itemName}
          </Text>
          <View style={[styles.badge, item.status === 'lost' ? styles.badgeLost : styles.badgeFound]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {item.location} · {item.category}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppTheme.surfaceCard,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  image: { width: '100%', height: 140 },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.accent + '33',
  },
  body: { padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontSize: 17, fontWeight: '700', color: AppTheme.primaryDark },
  meta: { marginTop: 4, fontSize: 13, color: AppTheme.textMuted },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeLost: { backgroundColor: AppTheme.badgeLostBg },
  badgeFound: { backgroundColor: AppTheme.badgeFoundBg },
  badgeText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize', color: AppTheme.primaryDark },
});
