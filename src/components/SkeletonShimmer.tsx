import React, { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  Canvas,
  LinearGradient,
  RoundedRect,
  vec,
} from '@shopify/react-native-skia';
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { useTraumaInformedMotion } from '@utils/motion';
import { C } from '@theme/colors';

interface SkeletonShimmerProps {
  width: number;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Skia-based shimmer skeleton. The shimmer sweep runs entirely on the UI
 * thread via Reanimated → Skia bridge. Zero JS-thread animation frames.
 *
 * Falls back to a static cream-card rectangle when Reduce Motion is on.
 */
export function SkeletonShimmer({
  width,
  height,
  borderRadius = 6,
  style,
}: SkeletonShimmerProps) {
  const reducedMotion = useTraumaInformedMotion();

  // Shimmer progress: 0 = sweep starts off left edge, 1 = off right edge
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      progress.value = 0;
      return;
    }
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1, // infinite
      false
    );
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <View
        style={[
          {
            width,
            height,
            borderRadius,
            backgroundColor: C.creamCard,
          },
          style,
        ]}
      />
    );
  }

  // Shimmer gradient travels from x = -width to x = 2*width across the rect.
  // We use Skia's LinearGradient with Reanimated-driven start/end points.
  // Skia accepts SharedValues directly for animated props in Skia v1.x.
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

  return (
    <View style={[{ width, height }, style]}>
      <Canvas style={{ width, height }}>
        <RoundedRect x={0} y={0} width={width} height={height} r={borderRadius}>
          <LinearGradient
            start={vec(shimmerStartX.value, 0)}
            end={vec(shimmerEndX.value, 0)}
            colors={[
              C.creamCard,
              C.creamCardSoft,
              'rgba(255,255,255,0.75)',
              C.creamCardSoft,
              C.creamCard,
            ]}
          />
        </RoundedRect>
      </Canvas>
    </View>
  );
}

// ── Composed skeleton for resource lists ─────────────────────────────────────

interface SkeletonResourceListProps {
  rows?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Stacked skeleton rows matching the height/layout of a resource card.
 * Import this into Find Help and Tools tabs while data loads.
 */
export function SkeletonResourceList({
  rows = 4,
  style,
}: SkeletonResourceListProps) {
  return (
    <View style={[styles.list, style]}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.row}>
          {/* Icon placeholder */}
          <SkeletonShimmer width={44} height={44} borderRadius={10} />
          <View style={styles.rowText}>
            {/* Title line */}
            <SkeletonShimmer width={160} height={14} borderRadius={4} style={styles.titleLine} />
            {/* Subtitle line */}
            <SkeletonShimmer width={110} height={11} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: C.creamCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.ruleLine,
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 6,
  },
  titleLine: {
    marginBottom: 2,
  },
});
