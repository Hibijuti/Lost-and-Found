import { AppButton } from '@/components/lf/AppButton';
import { AppTextField } from '@/components/lf/AppTextField';
import { AppTheme } from '@/constants/appTheme';
import { useAuth } from '@/context/AuthContext';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUpload';
import { createItem, type ItemStatus } from '@/lib/items';
import * as ImagePicker from 'expo-image-picker';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

/**
 * Report a lost or found item: pick photo → Cloudinary → Firestore doc (pending approval).
 */
export default function PostTab() {
  const { userProfile, firebaseUser } = useAuth();
  const router = useRouter();
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<ItemStatus>('lost');
  /** Keep picker metadata so Cloudinary gets correct MIME type (fixes many RN/Android upload errors). */
  const [pickedImage, setPickedImage] = useState<{
    uri: string;
    mimeType?: string | null;
    fileName?: string | null;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission', 'Photo library access is needed to attach an image.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    const asset = res.assets?.[0];
    if (!res.canceled && asset?.uri) {
      setPickedImage({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
      });
    }
  }

  async function onSubmit() {
    if (!firebaseUser || !userProfile) {
      Alert.alert('Sign in required', 'Please sign in again.');
      return;
    }
    if (!itemName.trim() || !description.trim() || !location.trim() || !date.trim()) {
      Alert.alert('Missing fields', 'Fill in name, description, where, and date.');
      return;
    }
    if (!pickedImage?.uri) {
      Alert.alert('Photo', 'Add a photo of the item.');
      return;
    }
    setSubmitting(true);
    try {
      const imageUrl = await uploadImageToCloudinary(pickedImage.uri, {
        mimeType: pickedImage.mimeType,
        fileName: pickedImage.fileName,
      });
      await createItem({
        itemName: itemName.trim(),
        category: category.trim() || 'General',
        description: description.trim(),
        location: location.trim(),
        date: date.trim(),
        imageUrl,
        status,
        postedBy: firebaseUser.uid,
        posterName: userProfile.name,
        posterEmail: userProfile.email,
        posterPhone: userProfile.phone,
      });
      Alert.alert('Submitted', 'An admin will review your listing before it appears on the feed.', [
        {
          text: 'OK',
          onPress: () => {
            setItemName('');
            setCategory('');
            setDescription('');
            setLocation('');
            setDate('');
            setPickedImage(null);
            router.push('/(tabs)' as Href);
          },
        },
      ]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not post item.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.lead}>
        Upload a clear photo. New posts stay hidden until an administrator approves them.
      </Text>

      <Pressable style={styles.imagePick} onPress={pickImage}>
        {pickedImage?.uri ? (
          <Image source={{ uri: pickedImage.uri }} style={styles.preview} />
        ) : (
          <Text style={styles.imagePickText}>Tap to choose image</Text>
        )}
      </Pressable>

      <AppTextField label="Item name" value={itemName} onChangeText={setItemName} />
      <AppTextField label="Category" value={category} onChangeText={setCategory} placeholder="Wallet, ID, keys…" />

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={status} onValueChange={(v) => setStatus(v as ItemStatus)}>
          <Picker.Item label="Lost" value="lost" />
          <Picker.Item label="Found" value="found" />
        </Picker>
      </View>

      <AppTextField
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ minHeight: 100, textAlignVertical: 'top' }}
      />
      <AppTextField label="Location" value={location} onChangeText={setLocation} placeholder="Building, room, desk…" />
      <AppTextField label="Date (when lost/found)" value={date} onChangeText={setDate} placeholder="e.g. 2026-05-01" />

      <AppButton title="Submit listing" onPress={onSubmit} loading={submitting} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40, backgroundColor: AppTheme.surfaceCard },
  lead: { fontSize: 14, color: AppTheme.textMuted, marginBottom: 16, lineHeight: 20 },
  imagePick: {
    height: 180,
    borderRadius: 14,
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  preview: { width: '100%', height: '100%' },
  imagePickText: { color: AppTheme.primary, fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#334155' },
  pickerWrap: {
    borderWidth: 1,
    borderColor: AppTheme.border,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
});
