import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

const DOORS = [
  { label: 'I need help now.', sub: 'Crisis triage and hotlines', route: '/emergency' as const, danger: true },
  { label: 'I am trying to understand.', sub: 'Definitions, patterns, laws', route: '/(tabs)/tools/learn' as const, danger: false },
  { label: 'I am helping someone.', sub: 'What to say, what not to say', route: '/support' as const, danger: false },
] as const;

const MINOR = [
  { label: 'Make a plan', route: '/(tabs)/tools/plan' as const },
  { label: 'Calm your body', route: '/(tabs)/tools/somatic' as const },
  { label: 'Find local help', route: '/(tabs)/resources' as const },
  { label: 'Decode a pattern', route: '/(tabs)/tools/decipher' as const },
] as const;

function Door({ item, index }: { item: typeof DOORS[number]; index: number }) {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();
  const entering = reduceMotion ? undefined : FadeInDown.duration(340).delay(index * 80 + 60);

  const bg = item.danger
    ? (theme.dark ? '#5C1A1A' : '#1A1A1A')
    : (theme.dark ? theme.surface : theme.surface);

  const textColor = item.danger
    ? '#F5F1E8'
    : theme.text;

  return (
    <Animated.View entering={entering}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setTimeout(() => router.push(item.route), 100);
        }}
        style={({ pressed }) => [styles.door, { backgroundColor: bg }, pressed && styles.doorPressed]}
        accessibilityRole="button"
      >
        <Text style={[styles.doorLabel, { color: textColor }]}>{item.label}</Text>
        <Text style={[styles.doorSub, { color: item.danger ? 'rgba(245,241,232,0.65)' : theme.muted }]}>{item.sub}</Text>
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
      style={[styles.root, { backgroundColor: 'transparent' }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(300)}>
        <Text style={[styles.eyebrow, { color: theme.accent }]}>START HERE</Text>
        <Text style={[styles.headline, { color: theme.text }]}>{"When you\ndon't know\nwhat to do."}</Text>
      </Animated.View>

      <View style={styles.doors}>
        {DOORS.map((d, i) => <Door key={d.route} item={d} index={i} />)}
      </View>

      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(300).delay(360)} style={styles.minorGrid}>
        {MINOR.map((m) => (
          <Pressable
            key={m.route}
            onPress={() => {
              Haptics.selectionAsync();
              router.push(m.route);
            }}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <GlassCard style={styles.minorCard}>
              <Text style={[styles.minorLabel, { color: theme.text }]}>{m.label}</Text>
            </GlassCard>
          </Pressable>
        ))}
      </Animated.View>

      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(300).delay(480)}>
        <Text style={[styles.privacy, { color: theme.faint }]}>
          NO ACCOUNT. NO TRACKING. EVERYTHING STAYS ON THIS DEVICE.
        </Text>
        <Pressable onPress={() => router.push('/about')} style={styles.aboutLink}>
          <Text style={[styles.aboutText, { color: theme.faint }]}>About this app</Text>
        </Pressable>
      </Animated.View>

      {/* spacer for Quick Exit button */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 40 },
  eyebrow: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 2, marginBottom: 12 },
  headline: { fontFamily: 'InterTight-ExtraBold', fontSize: 42, fontWeight: '900', lineHeight: 48, letterSpacing: -1, marginBottom: 32 },
  doors: { gap: 10, marginBottom: 16 },
  door: { borderRadius: 16, padding: 22 },
  doorPressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  doorLabel: { fontFamily: 'InterTight-ExtraBold', fontSize: 22, fontWeight: '800', lineHeight: 26, marginBottom: 6 },
  doorSub: { fontFamily: 'Inter', fontSize: 13 },
  minorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  minorCard: { paddingVertical: 12, paddingHorizontal: 16 },
  minorLabel: { fontFamily: 'Inter', fontSize: 13, fontWeight: '600' },
  privacy: { fontFamily: 'JetBrainsMono-Regular', fontSize: 9, letterSpacing: 1.5, lineHeight: 15, marginBottom: 8 },
  aboutLink: { paddingVertical: 4 },
  aboutText: { fontFamily: 'Inter', fontSize: 12, textDecorationLine: 'underline' },
});
