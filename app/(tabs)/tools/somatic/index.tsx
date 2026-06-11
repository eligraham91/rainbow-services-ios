import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { PressableScale } from '@components/ui/PressableScale';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

function BreatheIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.5} />
      <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}
function WaveIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M2 12 Q5 6 8 12 Q11 18 14 12 Q17 6 20 12 Q22 16 24 12" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
function DotsIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Ellipse cx={12} cy={5} rx={2} ry={2} fill={color} />
      <Ellipse cx={19} cy={9} rx={2} ry={2} fill={color} />
      <Ellipse cx={19} cy={15} rx={2} ry={2} fill={color} />
      <Ellipse cx={12} cy={19} rx={2} ry={2} fill={color} />
      <Ellipse cx={5} cy={15} rx={2} ry={2} fill={color} />
      <Ellipse cx={5} cy={9} rx={2} ry={2} fill={color} />
    </Svg>
  );
}

const ITEMS = [
  {
    num: '01',
    label: 'Breathe',
    sub: 'A guided 4-7-8 breath. Hold the screen and follow the sphere.',
    route: '/(tabs)/tools/somatic/breathe' as const,
    Icon: BreatheIcon,
  },
  {
    num: '02',
    label: 'Listen',
    sub: 'Calming tones you shape with your thumb. Drag to set the mood.',
    route: '/(tabs)/tools/somatic/listen' as const,
    Icon: WaveIcon,
  },
  {
    num: '03',
    label: 'Ground',
    sub: 'Drag your finger to clear your thoughts. Slow down, watch it settle.',
    route: '/(tabs)/tools/somatic/ground' as const,
    Icon: DotsIcon,
  },
] as const;

export default function SomaticHubScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();

  return (
    <ScreenScaffold
      eyebrow="TOOLS · 01 / CENTER YOUR BODY"
      title={"Find your\ncenter."}
      intro="Stress narrows what you can think about. A few minutes here can open it back out."
      showBack
      disclaimer="THESE TOOLS DO NOT TREAT OR DIAGNOSE ANYTHING. THEY ARE A MOMENT TO BREATHE. IF YOU ARE IN DANGER, USE QUICK EXIT."
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
                <Text style={[styles.num, { color: theme.faint }]}>{item.num}</Text>
                <View style={styles.cardRow}>
                  <item.Icon color={theme.accent} />
                  <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
                  <Text style={[styles.arrow, { color: theme.accent }]}>→</Text>
                </View>
                <Text style={[styles.sub, { color: theme.muted }]}>{item.sub}</Text>
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
  num: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1, marginBottom: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  label: { fontFamily: 'InterTight-ExtraBold', fontSize: 20, fontWeight: '800', flex: 1 },
  arrow: { fontFamily: 'Inter', fontSize: 18 },
  sub: { fontFamily: 'Inter', fontSize: 13, lineHeight: 19 },
});
