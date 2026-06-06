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
  { label: 'Safety plan', sub: 'Build a personal exit strategy', route: '/(tabs)/tools/plan/safety-plan' as const },
  { label: 'Legal options', sub: 'Coming soon', route: '/(tabs)/tools/plan/legal-prep' as const, coming: true },
  { label: 'What shelter is like', sub: 'What to expect, what to bring', route: '/(tabs)/tools/plan/shelter-expectations' as const },
  { label: 'De-escalation', sub: 'In-the-moment strategies', route: '/(tabs)/tools/plan/de-escalation' as const },
] as const;

export default function PlanHubScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();

  return (
    <ScreenScaffold eyebrow="Plan" title={"Make\na plan."} showBack intro="Everything here stays on this device. No account, no tracking.">
      <View style={styles.list}>
        {ITEMS.map((item, i) => (
          <Animated.View key={item.route} entering={reduceMotion ? undefined : FadeInDown.duration(280).delay(i * 60 + 80)}>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(item.route); }}
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
              disabled={(item as { coming?: boolean }).coming}
            >
              <GlassCard style={[styles.card, (item as { coming?: boolean }).coming && { opacity: 0.5 }]}>
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
