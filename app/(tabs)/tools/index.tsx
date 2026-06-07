import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

// Tool category icons
function WindIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M9.59 4.59A2 2 0 1111 8H2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M12.59 19.41A2 2 0 1014 16H2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M6.59 11.41A2 2 0 108 14H2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
function ScanIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M7 2H3a1 1 0 00-1 1v4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M17 2h4a1 1 0 011 1v4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M7 22H3a1 1 0 01-1-1v-4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M17 22h4a1 1 0 001-1v-4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M2 12h20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
function CompassIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.8} />
      <Path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  );
}
function ShieldIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function LockIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function BookIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function PhoneIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M6.6 10.8A15.6 15.6 0 0013.2 17.4l2.2-2.2a1 1 0 011-.24 11.6 11.6 0 003.58.58 1 1 0 011 1V19a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.58 3.58a1 1 0 01-.24 1L6.6 10.8z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const CATEGORIES = [
  {
    num: '01',
    label: 'Center your body',
    desc: 'Breathe, listen, and ground yourself before you decide anything.',
    route: '/(tabs)/tools/somatic' as const,
    Icon: WindIcon,
  },
  {
    num: '02',
    label: 'Decipher & understand',
    desc: 'Read the patterns behind texts, money, and control.',
    route: '/(tabs)/tools/decipher' as const,
    Icon: ScanIcon,
  },
  {
    num: '03',
    label: 'Make a plan',
    desc: 'Safe exit, legal prep, and what to expect, step by step.',
    route: '/(tabs)/tools/plan' as const,
    Icon: CompassIcon,
  },
  {
    num: '04',
    label: 'Learn & protect',
    desc: 'Your rights, the definitions, and how to reach out.',
    route: '/(tabs)/tools/learn' as const,
    Icon: ShieldIcon,
  },
  {
    num: '05',
    label: 'Secure vault',
    desc: 'Notes and your safety plan, encrypted on this device.',
    route: '/(tabs)/vault' as const,
    Icon: LockIcon,
  },
  {
    num: '06',
    label: 'Fake call',
    desc: 'A convincing call screen to exit a tense or unsafe situation.',
    route: '/(tabs)/tools/fake-call' as const,
    Icon: PhoneIcon,
  },
  {
    num: '07',
    label: 'How-Tos',
    desc: 'Block, report, share your ride, stop location — steps for apps you already use.',
    route: '/(tabs)/tools/howtos' as const,
    Icon: BookIcon,
  },
] as const;

function CategoryCard({ item, index }: { item: typeof CATEGORIES[number]; index: number }) {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();
  const entering = reduceMotion ? undefined : FadeInDown.duration(280).delay(index * 65 + 80);

  return (
    <Animated.View entering={entering}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push(item.route);
        }}
        style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
        accessibilityRole="button"
      >
        <GlassCard style={styles.card}>
          {/* Icon box */}
          <View style={[styles.iconBox, { backgroundColor: theme.dark ? 'rgba(159,111,227,0.12)' : 'rgba(74,20,140,0.07)' }]}>
            <item.Icon color={theme.accent} />
          </View>
          {/* Text */}
          <View style={styles.cardText}>
            <Text style={[styles.cardLabel, { color: theme.text }]}>{item.label}</Text>
            <Text style={[styles.cardDesc, { color: theme.muted }]}>{item.desc}</Text>
          </View>
          <Text style={[styles.arrow, { color: theme.accent }]}>→</Text>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
}

export default function ToolsHubScreen() {
  return (
    <ScreenScaffold
      eyebrow="TOOLS / WORK IT THROUGH"
      title="Tools."
      intro="Quiet, interactive tools to understand what is happening and plan your next move. Nothing leaves your phone."
    >
      <View style={styles.list}>
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.num} item={cat} index={i} />
        ))}
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 16,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardText: { flex: 1 },
  cardLabel: { fontFamily: 'InterTight-ExtraBold', fontSize: 17, fontWeight: '800', marginBottom: 3, letterSpacing: -0.2 },
  cardDesc: { fontFamily: 'Inter', fontSize: 13, lineHeight: 18 },
  arrow: { fontFamily: 'Inter', fontSize: 18 },
});
