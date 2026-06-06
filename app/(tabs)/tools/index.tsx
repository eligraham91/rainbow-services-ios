import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

const CATEGORIES = [
  { id: 'somatic', label: 'Calm your body', sub: 'Breathe, listen, ground', icon: '◌', route: '/tools/somatic' as const },
  { id: 'decipher', label: 'Decode patterns', sub: 'Text threads and money', icon: '⟐', route: '/tools/decipher' as const },
  { id: 'plan', label: 'Make a plan', sub: 'Safety, shelter, legal', icon: '⊡', route: '/tools/plan' as const },
  { id: 'learn', label: 'Understand it', sub: 'Words, laws, warning signs', icon: '◈', route: '/tools/learn' as const },
] as const;

function CategoryCard({ item, index }: { item: typeof CATEGORIES[number]; index: number }) {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();
  const entering = reduceMotion ? undefined : FadeInDown.duration(300).delay(index * 70 + 100);

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => router.push(item.route), 120);
  }

  return (
    <Animated.View entering={entering}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.cardPress, pressed && styles.pressed]}
      >
        <GlassCard style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardText}>
              <Text style={[styles.cardLabel, { color: theme.text }]}>{item.label}</Text>
              <Text style={[styles.cardSub, { color: theme.muted }]}>{item.sub}</Text>
            </View>
            <Text style={[styles.cardIcon, { color: theme.accent }]}>{item.icon}</Text>
          </View>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
}

export default function ToolsHubScreen() {
  return (
    <ScreenScaffold
      eyebrow="Tools"
      title={"Things you\ncan do now."}
      intro="Private. On this device. No account."
    >
      <View style={styles.list}>
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} item={cat} index={i} />
        ))}
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  cardPress: {},
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  card: { padding: 20 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardText: { flex: 1 },
  cardLabel: { fontFamily: 'InterTight-ExtraBold', fontSize: 20, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4 },
  cardSub: { fontFamily: 'Inter', fontSize: 14 },
  cardIcon: { fontSize: 28 },
});
