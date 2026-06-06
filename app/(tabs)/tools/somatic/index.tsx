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
  { label: 'Breathe', sub: '4-7-8 guided breathing', route: '/(tabs)/tools/somatic/breathe' as const },
  { label: 'Listen', sub: 'Ambient sound to calm your body', route: '/(tabs)/tools/somatic/listen' as const },
  { label: 'Ground', sub: 'Reconnect with the present', route: '/(tabs)/tools/somatic/ground' as const },
] as const;

export default function SomaticHubScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();

  return (
    <ScreenScaffold eyebrow="Calm your body" title={"Right\nhere, right now."} showBack intro="Quick tools when anxiety, panic, or overwhelm hit. No setup. No account.">
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
