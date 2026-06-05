import React from 'react';
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import { C } from '@theme/colors';

// Skia is not available in standard Expo Go — lazy-load so the app doesn't
// crash on devices without the native module. Falls back to a static bg.
let SkiaMeshLayer: React.ComponentType<{ style?: StyleProp<ViewStyle> }> | null =
  null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SkiaMeshLayerImpl } = require('./MeshGradientBg.skia') as {
    SkiaMeshLayerImpl: React.ComponentType<{ style?: StyleProp<ViewStyle> }>;
  };
  SkiaMeshLayer = SkiaMeshLayerImpl;
} catch {
  // Skia not available (standard Expo Go) — static fallback used below
}

interface MeshGradientBgProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * Full-bleed animated background. On a dev build (where Skia is available)
 * two radial gradients shift with device tilt via the gyroscope. In standard
 * Expo Go the component renders a static cream background instead of crashing.
 */
export function MeshGradientBg({ style }: MeshGradientBgProps) {
  return (
    <View style={[styles.container, style]}>
      {SkiaMeshLayer ? (
        <SkiaMeshLayer style={StyleSheet.absoluteFill} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.creamBase,
  },
});
