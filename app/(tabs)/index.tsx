import { EmptyState } from '@/components/lf/EmptyState';
import { ItemCard } from '@/components/lf/ItemCard';
import { LoadingView } from '@/components/lf/LoadingView';
import { AppTheme } from '@/constants/appTheme';
import { fetchRecentItems, type LostFoundItem } from '@/lib/items';
import type { Href } from 'expo-router';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

/**
 * Home feed: latest approved listings from Firestore.
 */
export default function HomeTab() {
  const router = useRouter();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchRecentItems(20);
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load items.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  if (loading && items.length === 0) {
    return <LoadingView message="Loading feed…" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent listings</Text>
        <Text style={styles.sub}>Approved lost & found posts from your campus.</Text>
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={AppTheme.primary}
            />
          }
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => router.push(`/item/${item.id}` as Href)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="No items yet"
              hint="Post from the Post tab once your listing is approved by an admin."
              icon="images-outline"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.surface },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: AppTheme.primaryDark },
  sub: { fontSize: 14, color: AppTheme.textMuted, marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  error: { color: AppTheme.danger, paddingHorizontal: 20 },
});
