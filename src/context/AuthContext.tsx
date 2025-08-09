
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onIdTokenChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup, getIdTokenResult, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, displayName: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<any>;
  setupRecaptcha: (elementId: string) => RecaptchaVerifier;
  sendVerificationCode: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  confirmVerificationCode: (confirmationResult: ConfirmationResult, code: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const saveUserToDb = async (user: User) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
             await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber,
                createdAt: serverTimestamp(),
            }, { merge: true });
        }
    } catch (error) {
        console.error("Error saving user to Firestore:", error);
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        await saveUserToDb(user);
        const idTokenResult = await user.getIdTokenResult(true); // Force refresh
        setIsAdmin(!!idTokenResult.claims.isAdmin);
        setUser(user);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    const updatedUser = { ...userCredential.user, displayName };
    await saveUserToDb(updatedUser as User);
    setUser(updatedUser as User); 
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };
  
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await saveUserToDb(result.user);
    return result;
  };

  const setupRecaptcha = (elementId: string) => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    return (window as any).recaptchaVerifier;
  }

  const sendVerificationCode = (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  }

  const confirmVerificationCode = async (confirmationResult: ConfirmationResult, code: string) => {
    const result = await confirmationResult.confirm(code);
    await saveUserToDb(result.user);
    return result;
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, signup, logout, loginWithGoogle, setupRecaptcha, sendVerificationCode, confirmVerificationCode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
