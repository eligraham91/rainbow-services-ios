import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme, Theme, ACCENT_CHOICES } from './colors';

type ThemeOverride = 'light' | 'dark' | 'system';

// MMKV persistence — wrapped so the file is still importable in Expo Go
let _getOverride: () => ThemeOverride = () => 'system';
let _setOverridePersist: (o: ThemeOverride) => void = () => {};
let _getAccent: () => string = () => 'violet';
let _setAccentPersist: (id: string) => void = () => {};
try {
  const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
  const storage = createMMKV({ id: 'sh-flags' });
  _getOverride = () => (storage.getString('sh_theme') as ThemeOverride) ?? 'system';
  _setOverridePersist = (o) => storage.set('sh_theme', o);
  _getAccent = () => storage.getString('sh_accent') ?? 'violet';
  _setAccentPersist = (id) => storage.set('sh_accent', id);
} catch {
  // Expo Go: no persistence, defaults to 'system' + 'violet'
}

interface ThemeContextValue {
  theme: Theme;
  override: ThemeOverride;
  setOverride: (o: ThemeOverride) => void;
  accentId: string;
  setAccentId: (id: string) => void;
  // Mesh blob tint for the current accent, 'r,g,b'
  meshRgb: string;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: LightTheme,
  override: 'system',
  setOverride: () => {},
  accentId: 'violet',
  setAccentId: () => {},
  meshRgb: ACCENT_CHOICES[0].meshLight,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [override, setOverrideState] = useState<ThemeOverride>(_getOverride);
  const [accentId, setAccentState] = useState<string>(_getAccent);

  const setOverride = (o: ThemeOverride) => {
    _setOverridePersist(o);
    setOverrideState(o);
  };

  const setAccentId = (id: string) => {
    _setAccentPersist(id);
    setAccentState(id);
  };

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
    <ThemeContext.Provider value={{ theme, override, setOverride, accentId, setAccentId, meshRgb }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
