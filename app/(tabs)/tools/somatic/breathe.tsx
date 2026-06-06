import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Canvas, Circle, RadialGradient, vec } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { BackPill } from '@components/BackPill';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

const DURATIONS = { inhale: 4000, hold: 7000, exhale: 8000 };
const PHASE_LABELS: Record<Phase, string> = {
  idle: 'Hold to\nbreathe',
  inhale: 'Breathe\nin',
  hold: 'Hold',
  exhale: 'Breathe\nout',
};

const SPHERE_SIZE = 220;
const SPHERE_R = SPHERE_SIZE / 2;

export default function BreatheScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();
  const insets = useSafeAreaInsets();

  const [phase, setPhase] = useState<Phase>('idle');
  const [cycles, setCycles] = useState(0);
  const scale = useSharedValue(0.62);

  // Skia reads this derived value for sphere radius
  const skiaR = useDerivedValue(() => SPHERE_R * scale.value);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (phase === 'idle' || reduceMotion) return;
    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'inhale') {
      scale.value = withTiming(1, { duration: DURATIONS.inhale, easing: Easing.out(Easing.quad) });
      timer = setTimeout(() => { Haptics.selectionAsync(); setPhase('hold'); }, DURATIONS.inhale);
    } else if (phase === 'hold') {
      timer = setTimeout(() => { Haptics.selectionAsync(); setPhase('exhale'); }, DURATIONS.hold);
    } else if (phase === 'exhale') {
      scale.value = withTiming(0.62, { duration: DURATIONS.exhale, easing: Easing.in(Easing.quad) });
      timer = setTimeout(() => {
        Haptics.selectionAsync();
        setCycles(c => c + 1);
        setPhase('inhale');
      }, DURATIONS.exhale);
    }
    return () => clearTimeout(timer);
  }, [phase, reduceMotion]);

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (phase === 'idle') {
      setPhase('inhale');
    } else {
      setPhase('idle');
      scale.value = withTiming(0.62, { duration: 600 });
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: 'transparent' }]}>
      {/* Back pill — floating */}
      <View style={[styles.backRow, { paddingTop: insets.top + 8 }]}>
        <BackPill />
      </View>

      {/* Centered content */}
      <View style={styles.body}>
        <Text style={[styles.eyebrow, { color: theme.muted }]}>[ 4 · 7 · 8 BREATH ]</Text>

        {/* Sphere — Skia gradient + Animated scale */}
        <Pressable onPress={handlePress} style={styles.sphereWrap} accessibilityRole="button">
          <Animated.View style={[styles.sphereAnimated, circleStyle]}>
            <Canvas style={styles.canvas}>
              <Circle cx={SPHERE_R} cy={SPHERE_R} r={SPHERE_R}>
                <RadialGradient
                  c={vec(SPHERE_R * 0.55, SPHERE_R)}
                  r={SPHERE_R * 1.15}
                  colors={['#6B44B2', '#C87C35', 'rgba(200,120,50,0)']}
                />
              </Circle>
            </Canvas>
            <View style={styles.sphereLabel}>
              <Text style={styles.phaseText}>{PHASE_LABELS[phase]}</Text>
              {cycles > 0 && (
                <Text style={styles.cyclesText}>{cycles} {cycles === 1 ? 'cycle' : 'cycles'}</Text>
              )}
            </View>
          </Animated.View>
        </Pressable>

        <Text style={[styles.guide, { color: theme.muted }]}>
          {phase === 'idle'
            ? 'Press and hold anywhere. Breathe in for four,\nhold for seven, out for eight. Let go whenever\nyou want to stop.'
            : 'Breathe in for 4 · Hold for 7 · Out for 8'}
        </Text>

        {reduceMotion && (
          <Text style={[styles.altText, { color: theme.faint }]}>
            Animations reduced. The timer still runs — follow the text.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backRow: { paddingHorizontal: 20, paddingBottom: 0 },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  eyebrow: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 40,
    textAlign: 'center',
  },
  sphereWrap: {
    width: SPHERE_SIZE,
    height: SPHERE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  sphereAnimated: {
    width: SPHERE_SIZE,
    height: SPHERE_SIZE,
  },
  canvas: {
    width: SPHERE_SIZE,
    height: SPHERE_SIZE,
    position: 'absolute',
  },
  sphereLabel: {
    position: 'absolute',
    width: SPHERE_SIZE,
    height: SPHERE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  phaseText: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
  },
  cyclesText: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 11,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  guide: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 300,
  },
  altText: {
    fontFamily: 'Inter',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 12,
  },
});
