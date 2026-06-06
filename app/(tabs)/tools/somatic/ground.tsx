import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import { BackPill } from '@components/BackPill';
import { useTheme } from '@theme/ThemeContext';

interface Particle {
  x: number;
  y: number;
  r: number;
  velocity: number;
}

const WARM_COLOR = '#D97757';
const COOL_COLOR = '#5B8DB8';
const VELOCITY_THRESHOLD = 1000;
const MAX_PARTICLES = 50;

export default function GroundScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const particles = useSharedValue<Particle[]>([]);

  const warmPath = useDerivedValue(() => {
    const p = Skia.Path.Make();
    for (const pt of particles.value) {
      if (pt.velocity <= VELOCITY_THRESHOLD) {
        p.addCircle(pt.x, pt.y, pt.r);
      }
    }
    return p;
  });

  const coolPath = useDerivedValue(() => {
    const p = Skia.Path.Make();
    for (const pt of particles.value) {
      if (pt.velocity > VELOCITY_THRESHOLD) {
        p.addCircle(pt.x, pt.y, pt.r);
      }
    }
    return p;
  });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      'worklet';
      const velocity = Math.sqrt(e.velocityX * e.velocityX + e.velocityY * e.velocityY);
      const next = [
        ...particles.value,
        { x: e.x, y: e.y, r: 6, velocity },
      ];
      particles.value = next.slice(-MAX_PARTICLES);
    });

  const canvasHeight = height - insets.top - insets.bottom - 80;

  return (
    <View style={[styles.root, { backgroundColor: 'transparent' }]}>
      <View style={[styles.backRow, { paddingTop: insets.top + 8 }]}>
        <BackPill />
      </View>

      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: theme.muted }]}>
          {'[ DRAG TO SETTLE ]'}
        </Text>
        <Text style={[styles.hint, { color: theme.faint }]}>
          Slow down. Let it spread. Watch the warmth appear.
        </Text>
      </View>

      <GestureDetector gesture={pan}>
        <Canvas style={{ width, height: canvasHeight }}>
          <Path path={warmPath} color={WARM_COLOR} style="fill" />
          <Path path={coolPath} color={COOL_COLOR} style="fill" />
        </Canvas>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backRow: { paddingHorizontal: 20 },
  header: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    gap: 6,
  },
  eyebrow: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  hint: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 19,
  },
});
