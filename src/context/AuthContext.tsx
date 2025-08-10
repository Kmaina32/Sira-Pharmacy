
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onIdTokenChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup, getIdTokenResult, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { logEvent } from '@/lib/logger';

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
        // Use setDoc with merge:true to create or update.
        if (!userDoc.exists()) {
             await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber,
                createdAt: new Date().toISOString(),
                isAdmin: false,
            }, { merge: true });
            await logEvent('success', 'User Signup', `New user registered: ${user.email}`);
        } else {
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber,
            }, { merge: true });
        }
    } catch (error) {
        console.error("Error saving user to Firestore:", error);
        await logEvent('error', 'User Save Failed', `Failed to save user ${user.email} to DB. Reason: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        await saveUserToDb(currentUser); 
        const idTokenResult = await currentUser.getIdTokenResult(true);
        setIsAdmin(!!idTokenResult.claims.isAdmin);
        setUser(currentUser);
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

    // Flag this as a new user so the tutorial can be shown on first login
    localStorage.setItem('is_new_user', 'true');
    
    setUser(userCredential.user);
    const idTokenResult = await userCredential.user.getIdTokenResult(true);
    setIsAdmin(!!idTokenResult.claims.isAdmin);
    
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };
  
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const userRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
        localStorage.setItem('is_new_user', 'true');
    }

    await saveUserToDb(result.user);
    return result;
  };

  const setupRecaptcha = (elementId: string) => {
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
    }
    const recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      'size': 'invisible',
      'callback': (response: any) => {},
      'expired-callback': () => {}
    });
    (window as any).recaptchaVerifier = recaptchaVerifier;
    return recaptchaVerifier;
  }

  const sendVerificationCode = (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  }

  const confirmVerificationCode = async (confirmationResult: ConfirmationResult, code: string) => {
    const result = await confirmationResult.confirm(code);
    
    const userRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
        localStorage.setItem('is_new_user', 'true');
    }

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
