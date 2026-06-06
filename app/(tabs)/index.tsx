import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

interface DoorItem {
  num: string;
  section: string;
  title: string;
  desc: string;
  route: string;
  accentColor?: string;
}

const DOORS: DoorItem[] = [
  {
    num: '01',
    section: 'EMERGENCY',
    title: 'I need\nhelp now',
    desc: 'Hotlines, and what to do in the next five minutes.',
    route: '/emergency',
    accentColor: '#C62828',
  },
  {
    num: '02',
    section: 'UNDERSTAND',
    title: "I'm trying\nto understand",
    desc: 'What abuse is, the patterns it follows, and what you can do.',
    route: '/(tabs)/tools/learn/definitions',
  },
  {
    num: '03',
    section: 'SUPPORT',
    title: "I'm helping\nsomeone else",
    desc: 'How to support a person you care about without making it worse.',
    route: '/support',
  },
];

function Door({ item, index }: { item: DoorItem; index: number }) {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();
  const entering = reduceMotion ? undefined : FadeInDown.duration(320).delay(index * 90 + 80);

  return (
    <Animated.View entering={entering}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push(item.route as never);
        }}
        style={({ pressed }) => [pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
        accessibilityRole="button"
      >
        <GlassCard style={styles.door}>
          {/* Left accent bar */}
          {item.accentColor && (
            <View style={[styles.doorAccent, { backgroundColor: item.accentColor }]} />
          )}
          <View style={styles.doorContent}>
            <Text style={[styles.doorNum, { color: theme.faint }]}>
              [ {item.num} / {item.section} ]
            </Text>
            <Text style={[styles.doorTitle, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.doorDesc, { color: theme.muted }]}>{item.desc}</Text>
          </View>
          <Text style={[styles.doorArrow, { color: theme.accent }]}>→</Text>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Eyebrow */}
      <Animated.View
        entering={reduceMotion ? undefined : FadeInDown.duration(280)}
        style={styles.eyebrowRow}
      >
        <Text style={[styles.eyebrow, { color: theme.muted }]}>[ 00 / START HERE ]</Text>
        <View style={[styles.eyebrowRule, { backgroundColor: theme.rule }]} />
      </Animated.View>

      {/* Headline */}
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(300).delay(50)}>
        <Text style={[styles.headline, { color: theme.text }]}>You are{'\n'}safe here.</Text>
        <Text style={[styles.subhead, { color: theme.muted }]}>
          Private tools to understand abuse, plan for safety, and find help. No account is needed.
        </Text>
      </Animated.View>

      {/* Three doors */}
      <View style={styles.doors}>
        {DOORS.map((d, i) => <Door key={d.num} item={d} index={i} />)}
      </View>

      {/* About link */}
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(280).delay(400)}>
        <Pressable
          onPress={() => router.push('/about')}
          style={styles.aboutLink}
          accessibilityRole="link"
        >
          <Text style={[styles.aboutText, { color: theme.faint }]}>About this app</Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  eyebrow: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1.5 },
  eyebrowRule: { flex: 1, height: StyleSheet.hairlineWidth },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 56,
    letterSpacing: -1.5,
    marginBottom: 12,
  },
  subhead: {
    fontFamily: 'Inter',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 28,
    maxWidth: 340,
  },
  doors: { gap: 10, marginBottom: 20 },
  door: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    overflow: 'hidden',
    minHeight: 90,
  },
  doorAccent: { width: 4, alignSelf: 'stretch' },
  doorContent: { flex: 1, paddingVertical: 18, paddingHorizontal: 16 },
  doorNum: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1.2, marginBottom: 6 },
  doorTitle: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: -0.3,
    marginBottom: 5,
  },
  doorDesc: { fontFamily: 'Inter', fontSize: 13, lineHeight: 19 },
  doorArrow: { fontFamily: 'Inter', fontSize: 20, paddingRight: 18 },
  aboutLink: { alignSelf: 'center', paddingVertical: 10 },
  aboutText: { fontFamily: 'Inter', fontSize: 12, textDecorationLine: 'underline' },
});
