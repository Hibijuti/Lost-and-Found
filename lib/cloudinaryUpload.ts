import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/constants/cloudinary';

type UploadOpts = {
  /** From expo-image-picker `asset.mimeType` — avoids wrong Content-Type on Android. */
  mimeType?: string | null;
  fileName?: string | null;
};

function mimeFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.heic') || lower.endsWith('.heif')) return 'image/heic';
  return 'image/jpeg';
}

/**
 * Uploads a local image URI to Cloudinary (unsigned preset).
 */
export async function uploadImageToCloudinary(localUri: string, opts?: UploadOpts): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME?.trim() || !CLOUDINARY_UPLOAD_PRESET?.trim()) {
    throw new Error(
      'Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in constants/cloudinary.ts'
    );
  }

  const pathOnly = localUri.split('?')[0];
  const fallbackName = pathOnly.split('/').pop() ?? 'upload.jpg';
  const name = opts?.fileName?.trim() || fallbackName || 'upload.jpg';
  const type =
    (opts?.mimeType && opts.mimeType.trim()) ||
    mimeFromName(name);

  const form = new FormData();
  form.append('file', {
    uri: localUri,
    type,
    name: name.includes('.') ? name : `${name}.jpg`,
  } as unknown as Blob);
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME.trim()}/image/upload`,
    { method: 'POST', body: form }
  );

  const json = (await res.json()) as { secure_url?: string; error?: { message?: string } };
  if (!res.ok) {
    const detail = json?.error?.message ?? res.statusText ?? 'Unknown error';
    throw new Error(`Cloudinary upload failed: ${detail}`);
  }
  if (!json.secure_url) {
    throw new Error('Cloudinary upload failed: no secure_url in response');
  }
  return json.secure_url;
}
