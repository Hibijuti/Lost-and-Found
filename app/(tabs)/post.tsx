import { AppButton } from '@/components/lf/AppButton';
import { AppTextField } from '@/components/lf/AppTextField';
import { DatePickerField } from '@/components/lf/DatePickerField';
import { CategoryPicker } from '@/components/lf/CategoryPicker';
import { StatusSegment } from '@/components/lf/StatusSegment';
import { AppTheme } from '@/constants/appTheme';
import { useAuth } from '@/context/AuthContext';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUpload';
import { createItem, type ItemStatus } from '@/lib/items';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function PostTab() {
  const { userProfile, firebaseUser } = useAuth();
  const router = useRouter();
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<ItemStatus>('lost');
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
    if (!itemName.trim() || !category || !description.trim() || !location.trim() || !date) {
      Alert.alert('Missing fields', 'Fill in all fields, pick a category, and select a date.');
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
        category,
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
            setStatus('lost');
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
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.tipBox}>
            <Ionicons name="information-circle" size={22} color={AppTheme.primary} />
            <Text style={styles.lead}>
              Upload a clear photo. New posts stay hidden until an administrator approves them.
            </Text>
          </View>

          <Pressable style={styles.imagePick} onPress={pickImage}>
            {pickedImage?.uri ? (
              <Image source={{ uri: pickedImage.uri }} style={styles.preview} />
            ) : (
              <View style={styles.imagePickEmpty}>
                <Ionicons name="camera" size={40} color={AppTheme.primary} />
                <Text style={styles.imagePickText}>Tap to add photo</Text>
              </View>
            )}
          </Pressable>

          <AppTextField
            label="Item name"
            value={itemName}
            onChangeText={setItemName}
            placeholder="e.g. Black wallet, student ID card"
          />
          <CategoryPicker label="Category" value={category} onChange={setCategory} required />
          <StatusSegment value={status} onChange={setStatus} />

          <AppTextField
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Color, brand, and unique details"
            multiline
            style={{ minHeight: 100, textAlignVertical: 'top' }}
          />
          <AppTextField
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Building, room, or campus area"
          />
          <DatePickerField label="Date (when lost/found)" value={date} onChange={setDate} />

          <AppButton title="Submit listing" onPress={onSubmit} loading={submitting} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppTheme.surface,
  },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    padding: AppTheme.spacing.md,
    paddingBottom: 40,
  },
  tipBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: AppTheme.surfaceCard,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.md,
    marginBottom: AppTheme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: AppTheme.primary,
    ...AppTheme.softShadow,
  },
  lead: { flex: 1, fontSize: 14, color: AppTheme.textSecondary, lineHeight: 21 },
  imagePick: {
    height: 200,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.surfaceCard,
    borderWidth: 2,
    borderColor: AppTheme.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.lg,
    overflow: 'hidden',
    ...AppTheme.softShadow,
  },
  imagePickEmpty: { alignItems: 'center', gap: 8 },
  preview: { width: '100%', height: '100%' },
  imagePickText: { color: AppTheme.primary, fontWeight: '700', fontSize: 15 },
});
