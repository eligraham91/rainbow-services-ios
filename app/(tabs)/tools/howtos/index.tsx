import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';
import { HOWTO_CATEGORIES } from '@data/howtos';

const ICONS: Record<string, (color: string) => React.ReactElement> = {
  dating: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  rideshare: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={c} strokeWidth={1.8} />
      <Path d="M8 12h8M12 8l4 4-4 4" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  device: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={2} width={14} height={20} rx={2} stroke={c} strokeWidth={1.8} />
      <Path d="M12 18h.01" stroke={c} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
  social: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={18} cy={5} r={3} stroke={c} strokeWidth={1.8} />
      <Circle cx={6} cy={12} r={3} stroke={c} strokeWidth={1.8} />
      <Circle cx={18} cy={19} r={3} stroke={c} strokeWidth={1.8} />
      <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
  reporting: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
};

export default function HowTosHubScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();

  return (
    <ScreenScaffold
      eyebrow="TOOLS · HOW-TOS"
      title={'Practical\nsteps.'}
      intro="Four taps to block him. One toggle for a women driver. The safety settings in apps you already use."
      showBack
    >
      <View style={styles.list}>
        {HOWTO_CATEGORIES.map((cat, i) => {
          const renderIcon = ICONS[cat.id];
          return (
            <Animated.View
              key={cat.id}
              entering={reduceMotion ? undefined : FadeInDown.duration(280).delay(i * 60 + 60)}
            >
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push({ pathname: '/(tabs)/tools/howtos/[category]', params: { category: cat.id } });
                }}
                style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
                accessibilityRole="button"
              >
                <GlassCard style={styles.card}>
                  <View style={[styles.iconBox, { backgroundColor: theme.dark ? 'rgba(159,111,227,0.12)' : 'rgba(74,20,140,0.07)' }]}>
                    {renderIcon ? renderIcon(theme.accent) : null}
                  </View>
                  <View style={styles.cardText}>
                    <Text style={[styles.cardLabel, { color: theme.text }]}>{cat.label}</Text>
                    <Text style={[styles.cardDesc, { color: theme.muted }]}>{cat.description}</Text>
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={[styles.countNum, { color: theme.accent }]}>{cat.entries.length}</Text>
                    <Text style={[styles.countLabel, { color: theme.faint }]}>how-tos</Text>
                  </View>
                </GlassCard>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      <Text style={[styles.footnote, { color: theme.faint }]}>
        Steps verified June 2026. Platforms change their flows often — tap the official link in each entry for the current version.
      </Text>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardText: { flex: 1 },
  cardLabel: { fontFamily: 'InterTight-ExtraBold', fontSize: 16, fontWeight: '800', marginBottom: 3 },
  cardDesc: { fontFamily: 'Inter', fontSize: 12, lineHeight: 17 },
  countBadge: { alignItems: 'center', flexShrink: 0 },
  countNum: { fontFamily: 'InterTight-ExtraBold', fontSize: 20, fontWeight: '900' },
  countLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 9, letterSpacing: 1 },
  footnote: {
    fontFamily: 'Inter',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
