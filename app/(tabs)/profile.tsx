import { AppButton } from '@/components/lf/AppButton';
import { AppTheme } from '@/constants/appTheme';
import { useAuth } from '@/context/AuthContext';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * Shows the signed-in user profile, role, and admin entry for admins only.
 */
export default function ProfileTab() {
  const { userProfile, signOutUser } = useAuth();
  const router = useRouter();

  if (!userProfile) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Profile not loaded.</Text>
      </View>
    );
  }

  const isAdmin = userProfile.role === 'admin';

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.card}>
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.role}>{userProfile.role}</Text>
      </View>

      <Field label="Student ID" value={userProfile.studentId} />
      <Field label="Email" value={userProfile.email} />
      <Field label="Phone" value={userProfile.phone || '—'} />
      <Field label="Social" value={userProfile.socialLink || '—'} />

      {isAdmin ? (
        <Pressable style={styles.adminBtn} onPress={() => router.push('/admin' as Href)}>
          <Text style={styles.adminBtnText}>Open admin panel</Text>
        </Pressable>
      ) : null}

      <AppButton
        title="Sign out"
        variant="outline"
        onPress={async () => {
          await signOutUser();
          router.replace('/(auth)/login' as Href);
        }}
      />
    </ScrollView>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  muted: { color: AppTheme.textMuted },
  scroll: { padding: 20, gap: 12, backgroundColor: AppTheme.surface },
  card: {
    backgroundColor: AppTheme.surfaceCard,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppTheme.border,
    ...AppTheme.cardShadow,
  },
  name: { fontSize: 22, fontWeight: '800', color: AppTheme.primaryDark },
  role: { marginTop: 4, fontSize: 14, fontWeight: '600', color: AppTheme.primary, textTransform: 'capitalize' },
  field: {
    backgroundColor: AppTheme.surfaceCard,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  fieldLabel: { fontSize: 12, color: AppTheme.textMuted, marginBottom: 4 },
  fieldValue: { fontSize: 16, color: AppTheme.primaryDark },
  adminBtn: {
    backgroundColor: AppTheme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  adminBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
