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
  { label: 'Text thread', sub: '6 message patterns decoded', route: '/(tabs)/tools/decipher/text-thread' as const },
  { label: 'Financial', sub: '4 money control patterns', route: '/(tabs)/tools/decipher/financial' as const },
  { label: 'Coercive control', sub: 'The invisible pattern', route: '/(tabs)/tools/decipher/coercion' as const },
  { label: 'The cycle', sub: 'Why it keeps going', route: '/(tabs)/tools/decipher/cycle' as const },
] as const;

export default function DecipherHubScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();

  return (
    <ScreenScaffold eyebrow="Decipher" title={"Decode\nthe pattern."} showBack intro="Tap highlighted phrases to understand what is happening.">
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
