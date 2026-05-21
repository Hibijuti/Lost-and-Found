import { AppButton } from '@/components/lf/AppButton';
import { LoadingView } from '@/components/lf/LoadingView';
import { AppTheme } from '@/constants/appTheme';
import { getItemById, type LostFoundItem } from '@/lib/items';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ItemDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<LostFoundItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ok = true;
    (async () => {
      if (!id) {
        setError('Missing item id.');
        setLoading(false);
        return;
      }
      try {
        const data = await getItemById(id);
        if (!ok) return;
        setItem(data);
        if (!data) setError('This listing was removed.');
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load.');
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, [id]);

  if (loading) {
    return <LoadingView message="Opening item…" />;
  }

  if (error || !item) {
    return (
      <View style={styles.center}>
        <Text style={styles.err}>{error ?? 'Not found.'}</Text>
        <AppButton title="Close" onPress={() => router.back()} />
      </View>
    );
  }

  const mail = item.posterEmail?.trim();
  const phone = item.posterPhone?.trim();

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="image-outline" size={48} color={AppTheme.textMuted} />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{item.itemName}</Text>
        <View style={styles.badges}>
          <View style={[styles.badge, item.status === 'lost' ? styles.lost : styles.found]}>
            <Text style={styles.badgeTxt}>{item.status}</Text>
          </View>
          {item.claimed ? (
            <View style={[styles.badge, styles.claimed]}>
              <Text style={styles.badgeTxt}>Claimed</Text>
            </View>
          ) : null}
        </View>

        <InfoRow icon="person-outline" text={`Posted by ${item.posterName}`} />
        <InfoRow icon="pricetag-outline" text={item.category} />
        <InfoRow icon="location-outline" text={item.location} />
        <InfoRow icon="calendar-outline" text={item.date} />

        <Text style={styles.section}>Description</Text>
        <View style={styles.descBox}>
          <Text style={styles.body}>{item.description}</Text>
        </View>

        <Text style={styles.section}>Contact poster</Text>
        <AppButton
          title={mail ? `Email ${item.posterName}` : 'No email on file'}
          onPress={() => {
            if (mail) Linking.openURL(`mailto:${mail}`);
          }}
          disabled={!mail}
        />
        {phone ? (
          <AppButton
            variant="outline"
            title={`Call ${phone}`}
            onPress={() => Linking.openURL(`tel:${phone}`)}
            style={{ marginTop: 10 }}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, text }: { icon: ComponentProps<typeof Ionicons>['name']; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={AppTheme.primary} />
      <Text style={styles.meta}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: AppTheme.surface },
  err: { color: AppTheme.danger, marginBottom: 16, textAlign: 'center', fontWeight: '600' },
  scroll: { paddingBottom: 40, backgroundColor: AppTheme.surface },
  image: { width: '100%', height: 260 },
  imagePlaceholder: {
    backgroundColor: AppTheme.accent + '55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginTop: -20,
    marginHorizontal: AppTheme.spacing.md,
    backgroundColor: AppTheme.surfaceCard,
    borderTopLeftRadius: AppTheme.radius.xl,
    borderTopRightRadius: AppTheme.radius.xl,
    padding: AppTheme.spacing.lg,
    ...AppTheme.cardShadow,
  },
  title: { fontSize: 26, fontWeight: '800', color: AppTheme.primaryDark, letterSpacing: -0.3 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: AppTheme.radius.full },
  lost: { backgroundColor: AppTheme.badgeLostBg },
  found: { backgroundColor: AppTheme.badgeFoundBg },
  claimed: { backgroundColor: AppTheme.accent },
  badgeTxt: { fontWeight: '700', textTransform: 'capitalize', color: AppTheme.primaryDark },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  meta: { flex: 1, fontSize: 15, color: AppTheme.textSecondary },
  section: {
    marginTop: 22,
    fontSize: 16,
    fontWeight: '800',
    color: AppTheme.primaryDark,
  },
  descBox: {
    marginTop: 10,
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.surface,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  body: { fontSize: 15, lineHeight: 23, color: AppTheme.text },
});
