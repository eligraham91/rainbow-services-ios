import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SpringButton } from '@components/SpringButton';
import { GlassCard } from '@components/GlassCard';
import { Typography } from '@theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_GAP = 10;
const TILE_WIDTH = (SCREEN_WIDTH - 48 - TILE_GAP) / 2; // 48 = paddingHorizontal * 2

const ACTIONS = [
  {
    label: 'I need help now',
    href: '/emergency' as const,
  },
  {
    label: 'I am trying to understand',
    href: '/understand' as const,
  },
  {
    label: 'I am making a plan',
    href: '/plan' as const,
  },
  {
    label: 'I am helping someone else',
    href: '/support' as const,
  },
] as const;

const ENTRY_SPRING = { stiffness: 180, damping: 20 } as const;

function ActionTile({
  label,
  href,
  index,
}: {
  label: string;
  href: string;
  index: number;
}) {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);
  const delay = index * 80;

  useEffect(() => {
    translateY.value = withDelay(delay, withSpring(0, ENTRY_SPRING));
    opacity.value = withDelay(delay, withTiming(1, { duration: 280 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.tileWrapper, animatedStyle]}>
      <GlassCard style={styles.card}>
        <SpringButton
          label={label}
          variant="secondary"
          href={href}
          onPress={() => {}}
          style={styles.tileBtn}
          accessibilityLabel={label}
        />
      </GlassCard>
    </Animated.View>
  );
}

export function ActionGrid() {
  return (
    <View style={styles.grid}>
      {ACTIONS.map((action, i) => (
        <ActionTile key={action.href} label={action.label} href={action.href} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
  },
  tileWrapper: {
    width: TILE_WIDTH,
  },
  card: {
    flex: 1,
    minHeight: 100,
  },
  tileBtn: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
});
