'use client';

import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';

const ThemeUpdater = () => {
  const { settings, loading } = useSettings();

  useEffect(() => {
    if (!loading && document.documentElement) {
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
      document.documentElement.style.setProperty('--accent', settings.accentColor);
    }
  }, [settings, loading]);

  return null;
};

export default ThemeUpdater;
