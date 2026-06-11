import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Canvas, Circle, SweepGradient, vec } from '@shopify/react-native-skia';
import { useSharedValue, useDerivedValue, withTiming } from 'react-native-reanimated';
import { BackPill } from '@components/BackPill';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

const CANVAS = 300;
const BASE_R = 100;

export default function BreatheScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();
  const insets = useSafeAreaInsets();

  const scale = useSharedValue(1);
  const r = useDerivedValue(() => BASE_R * scale.value);

  const shouldAnimate = !reduceMotion;

  const longPress = Gesture.LongPress()
    .minDuration(0)
    .onBegin(() => {
      'worklet';
      if (shouldAnimate) {
        scale.value = withTiming(1.5, { duration: 4000 });
      }
    })
    .onFinalize(() => {
      'worklet';
      if (shouldAnimate) {
        scale.value = withTiming(1, { duration: 8000 });
      }
    });

  const gradientColors: string[] = theme.dark
    ? ['#1A0F2E', '#9F6FE3', '#C87C35', '#1A0F2E']
    : ['#2D1E3D', '#F7F5F0', '#C87C35', '#2D1E3D'];

  return (
    <View style={styles.root}>
      <View style={[styles.backRow, { paddingTop: insets.top + 8 }]}>
        <BackPill />
      </View>

      <View style={styles.body}>
        <Text style={[styles.eyebrow, { color: theme.muted }]}>
          {'[ HOLD TO INHALE · RELEASE TO EXHALE ]'}
        </Text>

        <GestureDetector gesture={longPress}>
          <Canvas style={styles.canvas} accessibilityRole="none">
            <Circle c={vec(CANVAS / 2, CANVAS / 2)} r={r}>
              <SweepGradient
                c={vec(CANVAS / 2, CANVAS / 2)}
                colors={gradientColors}
              />
            </Circle>
          </Canvas>
        </GestureDetector>

        <Text style={[styles.guide, { color: theme.muted }]}>
          {'Hold the sphere and breathe in for four.\nRelease slowly and breathe out for eight.'}
        </Text>

        {reduceMotion && (
          <Text style={[styles.altText, { color: theme.faint }]}>
            Animations reduced. Follow the text prompt.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backRow: { paddingHorizontal: 20 },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
    gap: 32,
  },
  eyebrow: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 10,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  canvas: { width: CANVAS, height: CANVAS },
  guide: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 280,
  },
  altText: {
    fontFamily: 'Inter',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
