import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

const ITEMS = [
  { label: 'What the words mean', sub: 'Definitions without labels', route: '/(tabs)/tools/learn/definitions' as const },
  { label: 'Your rights, by state', sub: 'Protective orders, searchable', route: '/(tabs)/tools/learn/state-laws' as const },
  { label: 'Meeting someone new', sub: 'Dating and online safety', route: '/(tabs)/tools/learn/dating' as const },
  { label: 'Talk to a friend', sub: 'What to say when they tell you', route: '/(tabs)/tools/learn/talk-to-friend' as const },
] as const;

export default function LearnHubScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();

  return (
    <ScreenScaffold eyebrow="Learn" title={"Understand\nit."}  showBack intro="Plain language. No assumptions about where you are or what you know.">
      <View style={styles.list}>
        {ITEMS.map((item, i) => (
          <Animated.View key={item.route} entering={reduceMotion ? undefined : FadeInDown.duration(280).delay(i * 60 + 80)}>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(item.route); }}
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            >
              <GlassCard style={styles.card}>
                <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
                <Text style={[styles.sub, { color: theme.muted }]}>{item.sub}</Text>
              </GlassCard>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  card: { padding: 18 },
  label: { fontFamily: 'InterTight-ExtraBold', fontSize: 19, fontWeight: '800', marginBottom: 4 },
  sub: { fontFamily: 'Inter', fontSize: 14 },
});
