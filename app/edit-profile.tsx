import { AppButton } from '@/components/lf/AppButton';
import { AppTextField } from '@/components/lf/AppTextField';
import { ReadOnlyField } from '@/components/lf/ReadOnlyField';
import { AppTheme } from '@/constants/appTheme';
import { useAuth } from '@/context/AuthContext';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUpload';
import { hasProfileErrors, validateProfileForm } from '@/lib/profileValidation';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function EditProfileScreen() {
  const { userProfile, updateProfile } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userProfile) return;
    setName(userProfile.name);
    setPhone(userProfile.phone ?? '');
    setSocialLink(userProfile.socialLink ?? '');
    setPhotoUrl(userProfile.photoUrl);
    setLocalPhotoUri(null);
  }, [userProfile]);

  async function pickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission', 'Photo library access is needed to change your profile picture.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    const asset = res.assets?.[0];
    if (!res.canceled && asset?.uri) {
      setLocalPhotoUri(asset.uri);
    }
  }

  async function onSave() {
    const validation = validateProfileForm({ name, phone, socialLink });
    if (hasProfileErrors(validation)) {
      setErrors(validation as Record<string, string>);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      let nextPhotoUrl = photoUrl ?? '';
      if (localPhotoUri) {
        nextPhotoUrl = await uploadImageToCloudinary(localPhotoUri);
      }
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        socialLink: socialLink.trim(),
        photoUrl: nextPhotoUrl,
      });
      Alert.alert('Profile updated', 'Your changes have been saved.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not save profile.';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  }

  if (!userProfile) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Profile not loaded.</Text>
      </View>
    );
  }

  const avatarSource = localPhotoUri ?? (photoUrl ? { uri: photoUrl } : null);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>Update your display info. Email and Student ID cannot be changed.</Text>

        <Pressable style={styles.avatarWrap} onPress={pickPhoto}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatarImage} contentFit="cover" />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{initials(name || userProfile.name)}</Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={18} color={AppTheme.textOnPrimary} />
          </View>
        </Pressable>
        <Text style={styles.avatarHint}>Tap to change profile photo</Text>

        <AppTextField
          label="Full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholder="Your display name"
          error={errors.name}
        />
        <ReadOnlyField
          label="Student ID"
          value={userProfile.studentId}
          hint="Cannot be changed after registration"
          icon="card-outline"
        />
        <ReadOnlyField
          label="Email"
          value={userProfile.email}
          hint="Cannot be changed without verification"
          icon="mail-outline"
        />
        <AppTextField
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Mobile number (optional)"
          error={errors.phone}
        />
        <AppTextField
          label="Social link"
          value={socialLink}
          onChangeText={setSocialLink}
          autoCapitalize="none"
          placeholder="https:// (optional)"
          error={errors.socialLink}
        />

        <AppButton title="Save changes" onPress={onSave} loading={saving} />
        <AppButton title="Cancel" variant="outline" onPress={() => router.back()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: AppTheme.surface },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  muted: { color: AppTheme.textMuted },
  scroll: { padding: AppTheme.spacing.md, paddingBottom: 40 },
  lead: {
    fontSize: 14,
    lineHeight: 21,
    color: AppTheme.textSecondary,
    marginBottom: AppTheme.spacing.lg,
  },
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: AppTheme.primary,
  },
  avatarFallback: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: AppTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: AppTheme.primary,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: AppTheme.primaryDark },
  cameraBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AppTheme.surfaceCard,
  },
  avatarHint: {
    textAlign: 'center',
    fontSize: 13,
    color: AppTheme.textMuted,
    marginBottom: AppTheme.spacing.lg,
  },
});
