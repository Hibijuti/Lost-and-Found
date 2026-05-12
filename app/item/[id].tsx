import { AppButton } from '@/components/lf/AppButton';
import { LoadingView } from '@/components/lf/LoadingView';
import { AppTheme } from '@/constants/appTheme';
import { getItemById, type LostFoundItem } from '@/lib/items';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * Modal screen: full item details and actions to contact the poster.
 */
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
    <ScrollView contentContainerStyle={styles.scroll}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
      ) : null}

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

      <Text style={styles.meta}>Posted by {item.posterName}</Text>
      <Text style={styles.meta}>Category: {item.category}</Text>
      <Text style={styles.meta}>Location: {item.location}</Text>
      <Text style={styles.meta}>Date: {item.date}</Text>

      <Text style={styles.section}>Description</Text>
      <Text style={styles.body}>{item.description}</Text>

      <Text style={styles.section}>Contact</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: 24 },
  err: { color: AppTheme.danger, marginBottom: 16, textAlign: 'center' },
  scroll: { paddingBottom: 32, backgroundColor: AppTheme.surfaceCard },
  image: { width: '100%', height: 240 },
  title: { fontSize: 24, fontWeight: '800', paddingHorizontal: 20, marginTop: 16, color: AppTheme.primaryDark },
  badges: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginTop: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  lost: { backgroundColor: AppTheme.badgeLostBg },
  found: { backgroundColor: AppTheme.badgeFoundBg },
  claimed: { backgroundColor: AppTheme.accent },
  badgeTxt: { fontWeight: '700', textTransform: 'capitalize', color: AppTheme.primaryDark },
  meta: { paddingHorizontal: 20, marginTop: 6, fontSize: 14, color: AppTheme.textMuted },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: '700',
    color: AppTheme.primaryDark,
  },
  body: {
    marginHorizontal: 20,
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: AppTheme.textMuted,
  },
});
