import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { GlassSurface } from './GlassSurface';
import { useTheme } from '@theme/ThemeContext';

interface BackPillProps {
  label?: string;
}

export function BackPill({ label = 'Back' }: BackPillProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      accessibilityLabel={`Go back: ${label}`}
      accessibilityRole="button"
    >
      <GlassSurface style={[styles.pill, { borderColor: theme.rule }]}>
        <View style={styles.row}>
          {/* Chevron */}
          <View style={styles.chevronWrap}>
            <View style={[styles.chevronTop, { backgroundColor: theme.muted }]} />
            <View style={[styles.chevronBot, { backgroundColor: theme.muted }]} />
          </View>
          <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { alignSelf: 'flex-start' },
  pressed: { opacity: 0.7 },
  pill: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
  chevronWrap: { width: 10, height: 14, justifyContent: 'center' },
  chevronTop: {
    position: 'absolute',
    width: 8,
    height: 1.5,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }, { translateY: -2.5 }],
  },
  chevronBot: {
    position: 'absolute',
    width: 8,
    height: 1.5,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }, { translateY: 2.5 }],
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
  },
});
