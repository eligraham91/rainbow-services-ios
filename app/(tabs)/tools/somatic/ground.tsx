import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';

const STEPS = [
  { num: 5, sense: 'see', prompt: 'Name 5 things you can see right now.' },
  { num: 4, sense: 'touch', prompt: 'Name 4 things you can physically feel — the chair, the floor, your clothes.' },
  { num: 3, sense: 'hear', prompt: 'Name 3 things you can hear right now.' },
  { num: 2, sense: 'smell', prompt: 'Name 2 things you can smell, or notice the air temperature.' },
  { num: 1, sense: 'taste', prompt: 'Name 1 thing you can taste, or notice how your mouth feels.' },
];

export default function GroundScreen() {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const done = step >= STEPS.length;

  function handleNext() {
    Haptics.selectionAsync();
    setStep(s => Math.min(s + 1, STEPS.length));
  }

  function handleReset() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(0);
  }

  return (
    <ScreenScaffold
      eyebrow="Ground · 5-4-3-2-1"
      title={"Back to\nthe present."}
      intro="The 5-4-3-2-1 technique anchors you in your senses and interrupts anxiety spirals."
      showBack
    >
      {!done ? (
        <Animated.View key={step} entering={FadeInDown.duration(300)}>
          <GlassCard style={styles.card}>
            <Text style={[styles.num, { color: theme.accent }]}>{STEPS[step].num}</Text>
            <Text style={[styles.prompt, { color: theme.text }]}>{STEPS[step].prompt}</Text>
            <Text style={[styles.sense, { color: theme.muted }]}>things you can {STEPS[step].sense}</Text>
          </GlassCard>

          <View style={styles.progress}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i <= step ? theme.accent : theme.rule },
                ]}
              />
            ))}
          </View>

          <Pressable
            onPress={handleNext}
            style={[styles.nextBtn, { backgroundColor: theme.accent }]}
            accessibilityRole="button"
            accessibilityLabel="Next step"
          >
            <Text style={styles.nextBtnText}>
              {step < STEPS.length - 1 ? 'Next' : 'Done'}
            </Text>
          </Pressable>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.duration(300)}>
          <GlassCard style={styles.card}>
            <Text style={[styles.num, { color: theme.accent }]}>Done.</Text>
            <Text style={[styles.prompt, { color: theme.text }]}>
              You are here. You are safe in this moment.
            </Text>
          </GlassCard>
          <Pressable
            onPress={handleReset}
            style={[styles.nextBtn, { borderWidth: 1.5, borderColor: theme.accent }]}
            accessibilityRole="button"
          >
            <Text style={[styles.nextBtnText, { color: theme.accent }]}>Start again</Text>
          </Pressable>
        </Animated.View>
      )}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  card: { padding: 28, marginBottom: 20, alignItems: 'center' },
  num: { fontFamily: 'InterTight-ExtraBold', fontSize: 60, fontWeight: '900', marginBottom: 12 },
  prompt: { fontFamily: 'Inter', fontSize: 17, lineHeight: 26, textAlign: 'center', marginBottom: 8 },
  sense: { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, letterSpacing: 1.5, textAlign: 'center' },
  progress: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  nextBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  nextBtnText: { fontFamily: 'InterTight-ExtraBold', fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
});
