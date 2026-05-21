import { AnimatedListItem } from '@/components/lf/AnimatedListItem';
import { EmptyState } from '@/components/lf/EmptyState';
import { ItemCard } from '@/components/lf/ItemCard';
import { LoadingView } from '@/components/lf/LoadingView';
import { AppTheme } from '@/constants/appTheme';
import { fetchRecentItems, type LostFoundItem } from '@/lib/items';
import type { Href } from 'expo-router';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

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
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}

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
            colors={[AppTheme.primary]}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <AnimatedListItem index={index}>
            <ItemCard item={item} onPress={() => router.push(`/item/${item.id}` as Href)} />
          </AnimatedListItem>
        )}
        ListEmptyComponent={
          !error ? (
            <EmptyState
              title="No items yet"
              hint="Post from the Post tab once your listing is approved by an admin."
              icon="images-outline"
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.surface },
  list: { paddingHorizontal: AppTheme.spacing.md, paddingBottom: 28, paddingTop: 4 },
  errorBox: {
    marginHorizontal: AppTheme.spacing.md,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: AppTheme.radius.md,
  },
  error: { color: AppTheme.danger, fontWeight: '600' },
});
