import React, { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTraumaInformedMotion } from '@utils/motion';
import { C } from '@theme/colors';

// Try to load the Skia shimmer — only available in dev/production builds.
let SkiaShimmer: React.ComponentType<SkeletonShimmerProps> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('./SkeletonShimmer.skia') as {
    SkiaShimmerImpl: React.ComponentType<SkeletonShimmerProps>;
  };
  SkiaShimmer = mod.SkiaShimmerImpl;
} catch {
  // Skia unavailable — use the reanimated-only fallback below
}

export interface SkeletonShimmerProps {
  width: number;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Shimmer skeleton that works in both Expo Go (reanimated opacity pulse) and
 * dev/production builds (full Skia left-to-right sweep). Same props either way.
 */
export function SkeletonShimmer(props: SkeletonShimmerProps) {
  if (SkiaShimmer) return <SkiaShimmer {...props} />;
  return <ReanimatedShimmer {...props} />;
}

/** Expo Go fallback: simple opacity pulse on the UI thread. */
function ReanimatedShimmer({
  width,
  height,
  borderRadius = 6,
  style,
}: SkeletonShimmerProps) {
  const { reduceMotion: reducedMotion } = useTraumaInformedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    progress.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true // reverse — pulse in and out
    );
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 1 : interpolate(progress.value, [0, 1], [0.45, 1]),
  }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: C.creamCard },
        animatedStyle,
        style,
      ]}
    />
  );
}

// ── Composed skeleton for resource lists ─────────────────────────────────────

interface SkeletonResourceListProps {
  rows?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonResourceList({
  rows = 4,
  style,
}: SkeletonResourceListProps) {
  return (
    <View style={[styles.list, style]}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.row}>
          <SkeletonShimmer width={44} height={44} borderRadius={10} />
          <View style={styles.rowText}>
            <SkeletonShimmer width={160} height={14} borderRadius={4} style={styles.titleLine} />
            <SkeletonShimmer width={110} height={11} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
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
  rowText: { flex: 1, gap: 6 },
  titleLine: { marginBottom: 2 },
});
