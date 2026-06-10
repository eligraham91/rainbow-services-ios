import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme, Theme, ACCENT_CHOICES } from './colors';
import { setHapticsEnabled } from '@utils/haptics';

type ThemeOverride = 'light' | 'dark' | 'system';

// Quiet Mode dial (EXPERIENCE-2026.md §5.5). One setting that tunes the whole
// sensory system: Full (all motion + haptics), Soft (entrances on, idle motion
// off, haptics on), Still (the reduceMotion experience by choice, haptics off
// except safety warnings). Control over stimulus is regulation.
export type QuietMode = 'full' | 'soft' | 'still';

// MMKV persistence — wrapped so the file is still importable in Expo Go
let _getOverride: () => ThemeOverride = () => 'system';
let _setOverridePersist: (o: ThemeOverride) => void = () => {};
let _getAccent: () => string = () => 'violet';
let _setAccentPersist: (id: string) => void = () => {};
let _getQuiet: () => QuietMode = () => 'full';
let _setQuietPersist: (q: QuietMode) => void = () => {};
try {
  const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
  const storage = createMMKV({ id: 'sh-flags' });
  _getOverride = () => (storage.getString('sh_theme') as ThemeOverride) ?? 'system';
  _setOverridePersist = (o) => storage.set('sh_theme', o);
  _getAccent = () => storage.getString('sh_accent') ?? 'violet';
  _setAccentPersist = (id) => storage.set('sh_accent', id);
  _getQuiet = () => (storage.getString('sh_quiet') as QuietMode) ?? 'full';
  _setQuietPersist = (q) => storage.set('sh_quiet', q);
} catch {
  // Expo Go: no persistence, defaults apply
}

interface ThemeContextValue {
  theme: Theme;
  override: ThemeOverride;
  setOverride: (o: ThemeOverride) => void;
  accentId: string;
  setAccentId: (id: string) => void;
  // Mesh blob tint for the current accent, 'r,g,b'
  meshRgb: string;
  quiet: QuietMode;
  setQuiet: (q: QuietMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: LightTheme,
  override: 'system',
  setOverride: () => {},
  accentId: 'violet',
  setAccentId: () => {},
  meshRgb: ACCENT_CHOICES[0].meshLight,
  quiet: 'full',
  setQuiet: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [override, setOverrideState] = useState<ThemeOverride>(_getOverride);
  const [accentId, setAccentState] = useState<string>(_getAccent);

  const setOverride = (o: ThemeOverride) => {
    _setOverridePersist(o);
    setOverrideState(o);
  };

  const [quiet, setQuietState] = useState<QuietMode>(_getQuiet);

  const setAccentId = (id: string) => {
    _setAccentPersist(id);
    setAccentState(id);
  };

  const setQuiet = (q: QuietMode) => {
    _setQuietPersist(q);
    setQuietState(q);
  };

  // Still turns off all haptics except safety warnings
  useEffect(() => {
    setHapticsEnabled(quiet !== 'still');
  }, [quiet]);

  const resolved = override === 'system' ? scheme : override;
  const dark = resolved === 'dark';

  const { theme, meshRgb } = useMemo(() => {
    const base = dark ? DarkTheme : LightTheme;
    const choice = ACCENT_CHOICES.find(a => a.id === accentId) ?? ACCENT_CHOICES[0];
    const accent = dark ? choice.dark : choice.light;
    return {
      theme: { ...base, accent: accent.accent, accentHover: accent.accentHover },
      meshRgb: dark ? choice.meshDark : choice.meshLight,
    };
  }, [dark, accentId]);

  return (
    <ThemeContext.Provider
      value={{ theme, override, setOverride, accentId, setAccentId, meshRgb, quiet, setQuiet }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
