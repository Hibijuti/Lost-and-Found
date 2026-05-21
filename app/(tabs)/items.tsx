import { AnimatedListItem } from '@/components/lf/AnimatedListItem';
import { AppTextField } from '@/components/lf/AppTextField';
import { CategoryPicker } from '@/components/lf/CategoryPicker';
import { EmptyState } from '@/components/lf/EmptyState';
import { FilterChip } from '@/components/lf/FilterChip';
import { ItemCard } from '@/components/lf/ItemCard';
import { LoadingView } from '@/components/lf/LoadingView';
import { AppTheme } from '@/constants/appTheme';
import { fetchItemsFiltered, type ItemStatus, type LostFoundItem } from '@/lib/items';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

const STATUS_OPTIONS: { key: ItemStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'lost', label: 'Lost' },
  { key: 'found', label: 'Found' },
];

export default function ItemsTab() {
  const router = useRouter();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<ItemStatus | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const isFirstFilterRun = useRef(true);

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

  // Initial load
  useEffect(() => {
    load();
  }, [load]);

  // Auto-apply filters when search, category, or status changes (debounce search)
  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
      return;
    }
    const delay = search.trim() ? 400 : 0;
    const timer = setTimeout(() => {
      setRefreshing(true);
      load();
    }, delay);
    return () => clearTimeout(timer);
  }, [status, category, search, load]);

  if (loading && items.length === 0) {
    return <LoadingView message="Loading items…" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <AppTextField
          label="Search"
          value={search}
          onChangeText={setSearch}
          placeholder="Search item name, location, or description"
        />
        <CategoryPicker
          label="Category"
          value={category}
          onChange={setCategory}
          allowEmpty
        />
        <Text style={styles.filterLabel}>Status</Text>
        <View style={styles.row}>
          {STATUS_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.key}
              label={opt.label}
              selected={status === opt.key}
              onPress={() => setStatus(opt.key)}
            />
          ))}
        </View>
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
          <EmptyState
            title="No matches"
            hint="Try different keywords or clear filters."
            icon="search-outline"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.surface },
  filters: {
    marginHorizontal: AppTheme.spacing.md,
    marginTop: 4,
    marginBottom: 8,
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.surfaceCard,
    borderRadius: AppTheme.radius.lg,
    ...AppTheme.cardShadow,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: AppTheme.inputLabel,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  list: { paddingHorizontal: AppTheme.spacing.md, paddingBottom: 28 },
  error: { color: AppTheme.danger, paddingHorizontal: AppTheme.spacing.md, fontWeight: '600' },
});
