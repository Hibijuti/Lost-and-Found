import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDTErjyHzp7hkam_s5sYQpHtKtugeNXDPA",
  authDomain: "l-and-f-9cedf.firebaseapp.com",
  projectId: "l-and-f-9cedf",
  storageBucket: "l-and-f-9cedf.firebasestorage.app",
  messagingSenderId: "470239896461",
  appId: "1:470239896461:web:3b8362b984b460eb43d3c4",
  measurementId: "G-FLL5SGV3VL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);