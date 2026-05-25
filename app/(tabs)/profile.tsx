import { AppButton } from '@/components/lf/AppButton';
import { AppTheme } from '@/constants/appTheme';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

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
  const hasPhoto = Boolean(userProfile.photoUrl?.trim());

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        {hasPhoto ? (
          <Image
            source={{ uri: userProfile.photoUrl }}
            style={styles.avatarImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(userProfile.name)}</Text>
          </View>
        )}
        <Text style={styles.name}>{userProfile.name}</Text>
        <View style={[styles.rolePill, isAdmin && styles.roleAdmin]}>
          <Ionicons
            name={isAdmin ? 'shield-checkmark' : 'school'}
            size={14}
            color={isAdmin ? AppTheme.accent : AppTheme.textOnPrimary}
          />
          <Text style={styles.role}>{userProfile.role}</Text>
        </View>
      </View>

      <Pressable
        style={styles.editBtn}
        onPress={() => router.push('/edit-profile' as Href)}>
        <Ionicons name="create-outline" size={22} color={AppTheme.textOnPrimary} />
        <Text style={styles.editBtnText}>Edit profile</Text>
        <Ionicons name="chevron-forward" size={20} color={AppTheme.accent} />
      </Pressable>

      <Field icon="card-outline" label="Student ID" value={userProfile.studentId} />
      <Field icon="mail-outline" label="Email" value={userProfile.email} />
      <Field icon="call-outline" label="Phone" value={userProfile.phone || '—'} />
      <Field icon="link-outline" label="Social" value={userProfile.socialLink || '—'} />

      {isAdmin ? (
        <Pressable style={styles.adminBtn} onPress={() => router.push('/admin' as Href)}>
          <Ionicons name="settings-outline" size={22} color={AppTheme.textOnPrimary} />
          <Text style={styles.adminBtnText}>Open admin panel</Text>
          <Ionicons name="chevron-forward" size={20} color={AppTheme.accent} />
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

function Field({
  icon,
  label,
  value,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldIcon}>
        <Ionicons name={icon} size={18} color={AppTheme.primary} />
      </View>
      <View style={styles.fieldBody}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: AppTheme.surface },
  muted: { color: AppTheme.textMuted },
  scroll: { padding: AppTheme.spacing.md, paddingBottom: 32, gap: 12 },
  heroCard: {
    alignItems: 'center',
    backgroundColor: AppTheme.surfaceCard,
    paddingVertical: AppTheme.spacing.xl,
    paddingHorizontal: AppTheme.spacing.lg,
    borderRadius: AppTheme.radius.lg,
    borderWidth: 1,
    borderColor: AppTheme.border,
    ...AppTheme.cardShadow,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: AppTheme.spacing.md,
    borderWidth: 3,
    borderColor: AppTheme.primary,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: AppTheme.spacing.md,
    borderWidth: 3,
    borderColor: AppTheme.primary,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: AppTheme.primaryDark },
  name: { fontSize: 22, fontWeight: '800', color: AppTheme.primaryDark },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: AppTheme.radius.full,
    backgroundColor: AppTheme.primary,
  },
  roleAdmin: { backgroundColor: AppTheme.primaryDark },
  role: {
    fontSize: 13,
    fontWeight: '700',
    color: AppTheme.textOnPrimary,
    textTransform: 'capitalize',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: AppTheme.primaryLight,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.md,
    ...AppTheme.cardShadow,
  },
  editBtnText: { flex: 1, color: AppTheme.textOnPrimary, fontWeight: '700', fontSize: 16 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: AppTheme.surfaceCard,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    borderColor: AppTheme.border,
    ...AppTheme.softShadow,
  },
  fieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldBody: { flex: 1 },
  fieldLabel: { fontSize: 12, color: AppTheme.textSecondary, marginBottom: 2, fontWeight: '600' },
  fieldValue: { fontSize: 16, color: AppTheme.inputText, fontWeight: '600' },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: AppTheme.primary,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.md,
    ...AppTheme.cardShadow,
  },
  adminBtnText: { flex: 1, color: AppTheme.textOnPrimary, fontWeight: '700', fontSize: 16 },
});
