import React, { createContext, useContext } from 'react';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';

const ScrollContext = createContext<SharedValue<number> | null>(null);

export function ScrollOffsetProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useSharedValue(0);
  return <ScrollContext.Provider value={scrollY}>{children}</ScrollContext.Provider>;
}

export function useScrollOffset(): SharedValue<number> {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useScrollOffset must be used inside ScrollOffsetProvider');
  return ctx;
}
