import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme, Theme } from './colors';

type ThemeOverride = 'light' | 'dark' | 'system';

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
  const [override, setOverride] = useState<ThemeOverride>('system');

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
