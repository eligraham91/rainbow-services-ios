import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

const DURATIONS = { inhale: 4000, hold: 7000, exhale: 8000 };
const PHASE_LABELS: Record<Phase, string> = {
  idle: 'Tap to begin',
  inhale: 'Breathe in',
  hold: 'Hold',
  exhale: 'Breathe out',
};

export default function BreatheScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();

  const [phase, setPhase] = useState<Phase>('idle');
  const [cycles, setCycles] = useState(0);
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.4);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (phase === 'idle' || reduceMotion) return;

    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'inhale') {
      scale.value = withTiming(1, { duration: DURATIONS.inhale, easing: Easing.out(Easing.quad) });
      opacity.value = withTiming(0.9, { duration: DURATIONS.inhale });
      timer = setTimeout(() => {
        Haptics.selectionAsync();
        setPhase('hold');
      }, DURATIONS.inhale);
    } else if (phase === 'hold') {
      timer = setTimeout(() => {
        Haptics.selectionAsync();
        setPhase('exhale');
      }, DURATIONS.hold);
    } else if (phase === 'exhale') {
      scale.value = withTiming(0.6, { duration: DURATIONS.exhale, easing: Easing.in(Easing.quad) });
      opacity.value = withTiming(0.4, { duration: DURATIONS.exhale });
      timer = setTimeout(() => {
        Haptics.selectionAsync();
        setCycles(c => c + 1);
        setPhase('inhale');
      }, DURATIONS.exhale);
    }

    return () => clearTimeout(timer);
  }, [phase, reduceMotion]);

  function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (phase === 'idle') {
      setPhase('inhale');
    } else {
      setPhase('idle');
      scale.value = withTiming(0.6, { duration: 600 });
      opacity.value = withTiming(0.4, { duration: 600 });
    }
  }

  return (
    <ScreenScaffold
      eyebrow="Breathe · 4-7-8"
      title={"Slow\nyour breath."}
      intro="The 4-7-8 technique activates your body's calming response. Four breaths is enough."
      showBack
      scroll={false}
    >
      <View style={styles.circle_area}>
        <Pressable onPress={handleStart} style={styles.circleOuter}>
          <Animated.View style={[styles.circlePulse, { backgroundColor: theme.accent }, circleStyle]} />
          <View style={styles.circleCenter}>
            <Text style={[styles.phaseLabel, { color: theme.text }]}>{PHASE_LABELS[phase]}</Text>
            {cycles > 0 && (
              <Text style={[styles.cycles, { color: theme.muted }]}>{cycles} {cycles === 1 ? 'cycle' : 'cycles'}</Text>
            )}
          </View>
        </Pressable>
      </View>

      <Text style={[styles.guide, { color: theme.muted }]}>
        Breathe in for 4 · Hold for 7 · Out for 8
      </Text>
      {reduceMotion && (
        <Text style={[styles.altText, { color: theme.faint }]}>
          Animations reduced. The timer still runs — follow the text.
        </Text>
      )}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  circle_area: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 300 },
  circleOuter: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center' },
  circlePulse: { position: 'absolute', width: 240, height: 240, borderRadius: 120 },
  circleCenter: { alignItems: 'center', gap: 8 },
  phaseLabel: { fontFamily: 'InterTight-ExtraBold', fontSize: 24, fontWeight: '800', textAlign: 'center' },
  cycles: { fontFamily: 'JetBrainsMono-Regular', fontSize: 12, letterSpacing: 1 },
  guide: { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, letterSpacing: 1, textAlign: 'center', marginBottom: 16 },
  altText: { fontFamily: 'Inter', fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
