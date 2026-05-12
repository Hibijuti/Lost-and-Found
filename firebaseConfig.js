import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase Web config must NOT live in committed source (secret scanners + hygiene).
 * Copy `.env.example` → `.env`, paste values from Firebase Console → Project settings,
 * then restart `npx expo start`.
 *
 * Expo inlines `EXPO_PUBLIC_*` at bundle time (still visible in the built app — restrict the key in Google Cloud Console).
 */
function requiredEnv(name) {
  const v = process.env[name];
  if (!v || typeof v !== 'string' || !String(v).trim()) {
    throw new Error(
      `[firebaseConfig] Missing ${name}. Copy .env.example to .env and restart Expo (clear cache if needed: expo start -c).`
    );
  }
  return String(v).trim();
}

const firebaseConfig = {
  apiKey: requiredEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: requiredEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: requiredEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: requiredEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requiredEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requiredEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
  ...(process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim()
    ? { measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID.trim() }
    : {}),
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
