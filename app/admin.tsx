import { AppButton } from '@/components/lf/AppButton';
import { AppTextField } from '@/components/lf/AppTextField';
import { LoadingView } from '@/components/lf/LoadingView';
import { AppTheme } from '@/constants/appTheme';
import { useAuth } from '@/context/AuthContext';
import {
  deleteItem,
  fetchAllItemsAdmin,
  type ItemStatus,
  type LostFoundItem,
  updateItem,
} from '@/lib/items';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

/**
 * Admin-only: approve, edit, delete, and mark listings as claimed.
 * Promote a user to admin in Firestore: users/{uid}.role = "admin".
 */
export default function AdminScreen() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState<LostFoundItem | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent;
    if (!silent) setLoading(true);
    try {
      const data = await fetchAllItemsAdmin();
      setItems(data);
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Load failed');
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!userProfile) return;
    if (userProfile.role !== 'admin') {
      setLoading(false);
      return;
    }
    load();
  }, [userProfile, load]);

  async function onSaveEdit() {
    if (!editing) return;
    setSaving(true);
    try {
      await updateItem(editing.id, {
        itemName: editing.itemName,
        category: editing.category,
        description: editing.description,
        location: editing.location,
        date: editing.date,
        imageUrl: editing.imageUrl,
        status: editing.status,
        claimed: editing.claimed,
        approved: editing.approved,
      });
      setEditing(null);
      await load({ silent: true });
      Alert.alert('Saved');
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (!userProfile) {
    return <LoadingView message="Checking access…" />;
  }

  if (userProfile.role !== 'admin') {
    return (
      <View style={styles.denied}>
        <Text style={styles.deniedTitle}>Admins only</Text>
        <Text style={styles.deniedHint}>Set role to &quot;admin&quot; on your user document in Firestore.</Text>
        <AppButton title="Go back" onPress={() => router.back()} />
      </View>
    );
  }

  if (loading && items.length === 0) {
    return <LoadingView message="Loading admin data…" />;
  }

  return (
    <View style={styles.flex}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load({ silent: true });
            }}
            tintColor={AppTheme.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          <Text style={styles.hint}>Pending items have approved = false and are hidden from students.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.itemName}
            </Text>
            <Text style={styles.cardMeta}>
              {item.status} · {item.claimed ? 'claimed' : 'open'} ·{' '}
              {item.approved ? 'approved' : 'pending'}
            </Text>
            <View style={styles.actions}>
              {!item.approved ? (
                <Pressable
                  style={styles.smallBtn}
                  onPress={async () => {
                    await updateItem(item.id, { approved: true });
                    load({ silent: true });
                  }}>
                  <Text style={styles.smallBtnText}>Approve</Text>
                </Pressable>
              ) : null}
              <Pressable style={styles.smallBtn} onPress={() => setEditing({ ...item })}>
                <Text style={styles.smallBtnText}>Edit</Text>
              </Pressable>
              <Pressable
                style={styles.smallBtn}
                onPress={async () => {
                  await updateItem(item.id, { claimed: !item.claimed });
                  load({ silent: true });
                }}>
                <Text style={styles.smallBtnText}>{item.claimed ? 'Unclaim' : 'Claimed'}</Text>
              </Pressable>
              <Pressable
                style={[styles.smallBtn, styles.dangerBtn]}
                onPress={() => {
                  Alert.alert('Delete listing?', item.itemName, [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        await deleteItem(item.id);
                        load({ silent: true });
                      },
                    },
                  ]);
                }}>
                <Text style={styles.smallBtnText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Modal visible={!!editing} animationType="slide" onRequestClose={() => setEditing(null)}>
        <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.modalTitle}>Edit listing</Text>
          {editing ? (
            <>
              <AppTextField label="Name" value={editing.itemName} onChangeText={(t) => setEditing({ ...editing, itemName: t })} />
              <AppTextField label="Category" value={editing.category} onChangeText={(t) => setEditing({ ...editing, category: t })} />
              <AppTextField
                label="Description"
                value={editing.description}
                onChangeText={(t) => setEditing({ ...editing, description: t })}
                multiline
                style={{ minHeight: 100, textAlignVertical: 'top' }}
              />
              <AppTextField label="Location" value={editing.location} onChangeText={(t) => setEditing({ ...editing, location: t })} />
              <AppTextField label="Date" value={editing.date} onChangeText={(t) => setEditing({ ...editing, date: t })} />
              <AppTextField
                label="Image URL"
                value={editing.imageUrl}
                onChangeText={(t) => setEditing({ ...editing, imageUrl: t })}
                autoCapitalize="none"
              />

              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={editing.status}
                  onValueChange={(v) => setEditing({ ...editing, status: v as ItemStatus })}>
                  <Picker.Item label="Lost" value="lost" />
                  <Picker.Item label="Found" value="found" />
                </Picker>
              </View>

              <Pressable
                style={styles.toggleRow}
                onPress={() => setEditing({ ...editing, approved: !editing.approved })}>
                <Text style={styles.toggleLabel}>Approved (visible on feed)</Text>
                <Text style={styles.toggleVal}>{editing.approved ? 'Yes' : 'No'}</Text>
              </Pressable>
              <Pressable
                style={styles.toggleRow}
                onPress={() => setEditing({ ...editing, claimed: !editing.claimed })}>
                <Text style={styles.toggleLabel}>Claimed</Text>
                <Text style={styles.toggleVal}>{editing.claimed ? 'Yes' : 'No'}</Text>
              </Pressable>

              <AppButton title="Save changes" onPress={onSaveEdit} loading={saving} />
              <AppButton title="Cancel" variant="outline" onPress={() => setEditing(null)} />
            </>
          ) : null}
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: AppTheme.surface },
  denied: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: AppTheme.surface },
  deniedTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  deniedHint: { fontSize: 14, color: AppTheme.textMuted, textAlign: 'center', marginBottom: 20 },
  hint: { padding: 16, fontSize: 13, color: AppTheme.textMuted },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    backgroundColor: AppTheme.surfaceCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppTheme.border,
    ...AppTheme.cardShadow,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: AppTheme.primaryDark },
  cardMeta: { marginTop: 6, fontSize: 13, color: AppTheme.textMuted },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: AppTheme.primary,
    borderRadius: 8,
  },
  dangerBtn: { backgroundColor: AppTheme.danger },
  smallBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  modalScroll: { padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#334155' },
  pickerWrap: {
    borderWidth: 1,
    borderColor: AppTheme.border,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.border,
    marginBottom: 12,
  },
  toggleLabel: { fontSize: 15, fontWeight: '600' },
  toggleVal: { fontSize: 15, color: AppTheme.primary, fontWeight: '700' },
});
