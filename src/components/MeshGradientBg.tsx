import React from 'react';
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { LightTheme, DarkTheme } from '@theme/colors';

let SkiaMeshLayer: React.ComponentType<{
  style?: StyleProp<ViewStyle>;
  dark?: boolean;
  scrollY?: SharedValue<number>;
}> | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SkiaMeshLayerImpl } = require('./MeshGradientBg.skia') as {
    SkiaMeshLayerImpl: React.ComponentType<{
      style?: StyleProp<ViewStyle>;
      dark?: boolean;
      scrollY?: SharedValue<number>;
    }>;
  };
  SkiaMeshLayer = SkiaMeshLayerImpl;
} catch {
  // Skia not available — static fallback below
}

interface MeshGradientBgProps {
  style?: StyleProp<ViewStyle>;
  dark?: boolean;
  scrollY?: SharedValue<number>;
}

export function MeshGradientBg({ style, dark, scrollY }: MeshGradientBgProps) {
  const base = dark ? DarkTheme.background : LightTheme.background;
  return (
    <View style={[styles.container, { backgroundColor: base }, style]}>
      {SkiaMeshLayer ? (
        <SkiaMeshLayer
          style={StyleSheet.absoluteFill}
          dark={dark}
          scrollY={scrollY}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
