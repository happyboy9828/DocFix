import { useCallback, useEffect, useState } from 'react';
import {
  ResolvedTheme,
  ThemePreference,
  readStoredPreference,
  resolveTheme,
  syncTheme,
  writeStoredPreference
} from './theme';

interface ThemeController {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  cycle: () => void;
}

const ORDER: ThemePreference[] = ['light', 'dark', 'system'];

/**
 * Owns the active theme. The <html> class is written on mount from the stored
 * preference, and re-written whenever the OS colour scheme changes while the
 * user is on "system".
 */
export const useTheme = (): ThemeController => {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readStoredPreference());
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveTheme(readStoredPreference()));

  useEffect(() => {
    setResolved(syncTheme(preference));
  }, [preference]);

  useEffect(() => {
    if (preference !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolved(syncTheme('system'));
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    writeStoredPreference(next);
    setPreferenceState(next);
  }, []);

  const cycle = useCallback(() => {
    setPreferenceState((current) => {
      const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
      writeStoredPreference(next);
      return next;
    });
  }, []);

  return { preference, resolved, setPreference, cycle };
};
