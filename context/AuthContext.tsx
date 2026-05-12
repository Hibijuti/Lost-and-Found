import { auth, db } from '@/firebaseConfig';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type UserRole = 'student' | 'admin';

export type UserProfile = {
  uid: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  socialLink: string;
  role: UserRole;
  createdAt?: unknown;
};

type AuthContextValue = {
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: {
    email: string;
    password: string;
    name: string;
    studentId: string;
    phone: string;
    socialLink: string;
  }) => Promise<void>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setUserProfile(null);
      return;
    }
    const profile = await fetchUserProfile(uid);
    setUserProfile(profile);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(
    async (params: {
      email: string;
      password: string;
      name: string;
      studentId: string;
      phone: string;
      socialLink: string;
    }) => {
      const cred = await createUserWithEmailAndPassword(auth, params.email, params.password);
      const uid = cred.user.uid;
      const profile: UserProfile = {
        uid,
        name: params.name.trim(),
        studentId: params.studentId.trim(),
        email: params.email.trim().toLowerCase(),
        phone: params.phone.trim(),
        socialLink: params.socialLink.trim(),
        role: 'student',
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', uid), profile);
    },
    []
  );

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const value = useMemo(
    () => ({
      firebaseUser,
      userProfile,
      loading,
      refreshProfile,
      signIn,
      signUp,
      signOutUser,
      resetPassword,
    }),
    [
      firebaseUser,
      userProfile,
      loading,
      refreshProfile,
      signIn,
      signUp,
      signOutUser,
      resetPassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
