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
    label: 'Safe exit plan',
    sub: 'A private six-step plan, encrypted on this device.',
    route: '/(tabs)/tools/plan/safety-plan' as const,
  },
  {
    num: '02',
    label: 'Legal preparation',
    sub: 'A guided map of the legal options that exist.',
    route: '/(tabs)/tools/plan/legal-prep' as const,
    coming: true,
  },
  {
    num: '03',
    label: 'What to expect at a shelter',
    sub: 'Find programs and see what they offer before you call.',
    route: '/(tabs)/tools/plan/shelter-expectations' as const,
  },
  {
    num: '04',
    label: 'De-escalation in the moment',
    sub: 'Lower the temperature and keep an exit, safely.',
    route: '/(tabs)/tools/plan/de-escalation' as const,
  },
] as const;

export default function PlanHubScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();

  return (
    <ScreenScaffold
      eyebrow="02 / TOOLS / MAKE A PLAN"
      title={"Plan your\nnext move."}
      intro="Made ahead of time, a plan keeps you safer in the moment. Everything stays on this phone."
      showBack
    >
      <View style={styles.list}>
        {ITEMS.map((item, i) => (
          <Animated.View
            key={item.route}
            entering={reduceMotion ? undefined : FadeInDown.duration(280).delay(i * 65 + 60)}
          >
            <PressableScale
              onPress={() => {
                if ((item as { coming?: boolean }).coming) return;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(item.route);
              }}
              disabled={(item as { coming?: boolean }).coming}
            >
              <GlassCard style={[styles.card, (item as { coming?: boolean }).coming && styles.cardMuted]}>
                <View style={styles.row}>
                  <View style={styles.main}>
                    <Text style={[styles.label, { color: (item as { coming?: boolean }).coming ? theme.muted : theme.text }]}>
                      {item.label}
                    </Text>
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
  cardMuted: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  main: { flex: 1 },
  num: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  label: { fontFamily: 'InterTight-ExtraBold', fontSize: 18, fontWeight: '800', marginBottom: 2 },
  sub: { fontFamily: 'Inter', fontSize: 13, lineHeight: 19 },
  arrow: { fontFamily: 'Inter', fontSize: 18, paddingLeft: 10 },
});
