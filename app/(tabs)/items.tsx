import { EmptyState } from '@/components/lf/EmptyState';
import { ItemCard } from '@/components/lf/ItemCard';
import { LoadingView } from '@/components/lf/LoadingView';
import { AppTextField } from '@/components/lf/AppTextField';
import { AppTheme } from '@/constants/appTheme';
import { fetchItemsFiltered, type ItemStatus, type LostFoundItem } from '@/lib/items';
import type { Href } from 'expo-router';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

const STATUS_OPTIONS: { key: ItemStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'lost', label: 'Lost' },
  { key: 'found', label: 'Found' },
];

/**
 * Browse all approved items with search and status filter.
 */
export default function ItemsTab() {
  const router = useRouter();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<ItemStatus | 'all'>('all');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchItemsFiltered({
        status,
        search: search.trim(),
        category: category.trim(),
      });
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not load items.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status, search, category]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const chips = useMemo(
    () =>
      STATUS_OPTIONS.map((opt) => (
        <Pressable
          key={opt.key}
          onPress={() => setStatus(opt.key)}
          style={[styles.chip, status === opt.key && styles.chipOn]}>
          <Text style={[styles.chipText, status === opt.key && styles.chipTextOn]}>{opt.label}</Text>
        </Pressable>
      )),
    [status]
  );

  if (loading && items.length === 0) {
    return <LoadingView message="Loading items…" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <AppTextField label="Search" value={search} onChangeText={setSearch} placeholder="Name, place…" />
        <AppTextField label="Category (optional)" value={category} onChangeText={setCategory} placeholder="e.g. Electronics" />
        <View style={styles.row}>{chips}</View>
        <Pressable style={styles.apply} onPress={() => { setLoading(true); load(); }}>
          <Text style={styles.applyText}>Apply filters</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

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
          <EmptyState title="No matches" hint="Try different keywords or clear filters." icon="search-outline" />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.surface },
  filters: { paddingHorizontal: 16, paddingTop: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  chipOn: { backgroundColor: AppTheme.primary },
  chipText: { fontWeight: '600', color: '#334155' },
  chipTextOn: { color: '#fff' },
  apply: {
    alignSelf: 'flex-start',
    backgroundColor: AppTheme.surface,
    paddingVertical: 8,
    marginBottom: 8,
  },
  applyText: { color: AppTheme.primary, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  error: { color: AppTheme.danger, paddingHorizontal: 16 },
});
