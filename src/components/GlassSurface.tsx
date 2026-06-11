import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@theme/ThemeContext';

let glassCheck: (() => boolean) | null = null;
let transpCheck: (() => boolean) | null = null;
let GlassView: React.ComponentType<{ style?: StyleProp<ViewStyle>; children?: React.ReactNode }> | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const g = require('expo-glass-effect');
  glassCheck = g.isGlassEffectAPIAvailable;
  transpCheck = g.isReduceTransparencyEnabled;
  GlassView = g.GlassView;
} catch {
  // not available — use blur fallback
}

interface GlassSurfaceProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}

// Single glass gate.
// 1. Reduce Transparency on  → solid surface (accessibility)
// 2. iOS 26 GlassView available → native glass (dev build only)
// 3. Fallback → expo-blur BlurView
// IMPORTANT: never pass opacity to this component or its direct parent;
// animate matte child wrappers instead (GlassView opacity bug).
export function GlassSurface({ children, style, intensity = 60 }: GlassSurfaceProps) {
  const { theme } = useTheme();

  const reduceTransparency = transpCheck?.() ?? false;
  const glassAvailable = glassCheck?.() ?? false;

  if (reduceTransparency) {
    return (
      <View style={[{ backgroundColor: theme.surfaceSolid }, style]}>
        {children}
      </View>
    );
  }

  if (glassAvailable && GlassView) {
    return (
      <GlassView style={style}>
        {children}
      </GlassView>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={theme.dark ? 'dark' : 'light'}
      style={style}
    >
      {children}
    </BlurView>
  );
}
