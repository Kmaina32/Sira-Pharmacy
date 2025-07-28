'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, displayName: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const saveUserToDb = async (user: User) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
        const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        // Check if the document exists, if not it's a new user.
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
             await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                isAdmin: isAdmin,
                createdAt: new Date(),
            });
        } else {
            // Only update what's necessary for existing users
             await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                isAdmin: isAdmin,
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userIsAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        setIsAdmin(userIsAdmin);
        await saveUserToDb(user);
      } else {
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
    // Manually update the user object to reflect the new display name immediately
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

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, signup, logout, loginWithGoogle }}>
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
