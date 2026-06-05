import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  Canvas,
  LinearGradient,
  RoundedRect,
} from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTraumaInformedMotion } from '@utils/motion';
import { C } from '@theme/colors';
import type { SkeletonShimmerProps } from './SkeletonShimmer';

/** Full Skia left-to-right sweep shimmer. Only used in dev/production builds. */
export function SkiaShimmerImpl({
  width,
  height,
  borderRadius = 6,
  style,
}: SkeletonShimmerProps) {
  const reducedMotion = useTraumaInformedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, [reducedMotion]);

  // Pass SharedValues directly so Skia reacts to changes on the UI thread
  const shimmerStart = useDerivedValue(() => ({
    x: -width + progress.value * width * 3,
    y: 0,
  }));
  const shimmerEnd = useDerivedValue(() => ({
    x: shimmerStart.value.x + width,
    y: 0,
  }));

  if (reducedMotion) {
    return (
      <View
        style={[{ width, height, borderRadius, backgroundColor: C.creamCard }, style]}
      />
    );
  }

  return (
    <View style={[{ width, height }, style]}>
      <Canvas style={{ width, height }}>
        <RoundedRect x={0} y={0} width={width} height={height} r={borderRadius}>
          <LinearGradient
            start={shimmerStart}
            end={shimmerEnd}
            colors={[C.creamCard, C.creamCardSoft, 'rgba(255,255,255,0.75)', C.creamCardSoft, C.creamCard]}
          />
        </RoundedRect>
      </Canvas>
    </View>
  );
}
