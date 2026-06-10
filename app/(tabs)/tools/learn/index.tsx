import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { PressableScale } from '@components/ui/PressableScale';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

const ITEMS = [
  {
    num: '01',
    label: 'What the words mean',
    sub: 'Plain definitions, with no labels placed on you.',
    route: '/(tabs)/tools/learn/definitions' as const,
  },
  {
    num: '02',
    label: 'Your rights, by state',
    sub: 'Protective orders, searchable by state.',
    route: '/(tabs)/tools/learn/state-laws' as const,
  },
  {
    num: '03',
    label: 'Meeting someone new',
    sub: 'Early warning signs and online safety.',
    route: '/(tabs)/tools/learn/dating' as const,
  },
  {
    num: '04',
    label: 'Talk to a friend',
    sub: 'What to say when someone tells you.',
    route: '/(tabs)/tools/learn/talk-to-friend' as const,
  },
] as const;

export default function LearnHubScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();

  return (
    <ScreenScaffold
      eyebrow="03 / TOOLS / LEARN & PROTECT"
      title={"Understand\nit."}
      intro="Plain language. No assumptions about where you are or what you know."
      showBack
    >
      <View style={styles.list}>
        {ITEMS.map((item, i) => (
          <Animated.View
            key={item.route}
            entering={reduceMotion ? undefined : FadeInDown.duration(280).delay(i * 65 + 60)}
          >
            <PressableScale
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(item.route); }}
            >
              <GlassCard style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.main}>
                    <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
                    <Text style={[styles.num, { color: theme.faint }]}>{item.num}</Text>
                    <Text style={[styles.sub, { color: theme.muted }]}>{item.sub}</Text>
                  </View>
                  <Text style={[styles.arrow, { color: theme.accent }]}>→</Text>
                </View>
              </GlassCard>
            </PressableScale>
          </Animated.View>
        ))}
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  card: { padding: 18 },
  row: { flexDirection: 'row', alignItems: 'center' },
  main: { flex: 1 },
  num: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  label: { fontFamily: 'InterTight-ExtraBold', fontSize: 18, fontWeight: '800', marginBottom: 2 },
  sub: { fontFamily: 'Inter', fontSize: 13, lineHeight: 19 },
  arrow: { fontFamily: 'Inter', fontSize: 18, paddingLeft: 10 },
});
