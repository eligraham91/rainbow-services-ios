import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import Svg, { Path, Rect, Circle, G, Line } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

// Tab configuration
const TABS = [
  { name: 'index',     label: 'Home' },
  { name: 'resources', label: 'Find Help' },
  { name: 'tools',    label: 'Tools' },
  { name: 'vault',    label: 'Vault' },
] as const;

// SVG icons — 22×22 viewBox
function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12L12 3l9 9" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 10v9a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1v-9" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function SearchIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={1.8} />
      <Path d="M21 21l-4-4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
function GridIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.8} />
      <Rect x={14} y={3} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.8} />
      <Rect x={3} y={14} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.8} />
      <Rect x={14} y={14} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}
function LockIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={11} width={14} height={10} rx={2} stroke={color} strokeWidth={1.8} />
      <Path d="M8 11V7a4 4 0 018 0v4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

const ICON_MAP: Record<string, (color: string) => React.ReactElement> = {
  index: (c) => <HomeIcon color={c} />,
  resources: (c) => <SearchIcon color={c} />,
  tools: (c) => <GridIcon color={c} />,
  vault: (c) => <LockIcon color={c} />,
};

export function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { reduceMotion } = useTraumaInformedMotion();

  const pillX = useSharedValue(0);
  const pillW = useSharedValue(0);
  const tabRefs = useRef<Array<{ x: number; width: number } | null>>([]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width: pillW.value,
  }));

  function handlePress(index: number, routeKey: string, routeName: string) {
    const ref = tabRefs.current[index];
    if (ref) {
      if (!reduceMotion) {
        pillX.value = withSpring(ref.x, { damping: 20, stiffness: 220 });
        pillW.value = withSpring(ref.width, { damping: 20, stiffness: 220 });
      } else {
        pillX.value = ref.x;
        pillW.value = ref.width;
      }
    }
    const isFocused = state.index === index;
    const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      navigation.navigate(routeName);
    }
  }

  async function handleExit() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.dismissAll();
    router.replace('/stealth');
  }

  // Tint over the blur keeps icons/labels legible above busy content
  const barBg = theme.dark ? 'rgba(42,38,24,0.72)' : 'rgba(245,241,232,0.72)';

  return (
    <BlurView
      intensity={65}
      tint={theme.dark ? 'dark' : 'light'}
      style={[
        styles.bar,
        { paddingBottom: insets.bottom + 6, borderTopColor: theme.rule, backgroundColor: barBg },
      ]}
    >
      {/* Morphing active pill */}
      <Animated.View
        style={[styles.pill, { backgroundColor: theme.accent }, pillStyle]}
        pointerEvents="none"
      />

      {/* Tab buttons */}
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const label = TABS.find(t => t.name === route.name)?.label ?? route.name;
        const renderIcon = ICON_MAP[route.name];
        const iconColor = isFocused ? '#FFFFFF' : theme.faint;

        return (
          <Pressable
            key={route.key}
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              tabRefs.current[index] = { x, width };
              if (isFocused) {
                pillX.value = x;
                pillW.value = width;
              }
            }}
            onPress={() => handlePress(index, route.key, route.name)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={label}
            style={[styles.tab, isFocused && styles.tabActive]}
          >
            {renderIcon ? renderIcon(iconColor) : null}
            {isFocused && (
              <Text style={styles.tabLabel}>{label}</Text>
            )}
          </Pressable>
        );
      })}

      {/* Quick Exit — lives in the tab bar, rightmost */}
      <Pressable
        onPress={handleExit}
        style={styles.exitBtn}
        accessibilityLabel="Quick exit"
        accessibilityRole="button"
        hitSlop={10}
      >
        <View style={styles.exitInner}>
          <View style={[styles.arm, styles.armA]} />
          <View style={[styles.arm, styles.armB]} />
        </View>
      </Pressable>
    </BlurView>
  );
}

const ARM = 12;
const THICK = 2;

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 6,
    gap: 2,
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    top: 8,
    height: 38,
    borderRadius: 20,
    zIndex: 0,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    gap: 6,
    borderRadius: 20,
    zIndex: 1,
    paddingHorizontal: 6,
  },
  tabActive: {},
  tabLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0,
  },
  exitBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#C62828',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    zIndex: 1,
  },
  exitInner: {
    width: ARM + 4,
    height: ARM + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arm: {
    position: 'absolute',
    width: ARM,
    height: THICK,
    backgroundColor: '#FFFFFF',
    borderRadius: THICK,
  },
  armA: { transform: [{ rotate: '45deg' }] },
  armB: { transform: [{ rotate: '-45deg' }] },
});
