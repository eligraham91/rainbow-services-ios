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
import { GlassSurface } from './GlassSurface';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  resources: 'Find Help',
  tools: 'Tools',
  vault: 'Vault',
};

const TAB_ICONS: Record<string, string> = {
  index: '⌂',
  resources: '◎',
  tools: '⌥',
  vault: '⊕',
};

export function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { reduceMotion } = useTraumaInformedMotion();

  const highlightX = useSharedValue(0);
  const highlightW = useSharedValue(0);
  const tabRefs = useRef<Array<{ x: number; width: number } | null>>([]);

  const highlightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: highlightX.value }],
    width: highlightW.value,
  }));

  function handlePress(index: number, routeKey: string, routeName: string) {
    const ref = tabRefs.current[index];
    if (ref && !reduceMotion) {
      highlightX.value = withSpring(ref.x, { damping: 18, stiffness: 200 });
      highlightW.value = withSpring(ref.width, { damping: 18, stiffness: 200 });
    }
    const isFocused = state.index === index;
    const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      navigation.navigate(routeName);
    }
  }

  return (
    <GlassSurface
      style={[
        styles.bar,
        {
          paddingBottom: insets.bottom + 4,
          borderTopColor: theme.rule,
          backgroundColor: theme.dark ? 'rgba(42,38,24,0.7)' : 'rgba(245,241,232,0.7)',
        },
      ]}
      intensity={70}
    >
      {/* morphing highlight pill */}
      <Animated.View
        style={[
          styles.highlight,
          { backgroundColor: theme.dark ? 'rgba(159,111,227,0.18)' : 'rgba(74,20,140,0.1)' },
          highlightStyle,
        ]}
        pointerEvents="none"
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label = TAB_LABELS[route.name] ?? route.name;
        const icon = TAB_ICONS[route.name] ?? '·';

        return (
          <Pressable
            key={route.key}
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              tabRefs.current[index] = { x, width };
              // initialise highlight under active tab
              if (isFocused) {
                highlightX.value = x;
                highlightW.value = width;
              }
            }}
            onPress={() => handlePress(index, route.key, route.name)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            style={styles.tab}
          >
            <Text style={[styles.icon, { color: isFocused ? theme.accent : theme.faint }]}>
              {icon}
            </Text>
            <Text style={[styles.tabLabel, { color: isFocused ? theme.accent : theme.faint }]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    gap: 3,
  },
  icon: {
    fontSize: 18,
  },
  tabLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
