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
    label: 'Text thread decoder',
    sub: 'See what a controlling text sounds like, and what it does.',
    route: '/(tabs)/tools/decipher/text-thread' as const,
  },
  {
    num: '02',
    label: 'Financial abuse decoder',
    sub: 'The patterns behind money, allowances, and debt.',
    route: '/(tabs)/tools/decipher/financial' as const,
  },
  {
    num: '03',
    label: 'Coercion & control',
    sub: 'How rules, monitoring, and isolation shrink your world.',
    route: '/(tabs)/tools/decipher/coercion' as const,
  },
  {
    num: '04',
    label: 'The cycle of abuse',
    sub: 'Why it builds, breaks, and repeats, in plain language.',
    route: '/(tabs)/tools/decipher/cycle' as const,
  },
] as const;

export default function DecipherHubScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();

  return (
    <ScreenScaffold
      eyebrow="01 / TOOLS / DECIPHER & UNDERSTAND"
      title={"Read the\npattern."}
      intro="Abuse hides in reasonable-sounding words. These tools name what is actually happening."
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
