
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

interface Settings {
    appName: string;
    heroImageUrl: string;
    primaryColor: string;
    accentColor: string;
    whatsAppNumber?: string;
    stripePublishableKey?: string;
    paypalClientId?: string;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}

const defaultSettings: Settings = {
    appName: 'Sira Pharmacy',
    heroImageUrl: 'https://antdisplay.com/pub/media/furniture/022e9691c5ba65d23cbf27a53f83163e.jpg',
    primaryColor: '210 70% 50%',
    accentColor: '180 60% 40%',
    whatsAppNumber: '254757586253',
    stripePublishableKey: '',
    paypalClientId: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const docRef = doc(db, 'settings', 'store_config');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...defaultSettings, ...docSnap.data() });
      } else {
        setSettings(defaultSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      setSettings(defaultSettings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (!isAdmin) {
        throw new Error("You don't have permission to update settings.");
    }
    const docRef = doc(db, 'settings', 'store_config');
    await setDoc(docRef, newSettings, { merge: true });
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
