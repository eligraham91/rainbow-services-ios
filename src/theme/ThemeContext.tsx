import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme, Theme } from './colors';

type ThemeOverride = 'light' | 'dark' | 'system';

// MMKV persistence — wrapped so the file is still importable in Expo Go
let _getOverride: () => ThemeOverride = () => 'system';
let _setOverridePersist: (o: ThemeOverride) => void = () => {};
try {
  const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
  const storage = createMMKV({ id: 'sh-flags' });
  _getOverride = () => (storage.getString('sh_theme') as ThemeOverride) ?? 'system';
  _setOverridePersist = (o) => storage.set('sh_theme', o);
} catch {
  // Expo Go: no persistence, defaults to 'system'
}

interface ThemeContextValue {
  theme: Theme;
  override: ThemeOverride;
  setOverride: (o: ThemeOverride) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: LightTheme,
  override: 'system',
  setOverride: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [override, setOverrideState] = useState<ThemeOverride>(_getOverride);

  const setOverride = (o: ThemeOverride) => {
    _setOverridePersist(o);
    setOverrideState(o);
  };

  const resolved = override === 'system' ? scheme : override;
  const theme = resolved === 'dark' ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, override, setOverride }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
