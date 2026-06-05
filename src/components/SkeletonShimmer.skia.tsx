import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  Canvas,
  LinearGradient,
  RoundedRect,
  vec,
} from '@shopify/react-native-skia';
import {
  Easing,
  useAnimatedReaction,
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

  const shimmerStartX = useSharedValue(-width);
  const shimmerEndX = useSharedValue(0);

  useAnimatedReaction(
    () => progress.value,
    (p) => {
      'worklet';
      shimmerStartX.value = -width + p * width * 3;
      shimmerEndX.value = shimmerStartX.value + width;
    }
  );

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
            start={vec(shimmerStartX.value, 0)}
            end={vec(shimmerEndX.value, 0)}
            colors={[C.creamCard, C.creamCardSoft, 'rgba(255,255,255,0.75)', C.creamCardSoft, C.creamCard]}
          />
        </RoundedRect>
      </Canvas>
    </View>
  );
}
